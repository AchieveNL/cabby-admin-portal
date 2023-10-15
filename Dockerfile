# Use the official Node.js 14 image from DockerHub.
FROM node:18

# Create a work directory and copy over our dependency manifest files.
WORKDIR /usr/src/app
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the application
RUN npm run build

# Run the web service on container startup.
CMD ["npm", "start"]
