from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
#DB
from sqlalchemy.orm import Session
from . import crud, models, schemas, mqtt, linemessage
from .database import SessionLocal, engine

#APScheduler Related Libraries
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
import logging

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Prawny API",version="0.1.2beta")
origins = [
    "http://localhost:3000",
    "https://prawny.ml",
    "http://prawny.ml",
    "https://968b9197bc87.ngrok.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# APSchedule
Schedule = None
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def load_schedule_or_create_blank():
    """
    Instatialise the Schedule Object as a Global Param and also load existing Schedules from SQLite
    This allows for persistent schedules across server restarts. 
    """
    global Schedule
    try:
        jobstores = {
            'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
        }
        Schedule = AsyncIOScheduler(jobstores=jobstores)
        Schedule.start()
        logger.info("Created Schedule Object")   
    except:    
        logger.error("Unable to Create Schedule Object")

@app.on_event("shutdown")
async def pickle_schedule():
    """
    An Attempt at Shutting down the schedule to avoid orphan jobs
    """
    global Schedule
    Schedule.shutdown()
    logger.info("Disabled Schedule")

@app.get("/data/{device_id}", response_model=List[schemas.Data])
def read_data(device_id:str, db: Session = Depends(get_db)):
    db_data = crud.get_data(db,device_id=device_id)
    if not db_data:
        raise HTTPException(status_code=404, detail="Device ID not found")
    return db_data

@app.get("/dataone/{device_id}", response_model=schemas.Data)
def read_dataone(device_id:str, db: Session = Depends(get_db)):
    #  check_conn = mqtt.check_conn(device_id)
    data = crud.get_dataone(db,device_id=device_id)
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    # if not check_conn:
    #     raise HTTPException(status_code=404, detail="Can't connect device")
    return data

# connection to device with mqtt
@app.get("/connection/{device_id}", status_code=200)
def check_connection(device_id:str):
    check_conn = mqtt.check_conn_start(device_id)
    # print(check_conn)
    if not check_conn:
        raise HTTPException(status_code=404, detail="Can't connect device")
    return {"massage": 'OK'}

@app.post("/measurement",status_code=200)
def measurement(body: schemas.ConfigDevice ):
    value = mqtt.measurement(body.device_id,body.sensor)
    if not value:
        raise HTTPException(status_code=404, detail="Can't connect device")
    return {"value": value[0]}

@app.post("/calibate", response_model=schemas.Calibate)
def calibate(body: schemas.ConfigDevice):
    result = mqtt.calibate(body.device_id,body.sensor)
    print(result)
    if result:
        if body.sensor == 'phMax' or body.sensor == 'phMin':
            res = schemas.Calibate(store=str(result[0]['stored']),ph_info=result[0]['pH'])
            return res
        return schemas.Calibate(store=str(result[0]['stored']))
    else:
        raise HTTPException(status_code=404, detail="Can't connect device")

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.CreateUser, db : Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user.id)
    if db_user:
        return db_user
    else:
        return crud.create_user(db,user)

@app.post("/devices", status_code=201, response_description="Created")
def create_device(device: schemas.CreateDevice, db: Session = Depends(get_db)):
    if crud.create_device(db,device=device):
        return {"message": 'Created'}
    else:
        raise HTTPException(status_code=404, detail="Can't create device")

@app.delete("/devices/{device_id}", status_code=200)
def delete_device(device_id:str, db: Session = Depends(get_db)):
    crud.delete_device(db,device_id=device_id)
    return "Deleted"

@app.post("/schedules", status_code=201, response_description="Created")
def creat_schedule(schedule: schemas.CreateSchedule, db: Session = Depends(get_db)):
    createSchedule = crud.create_schedule(db, schedule=schedule)
    
    if schedule.condition == 'min' or schedule.condition == 'max':
        schedule = Schedule.add_job(linemessage.pushMessage,'interval', minutes=1, id=str(createSchedule.id), args=[schedule.owner_id,schedule.name_device,schedule.device_id,schedule.condition, schedule.value, schedule.sensor ,schedule.msg])
    elif schedule.condition == 'time':
        schedule = Schedule.add_job(linemessage.test,'interval', minutes=1, id=str(schedule.id), args=[schedule.owner_id])
    return {"message": 'Created'}

@app.delete("/schedules/{job_id}", status_code=200)
def delete_schedule(job_id: str, db: Session = Depends(get_db)):
    crud.delete_schedule(db,id=int(job_id))
    schedule = Schedule.remove_job(job_id)
    return "Deleted"


# @app.get("schedules/{user_id}", response_model=List[schemas.Schedule])
# def get_shedules_user(user_id:str, db:Session = Depends(get_db) ):
#     return crud.get_schedule_user(db,user_id=user_id)
