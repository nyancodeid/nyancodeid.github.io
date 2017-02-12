$(function() {

	$(document).scroll(function() {
	  webScrolled = $(document).scrollTop();
	  if (webScrolled > 5 ) {
	    $('header').addClass('bayangan-1');
	  } else {
	    $('header').removeClass('bayangan-1');
	  }
	});

});