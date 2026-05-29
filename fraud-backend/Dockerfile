FROM python:3.12-slim

WORKDIR /app

# Install build dependencies for psycopg2 and bcrypt
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Uninstall any conflicting bcrypt versions, then install pinned version
RUN pip install --no-cache-dir --upgrade pip \
    && pip uninstall -y bcrypt passlib 2>/dev/null || true \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

# Seed DB then start server
CMD ["sh", "-c", "python seed.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
