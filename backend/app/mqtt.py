import paho.mqtt.client as mqtt
import os
import time
import json

MQTT_ADDRESS = os.environ.get('PRAWNY_MQTT_ADDRESS')
MQTT_USER = os.environ.get('PRAWNY_MQTT_USER')
MQTT_PASSWORD = os.environ.get('PRAWNY_MQTT_PW')
MQTT_CLIENT_ID = 'backend'
MQTT_CA_PATH = os.environ.get('PRAWNY_MQTT_CA_PATH')



def check_conn(device_id: str):
    check_ack = []
    MQTT_TOPIC_CONN = f'prawny/{device_id}/ack'
    def on_connect(client,userdata,flags,rc):
        print('Connected Device_ID ' + str(device_id) + ' with result code ' + str(rc))
        client.publish(f"prawny/{device_id}/command","main;ack;0")
        client.subscribe(MQTT_TOPIC_CONN)
    def on_message(client,userdata,msg):
        message = msg.payload.decode()
        if message == 'ACK':
            check_ack.append(True)
            client.loop_stop()
            client.disconnect()
    mqtt_client = mqtt.Client(MQTT_CLIENT_ID)
    mqtt_client.username_pw_set(MQTT_USER,MQTT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.tls_set(MQTT_CA_PATH)
    mqtt_client.tls_insecure_set(True)
    mqtt_client.connect(MQTT_ADDRESS, 1883)
    mqtt_client.loop_start()
    
    # time 5 sec
    startTime = time.time()
    elapsed_time = 0
    while(elapsed_time <= 5) and (not check_ack):
        elapsed_time = time.time() - startTime 
    if not check_ack:
        mqtt_client.disconnect()
        return False
    return True

def check_conn_start(device_id: str):
    check_ack = []
    MQTT_TOPIC_CONN = f'prawny/{device_id}/ack'
    def on_connect(client,userdata,flags,rc):
        print('Connected Device_ID ' + str(device_id) + ' with result code ' + str(rc))
        client.publish(f"prawny/{device_id}/command","main;ack;0")
        client.publish(f"prawny/{device_id}/command","main;com;start")
        client.subscribe(MQTT_TOPIC_CONN)
    def on_message(client,userdata,msg):
        message = msg.payload.decode()
        if message == 'ACK':
            check_ack.append(True)
            client.loop_stop()
            client.disconnect()
    mqtt_client = mqtt.Client(MQTT_CLIENT_ID)
    mqtt_client.username_pw_set(MQTT_USER,MQTT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.tls_set(MQTT_CA_PATH)
    mqtt_client.tls_insecure_set(True)
    mqtt_client.connect(MQTT_ADDRESS, 1883)
    mqtt_client.loop_start()
    
    # time 5 sec
    startTime = time.time()
    elapsed_time = 0
    while(elapsed_time <= 5) and (not check_ack):
        elapsed_time = time.time() - startTime 
    if not check_ack:
        mqtt_client.disconnect()
        return False
    return True

def measurementCommand(sensor:str):
    switcher = {
        "phMax": "sensor;cal;ph;1;1",
        "phMin": "sensor;cal;ph;1;2",
        "ec": "sensor;cal;ec;1",
        "do": "sensor;cal;do;1;1",
    }
    return switcher.get(sensor)

def calibateCommand(sensor:str):
    switcher = {
        "phMax": "sensor;cal;ph;2;1",
        "phMin": "sensor;cal;ph;2;2",
        "ec": "sensor;cal;ec;2",
        "do": "sensor;cal;do;2;1",
    }
    return switcher.get(sensor)

def measurement(device_id:str, sensor:str):
    check_ack = []
    MQTT_TOPIC_CONN = f'prawny/{device_id}/config'
    def on_connect(client,userdata,flags,rc):
        print('Connected Device_ID ' + str(device_id) + ' with result code ' + str(rc))
        client.publish(f"prawny/{device_id}/command", measurementCommand(sensor))
        client.subscribe(MQTT_TOPIC_CONN)
    def on_message(client,userdata,msg):
        m_decode=str(msg.payload.decode("utf-8","ignore"))
        res=json.loads(m_decode) #decode json data
        if sensor == 'phMax' or sensor == 'phMin':
            msg = res['main']['read']['calph']
            check_ack.append(msg)
            # client.publish(f"prawny/{device_id}/command", 'sensor;cal;ph;3;1')
            client.loop_stop()
            client.disconnect()
        elif sensor == 'do':
            msg = res['main']['read']['caldo']
            check_ack.append(msg)
            # client.publish(f"prawny/{device_id}/command", 'sensor;cal;do;3;1')
            client.loop_stop()
            client.disconnect()    
        else:
            msg = float(res['main']['read']['calec'])
            check_ack.append(msg)
            # client.publish(f"prawny/{device_id}/command", 'sensor;cal;ec;3')
            client.loop_stop()
            client.disconnect()                      
        
    mqtt_client = mqtt.Client(MQTT_CLIENT_ID)
    mqtt_client.username_pw_set(MQTT_USER,MQTT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.tls_set(MQTT_CA_PATH)
    mqtt_client.tls_insecure_set(True)
    mqtt_client.connect(MQTT_ADDRESS, 1883)
    mqtt_client.loop_start()
    
    # time 5 sec
    startTime = time.time()
    elapsed_time = 0
    while(elapsed_time <= 5) and (not check_ack):
        elapsed_time = time.time() - startTime 
    if not check_ack:
        mqtt_client.disconnect()
        return check_ack
    return check_ack

def calibate(device_id:str, sensor:str):
    check_ack = []
    MQTT_TOPIC_CONN = f'prawny/{device_id}/config'
    def on_connect(client,userdata,flags,rc):
        print('Connected Device_ID ' + str(device_id) + ' with result code ' + str(rc))
        client.publish(f"prawny/{device_id}/command",calibateCommand(sensor))
        client.subscribe(MQTT_TOPIC_CONN)
    def on_message(client,userdata,msg):
        m_decode=str(msg.payload.decode("utf-8","ignore"))
        res=json.loads(m_decode) #decode json data
        if 'sensor' in res:
            msg = res['sensor']
            check_ack.append(msg)
            client.loop_stop()
            client.disconnect()
    mqtt_client = mqtt.Client(MQTT_CLIENT_ID)
    mqtt_client.username_pw_set(MQTT_USER,MQTT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.tls_set(MQTT_CA_PATH)
    mqtt_client.tls_insecure_set(True)
    mqtt_client.connect(MQTT_ADDRESS, 1883)
    mqtt_client.loop_start()
    
    # time 5 sec
    startTime = time.time()
    elapsed_time = 0
    while(elapsed_time <= 5) and (not check_ack):
        elapsed_time = time.time() - startTime 
    if not check_ack:
        mqtt_client.disconnect()
        return check_ack
    return check_ack

if __name__ == '__main__':

    print("Test CONN")
    check_conn('test')