var express = require('express');
var router = express.Router();

var fs = require("fs");
var slApi = require("../includes/apis/sl.js")(JSON.parse(fs.readFileSync("./secrets.json")));


/* GET home page. */
router.get('/', function(req, res) {
  slApi.getDepartures([9507, 9302, 3747], function(err, data){
    if(err) throw err;
    else res.render('index', { data: data });
  });
});

router.get('/api/json/departures/:siteid', function(req, res) {
  var siteid = parseInt(req.params.siteid);
  console.log(siteid);
  if(!(siteid > 0)) return res.status(500).end();
  slApi.getDepartures([req.params.siteid], function(err, data){
    if(err) { 
      console.log(err);
      return res.status(500).end();
    } else {
      res.json(data);
    }
  });
});

router.get('/api/json/stations/:searchstring/:stationsonly', function(req, res) {
  slApi.searchSites({searchstring: req.params.searchstring, stationsonly: req.params.stationsonly}, function(err, data){
    if(err) throw err;
    else res.json(data);
  });
});

module.exports = router;
