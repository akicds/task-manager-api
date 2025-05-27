# Use official Node.js image as base
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g nodemon

# Copy the rest of the app files
COPY . .

# Expose the port your app runs on (change 3000 if needed)
EXPOSE 3000

# Command to run the app in dev mode
CMD ["npm", "run", "dev"]
