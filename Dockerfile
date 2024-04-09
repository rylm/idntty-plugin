FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --global lisk-commander
RUN npm install --global @oclif/core
RUN apt update && apt install -y libtool automake autoconf curl build-essential

FROM node:18 as final

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

RUN chmod +x ./bin/run

EXPOSE 8000

CMD ["./bin/run", "start"]

