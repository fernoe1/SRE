FROM node

EXPOSE 4000

WORKDIR /usr/src/app

COPY . .

ENV PORT=4000

RUN npm install

CMD [ "node", "server" ]