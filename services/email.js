const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.registerEmail = (name, email) => {

    const message = {
        to: `${name} <${email}>`,
        from: 'Big Data Centre of Excellence <bdcoe@akgec.ac.in>',
        subject: 'Registration Successful',
        text: 'You have successfully resigtered for the event'
    }

    deliver(message);
}

exports.contactEmail = (name, email) => {

    const message = {
        to: `${name} <${email}>`,
        from: 'Big Data Centre of Excellence <bdcoe@akgec.ac.in>',
        subject: 'Thank you for contacting us',
        text: 'Thanks for getting in touch, This is an automatic response to let you know that we\'ve received your message and are working on the same. We\'ll reach out to you as soon as possible.'
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
