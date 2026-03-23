FROM node:22.14.0-bookworm-slim AS dev

ARG UID=1000
RUN userdel node && useradd Hackathon --uid ${UID} -l --create-home && mkdir /client && chown Hackathon /client

WORKDIR /client
USER Hackathon
