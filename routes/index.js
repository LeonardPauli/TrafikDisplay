var express = require('express');
var router = express.Router();

var fs = require("fs");
var slApi = require("../includes/apis/sl.js")(JSON.parse(fs.readFileSync("./secrets.json")));


/* GET home page. */
router.get('/', function(req, res) {
  slApi([9507, 9302, 3747], function(err, data){
    if(err) throw err;
    else res.render('index', { data: data });
  });
});

module.exports = router;
