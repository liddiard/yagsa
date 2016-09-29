const express = require('express');
const router = express.Router();
const cache = require('apicache').middleware;
const request = require('superagent');
const Baby = require('babyparse');


router.get('/sheet/:id', cache('1 minute'), function(req, expressRes, next) {

  if (!req.params.id) {
    return expressRes
    .status(400)
    .send({ error: 'Request missing sheet ID.' });
  }

  const url = `https://docs.google.com/spreadsheets/d/${req.params.id}/pub?output=csv`;

  request
  .get(url)
  .end((err, res) => {
    if (err) {
      return expressRes
      .status(502)
      .send({ error: `Could not fetch spreadsheet from ${url}` });
    }

    // config settings: http://papaparse.com/docs#config
    const results = Baby.parse(res.text, {
      // convert numeric and boolean strings to their types instead of
      // remaining strings
      dynamicTyping: true,
      // interpret first row of spreadsheet as field names, return array of
      // objects keyed by field name
      header: true
    });

    expressRes.json(results.data);
  });

});

module.exports = router;
