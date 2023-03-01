FROM python:3
WORKDIR /d5n_cicd/cicd
COPY . .
RUN pip install -r Requirements
RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8000
CMD["python","manage.py","runserver","0.0.0.0:8000"]
