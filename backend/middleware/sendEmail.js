const nodeMailer = require("nodemailer");

exports.sendEmail = async(options)=>{
    const transporter = nodeMailer.createTransport({
       host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d6244ec7a28d37",
    pass: "049af939daf38a",
  },
    });

const mail0ptions = {
    from: "process.env.SMPT_MAIL",
    to: options.email,
    subject: options.subject,
    text: options.message,
}
await transporter.sendMail(mail0ptions);
}
