function drawLoop(ctx, data, callback) {
  var cw = ctx.canvas.width, ch = ctx.canvas.height;
  ctx.clearRect(0, 0, cw, ch);



  ctx.font = "107px HelveticaNeue-UltraLight"
  ctx.fillStyle = "hsla(0,70%,77%,"+(0.75)+")";
  var mins = (new Date()).getMinutes();
  var days = "Söndag,Måndag,Tisdag,Onsdag,Torsdag,Fredag,Lördag".split(',');
  var clocktxt = days[(new Date()).getDay()]+" "+(new Date()).getHours()+":"+(mins<10?'0':'')+mins;
  //clocktxt += ", Godmorgon!"
  ctx.textAlign = "center";
  ctx.fillText(clocktxt, cw/2, 120+60);
  ctx.textAlign = "left";





  cw = (cw - 25*3)/2

  var bstartx, bstarty, timeline_off;
  var i;


// ------- Buses ----------

  buses_data = sortBusesData(data);
  
  bstartx = 25;
  bstarty = 50+250;
  timeline_off = 210;

  i = bstarty+30;
  for (var station_name in buses_data.stations)
  if (buses_data.stations.hasOwnProperty(station_name)) {
    var station = buses_data.stations[station_name];

    ctx.fillStyle = "white";
    ctx.font = "20px Helvetica"

    ctx.fillText(station_name, bstartx+15, i);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(bstartx,i+3,cw,1);
    
    i+=26;

    for (var destination_name in station)
    if (station.hasOwnProperty(destination_name)) {
      var destination = station[destination_name];
  
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "17px HelveticaNeue-Light"

      ctx.fillText(destination_name, bstartx+15, i);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(bstartx,i+8,cw,1);

      for (var j = 0; j<destination.length; j++) {
        var bus = destination[j];

        var bx = bstartx+timeline_off;

        var p = (bus.time-buses_data.time_now)/(buses_data.time_max-buses_data.time_now);
        bx += Math.round(p*(cw-timeline_off-65-15));

        ctx.fillStyle = "hsla(0,70%,60%,"+(0.8-0.7*p)+")";
        ctx.fillRect(bx,i-20+1,65,25);

        ctx.fillStyle = "rgba(255,255,255,"+(1-0.6*p)+")";
        ctx.fillText(bus.display_time, bx+4, i);
      }
  
      i+=30;
    }

    i+=30;
  }

  ctx.fillStyle = "hsla(0,70%,70%,"+(0.3)+")";
  ctx.fillRect(bstartx+timeline_off,bstarty+10,1,i-bstarty-30-30+20);

  ctx.font = "22px HelveticaNeue-Thin"
  ctx.fillStyle = "hsla(0,70%,80%,"+(0.7)+")";
  ctx.fillText("Bussar (10 min bort)", bstartx+10, bstarty);









// ------- Metros ----------

  metros_data = sortMetrosData(data);

  bstartx = 25*2+cw;

  i = bstarty+30;
  for (var station_name in metros_data.stations)
  if (metros_data.stations.hasOwnProperty(station_name)) {
    var station = metros_data.stations[station_name];

    ctx.fillStyle = "white";
    ctx.font = "20px Helvetica"

    ctx.fillText(station_name, bstartx+15, i);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(bstartx,i+3,cw,1);
    
    i+=26;

    for (var destination_name in station)
    if (station.hasOwnProperty(destination_name)) {
      var destination = station[destination_name];
  
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "17px HelveticaNeue-Light"

      ctx.fillText(destination_name, bstartx+15, i);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(bstartx,i+8,cw,1);

      for (var j = 0; j<destination.length; j++) {
        var bus = destination[j];

        var bx = bstartx+timeline_off;

        var p = (bus.time-metros_data.time_now)/(metros_data.time_max-metros_data.time_now);
        bx += Math.round(p*(cw-timeline_off-65-15));

        ctx.fillStyle = "hsla(0,70%,60%,"+(0.8-0.7*p)+")";
        ctx.fillRect(bx,i-20+1,65,25);

        ctx.fillStyle = "rgba(255,255,255,"+(1-0.6*p)+")";
        ctx.fillText(bus.display_time, bx+4, i);
      }
  
      i+=30;
    }

    i+=30;
  }

  ctx.fillStyle = "hsla(0,70%,70%,"+(0.3)+")";
  ctx.fillRect(bstartx+timeline_off,bstarty+10,1,i-bstarty-30-30+20);

  ctx.font = "22px HelveticaNeue-Thin"
  ctx.fillStyle = "hsla(0,70%,80%,"+(0.7)+")";
  ctx.fillText("Tunnelbanor (också 10 min bort)", bstartx+10, bstarty);









// ------- Metros ----------

  trains_data = sortTrainsData(data);
  window.data = trains_data;

  bstartx = 25*2+cw;
  bstarty = i;

  i += 30;
  for (var station_name in trains_data.stations)
  if (trains_data.stations.hasOwnProperty(station_name)) {
    var station = trains_data.stations[station_name];

    ctx.fillStyle = "white";
    ctx.font = "20px Helvetica"

    ctx.fillText(station_name, bstartx+15, i);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(bstartx,i+3,cw,1);
    
    i+=26;

    for (var destination_name in station)
    if (station.hasOwnProperty(destination_name)) {
      var destination = station[destination_name];
  
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "17px HelveticaNeue-Light"

      ctx.fillText(destination_name, bstartx+15, i);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(bstartx,i+8,cw,1);

      for (var j = 0; j<destination.length; j++) {
        var bus = destination[j];

        var bx = bstartx+timeline_off;

        var p = (bus.time-trains_data.time_now)/(trains_data.time_max-trains_data.time_now);
        bx += Math.round(p*(cw-timeline_off-65-15));

        ctx.fillStyle = "hsla(0,70%,60%,"+(0.8-0.7*p)+")";
        ctx.fillRect(bx,i-20+1,65,25);

        ctx.fillStyle = "rgba(255,255,255,"+(1-0.6*p)+")";
        ctx.fillText(bus.display_time, bx+4, i);
      }
  
      i+=30;
    }

    i+=30;
  }

  ctx.fillStyle = "hsla(0,70%,70%,"+(0.3)+")";
  ctx.fillRect(bstartx+timeline_off,bstarty+10,1,i-bstarty-30-30+20);

  ctx.font = "22px HelveticaNeue-Thin"
  ctx.fillStyle = "hsla(0,70%,80%,"+(0.7)+")";
  ctx.fillText("Pendeltåg (15 min bort)", bstartx+10, bstarty);




	callback();
}





function sortBusesData(data) {
  var buses = data.TrafficInfo.Buses;
  var stations = {};
  var bus_times = {}
  for (var i = 0; i<buses.length; i++) {
    var bus = buses[i];
    var key = bus.data.StopAreaName;
    
    if (!stations[key])
      stations[key] = {};
    
    var destination = bus.data.LineNumber+" "+bus.data.Destination;
    if (!stations[key][destination])
      stations[key][destination] = [];
  
    var time = new Date(bus.data.ExpectedDateTime);
    time.setHours(time.getHours()-1)
  
    stations[key][destination].push({
      time: time,
      display_time: bus.data.DisplayTime,
      departsNow: bus.departsNow,
      isdeparted: bus.isdeparted
    });
  
    time = Math.abs(time);
  
    if (!bus_times.min)
      bus_times.min =
      bus_times.max = time;
  
    bus_times.min = Math.min(time, bus_times.min);
    bus_times.max = Math.max(time, bus_times.max);
  }
  return {
    stations:stations,
    time_min:bus_times.min,
    time_max:bus_times.max,
    time_now:Math.abs(new Date())
  };
}




function sortMetrosData(data) {
  var metros = data.TrafficInfo.Metros;
  var stations = {};
  var bus_times = {}
  for (var i = 0; i<metros.length; i++) {
    var bus = metros[i];
    var key = bus.data.StopAreaName;
    
    if (!stations[key])
      stations[key] = {};
    
    var destination = bus.data.Destination;
    if (!stations[key][destination])
      stations[key][destination] = [];
  
    var time = new Date(bus.time);
  
    stations[key][destination].push({
      time: time,
      display_time: bus.data.DisplayTime,
      departsNow: bus.departsNow,
      isdeparted: bus.isdeparted
    });
  
    time = Math.abs(time);
  
    if (!bus_times.min)
      bus_times.min =
      bus_times.max = time;
  
    bus_times.min = Math.min(time, bus_times.min);
    bus_times.max = Math.max(time, bus_times.max);
  }
  return {
    stations:stations,
    time_min:bus_times.min,
    time_max:bus_times.max,
    time_now:Math.abs(new Date())
  };
}


function sortTrainsData(data) {
  var buses = data.TrafficInfo.Trains;
  var stations = {};
  var bus_times = {}
  for (var i = 0; i<buses.length; i++) {
    var bus = buses[i];
    var key = bus.data.StopAreaName;
    
    if (!stations[key])
      stations[key] = {};
    
    var destination = bus.data.Destination;
    if (!stations[key][destination])
      stations[key][destination] = [];
  
    var time = new Date(bus.data.ExpectedDateTime);
    time.setHours(time.getHours()-1)
  
    stations[key][destination].push({
      time: time,
      display_time: bus.data.DisplayTime,
      departsNow: bus.departsNow,
      isdeparted: bus.isdeparted
    });
  
    time = Math.abs(time);
  
    if (!bus_times.min)
      bus_times.min =
      bus_times.max = time;
  
    bus_times.min = Math.min(time, bus_times.min);
    bus_times.max = Math.max(time, bus_times.max);
  }
  return {
    stations:stations,
    time_min:bus_times.min,
    time_max:bus_times.max,
    time_now:Math.abs(new Date())
  };
}





function reloadData(callback) {
  var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    if (!(xmlhttp.readyState==4 && xmlhttp.status==200))
      return;
    callback(JSON.parse(xmlhttp.responseText));
  }
  xmlhttp.open('GET', '/api/data', true);
  xmlhttp.send();
}

function appLoop(ctx) {
  reloadData(function (data) {
    drawLoop(ctx, data, function () {
      setTimeout(function (ctx) {
        appLoop(ctx);
      }, 60000, ctx)
    })
  });
}

window.onload = function () {
	
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var w = document.body.clientWidth;
	var h = 700;
	canvas.setAttribute("width", w);
	canvas.setAttribute("height", h);

  appLoop(ctx);
}