import time
import threading
from tkinter import *
from tkinter import ttk
from pynput import mouse


class MouseController:
    def __init__(self, parent, vjoy_device, row, timeout_ms=100):
        self.vjoy = vjoy_device
        self.listener = None
        self.listening = False
        self.lock = threading.Lock()
        self.last_x = 0
        self.last_y = 0
        self.last_time=  0
        self.velocity_x = IntVar(parent, 0)
        self.velocity_y = IntVar(parent, 0)

        self.velocity_x.trace_add("write", self._update_labels)
        self.velocity_y.trace_add("write", self._update_labels)

        self.timeout = timeout_ms / 1000  # Convert ms to seconds
        self._stop_monitor = threading.Event()
        self._monitor_thread = None

        self.toggle_btn = ttk.Button(parent, text="Start", command=self.toggle_listener)
        self.toggle_btn.grid(column=0, row=row)

        ttk.Label(parent, text="Velocity X: ").grid(column=1, row=row)
        self.velocity_x_label = ttk.Label(parent, text=self.velocity_x.get())
        self.velocity_x_label.grid(column=2, row=row)

        ttk.Label(parent, text="Velocity Y: ").grid(column=3, row=row)
        self.velocity_y_label = ttk.Label(parent, text=self.velocity_y.get())
        self.velocity_y_label.grid(column=4, row=row)

    def toggle_listener(self):
        self.toggle()
        if self.listening:
            self.toggle_btn.config(text="End")
        else:
            self.toggle_btn.config(text="Start")

    def _update_labels(self, *args):
        self.velocity_x_label.config(text=str(self.velocity_x.get()))
        self.velocity_y_label.config(text=str(self.velocity_y.get()))
    
    def _on_click(self, x, y, button, pressed):
        pass

    def _on_move(self, x, y):
        current_time = time.time()
        dt = current_time - self.last_time

        if self.last_x is not None:
            if dt > 0:
                self.velocity_x.set((x - self.last_x) / dt)
        
        if self.last_y is not None:
            if dt > 0:
                self.velocity_y.set((y - self.last_y) / dt)
        
        self.last_x = x
        self.last_y = y
        self.last_time = current_time

    def _on_scroll(self, x, y, dx, dy):
        pass
    
    def _velocity_monitor(self):
        while not self._stop_monitor.is_set():
            time.sleep(self.timeout)
            if self.last_time is not None and (time.time() - self.last_time) > self.timeout:
                if self.velocity_x.get() != 0 or self.velocity_y.get() != 0:
                    self.velocity_x.set(0)
                    self.velocity_y.set(0)


    def toggle(self):
        if self.listening:
            self.stop()
        else:
            self.start()
    
    def start(self):
        with self.lock:
            if self.listening:
                return
            print("Starting mouse controller...")
            self.listener = mouse.Listener(
                on_click=self._on_click,
                on_move=self._on_move,
                on_scroll=self._on_scroll
            )
            self.last_time = time.time()
            self.listener.start()
            self.listening = True

            self._stop_monitor.clear()
            self._monitor_thread = threading.Thread(target=self._velocity_monitor, daemon=True)
            self._monitor_thread.start()
    
    def stop(self):
        with self.lock:
            if not self.listening:
                return
            print("Stopping mouse controller...")
            self.listener.stop()
            self.listening = False
            self.reset()

            # Stop the monitor thread
            self._stop_monitor.set()
            if self._monitor_thread:
                self._monitor_thread.join()
                self._monitor_thread = None
    
    def reset(self):
        self.velocity_x.set(0)
        self.velocity_y.set(0)
        self.last_x = None
        self.last_y = None
        self.last_time = None