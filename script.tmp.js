$(function() {
	//$(".switch, .dimmer, .lock, .menu, .momentary, .link, .holiday, .camera, .music, .thermostat, .refresh").append("<i class='spinner fa fa-refresh fa-spin'></i>");
	$(".tile").append("<i class='spinner fa fa-refresh fa-spin'></i>");
	
	setIcons();
	
	$(".switch, .dimmer, .momentary, .clock, .lock, .link, .holiday, .camera, .music i").click(function() {
		animateClick($(this));
	});
	
	$(".switch, .lock, .momentary, .music .play, .music .pause, .holiday, .camera").click(function() {
		$(this).closest(".tile").toggleClass("active");
        sendCommand($(this).attr("data-type"), $(this).attr("data-device"), "toggle");
	});
	
	$(".dimmer").click(function() {
		$(this).toggleClass("active");
    	sendCommand("dimmer", $(this).attr("data-device"), "toggle", $(this).attr("data-level"));
    });
	
    $(".dimmer").on('slidestop', function(e) {
    	var level = $(this).find("input").val()
		if ($(this).hasClass("active")) {
			animateClick($(this));
			sendCommand("dimmer", $(this).attr("data-device"), "level", level);
		};
		$(this).attr("data-level", level);
    });
	
	 $(".music").on('slidestop', function(e) {
    	var level = $(this).find("input").val()
		animateClick($(this));
		sendCommand("music", $(this).attr("data-device"), "level", level);
		$(this).attr("data-level", level);
    });
    
	$(".music .play").click(function() {
		var tile = $(this).closest(".tile");
		tile.removeClass("active");
		sendCommand("music", tile.attr("data-device"), "pause");
	});
	
	$(".music .pause").click(function() {
		var tile = $(this).closest(".tile");
		tile.addClass("active");
		sendCommand("music", tile.attr("data-device"), "play");
	});
	
	$(".music .muted").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "unmute");
	});
	
	$(".music .unmuted").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "mute");
	});
	
	$(".music .back").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "nextTrack");
	});
	
	$(".music .forward").click(function() {
		var tile = $(this).closest(".tile");
		sendCommand("music", tile.attr("data-device"), "previousTrack");
	});
	
	$(".mode, .hello-home, .thermostat").click(function() {
		$("#" + $(this).attr("data-popup")).popup("open");
    });
    
    $(".refresh, .clock").click(function() {
        refresh();
	});
    
    $("#mode-popup li").click(function() {
    	$("#mode-popup").popup("close");
		var tile = $(".mode");
    	animateClick(tile);
        var newMode = $(this).text();
		sendCommand("mode", "mode", newMode);
        
		var oldMode = $(".mode").attr("data-mode");
		tile.removeClass(oldMode);
		tile.attr("data-mode", newMode);
		if (["Home", "Away", "Night"].indexOf(newMode) >= 0) {
			$("#mode-name").hide();
			tile.addClass(newMode);
		} else {
			$("#mode-name").html(newMode).show();
		}
    });
    
    $("#hello-home-popup li").on("click", function() {
    	$("#hello-home-popup").popup("close");
		animateClick($(".hello-home"));
		sendCommand("helloHome", "helloHome", $(this).text());
    });
	
	startTime();
});

var fadeOn = 100;
var fadeOff = 200;

function animateClick(element, toggle) {
	spinner(element);
	element.animate({opacity: 0.3}, fadeOff, "swing").delay(fadeOn).animate({opacity: 1}, fadeOn, "swing");
}

function spinner(element) {
	element.closest(".tile").find(".spinner").fadeIn("slow").delay(2000).fadeOut("slow");
}

function setIcons() {
	$(".switch, .dimmer").append("<div class='icon inactive'><i class='fa fa-toggle-off'></i></div>").append("<div class='icon active'><i class='fa fa-toggle-on'></i></div>");
	
	$(".lock").append("<div class='icon inactive'><i class='fa fa-lock'></i></div>").append("<div class='icon active'><i class='fa fa-unlock-alt'></i></div>");
	
	$(".motion").append("<div class='icon inactive'><i class='fa opaque fa-exchange'></i></div>").append("<div class='icon active'><i class='fa fa-exchange'></i></div>");
	
	$(".presence").append("<div class='icon inactive'><i class='fa opaque fa-map-marker'></i></div>").append("<div class='icon active'><i class='fa fa-map-marker'></i></div>");
	
	$(".contact").append("<div class='icon inactive'><i class='r45 fa fa-compress'></i></div>").append("<div class='icon active'><i class='r45 fa fa-expand'></i></div>");
	$(".water").append("<div class='icon inactive'><i class='fa opaque fa-tint'></i></div>").append("<div class='icon active'><i class='fa fa-tint'></i></div>");
	
	$(".momentary").append("<div class='icon'><i class='fa fa-circle-o'></i></div>");
	$(".camera").append("<div class='icon'><i class='fa fa-camera'></i></div>");
	$(".holiday").append("<div class='icon'><i class='fa fa-tree'></i></div>");
	$(".refresh").append("<div class='icon'><i class='fa fa-refresh'></i></div>");

	$(".dimmer").each(function(){renderSlider($(this))});
	$(".music").each(function(){renderSlider($(this))});
	$(".weather").each(function(){renderWeather($(this))});
	
	$(".humidity").append("<div class='footer'><i class='fa fa-fw wi wi-sprinkles'></i></div>");
	$(".temperature").append("<div class='footer'><i class='fa fa-fw wi wi-thermometer'></i></div>");
	$(".energy").append("<div class='footer'><i class='fa fa-fw wi wi-lightning'></i></div>");
	$(".power").append("<div class='footer'><i class='fa fa-fw fa-bolt'></i></div>");
	$(".battery").append("<div class='footer'><span class='batt'></span></div>");
	
	$(".tile[data-is-value=true]").each(function(){renderValue($(this))});
}

function renderSlider(tile) {
	tile.find(".slider-container").remove();
	tile.append("<div class='slider-container'><div class='full-width-slider'><input value='" + tile.attr("data-level") + "' min='1' max='10' type='range' step='1' data-mini='true' data-popup-enabled='true' data-disabled='false' data-highlight='true'></div></div>").find("input").slider()
	$(".full-width-slider").click(function(e) {e.stopImmediatePropagation();});
}

function renderValue(tile) {
	tile.find(".icon").remove();
	tile.append("<div class='icon text'>" + tile.attr("data-value") + "</div>");
}

function renderWeather(tile) {
	var data = JSON.parse(tile.attr("data-weather"));
	tile.empty();
	var content = "<div class='title'>" + data.city + "<br/><span class='title2'>" + data.weather + ", feels like " + data.feelsLike + "&deg;</span></div>\n\
<div class='icon'><span class='text'>" + data.temperature + "&deg;</span><i class='wi " + data.icon + "'></i></span></div>\n\
<div class='footer'>" + data.localSunrise + " <i class='fa fa-fw wi wi-horizon-alt'></i> " + data.localSunset + "</div>\n\
<div class='footer right'>" + data.percentPrecip + "%<i class='fa fa-fw fa-umbrella'></i><br>" + data.humidity + "%<i class='fa fa-fw wi wi-sprinkles'></i></div>";
	tile.html(content);
}

function sendCommand(type, device, command, value) {
	//alert("&type=" + type + "&device=" + device + "&command=" + command + "&value=" + value);
	
	var access_token = getUrlParameter("access_token");
	var request = { type: type, device: device, command: command, value: value};
	if (access_token) request["access_token"] = access_token;
	
	$.get("command", request).done(function( data ) {
		//alert( "Data Loaded: " + data);
		if (data.status == "ok") {
			nextPoll(5);
		}
	}).fail(function() {
		setWTFCloud();
		nextPoll(10);
	});
}

function doPoll(func) {
	nextPoll(20);
	if (!func) spinner($(".refresh"));
	var access_token = getUrlParameter("access_token");
	var request = {ts:stateTS};
	if (access_token) request["access_token"] = access_token;
	
	$.get("ping", request).done(function( data ) {
		clearWTFCloud();
		if (func) {
			func();
		} else {
			stateTS = data.ts;
			$(".refresh .footer").html("Updated " + data.updated);
			if (data.status == "update") {for (i in data.data) updateTile(data.data[i]);}
		}
	}).fail(function() {
		setWTFCloud();
	});
}

function updateTile(data) {
	if (data.tile == "device") {
		var tile = $("." + data.type + "[data-device=" + data.device + "]");
	
		if (data.type == "music") {
			if (data.trackDescription != tile.attr("data-track-description") || data.mute != tile.attr("data-mute")) spinner(tile);
			tile.attr("data-track-description", data.trackDescription);
			tile.attr("mute", data.mute);
			tile.removeClass("muted unmuted").addClass(data.mute);
			tile.find(".title .track").html(tile.attr("data-track-description"));
		}
		
		if (data.tile == "weather") {
			tile.attr("data-weather", JSON.stringify(d));
			renderWeather(tile);
		} else {
			if (data.value != tile.attr("data-value")) spinner(tile);
			tile.attr("data-value", data.value);
			
			if (data.isValue){
				renderValue(tile);
			} else {
				tile.removeClass("inactive active").addClass(data.active);
				tile.attr("data-active", data.active);
			}
			
			if (data.type == "dimmer" || data.type == "music") {
				if (data.level != tile.attr("data-level")) spinner(tile);
				tile.attr("data-level", data.level);
				renderSlider(tile);
			}
		}
	} else if (data.tile == "mode") {
		var tile = $(".mode");
		if (data.mode != tile.attr("data-mode")) spinner(tile);
		tile.removeClass(tile.attr("data-mode"));
		tile.attr("data-mode", data.mode);
		if (data.isStandardMode) tile.addClass(data.mode);
		$(".mode-name").html(data.mode);
	}
}

var polling;
var wtfCloud = false;

function setWTFCloud() {
	wtfCloud = true;
	$("#wtfcloud-popup").popup("open");
}

function clearWTFCloud() {
	wtfCloud = false;
	$("#wtfcloud-popup").popup("close");
}

function nextPoll(timeout) {
	if (polling) clearInterval(polling)
	polling = setInterval(function () {doPoll()}, timeout * 1000);
}

nextPoll(30);

function refresh(timeout) {
	if (!timeout) {
		setTimeout(function() { doRefresh() }, 100);
	} else {
		setTimeout(function() { doRefresh() }, timeout * 1000);
	}
}

function doRefresh() {
	doPoll(function func(){
		$(".refresh .icon").addClass("fa-spin");
		location.reload();
	});
}

refresh(60 * 60); // hard refresh every hour

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

CoolClock.config.skins = { 
st: {
	outerBorder:      { lineWidth: 12, radius: 100, color: "yellow", alpha: 0 },
		smallIndicator:   { lineWidth: 16, startAt: 80, endAt: 85, color: "white", alpha: 1 },
		largeIndicator:   { lineWidth: 2, startAt: 80, endAt: 85, color: "white", alpha: 1 },
		hourHand:         { lineWidth: 8, startAt: 0, endAt: 60, color: "white", alpha: 1 },
		minuteHand:       { lineWidth: 6, startAt: 0, endAt: 75, color: "white", alpha: 1 },
		secondHand:       { lineWidth: 5, startAt: 80, endAt: 85, color: "red", alpha: 0 },
		secondDecoration: { lineWidth: 3, startAt: 96, radius: 4, fillColor: "white", color: "black", alpha: 1 }
},
st1: {
outerBorder: { lineWidth: 2, radius: 80, color: "white", alpha: 0 },
smallIndicator: { lineWidth: 5, startAt: 88, endAt: 94, color: "yellow", alpha: 0 },
largeIndicator: { lineWidth: 5, startAt: 90, endAt: 94, color: "white", alpha: 1 },
hourHand: { lineWidth: 8, startAt: 0, endAt: 60, color: "white", alpha: 1 },
minuteHand: { lineWidth: 8, startAt: 0, endAt: 80, color: "white", alpha: 1 },
secondHand: { lineWidth: 5, startAt: 89, endAt: 94, color: "white", alpha: 1 },
secondDecoration: { lineWidth: 3, startAt: 0, radius: 4, fillColor: "black", color: "black", alpha: 0 }
}
}

function startTime() {
    if (!document.getElementById('clock')) return;
    var today=new Date();
    var h=today.getHours();
    if (h > 12) {
    	h = h - 12;
    }
    var m=today.getMinutes();
    var s=today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h+":"+m;
    setTimeout(function(){startTime()},500);
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

var cellSize = getUrlParameter("t") || 120;
var cellGutter = getUrlParameter("g") || 4;

$(function() {
  var wall = new freewall(".tiles");
  wall.fitWidth();
  
  wall.reset({
			draggable: false,
			selector: '.tile',
		animate: true,
		gutterX:cellGutter,
		gutterY:cellGutter,
		cellW:cellSize,
		cellH:cellSize,
		fixSize:null,
		onResize: function() {
			wall.fitWidth();
			wall.refresh();
		}
	});
	wall.fitWidth();
	// for scroll bar appear;
	$(window).trigger("resize");
});
