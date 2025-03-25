require("dotenv").config();
const DistressCall = require("../models/DistressCall");
const User = require("../models/User");
const { sendSMS } = require("../services/smsService");
const {
  sendEmail,
  sendPersonalizedEmail,
} = require("../services/emailService");
const { ensurePhoneNumberWithCountryCode } = require("../utils/phoneUtils");
const WEBSITE_URL = process.env.WEBSITE_URL;

exports.getDistressCalls = async (req, res) => {
  const { ngoName } = req.body;
  const { status } = req.query;

  try {
    const ngo = await User.findOne({ ngoName: ngoName });

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    if (status) {
      const distressCalls = await DistressCall.find({
        status: status,
        ngos: ngoName,
      });

      if (distressCalls.length === 0) {
        return res.status(404).json({
          message: "No distress calls found for the specified NGO and status",
        });
      }

      return res.status(200).json({
        message: "Distress calls retrieved successfully",
        distressCalls,
      });
    } else {
      const statusCounts = await DistressCall.aggregate([
        {
          $match: {
            ngos: ngoName,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const groupedCalls = statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      return res.status(200).json({
        message: "Distress calls grouped by status retrieved successfully",
        distressCalls: groupedCalls,
      });
    }
  } catch (error) {
    console.error("Error fetching distress calls:", error);
    res.status(500).json({
      message: "Server error while fetching distress calls",
      error: error.message,
    });
  }
};

exports.getUserDistressCalls = async (req, res) => {
  const { phNo, email } = req.body;

  try {
    // If neither phNo nor email is provided, return error
    if (!phNo && !email) {
      return res
        .status(400)
        .json({ message: "Phone number or email is required" });
    }

    // Initialize the query condition object
    let queryCondition = {};

    // Check if phNo is provided and valid, add it to the query condition
    if (phNo) {
      queryCondition.userPhNo = phNo;
    }

    // Check if email is provided and valid, add it to the query condition
    if (email) {
      queryCondition.userEmail = email;
    }

    // Find distress calls based on phNo or email with populated NGO details
    const distressCalls = await DistressCall.find(queryCondition).populate({
      path: "assignedNGO", // The field to populate
      select: "ngoName", // Only select the 'ngoName' field
    });

    if (distressCalls.length === 0) {
      return res
        .status(404)
        .json({ message: "No distress calls found for the user" });
    }

    // Loop through distress calls and set acceptedBy to the NGO name
    for (let call of distressCalls) {
      call.acceptedBy = call.assignedNGO ? call.assignedNGO.ngoName : "None";
    }

    // Return distress calls with the NGO names
    return res.status(200).json({
      message: "Distress calls retrieved successfully",
      distressCalls,
    });
  } catch (error) {
    console.error("Error fetching distress calls:", error);
    res.status(500).json({
      message: "Server error while fetching distress calls",
      error: error.message,
    });
  }
};

exports.submitDistressCall = async (req, res) => {
  const {
    location,
    description,
    imgLink,
    userContact,
    animalType,
    nearByNGOs,
    userName,
  } = req.body;

  try {
    const distressLocation = location ? `${location[0]},${location[1]}` : null;
    const userPhNo = userContact ? userContact.phone : null;
    const userEmail = userContact ? userContact.email : null;

    const distressCall = new DistressCall({
      distressLocation,
      desc: description,
      imgLink,
      userPhNo,
      userEmail,
      createdBy: userName,
      animalType,
      status: "Pending",
    });

    // Initialize an empty array to store NGO names
    const ngosList = [];

    // Iterate through the nearby NGOs and add their names
    for (const ngoData of nearByNGOs) {
      const ngoName = ngoData.ngo;

      // Add NGO name to the list for storing with the distress call
      ngosList.push(ngoName);

      const ngoInDb = await User.findOne({ ngoName: ngoName });

      const emailToUse = ngoInDb?.email || ngoData?.email || null;
      const phoneToUse = ngoInDb?.phNo || ngoData?.phNo || null;

      if (emailToUse) {
        // Send email based on NGO's registration status
        if (ngoInDb) {
          await sendEmail(emailToUse, {
            location: distressLocation,
            description,
            imgLink,
            animalType,
          });
        } else {
          await sendPersonalizedEmail(emailToUse, {
            location: distressLocation,
            description,
            imgLink,
            animalType,
          });
        }
      } else if (phoneToUse) {
        // Send SMS if email is not available
        const validPhone = await ensurePhoneNumberWithCountryCode(
          phoneToUse.toString(),
          location[0],
          location[1]
        );
        if (validPhone) {
          const smsContent = ngoInDb
            ? `
                Distress Call Alert:
                Location: ${distressLocation}
                Animal Type: ${animalType || "Not Specified"}
                ${description ? `Details: ${description}` : ""}
                Please visit ${WEBSITE_URL}, log in, and accept the request.
              `.trim()
            : `
                Distress Call Alert:
                Location: ${distressLocation}
                Animal Type: ${animalType || "Not Specified"}
                ${description ? `Details: ${description}` : ""}
                Please visit ${WEBSITE_URL}, sign up, and then accept the request.
              `.trim();

          await sendSMS(validPhone, smsContent);
        }
      }
    }

    distressCall.ngos = ngosList; // Save the NGO names with the distress call

    // Save the distress call in the database
    await distressCall.save();

    res.status(201).json({
      message: "Distress call submitted successfully",
      distressCallID: distressCall._id,
      details: `Distress call for ${nearByNGOs.length} NGOs processed.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateDistressStatus = async (req, res) => {
  const { distressCallID, status, ngoID } = req.body;

  try {
    const distressCall = await DistressCall.findById(distressCallID);
    if (!distressCall) {
      return res.status(404).json({ message: "Distress call not found" });
    }

    if (ngoID) {
      const ngo = await User.findById(ngoID);
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }
    }

    if (distressCall.status === "InProgress" && status === "Pending") {
      distressCall.assignedNGO = null;
    } else {
      if (ngoID) {
        distressCall.assignedNGO = ngoID;
      }
    }

    distressCall.status = status;

    await distressCall.save();

    res.status(200).json({
      message: "Distress call status updated successfully",
      updatedDistressCall: distressCall,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
