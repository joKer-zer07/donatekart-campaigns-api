const express = require("express");
const router = express.Router();
const apiHelper = require("./apihelper");
const cors = require("cors");

// API to get the campaigns of donatekart
const API = "https://testapi.donatekart.com/api/campaign";

// 1. Endpoint to get a list of campaigns
router.get("/all-campaigns", cors(), (req, res) => {
  apiHelper
    .makeAPICall(API)
    .then((response) => {
      //sorting based on totalAmount in descending order
      response = response.sort((ta1, ta2) =>
        ta1.totalAmount > ta2.totalAmount ? -1 : 1
      );
      // remove the fields that are not required
      response = response.map(
        ({
          code,
          featured,
          priority,
          shortDesc,
          imageSrc,
          created,
          procuredAmount,
          totalProcured,
          categoryId,
          ngoCode,
          ngoName,
          daysLeft,
          percentage,
          ...keepAttrs
        }) => keepAttrs
      );
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 2. Endpoint to get active campaigns that are created within last 1 month
router.get("/active-campaigns", cors(), (req, res) => {
  apiHelper
    .makeAPICall(API)
    .then((response) => {
      // filter out the active campaigns
      response = response.filter((obj) => new Date(obj.endDate) >= new Date());
      // calculate 30 days before today
      var dateBefore30Days = new Date();
      dateBefore30Days.setDate(dateBefore30Days.getDate() - 30);
      // filter out the campaigns that are created within 30 days
      response = response.filter(
        (obj) =>
          new Date(obj.created) <= new Date() &&
          new Date(obj.created) >= new Date(dateBefore30Days)
      );
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 3. Endpoint to get closed campaigns
router.get("/closed-campaigns", cors(), (req, res) => {
  apiHelper
    .makeAPICall(API)
    .then((response) => {
      // filter out the closed campaigns
      response = response.filter(
        (obj) =>
          obj.procuredAmount >= obj.totalAmount ||
          new Date(obj.endDate) < new Date()
      );
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

module.exports = router;
