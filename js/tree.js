HCSegment = function(element) { //renamed arg for readability
    this.element = (element instanceof $) ? element : $(element);
};

HCSegment.prototype = {
    preloadSettings: function() {
        var that = this;
        that.imageSegments = [];
        that.imageDecorations = [];
        $.ajax({
            cache: false,
            url: 'includes/hc_settings.json',
            success: function(data) {

                //Create an array of objects
                that.segment = data['settings'][0].segment;
                that.decoration = data['settings'][0].decoration;
                that.intro = data['settings'][0].intro;
                that.outro = data['settings'][0].outro;

                //Create an array of objects
                that.settings = ({
                    "imagePath": data['settings'][0].imagePath,
                    "main_background": data['settings'][0].main_background,
                    "guidelines_header": data['settings'][0].guidelines_header,
                    "rules_header": data['settings'][0].rules_header,
                    "shake_text": data['settings'][0].shake_text,
                    "winning_prizes": data['settings'][0].winning_prizes
                });

                //Preload the images
                that.preloadImages(that.settings.imagePath, that.segment, that.decoration);
            }
        });
    },
    preloadImages: function(imagePath, segment_settings, deco_settings) {
        var that = this;
        var images = [];
        var randomid = 0;
        var aVariants = [],
            aPrizes = [];
        var number_of_segments = parseInt(segment_settings.number_of_segments, 10);
        var number_winning_prizes = parseInt(deco_settings.prizes_to_win, 10);
        var totalDecorations = ((number_of_segments - 2) * (number_of_segments - 2 + 1)) / 2; //Split in two - one for ornaments the other for gifts  - minus the trunk and top

        //Create segments
        for (var i = 1; i <= number_of_segments; i++) {
            images.push({
                "imageType": "segment",
                "id": i,
                "height": segment_settings.height,
                "width": segment_settings.width,
                "alt": segment_settings.alternative_text,
                "src": imagePath + segment_settings.filepath + segment_settings.prename + i + segment_settings.filetype
            });
        }

        //Create decorations
        for (var x = 1; x <= parseInt(deco_settings.number_of_variant_decorations, 10); x++) {
            aVariants.push(x);
        }

        //Create prize decorations
        for (var a = 1; a <= parseInt(deco_settings.number_of_variant_prizes, 10); a++) {
            aPrizes.push(a);
        }

        for (var b = 1; b <= Math.floor(totalDecorations / 2); b++) {
            randomid = aPrizes[Math.floor(Math.random() * aPrizes.length)];
            images.push({
                "imageType": "prize",
                "id": b,
                "height": deco_settings.height,
                "width": deco_settings.width,
                "alt": deco_settings.alternative_text,
                "src": imagePath + deco_settings.filepath + deco_settings.prize_prename + randomid + deco_settings.filetype
            });
        }

        for (var y = 1; y <= Math.ceil(totalDecorations / 2); y++) {
            randomid = aVariants[Math.floor(Math.random() * aVariants.length)];
            images.push({
                "imageType": "decoration",
                "id": y,
                "height": deco_settings.height,
                "width": deco_settings.width,
                "alt": deco_settings.alternative_text,
                "src": imagePath + deco_settings.filepath + deco_settings.deco_prename + randomid + deco_settings.filetype
            });
        }

        that.shuffleArray(images);
        that.loadImages(images, imagesLoaded);

        //Callback function after images have loaded
        function imagesLoaded(data) {
            that.initDOM();
        }
    },
    shuffleArray: function(collection) {
        for (var i = collection.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = collection[i];
            collection[i] = collection[j];
            collection[j] = temp;
        }
        return collection;
    },
    loadImages: function(image_sources, callback) {
        var that = this;
        var currentid = 0;
        var loadCounter = 0;
        var aImages = [];
        $.each(image_sources, function(i, image) {
            currentID = image.imageType + image.id;
            $('<img />').load(function(data) {
                    aImages.push(data.currentTarget);
                    if (image.imageType == 'segment') {
                        that.imageSegments.push(data.currentTarget);
                    } else {
                        that.imageDecorations.push(data.currentTarget);
                    }
                    loadCounter++;
                    if (loadCounter == image_sources.length) {
                        if (String(typeof(callback)).toUpperCase() == 'FUNCTION') {
                            //SORT ALL ARRAYS into ID order
                            that.sortArray(that.imageSegments);
                            that.sortArray(aImages);
                            callback(aImages);
                        }
                    }
                })
                .attr({
                    'id': currentID,
                    'src': image.src,
                    'alt': image.alt,
                    'title': image.alt,
                    'height': image.height,
                    'width': image.width
                });
        });
    },
    /* 
     * Sorts an array into the order of the ID 
     * Requires an array with an ID property
     */
    sortArray: function(current_array) {
        current_array.sort(function sortArrayBySource(a, b) {
            var a_src = $(a).attr('id').toUpperCase();
            var b_src = $(b).attr('id').toUpperCase();
            return (a_src < b_src) ? -1 : (a_src > b_src) ? 1 : 0;
        });
    },
    nextSlide: function(val) {
       setTimeout(function(){

               $('#slide3.slide .wincontent').animate({top: 0}, {duration:1000, easing: "easeOutBack"});
              
            }, 1500);
       setTimeout(function(){
               $('#slide3.slide img.bottom_img').animate({bottom: -$('.bottom_img').height()/2}, {duration:1000, easing: "easeOutBack"});
              
              
            }, 500);
         var windowWidth = $( window ).width();
        $('#slide3.slide').animate({left: 0},500);
 $('#slide2').animate({left: -windowWidth},500);
        $('#slide1').removeClass('active');
    },
    //Initialise fields in DOMd
    initDOM: function() {

        $('#slide1 img.head_intro').attr({'src': this.settings.imagePath + this.intro.header});
        $('#slide1 .body_txt img.icon').attr({'src': this.settings.imagePath + this.intro.instructionIcon});
        $('#slide1 .body_txt').html(this.intro.body_txt);
        $('#slide1 a.action').html(this.intro.btn_txt);
        $('#slide1 .overlay').css('background', this.intro.overlay_color);
        $('#slide1 a.action').attr('style', this.intro.btn_style);
        $('#slide1 .small_txt').html(this.intro.small_txt);

        $('#slide3 img.header_outro').attr({'src': this.settings.imagePath + this.outro.header_outro});
        $('#slide3 .bottom_img').attr({'src': this.settings.imagePath + this.outro.bottom_img});
        $('#slide3 .body_txt').html(this.outro.body_txt);
        $('#slide3 a').html(this.outro.CTA_txt);
        $('#slide3 a').attr('href', this.outro.CTA_URL);
        $('#slide3 a').attr('style', this.outro.CTA_style);
        $('#slide3.slide img.bottom_img').animate({bottom: -400},700);
        $('#slide3.slide .wincontent').animate({top: -$('.wincontent').height()},700);
       
        var windowWidth = $( window ).width();
        $('.slide').css({'left': windowWidth});
        $('#slide1.slide').css({'left': 0});
        $('#slide2.slide').css({'left': 0});
        $('a.nextSlide').on('click', function(){
          
            $(this).parents('.slideContent').animate({left: -windowWidth},600);
       
            $(this).parents('.slide').fadeOut(800);
            $(this).parents('.slide').removeClass('active');

        });
        $('a.prevSlide').on('click', function(){
            $(this).parents('.slide').animate({left: windowWidth},500);
            $(this).parents('.slide').prev().animate({left: 0 },500);
            $(this).parents('.slide').removeClass('active');
        });
        //this.checkCount = 0;
        this.iPrizeCount = 0;

        //Change background image
        $('body').css({
            'background': 'url(' + this.settings.imagePath + this.settings.main_background + ') no-repeat center center',
            'background-size': 'cover'
        });

        //Add Items to DOM
        var newmargin = 0;
        var currentHeight = 0;
        var numberElements = this.imageSegments.length;
        var tempIndex = numberElements + 1;
        var margin_overlap = 0.73;
        var ornamentCount = 0;

        for (var i = 0; i < numberElements; i++) {
            currentHeight = this.imageSegments[i].height;
            newmargin = (i === 0) ? 0 : (currentHeight * margin_overlap).toFixed(2);
            tempIndex--;

            //Adding Segment
            mynewDiv = $("<div />")
                .attr('id', "segment_" + i)
                .addClass('segment')
                .css({
                    'position': 'relative',
                    'left': 0,
                    'margin-top': '-' + newmargin + 'px',
                    'z-index': tempIndex
                });

            //Append image segment
            mynewDiv.append(this.imageSegments[i]);
            shadowDiv = $("<div />")
                .addClass('shadowDiv')
                .css({
                    'position': 'relative',
                    'background': 'rgba(0,0,0,0.2)',
                    'width': '300px',
                    'height': '100px',
                    'margin': '0 auto',
                    'margin-top': '-70px',
                    'background': 'url(images/shadow.png) 100% 100% / contain no-repeat ',
                    'z-index': '-999px'
                });
            //Create decorations per branch - ie segment 1 = 1 ornament, segment 5 = 5 ornaments
            if (i < numberElements - 1 && i > 0) { //Don't include the last segment (trunk)
                var varyingwidth = Math.round(((130 / numberElements) * i)); // 100 - (100 / 6) * rowNumber  + added 30 extra for padding
                var paddingleft = (100 - varyingwidth) / 2;

                //Adding Ornament
                var myornamentDiv = $("<div />")
                    //.attr('id', 'ornament_'+i)
                    .addClass('ornament')
                    .css({
                        'position': 'absolute',
                        'width': varyingwidth + '%',
                        'text-align': 'center',
                        'bottom': '20%',
                        'left': paddingleft + '%',
                        'margin': '0 auto'
                    });

                for (var inner = 1; inner <= i; inner++) {
                    myornamentDiv.append(this.createOrnament(ornamentCount, numberElements, i, inner));
                    ornamentCount++;
                }
                mynewDiv.append(myornamentDiv);
            }

            //Append the segment to the tree
            $("#tree").append(mynewDiv);
           
        }
        $("#tree").append(shadowDiv);
        theImage = $('<img />').attr({src: 'images/icon-grey.png', width: '45%'});
        moveDiv = $("<div />")
            .addClass('moveit')
            .append(theImage)
            .css({
                'position': 'absolute',
                'top': '12%',
                'width': '50%',
                'right': '0',
                'text-align': 'center'
               
               });
            scoreDiv = $("<div />")
                .addClass('scored')
                .css({
                    'position': 'absolute',
                    'top': '12%',
                    'width': '50%',
                    'left': '0',
                    'text-align': 'center'
                   
                   });
        $(".container").prepend(moveDiv);
        $(".container").prepend(scoreDiv);
        var max_degree = 45;
        var duration = 300;
        //this.shakeDirection("left", max_degree, duration);
    },
    createOrnament: function(current_item, numberElements, number_ornaments_in_row, inner) {

        var leftposition = (Math.round((100 / (number_ornaments_in_row + 1))) * inner);
        $(this.imageDecorations[current_item]).css({
            'position': 'absolute',
            'left': leftposition + '%',
            'margin-left': -(this.imageDecorations[current_item].width / 2)
        });
        return this.imageDecorations[current_item];
    },
    shake: function(direction, current_degree, duration, max_degree) {
        var that = this;
        var MAX_DEGREES = (max_degree === "undefined" || max_degree === null) ? 50 : max_degree;
        var number_segments = that.imageSegments.length - 1;

        //Only create animation to the maximum degrees
        current_degree = (current_degree > MAX_DEGREES) ? MAX_DEGREES : current_degree;
        var degrees = Math.floor(current_degree / number_segments);

        //Rotate from the bottom center point
        var center_y = 100;
        var center_x = 50;

        var previous = degrees;

        //Only rotate if degree is more than zero
        if (current_degree >= 1 && current_degree <= MAX_DEGREES) {
            //Repeat rotation for each segment moving slightly higher/lower and left/right
            for (var i = number_segments - 1; i >= 0; i--) {
                previous += degrees;
                center_y += 10;
                //center_x += 0;
                if (direction == 'left') {
                    //center_x -= 0;
                    that.segmentRotate("#segment_" + i, duration, center_x, center_y, -previous);
                    that.decorationRotate("#segment_" + i + " .ornament img", duration, center_x, current_degree);
                } else {
                    //center_x += 0;
                    that.segmentRotate("#segment_" + i, duration, center_x, center_y, previous);
                    that.decorationRotate("#segment_" + i + " .ornament img", duration, center_x, -current_degree);
                }
            }
        }
    },
    //Rotates the segment from the xy axis X degrees for X duration
    segmentRotate: function(segmentId, duration, center_x, center_y, animateDegree) {
        $(segmentId).rotate({
            duration: duration,
            center: [center_x + '%', center_y + '%'],
            animateTo: animateDegree,
            easing: $.easing.easeInOutCubic
        });
        $('.shadowDiv').css({
                left: animateDegree/2
         
        });
    },
    //Rotates the decoration X degrees for X duration
    decorationRotate: function(imageId, duration, center_x, animateDegree) {
        $(imageId).rotate({
            duration: duration,
            center: [center_x + '%', '0%'],
            animateTo: animateDegree,
            easing: $.easing.easeInOutCubic
        });
    },
    getNumberOfWinningPrizes: function() {
        return this.settings.winning_prizes;
    },
    releaseDecoration: function() {
            var total_winning_prizes = this.settings.winning_prizes;
            var negvalue = 25;


            var total_segments = parseInt(this.segment.number_of_segments, 10);
            var segment_height = parseInt(this.segment.height, 10);
            var decoration_height = parseInt(this.decoration.height, 10);
            //CALCULATE HEIGHT OF TREE - all segments - top segment, multiplied by the topmargin  + top
            var heightoftree = ((total_segments - 1) * (segment_height * 0.25) + segment_height);
            var randTop = (Math.random() * 0.04) + 0.02; // Originally this value was 0.05 instead of variable randTop
            var fallPosition = (heightoftree - (heightoftree * randTop));
            //Select a random image to fall from tree
            var aDecoImages = $('.segment .ornament img');

            if (aDecoImages.length > 0) {
                var randomitem = aDecoImages[Math.floor(Math.random() * aDecoImages.length)];
                var parentDiv = $("#tree");
                var myString = $($("#" + randomitem.id).parents('div.segment'))[0].id.split("_").pop();
                var topposition = (((segment_height * (myString - 1)) * 0.27) + segment_height-30);
                //clone_parent clones the div ornament + images included
                var clone_parent = $("#" + randomitem.id).parents('.ornament').clone();
                shadowDiv_clone = shadowDiv.clone();

                var previousOrnPosition = 0;
                var itemSmaller = false;
                var randomRotateDrop =  Math.floor(Math.random() * (390 - 340 + 1) + 340);
                console.log(randomRotateDrop);

                clone_parent.css({
                    'top': topposition
                });

                $("img#" + randomitem.id).rotate({
                    duration: 500,
                    animateTo: randomRotateDrop,
                    easing: $.easing.easeInOutBox,
                    center: ['50%', '50%']
                });


                //Add to DOM
                parentDiv.append(clone_parent);

                $.each($('.fallen'), function(index, val) {
                    var currentOrnDropped = $(val).css('top').slice(0, -2);

                    if (fallPosition < currentOrnDropped && !itemSmaller) {
                        previousOrnPosition = index;
                        itemSmaller = true;
                        
                    }
                });

                //PLACE BEHIND PREVIOUS OBJECTS
                if ($('.fallen').length > 0 && itemSmaller) {
                    $(clone_parent).insertBefore($('.fallen')[previousOrnPosition]);

                }

                //Clear all images within ornament container and add only the current ornament
                clone_parent
                .empty()
                .addClass('fallen')
                .append($("#" + randomitem.id));

                //ANIMATE
                clone_parent.animate({
                    top: fallPosition
                }, 500);
                console.log(clone_parent.find('img').position().left);
                $(clone_parent).append(shadowDiv_clone.attr('class', 'droppedOrnShadow').css({
                    'position': 'absolute',
                    'width': '30px',
                    'margin': '-72px auto 0px',
                    'left': clone_parent.find('img').position().left-12}));

                return randomitem;
            }
            return null;
        }
        // shakeDirection: function(direction, max_degree, duration) {
        //     var MAX_DEGREES = 50;
        //     var that = this;
        //     var animation;

    //     if (max_degree >= 1 && max_degree <= MAX_DEGREES) {

    //         var number_segments = that.imageSegments.length - 1;
    //         var degrees = Math.floor(max_degree / number_segments);

    //         var previous = degrees;
    //         var center_y = 100;
    //         var center_x = 50;

    //         for (var i = number_segments - 1; i >= 0; i--) {
    //             previous += degrees;
    //             center_x += 1;
    //             center_y += 10;
    //             //duration += 10;
    //             animation = (direction == 'left') ? -previous : previous;
    //             $("#segment_" + i)
    //                 .rotate({
    //                     duration: duration,
    //                     center: [center_x + '%', center_y + '%'],
    //                     animateTo: animation,
    //                     easing: $.easing.easeInOutCubic,
    //                     callback: function(){
    //                         direction = (direction == 'left') ? 'right' : 'left';
    //                         that.shakeDirection(direction, max_degree/2, duration);
    //                     }
    //                 });
    //         }
    //     }
    // }

    // shakeRight: function(max_degree, duration){
    //  var t= this;
    //  var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
    //  var degrees = Math.floor(max_degree / number_segments );

    //  var previous = degrees;
    //  var center_y = 100;
    //  var center_x = 38;

    //  if ( max_degree > 1){
    //      for (var i = number_segments -1; i >= 0; i--) {
    //          previous += degrees;
    //          center_x += 1;
    //          center_y += 15;
    //          duration += 10;
    //          $("div#divsegment_"+ i + " img")
    //          .rotate({
    //              duration:duration,
    //              center: [center_x+'%', center_y+'%'],
    //              animateTo: previous,
    //              easing: $.easing.easeInOutCubic,
    //              callback: function(){   
    //                  t.shakeLeft(max_degree/2, duration);
    //               }
    //          });
    //      }
    //  }


    // },
    // shakeLeft: function(max_degree, duration){
    //  var t= this;
    //  var number_segments = parseInt(t.segment.number_of_segments, 10)-1;
    //  var degrees = Math.floor(max_degree / number_segments );

    //  var previous = degrees;
    //  var center_y = 100;
    //  var center_x = 38;

    //  if ( max_degree > 1){
    //      for (var i = number_segments -1; i >= 0; i--) {
    //          previous += degrees;
    //          center_x += 1;
    //          center_y += 15;
    //          duration += 10;
    //          $("#divsegment_"+ i + " img")
    //              .rotate({
    //                  //angle: previous, 
    //                  duration: duration,
    //                  center: [center_x+'%', center_y+'%'],
    //                  animateTo: -previous,
    //                  easing: $.easing.easeInOutCubic,
    //                  callback: function(){   

    //                      t.shakeRight(max_degree/2, duration);
    //                  }
    //          });
    //      }
    //  }

    // },


};