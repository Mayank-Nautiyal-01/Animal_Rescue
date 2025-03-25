const express = require("express");
const {
  submitDistressCall,
  updateDistressStatus,
  getDistressCalls,
  getUserDistressCalls
} = require("../controllers/distressController");
const router = express.Router();

router.post("/fetch-user-calls", getUserDistressCalls);
router.post("/fetch-distress-calls", getDistressCalls);
router.post("/submit", submitDistressCall);
router.patch("/status", updateDistressStatus);

module.exports = router;
