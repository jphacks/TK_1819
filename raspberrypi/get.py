import RPi.GPIO as GPIO
import urllib.request
import time
import threading

url = 'https://hack-api.herokuapp.com/trashkan/1/status'
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
try:
    while True:
        with urllib.request.urlopen(req)as res:
            body = int(res.read())
            print(body)
        if body == 1 and threading.active_count() <= 1:
            th.start()

except urllib.error.URLError as err:
    print(err.reason)
    GPIO.cleanup()
except urllib.error.HTTPError as err:
    print(err.code)
    GPIO.cleanup()
except:
    GPIO.cleanup()
