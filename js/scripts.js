(function($){
	//GLOBAL VARIABLES
	var game = new HCSegment('#segment');
	game.preloadSettings();

	
	$(document).ready(function(){
		//DETECT orientation and create action
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			//window.addEventListener('devicemotion', deviceMotionHandler);
			window.addEventListener('deviceorientation', function(eventData) {
				// gamma is the left-to-right tilt in degrees, where right is positive
				var tiltLR = Math.round(eventData.gamma);

				// beta is the front-to-back tilt in degrees, where front is positive
				var tiltFB = Math.round(eventData.beta);

				// alpha is the compass direction the device is facing in degrees
				var dir = Math.round(eventData.alpha);

				$("#answer").text(tiltLR);// + " : " + tiltFB + " : " + dir);
				

				if (tiltLR < 0 || tiltFB < 0){
					game.moveLeft(-tiltLR, 2);
				} else {
					game.moveRight(tiltLR, 2);
					//$("#moRotation").text(tiltLR);
				}

			}, false);
		} else {
			$("#doEvent").text("Not supported.");
		}

		// setTimeout(function(){
		// 	$('#tree').click();
		// }, 3000);
		// $('#tree').on('click', function(){
		// 	game.shakeLeft(60, 300);
		// });
			
            
        // function phoneShake() {
        //     //game.shakeLeft(70);
        
        // }

        // $.shake({
        //     callback: function() {
        //         phoneShake();
        //     }
        // });



		//Allow only one click event
		var inaction = false;
		
		//WINDOW RESIZE
		$(window).resize(function(){
		});

	});
	
	// $('a#knop').click(function(event){
	//	event.preventDefault();
		
	// });
	
})(jQuery);