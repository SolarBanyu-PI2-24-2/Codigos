FROM python:3.11-alpine3.17

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . /mqtt
COPY ./scripts/start.sh /mqtt/start.sh

WORKDIR /mqtt

ENV PATH="./scripts/start.sh:/venv/bin:$PATH"

RUN pip install --no-cache-dir -r djangoapp/requirements.txt

EXPOSE 5000
