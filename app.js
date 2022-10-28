require('dotenv').config();
const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    res.status(200).send('hello');
});

app.listen(process.env.PORT, ()=>{
    console.log(`server running on PORT:${process.env.PORT}`);
});