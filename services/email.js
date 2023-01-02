const sendgrid = require('@sendgrid/mail');
const path = require('path');
const fs = require('fs');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.registerEmail = (name, email) => {

    const body = fs.readFileSync(path.join(__dirname, '..', 'data', 'register_email.txt'), { encoding: 'utf-8' });

    const message = {
        to: `${name} <${email}>`,
        from: 'Big Data Centre of Excellence <bdcoe@akgec.ac.in>',
        subject: 'Registration Successful',
        html: body
    }

    deliver(message);
}

exports.contactEmail = (name, email) => {

    const body = fs.readFileSync(path.join(__dirname, '..', 'data', 'contact_email.txt'), { encoding: 'utf-8' });

    const message = {
        to: `${name} <${email}>`,
        from: 'Big Data Centre of Excellence <bdcoe@akgec.ac.in>',
        subject: 'Thank you for contacting us',
        html: body    
    }

    deliver(message);
}

function deliver(message) {
    sendgrid.send(message).then(response => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    }).catch(err => {
        console.error(err);
    });
}
