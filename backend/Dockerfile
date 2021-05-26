FROM python:3.7

COPY requirements.txt requirements.txt 
RUN pip install -r requirements.txt

EXPOSE 4001

COPY ./app /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4001"]