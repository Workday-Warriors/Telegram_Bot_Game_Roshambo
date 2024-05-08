require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");

const app = express();

var corsOptions = { origin: "*" };

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.get('/', (_, res) => {
    res.sendStatus(200);
});

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {
    console.log('Running environment:', process.env.NODE_ENV);
    console.log('Listening on port', PORT);
});