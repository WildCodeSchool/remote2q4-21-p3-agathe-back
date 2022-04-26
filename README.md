### ABOUT THE PROJECT
This application is the back-end for the elfenn site.

### Built with
* Node.js
* Express
* MySQL
* JSON Web Token

### Getting started
Node.js : https://nodejs.org/en/download/  
MySQL : https://dev.mysql.com/downloads/mysql/

Database : reset-db.sql
It creates an admin user with 'test' password. NEED TO CHANGE THIS  
It contains some fake data at the end of file


  ↳ CREATE DATABASE elfenn

### Installation

1️ Clone the repo

git clone https://github.com/WildCodeSchool/remote2q4-21-p3-agathe-back 

2️ Install NPM packages

npm install

  "dependencies": {  
    "argon2": "^0.28.4",  
    "axios": "^0.26.0",  
    "cookie-parser": "^1.4.6",  
    "cors": "^2.8.5",  
    "dotenv": "^10.0.0",  
    "express": "^4.17.1",  
    "joi": "^17.6.0",  
    "jsonwebtoken": "^8.5.1",  
    "multer": "^1.4.4",  
    "mysql2": "^2.3.0",  
    "nodemon": "^2.0.15"  
  }  

3️ Set up .env with indications .env.sample = parameters necessary for the application to work.  
PORT=8000  
DB_HOST=localhost  
DB_PORT=3306  
DB_USER=root  
DB_PASSWORD=root  
DB_NAME=elfenn  
JWT_SECRET=secret_key  
CLIENT_URL=http://localhost:3000  

4️ Lancement

npm start

5️

Go repository github for front-end 🔗 https://github.com/WildCodeSchool/remote2q4-21-p3-agathe-front
