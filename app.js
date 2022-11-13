require('dotenv').config();
const express = require('express');
const cookieparser = require('cookie-parser');

require('./utils/db').connect();
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const authentication = require('./middlewares/authentication');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.status(200).send('server running');
});

app.use('/api', apiRouter);
app.use('/auth', authentication, authRouter);
app.use('/admin', authentication, adminRouter);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`server running on PORT:${process.env.PORT}`);
});