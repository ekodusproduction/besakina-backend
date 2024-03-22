# Use the official Node.js image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the source code from the 'src' folder to the working directory in the container
COPY src/ ./src/

# Copy app.js, server.js, and public folder to the working directory in the container
COPY app.js server.js public/ ./

# Expose the port on which the Node.js application will run (change it if your server.js file uses a different port)
EXPOSE 3000

# Command to run the Node.js application
CMD ["node", "server.js"]
