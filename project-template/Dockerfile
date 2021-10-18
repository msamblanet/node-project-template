#
# This is a baseline Dockerfile from @msamblanet/node-project-template
# It is copied only when the project is first initialized.  It should
# be modified to suit your project's needs OR deleted if you do not
# need it.
#
FROM node:16-alpine

ENV NODE_ENV=production
EXPOSE 8080

#
# Make a work folder owned by root:node, switch to user node
#
RUN mkdir /app && chown root:node /app && chmod 770 /app
WORKDIR /app

#
# Copy package.json and install then lock all the current file permissions
#
COPY --chown=root:node package*.json ./
USER node
RUN npm run prod:init
USER root
RUN chmod -R g-w,o-rwx /app

#
# Copy all our source over and lock down file permissions
#
COPY --chown=root:node dist ./dist
RUN chmod -R g-w,o-rwx ./dist

#
# Startup command is "npm run prod:start"
#
USER node
CMD ["npm", "run", "prod:start"]
