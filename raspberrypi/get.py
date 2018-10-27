import RPi.GPIO as GPIO
import urllib.request
import time
import pygame

url = 'https://hack-api.herokuapp.com/trashkan/1/status'
req = urllib.request.Request(url)

led = [22, 10, 9, 11, 5, 6, 13, 2, 3, 4, 17, 27]

pygame.init()

GPIO.setmode(GPIO.BCM)
for i in led:
    GPIO.setup(i, GPIO.OUT)
    GPIO.output(i, GPIO.LOW)


def blink(soundnum):
    print("blink start")
    if soundnum == 2:
        sound = pygame.mixer.Sound("wav/piano1.wav")
    else:
        sound = pygame.mixer.Sound("wav/decision5.wav")
    sound.play()
    for i in range(10):
        for j in led:
            GPIO.output(j, GPIO.HIGH)
            time.sleep(0.1)
            GPIO.output(j, GPIO.LOW)
    print("blink end")

try:
    while True:
        with urllib.request.urlopen(req)as res:
            body = int(res.read())
            print(body)
        if body != 0:
            blink(body)
        time.sleep(1)
except urllib.error.URLError as err:
    print(err.reason)
    GPIO.cleanup()
except urllib.error.HTTPError as err:
    print(err.code)
    GPIO.cleanup()
except:
    GPIO.cleanup()
