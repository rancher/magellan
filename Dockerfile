FROM node:10
WORKDIR /run
VOLUME /run/dist

COPY .ember-cli .
COPY .eslintignore .
COPY .eslintrc.js .
COPY .template-lintrc.js .
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY app app
COPY config config
COPY ember-cli-build.js .
COPY package.json .
COPY public public
COPY server server
COPY testem.js .
COPY tests tests
COPY translations translations
COPY vendor vendor

ENTRYPOINT ["yarn"]
CMD ["server"]
