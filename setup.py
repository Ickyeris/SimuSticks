from cx_Freeze import setup, Executable
import sys
import os

# Include additional files like images and sounds
include_files = ["assets/"]  # add any other folders or files your game needs

# GUI apps require base to be "Win32GUI" on Windows to hide the terminal window
base = None
if sys.platform == "win32":
    base = "Win32GUI"

setup(
    name="MyGame",
    version="1.0",
    description="My Pygame Game",
    options={
        "build_exe": {
            "packages": ["pygame"],
            "include_files": include_files
        }
    },
    executables=[Executable("main.py", base=base)]
)
