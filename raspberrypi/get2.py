import RPi.GPIO as GPIO
import urllib.request
import time
import pygame
import json
import subprocess
import os
import signal

url = 'https://hack-api.herokuapp.com/trashcans/5be705564ce0a041e16fb161/requestState'
req = urllib.request.Request(url)

pygame.init()

def blink(pt):
    print("blink start")
    if pt <= 5:
        sound = pygame.mixer.Sound("wav/piano1.wav")
    else:
        sound = pygame.mixer.Sound("wav/decision5.wav")
    sound.play()
    cmd1 = "bash"
    cmd2 = "python3 /home/pi/rpi-rgb-led-matrix/bindings/python/samples/runtext.py --led-no-hardware-pulse LED_NO_HARDWARE_PULSE -r 16 -t " + "'GOMI UP   " + str(pt) + "  pt'" 
    proc = subprocess.Popen(cmd1, shell=True, stdin=subprocess.PIPE)
    proc.communicate(cmd2.encode('ascii'))
    #time.sleep(15)
    proc.terminate()
    print("blink end")

blink(5)

try:
    while True:
        with urllib.request.urlopen(req)as res:
            body = json.load(res) 
            request_state = body["requestState"]
            print(request_state)
        if request_state is not -1:
            blink(request_state)
        time.sleep(1)
except urllib.error.URLError as err:
    print(err.reason)
except urllib.error.HTTPError as err:
    print(err.code)
