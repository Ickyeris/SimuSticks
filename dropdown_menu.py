import pygame
import pygame_gui

class DropdownMenu:
    def __init__(
            self, 
            manager, 
            name="?", 
            options=["None"],
            default="None",
            position=(0, 0)
        ):

        self.manager = manager
        self.name = name


        self.options = options
        self.current = default

        self.panel = pygame_gui.elements.UIPanel(
            relative_rect=pygame.Rect(position, (290, 120)),
            manager=manager,
            object_id="#dropdown_background"
        )

        label_rect = pygame.Rect((0, 5), (50, 120))
        dropdown_menu_rect = pygame.Rect(position, (150, 40)).move((50, 5))
        rapid_rect = pygame.Rect((50, 45), (25, 25))
        delay_rect = pygame.Rect((130, 45), (25, 25))

        container = self.panel if self.panel else None

        self.label = pygame_gui.elements.UILabel(
            relative_rect=label_rect, 
            text=name, 
            manager=manager,
            container=container
        )

        self.dropdown_menu = pygame_gui.elements.UIDropDownMenu(
            options_list=self.options, 
            starting_option=self.current, 
            relative_rect=dropdown_menu_rect, 
            manager=manager,
        )

        self.rapid_check = pygame_gui.elements.UICheckBox(
            relative_rect=rapid_rect, 
            text="Rapid", 
            manager=manager,
            container=container
        )

        self.rapid_msec = pygame_gui.elements.UITextEntryLine(
            relative_rect=pygame.Rect((50, 75), (60, 30)),
            initial_text="",
            placeholder_text="0 msec",
            container=container
        )

        self.delay_check = pygame_gui.elements.UICheckBox(
            relative_rect=delay_rect, 
            text="Delay", 
            manager=manager,
            container=container
        )

        self.delay_msec = pygame_gui.elements.UITextEntryLine(
            relative_rect=pygame.Rect((130, 75), (60, 30)),
            initial_text="",
            placeholder_text="0 msec",
            container=container
        )

        self.persist_check = pygame_gui.elements.UICheckBox(
            relative_rect=pygame.Rect((200, 45), (25, 25)), 
            text="Persist", 
            manager=manager,
            container=container
        )

        self.persist_msec = pygame_gui.elements.UITextEntryLine(
            relative_rect=pygame.Rect((200, 75), (60, 30)),
            initial_text="",
            placeholder_text="0 msec",
            container=container
        )