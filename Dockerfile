# Using image from AWS ECR
FROM 891180839529.dkr.ecr.ap-south-1.amazonaws.com/expressbuy-node:latest

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
CMD [ "npm", "run", "start" ]
