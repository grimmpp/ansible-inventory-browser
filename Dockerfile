FROM node:8.17.0-jessie

ARG ANSIBLE_INVENTORY=inventory.conf
ENV ANSIBLE_INVENTORY=${ANSIBLE_INVENTORY}

RUN mkdir /app/
WORKDIR /app
COPY . /app/

RUN cd /app && npm install

CMD \
    node main.js -c ${ANSIBLE_INVENTORY} \
    && PORT=8000 node server.js
EXPOSE 8000

# if you use windows and docker toolbox don't forget to create a port forwarding for your docker host VM