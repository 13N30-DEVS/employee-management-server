# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.14.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# See .dockerignore to avoid copying sensitive files

# Install dependencies and build the TypeScript code in a single RUN instruction
RUN npm install --ignore-scripts && npm run build

# Switch to non-root user for security
USER node

# Expose the port your application listens on
EXPOSE 3030


CMD ["npm", "run", "start"]
