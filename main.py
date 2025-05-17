from tkinter import *
from tkinter import ttk
from pyvjoystick import vjoy
from pynput import mouse

from mouse_controller import MouseController
from slider import Slider

root = Tk()
frm = ttk.Frame(root, padding=10)
frm.grid()

mouse_sens_x = Slider(frm, "Mouse Sensitivity X", row=0, initial=100)
mouse_sens_y = Slider(frm, "Mouse Sensitivity Y", row=1, initial=150)

j = vjoy.VJoyDevice(1)
mouse_controller = MouseController(frm, j, 2)


root.mainloop()
