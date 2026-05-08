FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask gunicorn

COPY app.py .

EXPOSE 5000

# Use gunicorn with 4 workers to handle concurrent load test requests
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "--timeout", "30", "app:app"]