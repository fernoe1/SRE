FROM node

EXPOSE 5000

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_API_URL=http://localhost:4000

RUN npm install
RUN npm run build
RUN npm install -g serve

CMD [ "serve", "-s", "-l", "5000", "build" ]