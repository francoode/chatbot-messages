FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN chmod 777 dist
RUN chmod +x entrypoint.sh  # Da permisos de ejecución al script
ENTRYPOINT ["sh", "./entrypoint.sh"]