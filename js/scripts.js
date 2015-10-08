(function($){
	//console.log( $('#intro_board').height() );
	//$.getScript("js/game.js");
	//GLOBAL VARIABLES
	//var word = $('#mystery_word'),
    //letters = $('#letters'),
   

	var game = new HCTree('#tree');
	game.preloadSettings();

	
	$(document).ready(function(){
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