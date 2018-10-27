import RPi.GPIO as GPIO
import urllib.request
import time
import threading

url = 'https://'
req = urllib.request.Request(url)

led = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(led, GPIO.OUT)

def blink():
    print("blink start")
    for i in range(20):
        GPIO.output(led, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(led, GPIO.LOW)
        time.sleep(0.5)
    print("blink end")
    
th = threading.Thread(name="bl", target=blink, args=())

while True:
    try:
        with urllib.request.urlopen(req)as res:
            body = res.read().int()
            print(body)
    except urllib.error.URLError as err:
        print(err.reason)
    except urllib.error.HTTPError as err:
        print(err.code)
    if body == 1 and threading.active_count() <= 1:
        th.start()

GPIO.cleanup()