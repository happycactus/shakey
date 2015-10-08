HCTree = function (element) { //renamed arg for readability
    this.element = (element instanceof $) ? element : $(element);
};

HCTree.prototype = {
	preloadSettings: function(){
		var that = this;
		$.ajax({
			cache: false,
			url: 'includes/hc_settings.json',
			success: function(data) {
				var game_settings = [];
				$.each( data['settings'], function( key, val ) {
					game_settings.push({
						"imagePath" : val.imagePath,
						"main_background" : val.main_background,
						"guidelines_header" : val.guidelines_header,
						"rules_header" : val.rules_header,
						"shake_text" : val.shake_text
					});
				});
				
				that.settings = game_settings;
				console.log(that.settings);
				that.initDOM();
				//that.downloadImages();
			}
		});
	},
	downloadImages: function(hangman_type){
		var available_options = [];
		$.each( this.imageAdjustments, function (key, val){
			available_options.push(val.body_type);
		})
		//console.log(available_options);
		
		//Check if value exists, otherwise select one at random from list
		hangman_type = ($.inArray(hangman_type, available_options) >= 0) ? hangman_type : available_options[Math.floor(Math.random()*available_options.length)];
		
		//console.log(hangman_type);
		
		this.hangman_type = hangman_type;
		this.imagesPath = 'images/';
		this.filePath = this.imagesPath + hangman_type +'/';
		
		this.canvas_background = new Image();
		this.canvas_background.src = this.imagesPath + this.settings[0].main_background;

	},
	initDOM: function(){
		//Initialise fields in DOM
		//TODO - RP
		//$('h2#howtoplay').text( this.settings[0].guidelines_header);
		
		$('.container').css('background','url(' + this.settings[0].imagePath + this.settings[0].main_background + ') no-repeat center center');
	},
	initEvents: function (){
	},
	resizeImages: function(){
	},
	loadBoard: function(){
	},
	loadKeyboard: function(){
		var valid_keys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		
		//Clear keyboard
		$('#keyboard').html('');

		//Create an array of keys
		var items = [];
		$.each(valid_keys, function( index, value){
			items.push( "<li><a href='#' id='btn_" + value + "'><div class='letter'>" + value + "</div></a></li>" );

		});
		$( "<ul/>", {
			"class": "letters",
			html: items.join( "" )
		}).appendTo( "#keyboard" );
	},
	leftleg_animation: function(canvas, maxdegrees, mindegrees, degrees, increase_degree){
		
	},	
	drawMan: function(badGuess, winner){
		var canvas = this.element[0];
		var ctx = canvas.getContext('2d');
		var that = this;
		var start = null;
	    
	    //HEAD SETTINGS 
	    var degrees = 0;
	    var increase_degree = true;
	    var maxdegrees = 10;
		var mindegrees = -10;

		//Clear Canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this.canvas_background, 0, 0);

		function controlDegrees(){
			if (increase_degree){
				degrees++;
				if (degrees >= maxdegrees){
					increase_degree = false;
					maxdegrees = maxdegrees - 2;
				}
			} else {
				degrees--;
				if (degrees <= mindegrees){
					increase_degree = true;
					mindegrees = mindegrees + 2;
				}
			}
			if (mindegrees >= 0 || maxdegrees <= 0){
				degrees = 0;
			}
		}

	    function animateHead(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.head_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();

				if (progress < 3000) {
					window.requestAnimationFrame(animateHead);
			  	}
		};	

		function animateBody(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.body_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();

				if (progress < 3000) {
					window.requestAnimationFrame(animateBody);
			  	}
		};	
		
		function animateLeftLeg(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.leftleg_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();
			  	
				if (progress < 3000) {
					window.requestAnimationFrame(animateLeftLeg);
			  	}
		};	
		function animateRightLeg(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.rightleg_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();
			  	
				if (progress < 3000) {
					window.requestAnimationFrame(animateRightLeg);
			  	}
		};	
		function animateLeftArm(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.leftarm_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();
			  	
				if (progress < 3000) {
					window.requestAnimationFrame(animateLeftArm);
			  	}
		};	
		function animateRightArm(timestamp){
			if (!start) start = timestamp;
			  	var progress = timestamp - start;
			  	
			  	that.rightarm_animation(canvas, maxdegrees, mindegrees, degrees, increase_degree);
			  	controlDegrees();
			  	
				if (progress < 3000) {
					window.requestAnimationFrame(animateRightArm);
			  	}
		};	
		

	    if (badGuess > 0){
	    	this.drawFirstFrame(ctx, badGuess == 1);
	    }
	    if (badGuess > 1){
	    	this.drawBase(ctx, badGuess == 2);
	    }
	    if (badGuess > 2){
	    	this.drawLever(ctx, badGuess == 3);
	    }
	    if (badGuess > 3){
	    	this.drawCorners(ctx, badGuess == 4);
	   	}
	    if (badGuess > 4){
	    	this.drawNoose(ctx, badGuess == 5);
	    }
	    
	    //SEQUENCE is IMPORTANT!
	    //Draw left leg 
	    if (badGuess > 7){
	    	if (badGuess == 8 ) {
	    		window.requestAnimationFrame(animateLeftLeg);
	    	} else {
	    		this.drawLeftLeg(ctx);
	    	}
	    }
	    //Draw right leg 
	    if (badGuess > 8){
	    	if (badGuess == 9 ) {
	    		window.requestAnimationFrame(animateRightLeg);
	    	} else {
	    		this.drawRightLeg(ctx);
	    	}
	    }

	    //Draw body 2nd to last
	    if (badGuess > 6){
	    	if (badGuess == 7 ) {
	    		window.requestAnimationFrame(animateBody);
	    	} else {
	    		this.drawBody(ctx, badGuess == 7);
	    	}
	    }

	    //Draw left arm
	    if (badGuess > 9){
	    	if (badGuess == 10 ) {
	    		window.requestAnimationFrame(animateLeftArm);
	    	} else {
	    		this.drawLeftArm(ctx);
	    	}
	    }
	    
	    //Draw right arm
	    if (badGuess > 10){
	    	if (badGuess == 11 ) {
	    		window.requestAnimationFrame(animateRightArm);
	    	} else {
	    		this.drawRightArm(ctx);
	    	}
	    }
	    
	    //Draw head last
	    if (badGuess > 5){
	    	if (badGuess == 6 ) {
	    		window.requestAnimationFrame(animateHead);
	    	} else {
	    		this.drawHead(ctx);
	    	}
	    }
	}
};


function drawLineAnimation(ctx, startX, startY, endX, endY, colour, lineThickness){
	var amount = 0;

	ctx.beginPath();
	ctx.lineWidth = lineThickness;
	ctx.strokeStyle = colour;
	ctx.moveTo(startX,startY);
	var inaction = 	false;
	
	if (!inaction){
	    inaction = true;
		var temptimer = setInterval(function(){
		    amount += 0.05; // change to alter duration
		    if (amount > 1) {
		    	amount = 1; 
		    	inaction = false;
		    	clearTimeout(temptimer);
		    }
		    // lerp : a  + (b - a) * f
		    //console.log("STATT X " + (startX + (endX - startX) * amount));
		    //console.log("START UY " + (startY + (endY - startY) * amount));
		    ctx.lineTo(startX + (endX - startX) * amount, 
		    			startY + (endY - startY) * amount);
		    ctx.closePath();
		    ctx.miterLimit = 1;
		    ctx.stroke();
		},10);
	}
}

function drawLine(ctx, startX, startY, endX, endY, colour, lineThickness){
	ctx.beginPath();
	ctx.lineWidth = lineThickness;
	ctx.strokeStyle = colour;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.miterLimit = 1;
	ctx.stroke();
}

/*
 * Starts the game
 */
function start(){
}

/*
 * Resets the game board
 */
function restart(){
}