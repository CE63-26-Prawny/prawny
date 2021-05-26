from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5432/prawny"
SQLALCHEMY_DATABASE_URL = f"postgresql://{os.environ.get('PRAWNY_DB_USER')}:{os.environ.get('PRAWNY_DB_PW')}@{os.environ.get('PRAWNY_DB_HOST')}:{os.environ.get('PRAWNY_DB_PORT')}/{os.environ.get('PRAWNY_DB_NAME')}" 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
