from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, Text
from sqlalchemy.orm import relationship

from .database import Base



class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    devices = relationship("Device", back_populates="owner")
    schedules = relationship("Schedule", back_populates="owner")

class Data(Base):
    __tablename__ = "data"
    time = Column(DateTime,index=True,primary_key=True)
    device_id = Column(String, index=True,primary_key=True)
    temperature = Column(Float)
    ph = Column(Float)
    doxy = Column(Float)
    ec = Column(Float)

class Device(Base):
    __tablename__ = "devices"
    device_id = Column(String, index=True, primary_key=True)
    owner_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    image = Column(Text)
    is_active = Column(Boolean,default=True)
    owner = relationship("User", back_populates="devices")

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, index=True, primary_key=True,autoincrement=True) 
    name_device = Column(String)
    device_id = Column(String)
    owner_id = Column(String, ForeignKey("users.id"))
    condition = Column(String)
    sensor = Column(String)
    value = Column(Float)
    msg = Column(String) 
    owner = relationship("User", back_populates="schedules")
