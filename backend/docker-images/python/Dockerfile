FROM python:3.13-slim

WORKDIR /app

RUN useradd -m runner
USER runner

CMD ["python", "/app/main.py"]