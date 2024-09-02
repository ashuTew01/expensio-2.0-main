FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]
