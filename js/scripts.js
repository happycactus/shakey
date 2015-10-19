(function($) {
    //GLOBAL VARIABLES
    var game = new HCSegment('#segment');
    var orientation = '';
    var inaction = false;

    game.preloadSettings();
    

     $('#tree').click(function(event){
        if (!inaction){
            var timeinterval = 360;
            var delaytimer = 0;
            var degrees = 50;
            var direction = "right";

            game.shake("left", 50, timeinterval, 70);
            var shakeanimation = setInterval(function(){
                game.shake(direction, degrees, timeinterval, 70);
                direction = (direction == 'left') ? 'right' : 'left';
                degrees = degrees/2;
                inaction = true;
                
                if (degrees < 1) {
                    inaction = false;
                    clearTimeout(shakeanimation);
                }
                
            }, timeinterval);
          
            setTimeout(function(){
                game.releaseDecoration();
            },100);
        }
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

                //Check forward tilt
                if (tiltFB < 90){ //tilted forward - no nothing
                    if (tiltLR < 0) {
                        //move left
                        game.shake("left", -tiltLR, 2, null);
                    } else {
                        game.shake("right", tiltLR, 2, null);
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