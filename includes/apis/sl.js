var request = require("request");
var moment = require("moment");
moment.locale("sv");
var fs = require("fs");

var parseMethod = function(time, data) {
  var format = new RegExp(/\d* min/);
  var regex = new RegExp(/\d*/);

  var unsorted = [ ];
  for(var i = 0; i < data.length; i++) {
    var item = { };
    item.data = data[i];
    item.departsNow = false;
    item.isdeparted = false;
    if(data[i].ExpectedDateTime)
      item.time = moment(data[i].ExpectedDateTime);
    else {
      var displaytime = data[i].DisplayTime.toString();
      if(displaytime === "Nu" || displaytime === "nu") {
        item.minutes = 0;
        item.time = moment(time).add(10, "seconds");
        item.departsNow = true;
      }
      else if(format.test(displaytime)){
        item.minutes = parseInt(regex.exec(displaytime)[0]);
        item.time = moment(time).add(item.minutes, "minutes");
      }
      else {
        item.time = moment(displaytime, "hh:mm");
      }
    }
    unsorted.push(item);
  }

  var sorted = unsorted.sort(function(a, b){
    return a.time.diff(b.time);
  });
  return sorted;
}

var momentify = function(data) {
  for(var key in data.TrafficInfo) {
    var info = data.TrafficInfo[key];
    for(var i = 0; i < info.length; i++) {
      info[i].time = moment(info[i].time);
    }
  }
  return data;
}

var buildData = function(data) {
  var returnData = momentify(JSON.parse(JSON.stringify(data)));
  returnData.ResponseData = undefined;
  returnData.TrafficInfo = {
    Metros: parseMethod(data.ResponseData.LatestUpdate, data.ResponseData.Metros),
    Buses: parseMethod(data.ResponseData.LatestUpdate, data.ResponseData.Buses),
    Trams: parseMethod(data.ResponseData.LatestUpdate, data.ResponseData.Trams),
    Trains: parseMethod(data.ResponseData.LatestUpdate, data.ResponseData.Trains),
    Ships: parseMethod(data.ResponseData.LatestUpdate, data.ResponseData.Ships)
  };
  returnData.update = function(){
    var temp = shiftToNow(returnData);
    returnData = temp;
  }
  return returnData;
}

var shiftToNow = function(data) {
  var returnData = momentify(JSON.parse(JSON.stringify(data)));
  var now = moment();
  for(var key in returnData.TrafficInfo) {
    var info = returnData.TrafficInfo[key];
    for(var i = 0; i < info.length; i++) {
      var departure = info[i];
      var diff = departure.time.diff(now);
      var isfuture = now.isBefore(departure.time);
      if(!isfuture) departure.isdeparted = true;
      departure.departsNow = diff < 60000 && isfuture;
      departure.minutes = Math.floor(diff / 60000);
    }
  }
  return returnData;
}



module.exports = function(secrets) {
  var timewindow = 60;

  var returnVal = { };

  var cache = { };

  var permonth = 10000;

  var secondspermonth = 60 * 60 * 24 * 31;

  console.log(secondspermonth / permonth);

  returnVal.getDepartures = function(siteids, callback) {
    var _collector = { ExecutionTime: 0, TrafficInfo: { Metros: [ ], Buses: [ ], Trams: [ ], Trains: [ ], Ships: [ ] } };


    var saveFor = 10;
    var fetch = function(site, cb) {
      if(cache.hasOwnProperty(site) && cache[site].time.isAfter(moment().subtract(60, "seconds"))) {
        cb(null, cache[site].data);
      } else {
        var url = "http://api.sl.se/api2/realtimedepartures.json?key="+secrets.trafiklab.slv3.apikey+"&siteid="+encodeURI(site)+"&timewindow="+encodeURI(timewindow);
        request({
          url: url,
          json: true
        }, function(err, res, body) {
          if(err) {
            cb(err);
          } else {
            if(!cache.hasOwnProperty(site)) cache[site] = { };
            cache[site].time = moment();
            cache[site].data = buildData(body);
            cb(err, cache[site].data);
          }
        });
      }
    };
    var fetcher = function(index, collector) {
      if(index >= siteids.length) { 
        return callback(null, collector);
      } else { 
        fetch(siteids[index], function(err, body){
          if(err) {
            return callback(err);
          } else {
            if(body.StatusCode > 0) {
              return callback(new Error("Statuscode not 0: " + body.StatusCode + "("+body.Message+")"));
            } else {
              collector.ExecutionTime += body.ExecutionTime;
              var data = shiftToNow(body);
              for(var key in data.TrafficInfo) {
                if(!collector.TrafficInfo.hasOwnProperty(key)) collector.TrafficInfo[key] = [ ];
                for(var i = 0; i < data.TrafficInfo[key].length; i++)
                  collector.TrafficInfo[key].push(data.TrafficInfo[key][i]);
              }
            }
            fetcher(index+1, collector);
          }
        });
      }
    }
    fetcher(0, _collector);
  };
  returnVal.searchSites = function(options, callback) {
    if(!(options.stationsonly === true || options.stationsonly === false || options.stationsonly === "true" || options.stationsonly === "false")) callback(new Error("stationsonly need to be a boolean"));

    var url = "http://api.sl.se/api2/typeahead.json?key="+secrets.trafiklab.slplaces.apikey+"&searchstring=\""+encodeURI(options.searchstring)+"\"&timewindow="+encodeURI(timewindow);
    request({
      url: url,
      json: true
    }, function(err, res, body) {
      callback(err, body.ResponseData);
    });
  };
  return returnVal;
}
