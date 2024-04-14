# first stage
# used for development and production
FROM node:20.12.2-alpine as base

WORKDIR /usr/src/app

# Preparing the building step
COPY package*.json ./
RUN npm install
COPY . .

# second stage
# installing dependencies and building code for the production environment
FROM base as builder
WORKDIR /usr/src/app

# copying the `package.json` from the previous step
COPY --from=base /usr/src/app/package*.json ./

RUN npm run build

# third stage
# copying the minimum amount of files for the production environment
FROM node:20.12.2-alpine
WORKDIR /usr/src/app

# copying the `package.json` from the previous step
COPY --from=builder /usr/src/app/package*.json ./
# copying the compiled typescript code from the previous step
COPY --from=builder /usr/src/app/build build

RUN npm ci install --production

CMD npm run start:prod