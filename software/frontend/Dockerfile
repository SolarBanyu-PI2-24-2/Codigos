# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos do projeto para o container
COPY . .

# Instale as dependências do projeto
RUN npm install

# Exponha a porta que o frontend usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
