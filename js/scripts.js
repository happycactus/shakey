(function($) {
    //GLOBAL VARIABLES
    var game = new HCSegment('#segment');
    var orientation = '';

    game.preloadSettings();

     $('#tree').click(function(event){
        //var timer = 0;
        //var direction = "left";
        //for (var i = 0; i < 10; i++) {
                game.shakeDirection("left", 45, 2);
                //movementDelay(direction, timer);
                //direction = (direction == "left") ? "right" : "left";
                //timer = timer + 500;
         //}
    });

    $(document).ready(function() {
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



                // if (tiltLR === 0) {
                //    // orientation = 'center';
                //     moveAllowed = true;
                // }

                // if (tiltLR < 0) {
                // 	//orientation = 'left';

                //     game.moveLeft(-tiltLR, 2);

                // } else if (tiltLR > 0) {
                // 	//orientation = 'right';
                //     game.moveRight(tiltLR, 2);


                // }
                


                //Check forward tilt
                if (tiltFB < 90){ //tilted forward - no nothing
                    if (tiltLR < 0) {
                        //move left
                        game.moveLeft(-tiltLR, 20);
                   
                    } else {
                        game.moveRight(tiltLR, 20);
  
                    }   
                }
                
                
                //$("#answer").text(tiltFB + ' sf-> ' + game.checkCount) // + " : " + tiltFB + " : " + dir);

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
        $(window).resize(function() {});



        // function movementDelay( direction, secondsdelay ){
        //     setTimeout(function(){
        //         console.log(direction);
        //         if (direction == "left"){
        //             game.moveLeft(45, 1);
        //         } else {
        //              game.moveRight(45, 1);
        //         }
        //     }, secondsdelay);
        // }
    });

    // $('a#knop').click(function(event){
    //	event.preventDefault();

    // });

})(jQuery);