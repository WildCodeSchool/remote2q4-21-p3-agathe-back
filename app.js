const connection = require('./db-config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const router = require('./routes/index.routes');

const port = process.env.PORT || 8000;

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
    } else {
        console.log('connected as id ' + connection.threadId);
    }
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use('/api', router);
app.use('/assets', express.static('assets'));

app.get("/", (req, res) => {
    res.send("Welcome");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;