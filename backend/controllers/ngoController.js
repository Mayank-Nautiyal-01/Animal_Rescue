const axios = require("axios");
const User = require("../models/User");

exports.getNearbyNGOs = async (req, res) => {
  const { longitude, latitude, radius = 5000 } = req.query;
  const GOOGLE_API_KEY = "AIzaSyD7BnbC3a-KDzlBzeDiAG6pJh24VoMoYdM"; // Replace with your actual API key

  try {
    // Fetch NGOs from your database within the radius
    const earthRadius = 6371; // Earth's radius in km
    const nearbyNgosFromDB = await User.find({
      type: "ngo", // Assuming there's a 'role' field to identify NGOs
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            radius / earthRadius,
          ],
        },
      },
    }).select("name email phNo ngoName location");

    const formattedDbResults = nearbyNgosFromDB.map((ngo) => ({
      name: ngo.ngoName || "Unknown",
      email: ngo.email || null,
      phone: ngo.phNo || null,
      location: ngo.location,
    }));

    // Fetch NGOs or Clinics from Google Maps API
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${
      radius * 1000
    }&keyword=animal+care+ngo&key=${GOOGLE_API_KEY}`;
    const googleResponse = await axios.get(googleApiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AnimalHelperLocator/1.0",
      },
    });

    // Process Google API results to include only entries with phone or email
    const filteredGoogleNgos = googleResponse.data.results
      .map((ngo) => ({
        name: ngo.name || "Unknown",
        email: ngo.email || null,
        phone: ngo.formatted_phone_number || null,
        location: ngo.geometry.location,
      }))
      .filter((ngo) => ngo.email || ngo.phone); // Filter for valid entries

    // Combine results from database and Google API
    const combinedResults = [...formattedDbResults, ...filteredGoogleNgos];

    // Send the combined list as the response
    res.status(200).json(combinedResults);
  } catch (error) {
    console.error("Error fetching animal helpers:", error);
    res.status(500).json({ error: "Failed to fetch nearby animal helpers." });
  }
};
