    #!/bin/sh

    cd djangoapp

    python manage.py collectstatic --noinput
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput

    daphne -b 0.0.0.0 -p 5000 app.asgi:application