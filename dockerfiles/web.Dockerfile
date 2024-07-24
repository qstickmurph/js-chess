# Build
FROM node:latest as build

# Set working directory
WORKDIR /app

# Copy entire front end source code
COPY ./src/web/ ./

# Install requirements, test, lint, and compile web application
RUN npm ci
RUN npm run test
RUN npm run lint
RUN npm run build

# Sever
FROM nginx:latest as serve

# Copies the nginx conf
COPY ./config/web/nginx/ /etc/nginx/

# Copies the compiled project into the working directory
COPY --from=build /app/dist/ /app/
