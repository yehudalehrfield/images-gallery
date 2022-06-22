FROM node:15.14-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm install -g npm@6.14.10

RUN npm install --silent

COPY . ./

CMD ["npm", "start"]