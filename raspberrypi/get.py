import RPi.GPIO as GPIO
import urllib.request
import time
url = 'https://hack-api.herokuapp.com/trashkan/1/status'
req = urllib.request.Request(url)

#led = 21
led = {2,3,4,17,27,22,10,9,11,5,6,13}


GPIO.setmode(GPIO.BCM)
for i in led:
    GPIO.setup(i, GPIO.OUT)

while True:
    for i in led:
        print(i)
        GPIO.output(i, GPIO.HIGH)
        time.sleep(4)
        GPIO.output(i, GPIO.LOW)

def blink():
    print("blink start")
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
        if body == 1:
            blink()
        time.sleep(1)
except urllib.error.URLError as err:
    print(err.reason)
    GPIO.cleanup()
except urllib.error.HTTPError as err:
    print(err.code)
    GPIO.cleanup()
except:
    GPIO.cleanup()
