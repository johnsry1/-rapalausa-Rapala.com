'use strict';
exports.init = function() {  
	var owl = $('.owl-carousel'); 
	owl.owlCarousel({
		items:1,
        loop:true,
        dots: true,
        autoplay:true,
        autoplayTimeout:7000,
        autoplayHoverPause:true,
        animateOut: 'fadeOut',
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
               items:1
            }
        }
	});
};
