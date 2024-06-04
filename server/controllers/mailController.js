const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: '37214956807@mby.co.il',
        pass: 'Student@264'
    }
  });

  function sendEmail(to, body) {
    const mailOptions = {
        from: ' Gruner. <37214956807@mby.co.il>',
        to: to,
        subject: "סיסמא למייל",
        text: body
    };
    return transporter.sendMail(mailOptions);
  }


const sendEmailToUser = (req,res)=>{
    const { to,body } = req.body;
  sendEmail(to,body)
      .then(info => {
          console.log('Email sent: ', info.response);
          return true
      })
      .catch(error => {
          console.log('Error sending email: ', error);
          return false
      });
}

module.exports = {sendEmailToUser}