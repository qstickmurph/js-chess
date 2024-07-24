# Build
FROM node:latest as build

# Set working directory
WORKDIR /app

# Copy entire front end source code
COPY ./src/web/ .

# Install requirements and compile application to /app/dist
RUN npm ci && npm run build

# Sever
FROM nginx:latest as serve

# Copies the nginx conf
COPY ./config/web/nginx/ /etc/nginx/

# Set working directory
WORKDIR /app

# Copies package.json and package-lock.json
COPY ./src/web/package.json ./src/web/package-lock.json .

# Install all production requirements
RUN npm ci --only-production

# Copies the compiled project into the working directory
COPY --from=build /app/dist/ .
