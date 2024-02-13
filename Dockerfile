# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the server will run
EXPOSE 5000

# Start the server
CMD [ "npm", "run", "server" ]
