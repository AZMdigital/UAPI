FROM node:16.14.0-alpine

WORKDIR /app
COPY . .

# Set the environment variable
ARG ENV_CONFIG

RUN yarn install --immutable
RUN yarn run $ENV_CONFIG

EXPOSE 3001
CMD ["yarn", "run", "start", "-p", "3001"]
