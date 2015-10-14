HCSegment = function (element) { //renamed arg for readability
    this.element = (element instanceof $) ? element : $(element);
};

HCSegment.prototype = {
	preloadSettings: function(){
		var that = this;
		$.ajax({
			cache: false,
			url: 'includes/hc_settings.json',
			success: function(data) {
				that.settings = [];
				that.settings.push({
					"imagePath" : data['settings'][0].imagePath,
					"main_background" : data['settings'][0].main_background,
					"guidelines_header" : data['settings'][0].guidelines_header,
					"rules_header" : data['settings'][0].rules_header,
					"shake_text" : data['settings'][0].shake_text,
				});
				
				that.segment = [];
				that.segment = data['settings'][0].segment;
				that.preloadImages();
			}
		});
	},
	preloadImages: function(){
		var that = this;
		var image_srcs = [];
		for (var i = 1; i <= that.segment.number_of_segments; i++) {
			image_srcs.push(that.settings[0].imagePath + that.segment.segment_filepath + that.segment.segment_prename + i + that.segment.segment_filetype);
		}
		loadImages(this.segment.segment_alternative_text, image_srcs, imagesLoaded, that);
		

		function loadImages(alttext, image_sources, callback, that){
			//var t = this;
			var loadCounter = 0;
			var aImages = [];
			$.each( image_sources, function(i, image){
				$('<img />').load(function(data){
					aImages.push(data.currentTarget);
					loadCounter++;
					if (loadCounter == image_sources.length){
						if ( String(typeof(callback)).toUpperCase() == 'FUNCTION' ){
							aImages.sort(function sortArrayBySource(a, b){
								var a_src = $(a).attr('src').toUpperCase();
								var b_src = $(b).attr('src').toUpperCase();
								return (a_src < b_src) ? -1 : (a_src > b_src) ? 1 : 0;
								});
							callback(aImages, that);
						}
					}
				})
				.attr({
					'id' : 'segment_'+i,
					'src': image,
					'alt' : alttext,
					'title': alttext,
					'height' : 190,
					'width'  : 455
				});
			});
		}
		//Callback function after images have loaded
		function imagesLoaded( data, that ){
			that.imageSegments = [];
			that.imageSegments = data;
			that.initDOM();
		}
	},
	//Initialise fields in DOM
	initDOM: function(){
		//Change background image
		$('.container').css({
			'background':'url(' + this.settings[0].imagePath + this.settings[0].main_background + ') no-repeat center center',
			'background-size' : 'cover'
		});

		//Add Items to DOM
		var newmargin = 0;
		var currentHeight = 0;
		var tempIndex = parseInt(this.segment.number_of_segments, 10) + 1;
		
		for (var i = 0; i < this.imageSegments.length; i++) {
			currentHeight = this.imageSegments[i].height;
			newmargin = (i === 0) ? 0 : (currentHeight * 0.75).toFixed(2);
			tempIndex--;
			
			mynewDiv = $("<div />")
				.attr('id', "divsegment_" + i)
				//.addClass('')
				.css({
					'position' : 'relative',
					'left' : 0,
					'margin-top' : '-' + newmargin + 'px',
					'z-index'	: tempIndex
				});
			// myornamentDiv = $("<div />")
			// 	.attr('id', 'ornament_'+i)
			// 	.addClass('gravity_pull')
			// 	.css({
			// 		'position' : 'relative',
			// 		'left'	: '10%',


			// 	});
			//Only add to certain elements
			//.append(mynewDiv);


			mynewDiv.append(this.imageSegments[i]);
			$("#tree").append(mynewDiv);
		}
		var max_degree = 60;
		var duration = 300;
		this.shakeDirection("left", max_degree, duration);
	},
	moveLeft: function(max_degree, duration){
		var t= this;
		var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
		max_degree = (max_degree > 60) ? 60 : max_degree;
		var degrees = Math.floor(max_degree / number_segments );
		
		var previous = degrees;
		var center_y = 100;
		var center_x = 38;

		if ( max_degree > 1){
			for (var i = number_segments -1; i >= 0; i--) {
				previous += degrees;
				center_x += 1;
				center_y += 15;
				//duration += 10;
				$("div#divsegment_"+ i + " img")
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: -previous,
						easing: $.easing.easeInOutCubic
				});
			}
		}
	
	},
	moveRight: function(max_degree, duration){
		var t= this;
		var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
		max_degree = (max_degree > 60) ? 60 : max_degree;
		var degrees = Math.floor(max_degree / number_segments );
		
		var previous = degrees;
		var center_y = 100;
		var center_x = 38;

		if ( max_degree > 1){
			for (var i = number_segments -1; i >= 0; i--) {
				previous += degrees;
				center_x += 1;
				center_y += 15;
				$("div#divsegment_"+ i + " img")
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: previous,
						easing: $.easing.easeInOutCubic 
				});
				// $("div#divsegment_"+ i + " ornament")
				// 	.rotate({
				// 		duration: duration,
				// 		center: [center_x+'%', center_y+'%'],
				// 		animateTo: 0,
				// 		easing: $.easing.easeInOutCubic 
				// });
			}
		}
	
	},
	// shakeRight: function(max_degree, duration){
	// 	var t= this;
	// 	var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
	// 	var degrees = Math.floor(max_degree / number_segments );

	// 	var previous = degrees;
	// 	var center_y = 100;
	// 	var center_x = 38;
		
	// 	if ( max_degree > 1){
	// 		for (var i = number_segments -1; i >= 0; i--) {
	// 			previous += degrees;
	// 			center_x += 1;
	// 			center_y += 15;
	// 			duration += 10;
	// 			$("div#divsegment_"+ i + " img")
	// 			.rotate({
	// 				duration:duration,
	// 				center: [center_x+'%', center_y+'%'],
	// 				animateTo: previous,
	// 				easing: $.easing.easeInOutCubic,
	// 				callback: function(){   
	// 					t.shakeLeft(max_degree/2, duration);
	// 				 }
	// 			});
	// 		}
	// 	}
		
	
	// },
	// shakeLeft: function(max_degree, duration){
	// 	var t= this;
	// 	var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
	// 	var degrees = Math.floor(max_degree / number_segments );
		
	// 	var previous = degrees;
	// 	var center_y = 100;
	// 	var center_x = 38;

	// 	if ( max_degree > 1){
	// 		for (var i = number_segments -1; i >= 0; i--) {
	// 			previous += degrees;
	// 			center_x += 1;
	// 			center_y += 15;
	// 			duration += 10;
	// 			$("#divsegment_"+ i + " img")
	// 				.rotate({
	// 					//angle: previous, 
	// 					duration: duration,
	// 					center: [center_x+'%', center_y+'%'],
	// 					animateTo: -previous,
	// 					easing: $.easing.easeInOutCubic,
	// 					callback: function(){   
							
	// 						t.shakeRight(max_degree/2, duration);
	// 					}
	// 			});
	// 		}
	// 	}
	
	// },
	shakeDirection: function(direction, max_degree, duration){
		var MAX_DEGREES = 60;
		var that = this;
		
		if ( max_degree > 1 && max_degree <= MAX_DEGREES){
			
			var number_segments = parseInt(that.segment.number_of_segments, 10)-1;
			var degrees = Math.floor(max_degree / number_segments );
			
			var previous = degrees;
			var center_y = 100;
			var center_x = 38;
			
			for (var i = number_segments -1; i >= 0; i--) {
				previous += degrees;
				center_x += 1;
				center_y += 15;
				duration += 10;
				
				$("div#divsegment_"+ i + " img")
					.rotate({
						duration:duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: (direction == 'left') ? -previous : previous,
						easing: $.easing.easeInOutCubic,
						callback: function(){   
							direction = (direction == 'left') ? 'right' : 'left';
							that.shakeDirection(direction, max_degree/2, duration);
						}
					});
			}
		}
	}

		
	

};