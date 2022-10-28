require('dotenv').config();
const express = require('express');

require('./utils/db').connect();
const adminRouter = require('./routes/admin');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res, next) => {
    res.status(200).send('server running');
});

app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
});

app.listen(process.env.PORT, ()=>{
    console.log(`server running on PORT:${process.env.PORT}`);
});