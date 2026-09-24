# create 2 virtual with the help of docker in one file

#fontend

FROM node:20-alpine as frontend_builder

WORKDIR /app 

COPY ./frontend /app

RUN npm install 

RUN npm run build

#backend

FROM node:20-alpine as backend_builder

WORKDIR /app 

COPY ./Backend /app 

RUN npm install

COPY --from=frontend_builder /app/dist /app/public

CMD [ "node","server.js"]
