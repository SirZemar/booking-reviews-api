FROM node:18.16.0

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json .

# Install production dependencies.
RUN npm ci
# RUN npm install

COPY . .

ENV PORT=8080

RUN npm uninstall puppeteer

RUN npm i puppeteer

RUN if [ "$NODE_ENV" = "development" ]; then \
    echo "Running in development mode, skipping build"; \
  else \
    npm run build; \
  fi

EXPOSE 8080

CMD ["npm", "start"]