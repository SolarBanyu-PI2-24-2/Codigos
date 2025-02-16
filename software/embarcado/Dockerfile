FROM python:3.11-alpine3.17

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . /app

ENV PATH="/scripts:/venv/bin:$PATH"

WORKDIR /app

RUN pip install --no-cache-dir -r djangoapp/requirements.txt

EXPOSE 5000