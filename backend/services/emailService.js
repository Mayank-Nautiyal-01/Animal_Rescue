require("dotenv").config();

const nodemailer = require("nodemailer");
const { emailConfig } = require("../config/email");

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

const WEBSITE_URL = process.env.WEBSITE_URL;

// Function to send a basic email with enhanced content
const sendEmail = async (recipientEmail, distressDetails) => {
  const mailOptions = {
    from: '"Animal NGO Finder" <noreply@animalngofinder.com>',
    to: recipientEmail,
    subject: "🚨 Distress Call Alert for Injured Animal",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Distress Call Alert</h2>
        <p>Dear Responder,</p>
        <p>A distress call has been reported for an injured animal. Please review the details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              distressDetails.location
            }</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Description:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              distressDetails.description
            }</td>
          </tr>
          ${
            distressDetails.imgLink
              ? `<tr>
                  <td colspan="2" style="padding: 10px; text-align: center;">
                    <img src="${distressDetails.imgLink}" alt="Animal in distress" style="max-width: 100%; border-radius: 5px;"/>
                  </td>
                </tr>`
              : ""
          }
        </table>
        <p>Please take appropriate action to assist the animal in need.</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${WEBSITE_URL}" 
            style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Visit Animal NGO Finder
          </a>
        </p>
        <hr style="margin: 20px 0;"/>
        <p style="font-size: 12px; color: #555;">This is an automated email from Animal NGO Finder. Please do not reply to this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send a personalized email with enhanced content
const sendPersonalizedEmail = async (recipientEmail, distressDetails) => {
  const mailOptions = {
    from: '"Animal NGO Finder" <noreply@animalngofinder.com>',
    to: recipientEmail,
    subject: "🚨 Distress Call Alert - Action Required",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #FF5722; text-align: center;">Urgent: Action Required</h2>
        <p>Dear Volunteer,</p>
        <p>An injured animal has been reported. Kindly review the details below and take necessary action:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              distressDetails.location
            }</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Description:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              distressDetails.description
            }</td>
          </tr>
          ${
            distressDetails.imgLink
              ? `<tr>
                  <td colspan="2" style="padding: 10px; text-align: center;">
                    <img src="${distressDetails.imgLink}" alt="Animal in distress" style="max-width: 100%; border-radius: 5px;"/>
                  </td>
                </tr>`
              : ""
          }
        </table>
        <p>To accept this request, please sign up or log in at the link below:</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${WEBSITE_URL}" 
            style="background-color: #FF5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Take Action Now
          </a>
        </p>
        <hr style="margin: 20px 0;"/>
        <p style="font-size: 12px; color: #555;">This is an automated email from Animal NGO Finder. Please do not reply to this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, sendPersonalizedEmail };
