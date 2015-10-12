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
		var image_srcs = [];
		for (var i = 1; i <= this.segment.number_of_segments; i++) {
			image_srcs.push(this.settings[0].imagePath + this.segment.segment_filepath + this.segment.segment_prename + i + this.segment.segment_filetype);
		}
		loadImages(this.segment.segment_alternative_text, image_srcs, imagesLoaded);
		
		var t = this;
		
		//Callback function after images have loaded
		function imagesLoaded( data ){
			t.imageSegments = [];
			t.imageSegments = data;
			t.initDOM();
		}

		function loadImages(alttext, image_sources, callback){
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
							callback(aImages);
						}
					}
				})
				.attr({
					'id' : 'segment_'+i,
					'src': image,
					'alt' : alttext,
					'title': alttext
				});
			});
		}
	},
	//Initialise fields in DOM
	initDOM: function(){
		
		//Change background image
		$('.container').css({
			'background':'url(' + this.settings[0].imagePath + this.settings[0].main_background + ') no-repeat center center',
			'background-size' : 'cover'
		});

		//console.log(this.segment);
		
		//Add Items to DOM
		var newmargin = 0;
		var tempIndex = parseInt(this.segment.number_of_segments, 10) + 1;
		
		for (var i = 0; i < this.imageSegments.length; i++) {
			//newimage.attr({'alt' : t.segment.segment_alternative_text, 'title' : t.segment.segment_alternative_text });
			newmargin = (this.imageSegments[i].height * 0.7).toFixed(2);
			tempIndex--;
			
			mynewDiv = $("<div />")
				.attr('id', "divsegment_" + i)
				.addClass('ddd')
				.css({
					'position' : 'relative',
					'left' : 0,
					'margin-top' : '-' + newmargin + 'px',
					'z-index'	: tempIndex
				})
				.append(this.imageSegments[i]);
			$("#tree").append(mynewDiv);
		}
		var max_degree = 70;
		this.shakeLeft(max_degree);
	},
	shakeRight: function(max_degree){
		var t= this;
		var number_segments = parseInt(this.segment.number_of_segments, 10)-1;
		var degrees = Math.floor(max_degree / number_segments);
		
		var previous = degrees;
		var center_y = 150;
		var center_x = 50;

		//console.log(height);
		//var center_margin = 100;//(100 - center_y) / number_segments;
		//var centerx_margin = 0;//(1- center_x) / number_segments;

		if ( max_degree > 1){
			for (var i = number_segments -1; i >= 0; i--) {
				//console.log(number_segments + " : i: " + i);
				previous += degrees;
				center_x += 1;//centerx_margin;
				center_y += 10;//center_margin;//100%';
				//console.log($("div#divsegment_"+i-1+" img")[0].height);
				$("div#divsegment_"+ i)
				.rotate({
					duration:150,
					center: [center_x+'%', center_y+'%'],
					animateTo: previous,
					easing: $.easing.easeInOutCubic,
					callback: function(){   
						t.shakeLeft(max_degree/2);
					 }
				});
			}
			//console.log($("#divsegment_"+ i));
		}
		
	
	},
	shakeLeft: function(max_degree){
		var t= this;
		var number_segments = parseInt(this.segment.number_of_segments, 10)-1;
		var degrees = Math.floor(max_degree / number_segments);
		
		var previous = degrees;
		var center_y = 150;
		var center_x = 50;

		//var center_margin = 100;//(100 - center_y) / number_segments;
		//var centerx_margin = 0;//(1- center_x) / number_segments;
		if ( max_degree > 1){
			for (var i = number_segments -1; i >= 0; i--) {
				//console.log(number_segments + " : i: " + i);
				previous += degrees;
				center_x -= 1;//centerx_margin;
				center_y += 10;//center_margin;//100%';
				//console.log($("div#divsegment_"+i-1+" img")[0].height);
				$("div#divsegment_"+ i)
					.rotate({
						angle: previous, 
						duration:150,
						center: [center_x+'%', center_y+'%'],
						animateTo: -previous,
						easing: $.easing.easeInOutCubic,
						// easing: function (x,t,b,c,d){
						// 	 return c*(t/d)+b;
						// },
						callback: function(){   
							t.shakeRight(max_degree/2);
						 }
					});
				//console.log($("#divsegment_"+ i));
			}
		}
	
	}

		
	

};