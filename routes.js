const express = require('express');
const router = express.Router();
const apicache = require('apicache');
const request = require('superagent');
const Baby = require('babyparse');

const cache = apicache.options({ 
  // one day (ms in s * s in min * mins in hr * hrs in day)
  defaultDuration: 1000 * 60 * 60 * 24 
}).middleware;


router.get('/sheet/:id', cache(), (req, expressRes, next) => {

  if (!req.params.id) {
    return expressRes
    .status(400)
    .send({ error: 'Missing sheet ID.' });
  }

  // use the sheet id for cache key
  req.apicacheGroup = req.params.id;

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

router.post('/purge/:id', (req, res, next) => {
  apicache.clear(req.params.id);
  res.status(204).send(); 
});

router.get('/cache-example', cache('100 days'), (req, res, next) => {
  console.log('cache miss');
  res.json({ example: 'response' });
});

module.exports = router;
