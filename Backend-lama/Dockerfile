FROM node:20-alpine

WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy seluruh source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]