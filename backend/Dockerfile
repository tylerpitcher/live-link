# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app is running on
EXPOSE 8000

# Command to run the backend server
CMD ["npm", "start"]
