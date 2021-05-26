from sqlalchemy.orm import Session

from . import models, schemas

def get_data(db: Session, device_id: str):
    return db.query(models.Data).filter(models.Data.device_id == device_id).all()

def get_dataone(db: Session, device_id: str):
    return db.query(models.Data).filter(models.Data.device_id == device_id).order_by(models.Data.time.desc()).first()

def get_user(db: Session ,id: str):
    return db.query(models.User).filter(models.User.id == id).first()

def create_user(db: Session, user: schemas.User):
    db_user = models.User(id=user.id,email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_schedule(db: Session, schedule: schemas.CreateSchedule):
    schedule_user = models.Schedule(**schedule.dict())
    db.add(schedule_user)
    db.commit()
    db.refresh(schedule_user)
    return schedule_user

def get_schedule_user(db: Session, user_id: str):
    user = db.query(models.User).filter(models.User.id == id).first()
    return user.schedules

def delete_schedule(db: Session, id: int):
    schedule = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    dl = db.delete(schedule)
    db.commit()
    return dl


def create_device(db: Session, device: schemas.CreateDevice):
    device = models.Device(**device.dict())
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

def delete_device(db: Session, device_id:str):
    device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    dl = db.delete(device)
    db.commit()
    return dl

def get_data_sensor(db: Session, device_id: str):
    data = db.query(models.Data).filter(models.Data.device_id == device_id).first()
    return data