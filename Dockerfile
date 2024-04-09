FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:18 as final

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

EXPOSE 8000

CMD ["./bin/run", "start"]

