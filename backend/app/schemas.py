from typing import List, Optional

from pydantic import BaseModel
from typing import Optional

from datetime import datetime



class Data(BaseModel):
    time: datetime
    device_id: str
    temperature: float
    ph: float
    doxy: float
    ec: float

    class Config:
        orm_mode = True

class CreateDevice(BaseModel):
    device_id: str
    owner_id: str
    name: str
    image: str

class Device(BaseModel):
    device_id: str
    owner_id: str
    name: str
    image: str
    is_active: bool

    class Config:
        orm_mode = True

class Schedule(BaseModel):
    id: int
    name_device: str
    device_id: str
    owner_id: str
    condition: str
    sensor: str
    value: float
    msg: str

    class Config:
        orm_mode = True

class CreateSchedule(BaseModel):
    name_device: str
    device_id: str
    owner_id: str
    condition: str
    sensor: str
    value: float
    msg: str

class CreateUser(BaseModel):
    id: str
    email: str 
   
class User(BaseModel):
    id: str
    email: str
    is_active: bool
    devices: List[Device] = []
    schedules: List[Schedule] = []

    class Config:
        orm_mode = True

class ConfigDevice(BaseModel):
    device_id:str
    sensor: str

class Calibate(BaseModel):
    store: str
    ph_info: Optional[str]