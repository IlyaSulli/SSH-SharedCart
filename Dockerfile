FROM node:22.11.0
WORKDIR /server
COPY . .
RUN npm --verbose install
EXPOSE 5500
CMD [ "node", "server.js" ]


