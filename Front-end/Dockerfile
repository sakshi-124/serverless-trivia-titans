
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install --force --only=production
COPY build/ ./build/
RUN npm install -g serve


CMD ["serve", "-s", "build"]

EXPOSE 8080
