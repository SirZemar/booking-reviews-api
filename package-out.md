{
  "name": "booking-reviews-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "puppeteer": "^21.3.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.18",
    "@types/node": "^20.8.4",
    "concurrently": "^8.2.1",
    "nodemon": "^3.0.1",
    "typescript": "^5.2.2"
  }
}
