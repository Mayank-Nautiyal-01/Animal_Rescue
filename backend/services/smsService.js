const { sendSMS } = require("../utils/twilio");

const sendDistressSMS = async (phoneNumber, message) => {
  try {
    await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = { sendSMS: sendDistressSMS };
