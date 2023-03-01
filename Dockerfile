FROM python:3
RUN python3 -m venv venv
RUN source venv/bin/activate
cd /cicd/erpserver
RUN pip install -r Requirments.txt
RUN pip install django==3.1.1

COPY . .

RUN python manage.py makemigrations
RUN python manage.py migrate
EXPOSE 8000
CMD ["python","manage.py","runserver","0.0.0.0:8000"]