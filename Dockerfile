FROM node:13.13.0-alpine3.11

RUN mkdir -p /srv/app/nickylai-admin-server
WORKDIR /srv/app/nickylai-admin-server

COPY package.json /srv/app/nickylai-admin-server
COPY package-lock.json /srv/app/nickylai-admin-server

RUN npm install

COPY . /srv/app/nickylai-admin-server

CMD ["npm", "run", "start"]