from tkinter import *
from tkinter import ttk

class Slider:
    def __init__(self, parent, label_text, row, initial=100, min_val=0, max_val=100):
        self.min_val = min_val
        self.max_val = max_val
        self.var = IntVar(parent, initial)

        ttk.Label(parent, text=label_text).grid(column=0, row=row)
        self.scale = ttk.Scale(parent, from_=10, to=500, orient=HORIZONTAL, variable=self.var)
        self.scale.grid(column=1,row=row)
        self.label = ttk.Label(parent, text=self.var.get())
        self.label.grid(column=2,row=row)

        self.var.trace_add("write", self._on_change)
    
    def _on_change(self, *args):
        value = self.var.get()
        clamped = max(10, min(value, 500))
        if clamped != value:
            self.var.set(clamped)
        self.label.config(text=str(self.var.get()))
    
    def get(self):
        return self.var.get()

    def set(self, value):
        self.var.set(value)