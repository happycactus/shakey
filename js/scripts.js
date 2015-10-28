(function($) {
    //GLOBAL VARIABLES
    var game = new HCSegment('#segment');
    var orientation = '';
    var inaction = false;
    var gamecount = 0;
    var prizes_won = 0;

    game.preloadSettings();
    
/*TEST CLICK*/
     $('#tree').click(function(event){
        if (!inaction){
            inaction = true;
            var timeinterval = 200;
            var delaytimer = 0;
            var degrees = 50;
            var direction = "right";

            game.shake("left", 50, timeinterval, 70);
            var shakeanimation = setInterval(function(){
                game.shake(direction, degrees, timeinterval, 70);
                direction = (direction == 'left') ? 'right' : 'left';
                degrees = degrees/2;
                gamecount++;

                if (degrees < 1) {
                    inaction = false;
                    clearTimeout(shakeanimation);
                }
                
            }, timeinterval);
          
            //Check for winner after a few seconds
            setTimeout(function(){
                checkWinner();
            }, 460);
        }
    });

    /*
    * Releases the ornament and checks if it's a prize
    * If its a prize then add to prizes_won until winning total is reached
    */
    function checkWinner(){
        if (gamecount > 3){
           gamecount = 0;
           prize = game.releaseDecoration();
           
            //Check if it's a prize that has fallen
            if (prize !== null){
                if ( prize.id.substr(0, 5) == 'prize'){
                    prizes_won++;
                    
                    //WINNER?
                    if (prizes_won == game.getNumberOfWinningPrizes()){
                       //YOU HAVE WON!
                        setTimeout(function(){
                           
                            game.nextSlide($('#slide2'));
                        }, 1000);
                    }
                }
            }
        }
    }
        // window.onresize = function(event) {
        //     var leftWidth = $( window ).width();
        //     $('.slide').css('left', leftWidth);
        //     $('.currentSlide').css('left', 0)
        // };


    $(document).ready(function() {

        //DETECT orientation and create action
        // Listen for the deviceorientation event and handle the raw data
        if (window.DeviceOrientationEvent) {
            
            
            var direction = "left";
            var leftdirection = false;

            //window.addEventListener('devicemotion', deviceMotionHandler);
            window.addEventListener('deviceorientation', function(eventData){
                // gamma is the left-to-right tilt in degrees, where right is positive
                var tiltLR = Math.round(eventData.gamma);

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = Math.round(eventData.beta);

                // alpha is the compass direction the device is facing in degrees
                var dir = Math.round(eventData.alpha);
                
                var flexible_margin = 0;
                var shake_margin = 10;
                //Check forward tilt
                if (tiltFB > -flexible_margin && tiltFB < 90){  //Front to back range - only works if it's within range

                    // UNCOMMENT IF YOU WANT TO REACT ON FLAT/LEVEL ROTATING
                    // if (tiltLR < flexible_margin && tiltLR > -flexible_margin) {
                    //     if ( dir < 90 && dir > 0 ){
                    //         game.shake("left", dir, 2, null);
                            
                    //         if (direction == 'right' && dir > shake_margin){
                    //             leftdirection = true;
                    //             gamecount++;
                    //             direction = 'left';
                    //         }

                    //     } else if (dir > 270 && dir < 360){
                    //         game.shake("right", 360-dir, 2, null);

                    //         if (direction == 'left' && dir < 340){
                    //             leftdirection = true;
                    //             gamecount++;
                    //             direction = 'right';
                    //         }

                    //     }
                    // } else 
                    if (tiltLR < -flexible_margin && tiltLR > -90) {
                            //move left
                            game.shake("left", -tiltLR, 2, null);

                            if (direction == 'right' && tiltLR < -shake_margin){
                                leftdirection = true;
                                if($('#slide1').hasClass('active')){
                                gamecount = 0;
                                    
                                }
                                gamecount++;
                                direction = 'left';
                            }

                    } else if (tiltLR > flexible_margin && tiltLR < 90) {
                        game.shake("right", tiltLR, 2, null);
                        
                        if (direction == 'left' && tiltLR > shake_margin){
                            leftdirection = true;
                              if($('#slide1').hasClass('active')){
                                gamecount = 0;
                                    
                                }
                                gamecount++;
                            direction = 'right';
                        }
                    }
                    $(".scored").text(shake_margin-gamecount);
                }

                setTimeout(function(){
                    checkWinner();
                }, 1000);
                
                $("#answer").text(gamecount + ' : ' +tiltLR + " : " + dir);
                //$("#answer").text(tiltFB + ' : ' +tiltLR + " : " + dir);
              
            }, false);
        } else {
            $("#answer").text("Not supported.");
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