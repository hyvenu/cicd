STEP 1: Clone project from Particular Branch .
STEP 2: Create and Activate Virtual Environment.(create with cmd python -m venv venv and activate with cmd venv\scripts\activate)
STEP 3: Created Database name has to be place in databases of settings file(i.e  In settingg.py file set  DATABASES->'NAME':'DB Name')
STEP 4: Install requirements with command "pip install -r requirments.txt"
STEP 5: python manage.py makemigrations
STEP 6: python manage.py migrate
STEP 7: python manage.py createsuperuser
STEP 8: python manage.py runserver