module.exports = {
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
