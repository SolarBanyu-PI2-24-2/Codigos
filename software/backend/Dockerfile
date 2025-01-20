FROM python:3.11-alpine3.17

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./djangoapp /djangoapp
COPY ./scripts /scripts

WORKDIR /djangoapp

EXPOSE 8000

RUN python -m venv /venv && \
  /venv/bin/pip install --upgrade pip && \
  /venv/bin/pip install -r /djangoapp/requirements.txt && \
   chmod -R +x /scripts

ENV PATH="/scripts:/venv/bin:$PATH"

CMD ["commands.sh"]