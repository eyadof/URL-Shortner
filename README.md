#URL Shortner

- support for anonymous users.
- clicks statistics.

##Installation

Backend dependencies: `npm install`

Frontend dependencies: `cd ui && npm install`

**Required Environment Variables**

- DB_URL: MongoDB connection url.
- JWT_SECRET: secret password to sign jwt tokens.

##Deployment
`DB_URL=<url here> JWT_SECRET=<keep it the same always> npm run deploy`

*note: git and heroku-cli are required.*

#Tests

`npm test`
