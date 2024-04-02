FROM node:lts

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install 
COPY . .
RUN npx prisma generate
EXPOSE 4000

CMD ["npx", "nodemon", "src/index.ts"]
