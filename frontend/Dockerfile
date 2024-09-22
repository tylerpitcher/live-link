# Stage 1: Build Application
FROM node:20-alpine AS build

# Pass environment variable
ARG REACT_APP_BACKEND_URL

# Set working directory within the container
WORKDIR /app

# Copy all files from the current directory to the working directory
COPY . .

# Install dependencies based on package.json and package-lock.json
RUN npm install

# Build the application using npm
RUN npm run build

# Stage 2: Create Hosting Environment
FROM nginx:stable-alpine3.19-perl

# Remove the default content of Nginx HTML directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application from the previous stage to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file to Nginx config directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for incoming HTTP traffic
EXPOSE 80

# Start Nginx server in the foreground
CMD ["nginx", "-g", "daemon off;"]
