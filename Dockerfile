FROM node:8.17.0-jessie

ENV ANSIBLE_INVENTORY=/app/inventory.conf

RUN mkdir /app
WORKDIR /app
COPY . /app/

RUN cd /app && npm install

CMD /usr/local/bin/node ./main.js -c ${ANSIBLE_INVENTORY}