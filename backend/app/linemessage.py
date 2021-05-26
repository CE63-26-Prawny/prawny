import json
import os
#linebot 
from linebot import LineBotApi
from linebot.models import TextSendMessage, FlexSendMessage
#db
import psycopg2
from . import crud
from datetime import datetime

#global variable
line_bot_api = LineBotApi(os.environ.get('PRAWNY_LINE_CHANNEL_ACCESS_TOKEN'))

def pushMessage(owner_id: str, name_device:str, device_id: str, condition: str, value: float, sensor: str, msg: str):
    indexSensor = 0 
    if sensor == "temp": 
        indexSensor = 2
    elif sensor == "ph":
        indexSensor = 3
    elif sensor == "doxy":
        indexSensor = 4
    else:
        indexSensor = 5

    conn=psycopg2.connect(
        host=os.environ.get('PRAWNY_DB_HOST'),
        port=os.environ.get('PRAWNY_DB_PORT'),
        database=os.environ.get('PRAWNY_DB_NAME'),
        user=os.environ.get('PRAWNY_DB_USER'),
        password=os.environ.get('PRAWNY_DB_PW')
    )
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM data WHERE device_id = '{device_id}' ORDER BY time DESC LIMIT 2")
    data = cur.fetchone()[indexSensor]
    conn.commit()
    cur.close()
    conn.close()

    msg = '''{
    "type":"bubble",
    "body":{
        "type":"box",
        "layout":"vertical",
        "spacing":"md",
        "contents":[
            {
                "type":"text",
                "text":"%s",
                "weight":"bold",
                "size":"xl",
                "contents":[
                    
                ]
            },
            {
                "type":"box",
                "layout":"vertical",
                "spacing":"sm",
                "contents":[
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"Sensor",
                                "weight":"bold",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"Value",
                                "weight":"bold",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"%s",
                                "weight":"regular",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"%s",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "footer":{
        "type":"box",
        "layout":"vertical",
        "contents":[
            {
                "type":"separator",
                "margin":"md",
                "color":"#000000FF"
            },
            {
                "type":"text",
                "text":"%s",
                "weight":"regular",
                "align":"start",
                "margin":"md",
                "contents":[
                    
                ]
            }
        ]
    }
    }'''%(name_device,sensor,str(data),msg)
    
    if condition == 'max':
        if data > value:
            res = json.loads(msg)
            line_bot_api.push_message(owner_id,FlexSendMessage(alt_text="warning",contents=res))
    elif condition == 'min':
        if data < value:
            res = json.loads(msg)
            line_bot_api.push_message(owner_id,FlexSendMessage(alt_text="warning",contents=res))
            

def pushMessagebyTime(owner_id: str, id: str, device_id: str, msg: str):
    conn=psycopg2.connect(
        host=os.environ.get('PRAWNY_DB_HOST'),
        port=os.environ.get('PRAWNY_DB_PORT'),
        database=os.environ.get('PRAWNY_DB_NAME'),
        user=os.environ.get('PRAWNY_DB_USER'),
        password=os.environ.get('PRAWNY_DB_PW')
    )
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM data WHERE device_id = '{device_id}' ORDER BY time DESC LIMIT 2")
    data = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    msg='''
{
    "type":"bubble",
    "size":"giga",
    "direction":"ltr",
    "body":{
        "type":"box",
        "layout":"vertical",
        "spacing":"md",
        "contents":[
            {
                "type":"text",
                "text":"%s",
                "weight":"bold",
                "size":"xl",
                "contents":[
                    
                ]
            },
            {
                "type":"box",
                "layout":"vertical",
                "spacing":"sm",
                "contents":[
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"Sensor",
                                "weight":"bold",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"Value",
                                "weight":"bold",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"Temperature",
                                "weight":"regular",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"%s",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"pH",
                                "weight":"regular",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"%s",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"Dissolved Oxygen",
                                "weight":"regular",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"%s",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    },
                    {
                        "type":"box",
                        "layout":"baseline",
                        "contents":[
                            {
                                "type":"text",
                                "text":"Electrical Conductivity",
                                "weight":"regular",
                                "margin":"sm",
                                "contents":[
                                    
                                ]
                            },
                            {
                                "type":"text",
                                "text":"%s",
                                "color":"#000000FF",
                                "align":"end",
                                "contents":[
                                    
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "footer":{
        "type":"box",
        "layout":"vertical",
        "contents":[
            {
                "type":"separator",
                "margin":"md",
                "color":"#000000FF"
            },
            {
                "type":"text",
                "text":"%s",
                "weight":"regular",
                "size":"lg",
                "align":"start",
                "margin":"md",
                "contents":[
                    
                ]
            }
        ]
    }
}'''%(device_id,sensor,str(data[2]),str(data[3]),str(data[4]),str(data[5]),msg)
    res = json.loads(msg)
    line_bot_api.push_message(owner_id,FlexSendMessage(alt_text="warning",contents=res))

def test(device_id: str, ownder_id: str,msg: str):
    conn=psycopg2.connect(
        host=os.environ.get('PRAWNY_DB_HOST'),
        port=os.environ.get('PRAWNY_DB_PORT'),
        database=os.environ.get('PRAWNY_DB_NAME'),
        user=os.environ.get('PRAWNY_DB_USER'),
        password=os.environ.get('PRAWNY_DB_PW')
    )
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM data WHERE device_id = '{device_id}' ORDER BY time DESC LIMIT 2")
    value = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    print(value)
    line_bot_api.push_message(ownder_id,TextSendMessage(text=f'message: {msg}, value={str(value[3])}'))