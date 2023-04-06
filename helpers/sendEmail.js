const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const mail = { ...data, from: SENDGRID_EMAIL };
  try {
    await sgMail.send(mail);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
