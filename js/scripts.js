(function($){
	//console.log( $('#intro_board').height() );
	//$.getScript("js/game.js");
	//GLOBAL VARIABLES
	//var word = $('#mystery_word'),
    //letters = $('#letters'),
   

	var game = new HCSegment('#segment');
	game.preloadSettings();

	
	$(document).ready(function(){
		
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('devicemotion', deviceMotionHandler);
			// window.addEventListener('devicemotion', function(eventData) {
			// 	// gamma is the left-to-right tilt in degrees, where right is positive
			// 	var tiltLR = eventData.gamma;

			// 	// beta is the front-to-back tilt in degrees, where front is positive
			// 	var tiltFB = eventData.beta;

			// 	// alpha is the compass direction the device is facing in degrees
			// 	var dir = eventData.alpha;

			// 	// call our orientation event handler
			// 	devOrientationHandler(tiltLR, tiltFB, dir);
			// }, false);
		} else {
			$("#doEvent").text("Not supported.");
		}

		// function devOrientationHandler(tiltLR, tiltFB, dir){
		// 	alert(tiltLR + " : " + tiltFB + " : " + dir);
		// }

		function deviceMotionHandler(eventData) {
			var info, xyz = "[X, Y, Z]";
			//console.log(eventData.acceleration.y);
			//$("#moAccel").text("event acceleration: " + eventData.acceleration.x);
			//console.log( "alpha: " + Math.round(event.rotationRate.alpha) );
			//$("#dmEvent").text("alpha: " + Math.round(event.rotationRate.alpha));
			// // Grab the acceleration from the results
			var acceleration = eventData.acceleration;
			info = xyz.replace("X", Math.round(acceleration.x),2);
			info = info.replace("Y", Math.round(acceleration.y),2);
			info = info.replace("Z", Math.round(acceleration.z),2);
			$("#moAccel").text(info);

			// Grab the acceleration including gravity from the results
			acceleration = eventData.accelerationIncludingGravity;
			info = xyz.replace("X", Math.round(acceleration.x),2);
			info = info.replace("Y", Math.round(acceleration.y),2);
			info = info.replace("Z", Math.round(acceleration.z),2);
			$("#moAccelGrav").text(info);

			// Grab the rotation rate from the results
			var rotation = eventData.rotationRate;
			info = xyz.replace("X", Math.round(rotation.alpha),2);
			info = info.replace("Y", Math.round(rotation.beta),2);
			info = info.replace("Z", Math.round(rotation.gamma),2);
			$("#moRotation").text(info);

			// // Grab the refresh interval from the results
			info = eventData.interval;
			$("#moInterval").text(info);
		}
		//setInterval(function(){ $('#shake').shake(); }, 3000);
            
        // function phoneShake() {
        //     $('#shake').hide();
        //     alert('shake');
        // }

        // $.shake({
        //     callback: function() {
        //         phoneShake();
        //     }
        // });



		//Allow only one click event
		var inaction = false;
		
		var doc_width = $(document).width();
			
		$('.container').width( doc_width );
		
		//WINDOW RESIZE
		$(window).resize(function(){
			var doc_width = $(document).width();

			$('.container').width( doc_width );
		});

	});
	
	// $('a#knop').click(function(event){
	//	event.preventDefault();
		
	// });
	
	
	//function loadSettings(){
	//	$.ajax({
	//		cache: false,
	//		url: 'includes/hc_settings.json',
	//		success: function(data) {
	//			$.each( data, function( key, val ) {
	//				//Do something
	//			});
	//		},
	//		error: function(data){
	//			//File is empty 
	//		}
	//	});
	//}
	
})(jQuery);