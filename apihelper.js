const request = require("request");

// helps to call an api from backend
module.exports = {
  makeAPICall: function (url) {
    return new Promise((resolve, reject) => {
      request(
        url,
        { headers: { "user-agent": "node.js" }, json: true },
        (err, res, body) => {
          if (err) reject(err);
          resolve(body);
        }
      );
    });
  },
};
