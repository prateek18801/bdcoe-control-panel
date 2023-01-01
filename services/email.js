const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendConfirmationEmail = (name, email) => {

    const message = {
        to: `${name} <${email}>`,
        from: 'Big Data Centre of Excellence <bdcoe@akgec.ac.in>',
        subject: 'Registration Successful',
        text: 'You have successfully resigtered for the event'
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
