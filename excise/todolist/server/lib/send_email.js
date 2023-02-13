const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.qq.com",
  auth: {
    user: '792032432@qq.com',
    pass: 'heafeuojysvkbcbd',
  },
  secure: true,
});

const emailTo = (
  to = 'myfriend@gmail.com',
  subject = 'Sending Email using Node.js',
  text = 'That was easy!',
  html = '<b>Hey there! </b>< br > This is our first message sent with Nodemailer < br />',
) => {
  const mailOptions = {
    from: '792032432@qq.com',  // sender address
    to,   // list of receivers
    subject,
    text,
    html,
    // An array of attachments
    // attachments: [
    //   {
    //     filename: 'text notes.txt',
    //     path: 'notes.txt',
    //   },
    // ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(info);
      }
    });
  });
};

const sendEmail = async (req, res, next) => {
  const { to, subject, text, html } = req.body;

  try {
    await emailTo(to, subject, text, html);
    res.send({
      code: 200,
      message: 'success',
    });
  } catch (error) {
    res.send({
      code: -1,
      message: 'failure',
    });
  }
};

module.exports = sendEmail;