const {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} = require("libphonenumber-js");
const isoCountries = require("i18n-iso-countries");
const axios = require("axios");

const getCountryFromCoordinates = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await axios.get(url);
    return response.data.address.country || null;
  } catch (error) {
    return null;
  }
};

const ensurePhoneNumberWithCountryCode = async (
  phoneNumber,
  latitude,
  longitude
) => {
  const countryCodePattern = /^\+(\d+)/;
  const matched = phoneNumber.match(countryCodePattern);

  if (matched) {
    return phoneNumber; // Already includes a country code
  }

  const country = await getCountryFromCoordinates(latitude, longitude);
  if (!country) return null;

  const countryCode = isoCountries.getAlpha2Code(country, "en");
  if (!countryCode) return null;

  const countryCallingCode = getCountryCallingCode(countryCode);
  if (!countryCallingCode) return null;

  const phoneNumberWithCountryCode = `+${countryCallingCode}${phoneNumber}`;
  const phoneNumberObject = parsePhoneNumberFromString(
    phoneNumberWithCountryCode,
    countryCode
  );
  return phoneNumberObject ? phoneNumberObject.formatInternational() : null;
};

module.exports = { ensurePhoneNumberWithCountryCode };
