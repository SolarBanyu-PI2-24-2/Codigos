FROM docker:20.10.23-dind

RUN apk add --no-cache docker-compose

WORKDIR /app

COPY . .

EXPOSE 8000 8080 5000

CMD ["sh", "scripts/start_all.sh"]
