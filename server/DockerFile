FROM node:24.5.0-bookworm-slim AS client

# Install client dependencies
COPY client/package.json client/package-lock.json /client/
RUN cd /client && npm install

# Copy client source
COPY client /client

# Build client
RUN cd /client && npm run build


FROM python:3.13.5-slim-bookworm AS base

RUN apt update -y \
    && apt install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/venv
ENV PATH=$VIRTUAL_ENV/bin:$PATH \
    PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=Hackathon.settings

ARG UID=1000
RUN useradd Hackathon --uid ${UID} --create-home \
    && mkdir /app $VIRTUAL_ENV \
    && chown -R Hackathon /app $VIRTUAL_ENV

RUN pip install poetry==2.1.4

USER Hackathon
WORKDIR /app

RUN python -m venv $VIRTUAL_ENV

# Install Python deps first for better layer caching
COPY --chown=Hackathon server/pyproject.toml server/poetry.lock ./
RUN poetry install --no-root --only main

# Copy server source
COPY --chown=Hackathon server .

# Install project
RUN poetry install --only main


FROM base AS prod

# Copy built Vite bundle
COPY --chown=Hackathon --from=client /client/dist /client

# Tell Django where the built frontend lives
ENV VITE_BUNDLE_DIR=/client

# Collect static files
RUN DJANGO_SECRET_KEY=secret DJANGO_DEBUG=false DJANGO_ALLOWED_HOSTS=* python manage.py collectstatic --noinput --clear

CMD sh -c "python manage.py migrate && gunicorn Hackathon.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 4 --threads 2"


#FROM base AS dev

#RUN poetry install