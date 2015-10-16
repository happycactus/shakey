HCSegment = function(element) { //renamed arg for readability
    this.element = (element instanceof $) ? element : $(element);
};

HCSegment.prototype = {

  	preloadSettings: function(){
		var that = this;
		that.imageSegments = [];
		that.imageDecorations = [];
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
								
				that.preloadImages(that.settings[0].imagePath, data['settings'][0].segment, data['settings'][0].decoration);
			}
		});
	},
	preloadImages: function(imagePath, segment_settings, deco_settings){
		var that = this;
		var images = [];
		var randomid = 0;
		var aVariants = [];
		var number_of_segments = parseInt(segment_settings.number_of_segments,10);
		var totalDecorations = ((number_of_segments - 1) * (number_of_segments)) / 2;
		

		//Create segments
		for (var i = 1; i <= number_of_segments; i++) {
			images.push({"imageType" : "segment", "id" : i, "height":segment_settings.height, "width": segment_settings.width, "alt" : segment_settings.alternative_text, "src" : imagePath + segment_settings.filepath + segment_settings.prename + i + segment_settings.filetype});
		}

		//Create ornaments
		for (var j= 1; j <= parseInt(deco_settings.number_of_variants,10); j++) {
			aVariants.push(j);
		}
		
		for (var x = 1; x <= totalDecorations; x++) {
			randomid = aVariants[Math.floor(Math.random() * aVariants.length)];
			images.push({"imageType" : "decoration", "id" : x, "height" : deco_settings.height, "width" : deco_settings.width, "alt": deco_settings.alternative_text, "src" : imagePath + deco_settings.filepath + deco_settings.prename + randomid + deco_settings.filetype});
		}
		
		that.loadImages(images, imagesLoaded);
		
		//Callback function after images have loaded
		function imagesLoaded( data ){
			that.initDOM();
		}
	},
	loadImages: function(image_sources, callback){
		var that = this;
		var currentid = 0;
		var loadCounter = 0;
		var aImages = [];
		$.each( image_sources, function(i, image){
			currentID = image.imageType + image.id;
			$('<img />').load(function(data){
				aImages.push(data.currentTarget);
				if (image.imageType == 'segment'){
					that.imageSegments.push(data.currentTarget);
				} else {
					that.imageDecorations.push(data.currentTarget);
				}
				loadCounter++;
				if (loadCounter == image_sources.length){
					if ( String(typeof(callback)).toUpperCase() == 'FUNCTION' ){
						//SORT ALL ARRAYS into ID order
						that.sortArray(that.imageSegments);
						that.sortArray(that.imageDecorations);
						that.sortArray(aImages);
						callback(aImages);
					}
				}
			})
			.attr({
				'id' : currentID,
				'src': image.src,
				'alt' : image.alt,
				'title': image.alt,
				'height' : image.height,
				'width'  : image.width
			});
		});
	},
	/* 
	* Sorts an array into the order of the ID 
	* Requires an array with an ID property
	*/
	sortArray: function(current_array){
		current_array.sort(function sortArrayBySource(a, b){
			var a_src = $(a).attr('id').toUpperCase();
			var b_src = $(b).attr('id').toUpperCase();
			return (a_src < b_src) ? -1 : (a_src > b_src) ? 1 : 0;
		});
	},
	//Initialise fields in DOM
	initDOM: function(){
		this.checkCount = 0;

		//Change background image
		$('body').css({
			'background':'url(' + this.settings[0].imagePath + this.settings[0].main_background + ') no-repeat center center',
			'background-size' : 'cover'
		});

		//Add Items to DOM
		var newmargin = 0;
		var currentHeight = 0;
		var numberElements = this.imageSegments.length;
		var tempIndex = numberElements + 1;
		var margin_overlap = 0.75;
		var ornamentCount = 0;
		
		for (var i = 0; i < numberElements; i++) {
			currentHeight = this.imageSegments[i].height;
			newmargin = (i === 0) ? 0 : (currentHeight * margin_overlap).toFixed(2);
			tempIndex--;
			
			mynewDiv = $("<div />")
				.attr('id', "segment_" + i)
				.addClass('segment')
				.css({
					'position' : 'relative',
					'left' : 0,
					'margin-top' : '-' + newmargin + 'px',
					'z-index'	: tempIndex
				});
			
			//Append image segment
			mynewDiv.append(this.imageSegments[i]);
			var myornamentDiv = $("<div />")
				//.attr('id', 'ornament_'+i)
				.addClass('ornament')
				.css({
					'position' : 'absolute',
					'width' : '100%',
					'text-align' : 'center',
					'bottom' : '2%'
				});
			//Create decorations per branch - ie segment 1 = 1 ornament, segment 5 = 5 ornaments
			for (var inner = i; inner < (i+i); inner++) {
		

				myornamentDiv.append( this.createOrnament(ornamentCount) );
				ornamentCount++;
	
			}
			mynewDiv.append(myornamentDiv);

			$("#tree").append(mynewDiv);
		}

		//this.createDecorations(this.segment.number_of_segments);
		var max_degree = 60;
		var duration = 300;
		//this.shakeDirection("left", max_degree, duration);
	},
	createOrnament: function(inner){
		

		return this.imageDecorations[inner];
	},
	moveLeft: function(max_degree, duration){
		var MAX_DEGREES = 60;
		var that = this;
		var number_segments = that.imageSegments.length - 1;
		max_degree = (max_degree > MAX_DEGREES) ? MAX_DEGREES : max_degree;
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
				$("#segment_"+ i)
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: -previous,
						easing: $.easing.easeInOutCubic
				});
				$("#segment_"+ i + " .ornament img")
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: previous,
						easing: $.easing.easeInOutCubic
				});
				// if (previous == max_degree - 1) {
				// 	this.checkCount++;
				// 	console.log(this.checkCount);
				// }
			}
		}
	
	},
	moveRight: function(max_degree, duration){
		var MAX_DEGREES = 60;
		var that = this;
		var number_segments = that.imageSegments.length - 1;
		max_degree = (max_degree > MAX_DEGREES) ? MAX_DEGREES : max_degree;
		var degrees = Math.floor(max_degree / number_segments );
		
		var previous = degrees;
		var center_y = 100;
		var center_x = 38;

		if ( max_degree > 1){
			for (var i = number_segments -1; i >= 0; i--) {
				previous += degrees;
				center_x += 1;
				center_y += 15;
				$("#segment_"+ i)
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: previous,
						easing: $.easing.easeInOutCubic
				});
				$("#segment_"+ i + " .ornament img")
					.rotate({
						duration: duration,
						center: [center_x+'%', center_y+'%'],
						animateTo: -previous,
						easing: $.easing.easeInOutCubic
				});
				// if (previous == max_degree - 1) {
				// 	this.checkCount--;
				// 	console.log(this.checkCount);
				// }
			}
		}

	},
	shakeDirection: function(direction, max_degree, duration){
		var MAX_DEGREES = 60;
		var that = this;
		
		if ( max_degree > 1 && max_degree <= MAX_DEGREES){
			
			var number_segments = that.imageSegments.length - 1;
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
	

};