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
  var apikey = secrets.trafiklab.slv3.apikey;
  var timewindow = 60;

  return function(siteids, callback) {
    var _collector = { ExecutionTime: 0, TrafficInfo: { Metros: [ ], Buses: [ ], Trams: [ ], Trains: [ ], Ships: [ ] } };

    var fetcher = function(index, collector) {
      if(index >= siteids.length) { callback(undefined, collector); }
      else { 
        var url = "http://api.sl.se/api2/realtimedepartures.json?key="+apikey+"&siteid="+siteids[index]+"&timewindow="+timewindow;
        request({
          url: url,
          json: true
        }, function(err, res, body) {
          if(err) callback(err);
          else {
            if(body.StatusCode > 0) callback(new Error("Statuscode not 0: " + body.StatusCode + "("+body.Message+")"));
            else {
              collector.ExecutionTime += body.ExecutionTime;
              var data = buildData(body);
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
  }
}
