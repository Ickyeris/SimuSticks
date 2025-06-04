import time
import pygame
import pygame_gui
from pyvjoystick import vigem as vg
from collections import deque


from dropdown_menu import DropdownMenu

# --- Initialization ---
pygame.init()
pygame.joystick.init()

screen = pygame.display.set_mode((800, 800))
pygame.display.set_caption("Rematch Controller Emulator")

actions = ["None", "Push Ball", "Tackle", "Sprint", "Rainbow Flick", "Dive", "Short Pass", "Short Lob", "Call Out", "Extra Effort", "Shoot", "Guard"]

manager = pygame_gui.UIManager((800, 800), theme_path="theme.json")

scrolling_container = pygame_gui.elements.UIScrollingContainer(
    relative_rect=pygame.Rect((50, 50), (300, 400)),  # viewport size
    manager=manager
)


lb_option = DropdownMenu(manager, name="LB", options=actions, default="Sprint", position=(10, 120*0))
a_option = DropdownMenu(manager, name="A", options=actions, default="Push Ball", position=(10, 120*1))
b_option = DropdownMenu(manager, name="B", options=actions, default="Tackle", position=(10, 120*2))
l_thumb_option = DropdownMenu(manager, name="L Thumb", options=actions, default="Extra Effort", position=(10, 120*3))
l_trigger_option = DropdownMenu(manager, name="L Trigger", options=actions, default="Guard", position=(10, 120*4))


clock = pygame.time.Clock()

background_image = pygame.image.load("assets/background.jpg")
background_image = pygame.transform.scale(background_image, (800, 600))

xbox_controller_image = pygame.image.load("assets/xbox_controller.png")
xbox_controller_image = pygame.transform.scale(xbox_controller_image, (300, 200))

mouse_image = pygame.image.load("assets/mouse.png")
mouse_image = pygame.transform.scale(mouse_image, (100, 100))

# --- Gamepad Setup ---
controller_connected = pygame.joystick.get_count() > 0
if not controller_connected:
    print("No controller connected")

joystick = None
if controller_connected:
    joystick = pygame.joystick.Joystick(0)
    joystick.init()

gamepad = vg.VX360Gamepad()

# --- Utility Functions ---
def clamp(val, min_val, max_val):
    return max(min(val, max_val), min_val)

def handle_mouse_motion(event):
    dx_raw, dy_raw = event.rel
    dx_raw = clamp(dx_raw, -25.0, 25.0)
    dy_raw = clamp(dy_raw, -10.0, 10.0)
    dx_norm = dx_raw / 25.0
    dy_norm = dy_raw / 15.0
    def normalize(val, base=0.35, scale=0.6):
        if abs(val) > 0.01:
            return (1 if val > 0 else -1) * (base + abs(val) * scale)
        return 0.0
    return normalize(dx_norm), normalize(dy_norm)

mouse_locked = False
def toggle_mouse():
    global mouse_locked
    
    mouse_locked = not mouse_locked
    pygame.event.set_grab(mouse_locked)  # Lock mouse to window
    pygame.mouse.set_visible(not mouse_locked)

class Vector2:
    x = 0.0
    y = 0.0
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Mouse:
# 1 -> Left Click, 2 -> Middle Click 3 -> Right Click 6 -> Side button buttom

class Button:
    active = False
    duration = 0.0 # How long this button is active for
    delay = 0.0 # The time before the button is activated
    last_time = 0
    # Rapid
    rapid = False
    rapid_delay = 0.0
    rapid_last_time = 0
    
    def __init__(self, button):
        self.button = button
    
    def activate(self, duration=0.0, delay=0.0):
        self.active = True
        self.delay = delay
        gamepad.press_button(self.button)
        self.last_time = time.time()
    
    def rapid_activate(self, duration, rapid_delay, delay):
        self.active = True
        self.duration = duration
        self.delay = delay
        self.rapid = True
        self.rapid_delay = rapid_delay
        self.last_time = time.time()
    
    def deactivate(self):
        self.active = False
        gamepad.release_button(self.button)
        

    def process(self, current_time):
        if self.active:
            # Wait for delay to finish
            if current_time > self.last_time + self.delay:
                gamepad.press_button(self.button)
                if self.rapid:
                    # Periodically release the button if rapid is on.
                    if current_time > self.rapid_last_time + self.rapid_delay:
                        gamepad.release_button(self.button)
                        self.rapid_last_time = current_time
            if current_time > self.last_time + self.duration + self.delay:
                self.active = False
                gamepad.release_button(self.button)


buttons = {
'push_ball': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_A),
'pass': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_X),
'dive': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_Y),
'sprint': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER),
'height_modifier': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER),
'extra_effort': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_THUMB),
'tackle': Button(vg.XUSB_BUTTON.XUSB_GAMEPAD_B)
}

def handle_input(event):
    match(event.type):
            # In game events
            case pygame.MOUSEBUTTONDOWN:
                match(event.button):
                    case 1: # Left Click
                        gamepad.right_trigger_float(value_float=1.0)
                    case 2: # Middle Click
                        gamepad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER)
                    case 3: # Right Click
                        gamepad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_X)
                    case 7: # Top side button
                        buttons['dive'].activate(10, delay=10)
                    case 6: # Bottom side button
                        buttons['extra_effort'].activate(10)

            case pygame.MOUSEBUTTONUP:
                match(event.button):
                    case 1: # Left Click
                        gamepad.right_trigger_float(value_float=0.0)
                    case 2: # Middle Click
                        gamepad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER)
                    case 3: # Right Click
                        gamepad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_X)
                    case 6:
                        pass
                    case 7:
                        gamepad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_Y)
            case pygame.MOUSEWHEEL:
                if event.y < 0:# Up
                    buttons['push_ball'].activate(duration=0.0)
                if event.y > 0:# Down
                    buttons['pass'].activate(duration=0.0)
                    buttons['push_ball'].activate(duration=10.0, delay=5)
                    buttons['height_modifier'].activate(duration=10.0)


clock = pygame.time.Clock()
running = True

while running:
    time_delta = clock.tick(60)/1000.0
    current_time = time.time()
    vx, vy = 0.0, 0.0

    for event in pygame.event.get():
        manager.process_events(event)
        # App events
        if event.type == pygame.QUIT:
                running = False
        if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    toggle_mouse()
        if event.type == pygame_gui.UI_BUTTON_PRESSED:
            pass
        handle_input(event)

        if event.type == pygame.MOUSEMOTION:
            vx, vy = handle_mouse_motion(event)

    gamepad.right_joystick_float(x_value_float=vx, y_value_float=-vy)
    manager.update(time_delta)

    # Gamepad controls
    if joystick:
        left_stick = Vector2(joystick.get_axis(1), joystick.get_axis(2))
        left_trigger = joystick.get_axis(5)
        b_button = joystick.get_button(1)
        lb_button = joystick.get_button(4)
        left_thumb = joystick.get_button(6)
        gamepad.left_joystick_float(x_value_float=left_stick.x, y_value_float=-left_stick.y)
        gamepad.left_trigger_float(1.0 if (left_trigger > -1.0) else 0.0)
        
        if b_button:
            buttons['tackle'].activate(0.0)

        if lb_button:
            gamepad.press_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER)
        else:
            gamepad.release_button(vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER)




    for button in buttons:
        buttons[button].process(current_time=current_time)
        

    # --- Frame Update ---
    gamepad.update()


    # Render
    screen.fill((30, 30, 30))
    manager.draw_ui(screen)
    pygame.display.flip()
    clock.tick(120)


pygame.quit()
