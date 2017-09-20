(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var dialog = require('./dialog');

var $cache = {};

function initializeCache() {
    $cache.primary = $('#primary');
    $cache.checkoutForm = $cache.primary.find('.checkout-shipping.address').length > 0 ? $cache.primary.find('.checkout-shipping.address') : $cache.primary.find('.checkout-billing.address');
    $cache.submitFormButton = $cache.checkoutForm.find('button.saveShipping').length > 0 ? $cache.checkoutForm.find('button.saveShipping') : $cache.checkoutForm.find('button[name$=_save]');
    $cache.validatoionDialog = $cache.primary.find('#address-validation-dialog');
    $cache.byPassDAV = $cache.checkoutForm.find('.bypassDAV');
    $cache.address1 = $cache.checkoutForm.find('input[name$="_address1"]');
    $cache.address2 = $cache.checkoutForm.find('input[name$="_address2"]');
    $cache.city = $cache.checkoutForm.find('input[name$="_city"]');
    $cache.stateCode = $cache.checkoutForm.find('select[id$="_state"]');
    $cache.countryCode = $cache.checkoutForm.find('select[id$="_country"]');
    $cache.postalCode = $cache.checkoutForm.find('input[name$="_postal"]');
}

function initializeDom() {
    if ($cache.validatoionDialog.length > 0) {

        var dlg = dialog.create({
            target: $cache.validatoionDialog,
            options: {
                width: 300,
                dialogClass: 'address-validation-dialog',
                open: initializeEvents
            }
        });

        $cache.validatoionDialog.show();
        dlg.dialog('open');
    }
}


function initializeEvents() {

    $cache.validatoionDialog.on('click', '#original-address-edit', function () {
        $cache.validatoionDialog.dialog('close');
        $(".shipping-address-field-section").removeClass("hide");
        $(".selected-shipping-address").addClass("hide");
        $(".new-address-field").addClass("hide");

        /*jQuery('html, body').animate({
            scrollTop: $('#navigation').position().top
        }, 500);*/
    });
    $cache.validatoionDialog.on('click', '#suggested-address-edit-1', function () {

        $(".shipping-address-field-section").removeClass("hide");
        $(".selected-shipping-address").addClass("hide");
    });


    $cache.validatoionDialog.on('click', '#ship-to-original-address', function () {

        $cache.validatoionDialog.dialog('close');
        $cache.byPassDAV.attr('value', 'true');
        $cache.submitFormButton.click();
    });

    $cache.validatoionDialog.on('click', '[id|="suggested-address-edit"]', function () {
        var selectedAddress = $(this).data('address').split('||');
        $cache.address1.val(selectedAddress[0]);
        if (selectedAddress[1] !== 'undefined' && selectedAddress[1] !== '') {
            $cache.address2.val(selectedAddress[1]);
        }
        $cache.city.val(selectedAddress[2]);
        $cache.stateCode.val(selectedAddress[3]);
        $cache.countryCode.val(selectedAddress[4]);
        $cache.postalCode.val(selectedAddress[5]);
        $cache.validatoionDialog.dialog('close');
        jQuery('html, body').animate({
            scrollTop: $('#navigation').position().top
        }, 500);
    });

    $cache.validatoionDialog.on('click', '[id|="ship-to-address-selected"]', function () {
        var selectedAddress = $(this).data('address').split('||');
        $cache.address1.val(selectedAddress[0]);
        if (selectedAddress[1] !== 'undefined' && selectedAddress[1] !== '') {
            $cache.address2.val(selectedAddress[1]);
        }
        $cache.city.val(selectedAddress[2]);
        $cache.stateCode.val(selectedAddress[3]);
        $cache.countryCode.val(selectedAddress[4]);
        $cache.postalCode.val(selectedAddress[5]);
        $cache.byPassDAV.attr('value', 'true');
        $cache.validatoionDialog.dialog('close');

        $cache.submitFormButton.click();
    });
}

exports.init = function() {
    initializeCache();
    initializeDom();
};

},{"./dialog":10}],2:[function(require,module,exports){
'use strict';

var progress = require('./progress'),
    util = require('./util');

var currentRequests = [];

/**
 * @function
 * @description Ajax request to get json response
 * @param {Boolean} async  Asynchronous or not
 * @param {String} url URI for the request
 * @param {Object} data Name/Value pair data request
 * @param {Function} callback  Callback function to be called
 */
var getJson = function (options) {
    options.url = util.toAbsoluteUrl(options.url);
    // return if no url exists or url matches a current request
    if (!options.url || currentRequests[options.url]) {
        return;
    }

    currentRequests[options.url] = true;

    // make the server call
    $.ajax({
        dataType: 'json',
        url: options.url,
        async: (typeof options.async === 'undefined' || options.async === null) ? true : options.async,
        data: options.data || {},
        type: options.type || 'GET' //PREVAIL-Added to handle security form issues.
    })
    // success
    .done(function (response) {
        if (options.callback) {
            options.callback(response);
        }
    })
    // failed
    .fail(function (xhr, textStatus) {
        if (textStatus === 'parsererror') {
            window.alert(Resources.BAD_RESPONSE);
        }
        if (options.callback) {
            options.callback(null);
        }
    })
    // executed on success or fail
    .always(function () {
        // remove current request from hash
        if (currentRequests[options.url]) {
            delete currentRequests[options.url];
        }
    });
};
/**
 * @function
 * @description ajax request to load html response in a given container
 * @param {String} url URI for the request
 * @param {Object} data Name/Value pair data request
 * @param {Function} callback  Callback function to be called
 * @param {Object} target Selector or element that will receive content
 */
var load = function (options) {
    options.url = util.toAbsoluteUrl(options.url);
    // return if no url exists or url matches a current request
    if (!options.url || currentRequests[options.url]) {
        return;
    }

    currentRequests[options.url] = true;

    // make the server call
    $.ajax({
        dataType: 'html',
        url: util.appendParamToURL(options.url, 'format', 'ajax'),
        data: options.data,
        xhrFields: {
            withCredentials: true
        },
        type: options.type || 'GET' //PREVAIL-Added to handle security form issues.
    })
    .done(function (response) {
        // success
        if (options.target) {
            $(options.target).empty().html(response);
        }
        if (options.callback) {
            options.callback(response);
        }
    })
    .fail(function (xhr, textStatus) {
        // failed
        if (textStatus === 'parsererror') {
            window.alert(Resources.BAD_RESPONSE);
        }
        options.callback(null, textStatus);
    })
    .always(function () {
        progress.hide();
        // remove current request from hash
        if (currentRequests[options.url]) {
            delete currentRequests[options.url];
        }
    });
};

exports.getJson = getJson;
exports.load = load;

},{"./progress":39,"./util":48}],3:[function(require,module,exports){
/**
 *    (c) 2009-2014 Demandware Inc.
 *    Subject to standard usage terms and conditions
 *    For all details and documentation:
 *    https://bitbucket.com/demandware/sitegenesis
 */
'use strict';

var countries = require('./countries'),
    dialog = require('./dialog'),
    minicart = require('./minicart'),
    page = require('./page'),
    searchplaceholder = require('./searchplaceholder'),
    searchsuggest = require('./searchsuggest'),
    tooltip = require('./tooltip'),
    util = require('./util'),
    validator = require('./validator'),
    megamenu = require('./megamenu'),
    headerinit = require('./headerinit'),
    uievents = require('./uievents'),
    progress = require('./progress'),
    tls = require('./tls');


// if jQuery has not been loaded, load from google cdn
if (!window.jQuery) {
    var s = document.createElement('script');
    s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
    s.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(s);
}

require('./jquery-ext')();
require('./cookieprivacy')();
require('./captcha')();

var $ = window.jQuery;

function resetPasswordEvents() {
	$("body").find('.PasswordResetDialog .field-wrapper input').off("change").on("click change", function(){
		$(this).removeClass("errorclient");
		$(this).closest(".passwordreset").find("#message").hide();
		$(this).closest(".formfield").find(".label").find("span.errorclient").remove();
		$(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
	});
	if($('.PasswordResetDialog').length > 0){
		$('.PasswordResetDialog').find('.formfield').each(function () {
               if($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                }
		});
	}
	$("body").find('.PasswordResetDialog a.clearbutton').on("click",function(){
		 $(this).closest(".field-wrapper").find('span').remove();
		 $(this).closest(".field-wrapper").find('.required').removeClass('errorclient');
		 $(this).closest('.formfield ').find('.form-row , .label span').removeClass('inputlabel');
		 $(this).closest('.formfield').find('input') .val("");
		 $(this).closest('.formfield').find('a.clearbutton').hide();
		 $(this).closest(".formfield").find("span.logerror , .existing_register").hide();

   });
	// Attach keypress handler to input box.  Submit form if user presses 'enter' key.
	$("body").find(".PasswordResetDialog input.resetold").keypress(function(e) {
		if(e.which == 13) {
			//jQuery('#sendBtn').click();
			return false;
		}
		return true;
	});
	$("body").find('.PasswordResetDialog .field-wrapper input').on('keyup input blur', function () {
       if($(this).val() != undefined) {
           if($(this).val().length > 0) {
        	   $(this).closest('.formfield').find('a.clearbutton').show();
            }
            else {
            	$(this).closest('.formfield').find('a.clearbutton').hide();
            }
        }
	});
	var $requestPasswordForm = $('[name$="_requestpassword"]'),
    $submit = $requestPasswordForm.find('[name$="_requestpassword_send"]');
	$($submit).on('click', function (e) {
          if (!$requestPasswordForm.valid()) {
              return;
          }
          e.preventDefault();
          dialog.submit($submit.attr('name'));
          setTimeout(function(){
        	  resetPasswordEvents();
          },1300);
	});
	validator.init();
}
function initializeEvents() {
	var is_safari = navigator.userAgent.indexOf("Safari") > -1;
	var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if ((is_chrome)&&(is_safari)) {is_safari=false;}
    if ((is_chrome)&&(is_opera)) {is_chrome=false;}
	 if(is_safari) {
		 $("body").addClass("safari-browser");
	 }
	 else if(is_firefox){
		 $("body").addClass("firefox-browser");
	 }
	 else if(is_explorer){
		 $("body").addClass("ie-browser");
	 }
	 else if(is_chrome){
		 $("body").addClass("chrome-browser");
	 }
	 if (navigator.userAgent.indexOf('Mac OS X') != -1) {
		  $("body").addClass("mac");
		} else {
		  $("body").addClass("pc");
	}
    var controlKeys = ['8', '13', '46', '45', '36', '35', '38', '37', '40', '39'];

    //PREVAIL-Added to handle form dialog boxes server side issues.
    $('body').on('click', '.dialogify, [data-dlg-options], [data-dlg-action]', require('./dialogify').setDialogify)
        .on('keydown', 'textarea[data-character-limit]', function (e) {
            var text = $.trim($(this).val()),
                charsLimit = $(this).data('character-limit'),
                charsUsed = text.length;

            if ((charsUsed >= charsLimit) && (controlKeys.indexOf(e.which.toString()) < 0)) {
                e.preventDefault();
            }
        })
        .on('change keyup mouseup', 'textarea[data-character-limit]', function () {
            var text = $.trim($(this).val()),
                charsLimit = $(this).data('character-limit'),
                charsUsed = text.length,
                charsRemain = charsLimit - charsUsed;

            if (charsRemain < 0) {
                $(this).val(text.slice(0, charsRemain));
                charsRemain = 0;
            }

            $(this).next('div.char-count').find('.char-remain-count').html(charsRemain);
        });

    /**
     * initialize search suggestions, pending the value of the site preference(enhancedSearchSuggestions)
     * this will either init the legacy(false) or the beta versions(true) of the the search suggest feature.
     * */

    /*** minicart hide ***/
    var minicartlink= $('#headerwrapper #header .row.column1 #minicart .minicarttotal .minicarticon-cont .minicart-button');
    minicartlink.on("click",function() {
	    if($(window).width() < 959 ) {
	    	$('#minicart .minicartcontent').hide();
	    }
    });

    var $searchContainer = $('.site-suggestion-section');
    searchsuggest.init($searchContainer, Resources.SIMPLE_SEARCH);

    $('#password-reset').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            url: $(e.target).attr('href'),
            options: {
                //Start JIRA PREV-334 : Title is missing for the Forgot password overlay.
                title: Resources.FORGOT_PASSWORD,
                width: 475,
                dialogClass:"PasswordResetDialog",
                open: function () {
                	resetPasswordEvents();
                }
            }
        });
    });

    // print handler
    $('.print-page').on('click', function () {
        window.print();
        return false;
    });

        $('.mobile-banner-stuff').on('click', function (e) {
        	e.preventDefault();
        	if($('.calloutexist').length > 0) {
        		var promoCallOut = $('.calloutexist').html();
    		   var bannerDialogOpen = dialog.create({
                   target: '#calloutexist',
                   options: {
                      dialogClass: 'dialogBanner'
                  }
	              });
    		   	util.scrollBrowser($("html").offset().top);
	              bannerDialogOpen.html(promoCallOut);
	              $(".ui-dialog-content:visible").each(function () {
	       	        $( this ).dialog("option","position",$(this).dialog("option","position"));
	       	    	});
	              bannerDialogOpen.dialog("open");
        	}
       });
	$(document).on('click','.dialogBanner #closeBtn01', function (e) {
    	e.preventDefault();
    	$(this).parents('.dialogBanner').find('.ui-dialog-titlebar-close').trigger('click');
	});
    //footer change region event
	$(".change-region-footer").hover(function() {
        $(".domainswitch").show();
    }, function() {
        $(".domainswitch").hide();
    });
    $(".domainswitch").hover(function() {
        if (!clicked) {
            $(this).show();
        }
    }, function() {
        if (!clicked) {
            $(this).hide();
        }
    });
    $('div.pseudo_self_label').each(
            function () {
                var $this = jQuery(this);
                var $input = $this
                    .children('input[type="text"]');
                $input.data('toggle', $input.val());
                //used to add a class to placeholder for styling
                if($('.emailinput.emailfooter').attr('data-placeholder') == $input.val()){
             	   $('.emailinput.emailfooter').addClass('footerplace');
                }
                /**
                 * if(jQuery.trim($input.val()) != "") {
                 * $input.data('toggle').hide(); } else
                 *if($input.data('toggle') &&
                 * $input.data('toggle').size() >= 1) {
                 * $input.val($input.data('toggle')); }
                 */
                $input
                    .blur(function () {
                        var $this = jQuery(this);
                       if(jQuery
                            .trim($this.val()) == "") {
                            // $this.data('toggle').show();
                            $this
                                .val($this
                                    .data('toggle'));
                          //used to add a class to placeholder for styling
                           if($('.emailinput.emailfooter').attr('data-placeholder') == $input.val()){
                        	   $('.emailinput.emailfooter').addClass('footerplace');
                           }

                        }
                    });
                $input
                    .focus(function () {
                    	$('.emailinput.emailfooter').removeClass('footerplace');
                        var $this = jQuery(this);
                       if($this.data('toggle') && (jQuery
                            .trim($this
                                .val()) == jQuery
                            .trim($this
                                .data('toggle')))) {
                            // $this.data('toggle').show();
                            $this.val('');
                        }
                    });
                $this
                    .parents('form')
                    .submit(
                        function () {
                            var $this = jQuery(this);
                            $this
                                .find(
                                    "div.pseudo_self_label input")
                                .each(
                                    function () {
                                        var $this = jQuery(this);
                                       if($this
                                            .data('toggle') && $this
                                            .data('toggle') == $this
                                            .val()) {
                                            $this
                                                .val('');
                                        }
                                    });
                        });
            });

    //
    $("body").on("submit","#customercontactus", function (e) {
    	e.preventDefault();
    	var $form = $(this);
    	if($form.valid()) {
            // set the action
            $('<input/>').attr({
                name: $form.attr('action'),
                type: 'hidden'
            }).appendTo($form);
            // serialize the form and get the post url
            var data = $form.serialize();
            var url = $form.attr('action');
            // make sure the server knows this is an ajax request
            if (data.indexOf('ajax') === -1) {
                data += '&format=ajax';
            }

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: data
            }).done(function (response) {
                $('.column.colspan2').empty().html(response);
            });
    	}
	});

    $('.first-level').on('click',function() {
    	$(this).children('.second-level').toggle();
    	$(this).toggleClass('list-active');
    });
    $('.first-level li.active').closest('.first-level').click();
    $('.first-level li a').click(function(event) {
    event.stopPropagation();
    });
    $('.first-levell').on('click',function() {
    	$(this).children('.second-levell').toggle();
    	//$(this).toggleClass('list-active');
    });
  	$(window).load(function(){
  		if($('.newMargin').length > 0) {
  			var currentItem = $('.newMargin');
  			currentItem.parents('.cell-header').addClass('new-margin-update');
  		}
  		if($('.newMargin-one').length > 0) {
  			var currentItem = $('.newMargin-one');
  			currentItem.parents('.cell-header').addClass('new-margin-updateone');
  		}
  		if($('.vmc-manufacturer-margin').length > 0) {
  			var currentItem = $('.vmc-manufacturer-margin');
  			currentItem.parents('.cell-header').addClass('manufacture-margin-update');
  		}
  		if($('.strikemaster-paragraph').length > 0) {
  			var currentItem = $('.strikemaster-paragraph');
  			currentItem.parents('.cell-header').addClass('strikemaster-margin-update');
  		}
  		var spancountleftnav = $('.pt_customerservice .customer .column .contentbox .left-nav-top .contentboxcontent .nav-group li span');
		spancountleftnav.each(function(){
			if($(this).height() > 19) {
				$(this).addClass('newone');
			}
			else {
				$(this).removeClass('newone');
			}
		});
		var spancountleftnav = $('.pt_customerservice .style-cservice .column .contentbox .left-nav-top .contentboxcontent .nav-group li span');
		spancountleftnav.each(function(){
			if($(this).height() > 19) {
				$(this).addClass('newone');
			}
			else {
				$(this).removeClass('newone');
			}
		});
  		if($('.shadow-box').length > 0) {
  			var currentItem = $('.shadow-box');
  			currentItem.parents('.pt_customerservice').addClass('pt_customerservice-box');
  		}
  		if($('.zero-margin').length > 0) {
  			var currentItem = $('.zero-margin');
  			currentItem.parents('.cell-header').addClass('zero-margin-cell-header');
  		}
  		if($('.checkoutloginsignin').find('.TokenExpired').length>0){
			$("#password-reset").trigger("click");
			setTimeout(function(){
				$('#dialog-container').find('p').hide();
				if($('#dialog-container #PasswordResetForm').length>0){
					$('#dialog-container #PasswordResetForm').prepend('<div class="TokenExpireError">We&#39;re sorry, the link to reset your password has expired. Reset Password links expire after 30 minutes for security purposes. Please submit your email again.</div>');
						$('#dialog-container #PasswordResetForm .passwordemail').prepend('<div class="Emaillabel">Enter your email address to get reset password instructions sent to your inbox.</div>');
				}
			}, 2000);
	  	}
  	});
    $(window).resize(function(){
    	if( $(window).width() > 960 ) {
    		if($("#container").hasClass("js-container-active")) {
    			$("#container, .open-menu-wrap").removeAttr("style");
    			$("#container").removeClass("js-container-active").find(".menu-toggle").removeClass("js-menu-toggle");
    			$("#main, #footernew").unwrap();
    			$("#brand-tabs-header").unwrap();
    		}
    		//megamenu.init();
    	}
    });
    // add generic toggle functionality
    $('.toggle').next('.toggle-content').hide();
    if($(".pt_checkout").length == 0) {
    	if($(".pt_customerservice").length == 0) {
    		$('.toggle').off("click").on("click",function (e) {
    			e.preventDefault(); //JIRA PREV-90 : When click on advance search from gift registry login page, focus is happening towards top of the page.
    			$(this).toggleClass('expanded').next('ul, .toggle-content').toggle();
    		});
    	}
    }
    // toggle for customer service FAQ
    if( $(".pt_customerservice").length > 0) {
    	 $('.section a.toggle').off("click").on("click",function (e) {
    		 e.preventDefault();
    		 	$(this).parent().next('.reveal').slideToggle('fast', function() {
    	 	});
    	 	return false;
    	});
    }

    $('#footernew .footer-main #linkheading').click(function () {
	$(this).toggleClass('show');
	$(this).closest('div').toggleClass('expanded');
	if($('#about, #customer-service, #More-ways-to-shop').hasClass('expanded')) {
		$('#rapala_insider').addClass('new');
	}
	else {
		$('#rapala_insider').removeClass('new');
	}
	if($('#busniness').hasClass('expanded')) {
		$('#follow_us').addClass('new');
	}
	else {
		$('#follow_us').removeClass('new');
	}
	});

    function isTouchDevice() {
        return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
    }
    if (isTouchDevice() === true) {
        //alert('Touch Device'); //your logic for touch device here
        $('.old-swim').removeClass('show').addClass('hide');
        $('.new-swim').removeClass('hide').addClass('show');
    } else {
        //alert('Not a Touch Device');//your logic for non touch device here
        $('.old-swim').removeClass('hide').addClass('show');
        $('.new-swim').removeClass('show').addClass('hide');
    }
    $(window).bind('scroll resize', function(){
    	if($('.rapala_device').length > 0 && $(window).width() < 768){
    		if( $('#footerEmailDialog.ui-dialog-content').length > 0){
    			$('.ui-dialog').css({'left':($(document).width() - $('.ui-dialog').width())/2, 'top':'100px'});
    		}else{
    			$('.ui-dialog').css({'left':($(document).width() - $('.ui-dialog').width())/2});
    		}

    	}
	});

    $(".tabsHeader").bind("click", function(event) {
    	var currentItem = $(this);
    	currentItem.closest('.mobile-tabs-section').toggleClass('active');
    });

    $(document).on("click", ".upgradenow-link" ,function(e){
        $('html, body').animate({
            scrollTop: $(".viploginsignin").offset().top
        }, 2000);
    });
    $('.menu-category li .menu-item-toggle').on('click', function (e) {
        e.preventDefault();
        var $parentLi = $(e.target).closest('li');
        $parentLi.siblings('li').removeClass('active').find('.menu-item-toggle').removeClass('fa-chevron-up active').addClass('fa-chevron-right');
        $parentLi.toggleClass('active');
        $(e.target).toggleClass('fa-chevron-right fa-chevron-up active');
    });

    $("body").on("click",".dialog-close", function(){
    	$(this).closest(".ui-dialog").find(".ui-dialog-titlebar-close").trigger("click");
    });
    if ($(window).width() > 959){
		var item = $('.sign-up-blk'),
			clickItem = item.find('.userlogin');

		clickItem.on('click',function () {
			return false;
		});
	}

    $('.email-subscribe').submit(function (e) {
    	e.preventDefault();
    	var $form = $(this);
    	if($form.valid()) {
            // set the action
            $('<input/>').attr({
                name: $form.attr('action'),
                type: 'hidden'
            }).appendTo($form);
            // serialize the form and get the post url
            var data = $form.serialize();
            var url = $form.attr('action');
            // make sure the server knows this is an ajax request
            if (data.indexOf('ajax') === -1) {
                data += '&format=ajax';
            }

    		dialog.open({
                url: url,
                data: data,
                options: {
                    title: "email",
                    width: 800,
    			    height: 530,
                    dialogClass:"footerEmailDialog"
                },
                open: function () {}
           });
    	}
	});

}
/**
 * @private
 * @function
 * @description Adds class ('js') to html for css targeting and loads js specific styles.
 */
function initializeDom() {
    // add class to html for css targeting
    $('html').addClass('js');
    if (SitePreferences.LISTING_INFINITE_SCROLL) {
        $('html').addClass('infinite-scroll');
    }
    // load js specific styles//
    util.limitCharacters();
}

var pages = {
    account: require('./pages/account'),
    cart: require('./pages/cart'),
    checkout: require('./pages/checkout'),
    compare: require('./pages/compare'),
    product: require('./pages/product'),
    registry: require('./pages/registry'),
    search: require('./pages/search'),
    storefront: require('./pages/storefront'),
    wishlist: require('./pages/wishlist'),
    rapalainsider: require('./pages/rapalainsider'),
    storelocator: require('./pages/storelocator'),
    international: require('./pages/international')
};

var app = {
    init: function () {
    	 if(typeof geoipCountryCode == 'function') {
             var IP_GeoCode = geoipCountryCode();
             var allowed_countries = $(".allowed-countries").text();
            if(allowed_countries == null || allowed_countries == 'null' || allowed_countries == "undefined") {
                 allowed_countries = "US";
             }
            if(allowed_countries.indexOf(IP_GeoCode) == -1) {
           	  $('html').addClass('no-pricing');
                 $('.non-usa-alert').removeClass('hide');
                 $('.ui-customer,.dividers.pipe,.ui-email,.ui-storelocator,.ui-wishlist,.ui-login,.handle-non-us,.welcomemessage,.anonymous,.site-suggestion-section').addClass('hide');
                 $('.minicart, .promotional-message, .product-colors-size').css({"display":'none'});
                 $('#customer-returns,#customer-shipping,#customer-warranty').addClass('hide');
                 $(".addtowishlist").addClass("hide");
                 $(".non-us-contactus geo,.us-contactus").addClass("hide");
                 $('.non-us-contactus-non').removeClass('hide');
                 $('.desktopHide.handle-non-us.geo').removeClass('desktopHide');
                 $('.mobileHide.handle-non-us.geo').removeClass('mobileHide');
                 var contactus_nonus_url = Urls.contactusnonus;
                 $('.handle-non-us.geo').addClass('hide')
                 $(".ca-contactus-link").attr('href', contactus_nonus_url);
                 $('.cust-non-us').find('a').attr('href',contactus_nonus_url);
                 $('.ui-login,.magnifier-icon').css({"background":'none'});
                 $(".handle-non-us-vh").addClass("vhide");
                 $('.subscribe').prop('disabled', true);
                 setTimeout(function(){
                	 $('.product-promo, .newrecommendation').css({"display":'none'});
                 },5000);

             }
         }

        // Check TLS status if indicated by site preference
        var checkTLS = SitePreferences.CHECK_TLS;
        if(checkTLS == true){
        	var tls_broswer =  tls.getUserAgent();
            if((tls_broswer.name == "Chrome" && tls_broswer.version < 22) || (tls_broswer.name == "Firefox" && tls_broswer.version < 27) || (tls_broswer.name == "Safari" && tls_broswer.version < 5) || (tls_broswer.name == "MSIE" && tls_broswer.version < 11)){
            	if(tls_broswer.name == "MSIE"){
    		    	 tls_broswer.name = "Internet Explorer";
    		      }
            	$('.browser-compatibility-alert').removeClass('hide');
         	    $('.browser-compatibility-alert p').find('.browser_version').text(" " + tls_broswer.name + " " + tls_broswer.version+".");
            }
        }
        initializeDom();
        // init specific global components
        countries.init();
        tooltip.init();
        minicart.init();
        validator.init();
        uievents.init();
        megamenu.init();
        headerinit.init();
        searchplaceholder.init();
        // execute page specific initializations
        $.extend(page, window.pageContext);
        var ns = page.ns;
        if (ns && pages[ns] && pages[ns].init) {
            pages[ns].init();
        }
        initializeEvents();
        require('./browsera').init();
    }
};

// general extension functions
(function () {
    String.format = function () {
        var s = arguments[0];
        var i, len = arguments.length - 1;
        for (i = 0; i < len; i++) {
            var reg = new RegExp('\\{' + i + '\\}', 'gm');
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    };
})();

jQuery(function(event){
	jQuery(".accordion")
		.hover(function(event) {
				var $this = jQuery(this);
			   if ($this.hasClass('highlight')) {
				   $this.addClass('contentbox');
			   } else {
				   $this.removeClass('contentbox').addClass('tabover');
	           }
			},
			function(event) {
		   		jQuery(this).removeClass('tabover').addClass('contentbox');
        	}
        ).click(function() {
			var $this = jQuery(this);
			if ($this.find('.expandcontent').length > 0) {
				$this.find('h1').toggleClass('downarrow').next().toggle('fast');
				$this.toggleClass('highlight').toggleClass('tabover').toggleClass('contentbox');
			} else {
				window.location.href=$this.find('a').attr('href');
			}
		});
});

// initialize app
$(document).ready(function () {
    app.init();
});

},{"./browsera":5,"./captcha":6,"./cookieprivacy":8,"./countries":9,"./dialog":10,"./dialogify":11,"./headerinit":14,"./jquery-ext":15,"./megamenu":16,"./minicart":17,"./page":18,"./pages/account":19,"./pages/cart":20,"./pages/checkout":24,"./pages/compare":27,"./pages/international":28,"./pages/product":30,"./pages/rapalainsider":32,"./pages/registry":33,"./pages/search":34,"./pages/storefront":35,"./pages/storelocator":36,"./pages/wishlist":37,"./progress":39,"./searchplaceholder":41,"./searchsuggest":42,"./tls":45,"./tooltip":46,"./uievents":47,"./util":48,"./validator":49}],4:[function(require,module,exports){
'use strict';

var dialog = require('./dialog'),
    page = require('./page'),
    util = require('./util');

var selectedList = [];
var maxItems = 1;
var bliUUID = '';

/**
 * @private
 * @function
 * description Gets a list of bonus products related to a promoted product
 */
function getBonusProducts() {
    var bonusproducts = [];

    var i, len;
    for (i = 0, len = selectedList.length; i < len; i++) {
        var p = {
            pid: selectedList[i].pid,
            qty: selectedList[i].qty,
            options: {}
        };
        var a, alen, bp = selectedList[i];
        if (bp.options) {
            for (a = 0, alen = bp.options.length; a < alen; a++) {
                var opt = bp.options[a];
                p.options = {optionName : opt.name, optionValue : opt.value};
            }
        }
        bonusproducts.push({product : p});
    }
    return {bonusproducts: bonusproducts};
}

var selectedItemTemplate = function (data) {
    var attributes = '';
    for (var attrID in data.attributes) {
        var attr = data.attributes[attrID];
        attributes += '<li data-attribute-id="' + attrID + '">\n';
        attributes += '<span class="display-name">' + attr.displayName + '</span>: ';
        attributes += '<span class="display-value">' + attr.displayValue + '</span>\n';
        attributes += '</li>';
    }
    attributes += '<li class="item-qty">\n';
    attributes += '<span class="display-name">Qty</span>: ';
    attributes += '<span class="display-value">' + data.qty + '</span>';
    return [
        '<li class="selected-bonus-item" data-uuid="' + data.uuid + '" data-pid="' + data.pid + '">',
        '<i class="remove-link fa fa-remove" title="Remove this product" href="#"></i>',
        '<div class="item-name">' + data.name + '</div>',
        '<ul class="item-attributes">',
        attributes,
        '<ul>',
        '<li>'
    ].join('\n');
};

// hide swatches that are not selected or not part of a Product Variation Group
var hideSwatches = function () {
    $('.bonus-product-item:not([data-producttype="master"]) .swatches li').not('.selected').not('.variation-group-value').hide();
    // prevent unselecting the selected variant
    $('.bonus-product-item .swatches .selected').on('click', function () {
        return false;
    });
};

/**
 * @private
 * @function
 * @description Updates the summary page with the selected bonus product
 */
function updateSummary() {
    var $bonusProductList = $('#bonus-product-list');
    if (!selectedList.length) {
        $bonusProductList.find('li.selected-bonus-item').remove();
    } else {
        var ulList = $bonusProductList.find('ul.selected-bonus-items').first();
        var i, len;
        for (i = 0, len = selectedList.length; i < len; i++) {
            var item = selectedList[i];
            var li = selectedItemTemplate(item);
            $(li).appendTo(ulList);
        }
    }

    // get remaining item count
    var remain = maxItems - selectedList.length;
    $bonusProductList.find('.bonus-items-available').text(remain);
    if (remain <= 0) {
        $bonusProductList.find('.select-bonus-item').attr('disabled', 'disabled');
    } else {
        $bonusProductList.find('.select-bonus-item').removeAttr('disabled');
    }
}

function initializeGrid() {
    var $bonusProduct = $('#bonus-product-dialog'),
        $bonusProductList = $('#bonus-product-list'),
        bliData = $bonusProductList.data('line-item-detail');
    maxItems = bliData.maxItems;
    bliUUID = bliData.uuid;

    if (bliData.itemCount >= maxItems) {
        $bonusProductList.find('.select-bonus-item').attr('disabled', 'disabled');
    }

    var cartItems = $bonusProductList.find('.selected-bonus-item');
    cartItems.each(function () {
        var ci = $(this);
        var product = {
            uuid: ci.data('uuid'),
            pid: ci.data('pid'),
            qty: ci.find('.item-qty').text(),
            name: ci.find('.item-name').html(),
            attributes: {}
        };
        var attributes = ci.find('ul.item-attributes li');
        attributes.each(function () {
            var li = $(this);
            product.attributes[li.data('attributeId')] = {
                displayName : li.children('.display-name').html(),
                displayValue : li.children('.display-value').html()
            };
        });
        selectedList.push(product);
    });

    $bonusProductList.on('click', '.bonus-product-item a[href].swatchanchor', function (e) {
        e.preventDefault();
        var url = this.href,
            $this = $(this);
        url = util.appendParamsToUrl(url, {
            'source': 'bonus',
            'format': 'ajax'
        });
        $.ajax({
            url: url,
            success: function (response) {
                $this.closest('.bonus-product-item').empty().html(response);
                hideSwatches();
            }
        });
    })
    .on('change', '.input-text', function () {
        $bonusProductList.find('.select-bonus-item').removeAttr('disabled');
        $(this).closest('.bonus-product-form').find('.quantity-error').text('');
    })
    .on('click', '.select-bonus-item', function (e) {
        e.preventDefault();
        if (selectedList.length >= maxItems) {
            $bonusProductList.find('.select-bonus-item').attr('disabled', 'disabled');
            $bonusProductList.find('.bonus-items-available').text('0');
            return;
        }

        var form = $(this).closest('.bonus-product-form'),
            detail = $(this).closest('.product-detail'),
            uuid = form.find('input[name="productUUID"]').val(),
            qtyVal = form.find('input[name="Quantity"]').val(),
            qty = (isNaN(qtyVal)) ? 1 : (+qtyVal);

        if (qty > maxItems) {
            $bonusProductList.find('.select-bonus-item').attr('disabled', 'disabled');
            form.find('.quantity-error').text(Resources.BONUS_PRODUCT_TOOMANY);
            return;
        }

        var product = {
            uuid: uuid,
            pid: form.find('input[name="pid"]').val(),
            qty: qty,
            name: detail.find('.product-name').text(),
            attributes: detail.find('.product-variations').data('attributes'),
            options: []
        };

        var optionSelects = form.find('.product-option');

        optionSelects.each(function () {
            product.options.push({
                name: this.name,
                value: $(this).val(),
                display: $(this).children(':selected').first().html()
            });
        });
        selectedList.push(product);
        updateSummary();
    })
    .on('click', '.remove-link', function (e) {
        e.preventDefault();
        var container = $(this).closest('.selected-bonus-item');
        if (!container.data('uuid')) { return; }

        var uuid = container.data('uuid');
        var i, len = selectedList.length;
        for (i = 0; i < len; i++) {
            if (selectedList[i].uuid === uuid) {
                selectedList.splice(i, 1);
                break;
            }
        }
        updateSummary();
    })
    .on('click', '.add-to-cart-bonus', function (e) {
        e.preventDefault();
        var url = util.appendParamsToUrl(Urls.addBonusProduct, {bonusDiscountLineItemUUID: bliUUID});
        var bonusProducts = getBonusProducts();
        if (bonusProducts.bonusproducts[0].product.qty > maxItems) {
            bonusProducts.bonusproducts[0].product.qty = maxItems;
        }
        // make the server call
        $.ajax({
            type: 'POST',
            dataType: 'json',
            cache: false,
            contentType: 'application/json',
            url: url,
            data: JSON.stringify(bonusProducts)
        })
        .done(function () {
            // success
            page.refresh();
        })
        .fail(function (xhr, textStatus) {
            // failed
            if (textStatus === 'parsererror') {
                window.alert(Resources.BAD_RESPONSE);
            } else {
                window.alert(Resources.SERVER_CONNECTION_ERROR);
            }
        })
        .always(function () {
            $bonusProduct.dialog('close');
        });
    })
    .on('click', '#more-bonus-products', function (e) {
        e.preventDefault();
        var uuid = $('#bonus-product-list').data().lineItemDetail.uuid;

        //get the next page of choice of bonus products
        var lineItemDetail = JSON.parse($('#bonus-product-list').attr('data-line-item-detail'));
        lineItemDetail.pageStart = lineItemDetail.pageStart + lineItemDetail.pageSize;
        $('#bonus-product-list').attr('data-line-item-detail', JSON.stringify(lineItemDetail));

        var url = util.appendParamsToUrl(Urls.getBonusProducts, {
            bonusDiscountLineItemUUID: uuid,
            format: 'ajax',
            lazyLoad: 'true',
            pageStart: lineItemDetail.pageStart,
            pageSize: $('#bonus-product-list').data().lineItemDetail.pageSize,
            bonusProductsTotal: $('#bonus-product-list').data().lineItemDetail.bpTotal
        });

        $.ajax({
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            url: url
        })
        .done(function (data) {
            //add the new page to DOM and remove 'More' link if it is the last page of results
            $('#more-bonus-products').before(data);
            if ((lineItemDetail.pageStart + lineItemDetail.pageSize) >= $('#bonus-product-list').data().lineItemDetail.bpTotal) {
                $('#more-bonus-products').remove();
            }
        })
        .fail(function (xhr, textStatus) {
            if (textStatus === 'parsererror') {
                window.alert(Resources.BAD_RESPONSE);
            } else {
                window.alert(Resources.SERVER_CONNECTION_ERROR);
            }
        });
    });
}

var bonusProductsView = {
    /**
     * @function
     * @description Open the list of bonus products selection dialog
     */
    show: function (url) {
        var $bonusProduct = $('#bonus-product-dialog');
        // create the dialog
        dialog.open({
            target: $bonusProduct,
            url: url,
            options: {
                width: 795,
                title: Resources.BONUS_PRODUCTS
            },
            callback: function () {
                initializeGrid();
                hideSwatches();
            }
        });
    },
    /**
     * @function
     * @description Open bonus product promo prompt dialog
     */
    loadBonusOption: function () {
        var    self = this,
            bonusDiscountContainer = document.querySelector('.bonus-discount-container');
        if (!bonusDiscountContainer) { return; }

        // get the html from minicart, then trash it
        var bonusDiscountContainerHtml = bonusDiscountContainer.outerHTML;
        bonusDiscountContainer.parentNode.removeChild(bonusDiscountContainer);

        dialog.open({
            html: bonusDiscountContainerHtml,
            options: {
                width: 400,
                title: Resources.BONUS_PRODUCT,
                buttons: [{
                    text: Resources.SELECT_BONUS_PRODUCTS,
                    click: function () {
                        var uuid = $('.bonus-product-promo').data('lineitemid'),
                            url = util.appendParamsToUrl(Urls.getBonusProducts, {
                                bonusDiscountLineItemUUID: uuid,
                                source: 'bonus',
                                format: 'ajax',
                                lazyLoad: 'false',
                                pageStart: 0,
                                pageSize: 10,
                                bonusProductsTotal: -1
                            });
                        $(this).dialog('close');
                        self.show(url);
                    }
                }, {
                    text: Resources.NO_THANKS,
                    click: function () {
                        $(this).dialog('close');
                    }
                }]
            },
            callback: function () {
                // show hide promo details
                $('.show-promo-details').on('click', function () {
                    $('.promo-details').toggleClass('visible');
                });
            }
        });
    }
};

module.exports = bonusProductsView;

},{"./dialog":10,"./page":18,"./util":48}],5:[function(require,module,exports){
'use strict';

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function runBrowseraTest() {

    var hoverSelector = decodeURI(getUrlVars().hover);
    if (hoverSelector !== '') {
        hoverSelector = hoverSelector.replace(' eq ', '=');
        if ($(hoverSelector).length > 0) {
            $(hoverSelector).trigger('mouseenter');
        }
    }
    var clickSelector = decodeURI(getUrlVars().click);
    if (clickSelector !== '') {
        clickSelector = clickSelector.replace(' eq ', '=');
        if ($(clickSelector).length > 0) {
            $(clickSelector).trigger('click');
        }
    }
}

exports.init = function() {
    runBrowseraTest();
};

},{}],6:[function(require,module,exports){
'use strict';

var dialog = require('./dialog');
var util = require('./util');
var SessionAttributes = window.SessionAttributes;

/**
 * @function captcha    Used to display/control the scrim containing the simulated captcha code
 **/
module.exports = function () {
    /**
     * if the session.privacy.ratelimited element is present then show the notification
     * NOTE: You will probably want to replace this with a call to an actual CAPTCHA system to replace the simple one here
     */
    if (SessionAttributes.SHOW_CAPTCHA) {
        dialog.open({
            html: '<h1>' + Resources.ARE_YOU_HUMAN + '</h1>',
            options: {
                closeOnEscape: false,
                dialogClass: 'no-close',
                buttons: [{
                    text: Resources.OK,
                    click: function () {
                        var url = util.appendParamsToUrl(Urls.rateLimiterReset, {format: 'ajax'});
                        $.ajax({
                            url: url
                        });
                        $(this).dialog('close');
                    }
                }]
            }
        });
    }
};

},{"./dialog":10,"./util":48}],7:[function(require,module,exports){
'use strict';

var page = require('./page'),
    util = require('./util'),
    TPromise = require('promise');

var _currentCategory = '',
    MAX_ACTIVE = 6;

/**
 * @private
 * @function
 * @description Verifies the number of elements in the compare container and updates it with sequential classes for ui targeting
 */
function refreshContainer() {
    var $compareContainer = $('.compare-items');
    var $compareItems = $compareContainer.find('.compare-item');
    var numActive = $compareItems.filter('.active').length;

    if (numActive < 2) {
        $('#compare-items-button').attr('disabled', 'disabled');
    } else {
        $('#compare-items-button').removeAttr('disabled');
    }
    /*Start JIRA PREV-234 : PLP - Not able to remove individual product from the compare grid from PLP.*/
    for (var i = 0; i < $compareItems.length; i++) {
        $($compareItems[i]).find('.compare-item-number').text(i + 1);
    }
    /*End JIRA PREV-234*/
    $compareContainer.toggle(numActive > 0);
}
/**
 * @private
 * @function
 * @description Adds an item to the compare container and refreshes it
 */
function addToList(data) {
    // get the first compare-item not currently active
    var $item = $('.compare-items .compare-item').not('.active').first(),
        $productTile = $('#' + data.uuid);

    if ($item.length === 0) {
        if ($productTile.length > 0) {
            $productTile.find('.compare-check')[0].checked = false;
        }
        window.alert(Resources.COMPARE_ADD_FAIL);
        return;
    }

    // if already added somehow, return
    if ($('[data-uuid="' + data.uuid + '"]').length > 0) {
        return;
    }
    // set as active item
    $item.addClass('active')
        .attr('data-uuid', data.uuid)
        .attr('data-itemid', data.itemid)
        .data('uuid', data.uuid)
        .data('itemid', data.itemid)
        .append($(data.img).clone().addClass('compare-item-image'));
}
/**
 * @private
 * @function
 * description Removes an item from the compare container and refreshes it
 */
function removeFromList($item) {
    if ($item.length === 0) {
        return;
    }
    // remove class, data and id from item
    $item.removeClass('active')
        .removeAttr('data-uuid')
        .removeAttr('data-itemid')
        .data('uuid', '')
        .data('itemid', '')
        // remove the image
        .find('.compare-item-image').remove();

    /*Start JIRA PREV-234 : PLP - Not able to remove individual product from the compare grid from PLP.*/
    var $cloneItem = $item.clone();
    $item.remove();
    $cloneItem.appendTo('.compare-items-panel');
    refreshContainer();
    /*End JIRA PREV-234*/
}

function addProductAjax(args) {
    var promise = new TPromise(function (resolve, reject) {
        $.ajax({
            url: Urls.compareAdd,
            data: {
                pid: args.itemid,
                category: _currentCategory
            },
            dataType: 'json'
        }).done(function (response) {
            if (!response || !response.success) {
                reject(new Error(Resources.COMPARE_ADD_FAIL));
            } else {
                resolve(response);
                initializeEvents(); // JIRA PREV-234 : PLP - Not able to remove individual product from the compare grid from PLP.
            }
        }).fail(function (jqxhr, status, err) {
            reject(new Error(err));
        });
    });
    return promise;
}

function removeProductAjax(args) {
    var promise = new TPromise(function (resolve, reject) {
        $.ajax({
            url: Urls.compareRemove,
            data: {
                pid: args.itemid,
                category: _currentCategory
            },
            dataType: 'json'
        }).done(function (response) {
            if (!response || !response.success) {
                reject(new Error(Resources.COMPARE_REMOVE_FAIL));
            } else {
                resolve(response);
            }
        }).fail(function (jqxhr, status, err) {
            reject(new Error(err));
        });
    });
    return promise;
}

function shiftImages() {
    return new TPromise(function (resolve) {
        var $items = $('.compare-items .compare-item');
        $items.each(function (i, item) {
            var $item = $(item);
            // last item
            if (i === $items.length - 1) {
                return removeFromList($item);
            }
            var $next = $items.eq(i); //JIRA PREV-261 : PLP: When more than 6 product compared then Comparesection not displaying all the product images. Removed +1
            if ($next.hasClass('active')) {
                // remove its own image
                $next.find('.compare-item-image').detach().appendTo($item);
                $item.addClass('active')
                    .attr('data-uuid', $next.data('uuid'))
                    .attr('data-itemid', $next.data('itemid'))
                    .data('uuid', $next.data('uuid'))
                    .data('itemid', $next.data('itemid'));
            }
        });
        resolve();
    });
}

/**
 * @function
 * @description Adds product to the compare table
 */
function addProduct(args) {
    var promise;
    var $items = $('.compare-items .compare-item');
    var $cb = $(args.cb);
    var numActive = $items.filter('.active').length;
    if (numActive === MAX_ACTIVE) {
        if (!window.confirm(Resources.COMPARE_CONFIRMATION)) {
            $cb[0].checked = false;
            return;
        }

        // remove product using id
        var $firstItem = $items.first();
        promise = removeItem($firstItem).then(function () {
            return shiftImages();
        });
    } else {
        promise = TPromise.resolve(0);
    }
    return promise.then(function () {
        return addProductAjax(args).then(function() {
            addToList(args);
            if ($cb && $cb.length > 0) {
                $cb[0].checked = true;
            }
            refreshContainer();
        });
    }).then(null, function () {
        if ($cb && $cb.length > 0) {
            $cb[0].checked = false;
        }
    });
}

/**
 * @function
 * @description Removes product from the compare table
 * @param {object} args - the arguments object should have the following properties: itemid, uuid and cb (checkbox)
 */
function removeProduct(args) {
    var $cb = args.cb ? $(args.cb) : null;
    return removeProductAjax(args).then(function () {
        var $item = $('[data-uuid="' + args.uuid + '"]');
        removeFromList($item);
        if ($cb && $cb.length > 0) {
            $cb[0].checked = false;
        }
        refreshContainer();
    }, function () {
        if ($cb && $cb.length > 0) {
            $cb[0].checked = true;
        }
    });
}

function removeItem($item) {
    var uuid = $item.data('uuid'),
        $productTile = $('#' + uuid);
    return removeProduct({
        itemid: $item.data('itemid'),
        uuid: uuid,
        cb: ($productTile.length === 0) ? null : $productTile.find('.compare-check')
    });
}

/**
 * @private
 * @function
 * @description Initializes the DOM-Object of the compare container
 */
function initializeDom() {
    var $compareContainer = $('.compare-items');
    _currentCategory = $compareContainer.data('category') || '';
    var $active = $compareContainer.find('.compare-item').filter('.active');
    $active.each(function () {
        var $productTile = $('#' + $(this).data('uuid'));
        if ($productTile.length === 0) {
            return;
        }
        $productTile.find('.compare-check')[0].checked = true;
    });
    // set container state
    refreshContainer();
}

/**
 * @private
 * @function
 * @description Initializes the events on the compare container
 */
function initializeEvents() {
    // add event to buttons to remove products
    $('.compare-item').on('click', '.compare-item-remove', function () {
        removeItem($(this).closest('.compare-item'));
    });

    // Button to go to compare page
    $('#compare-items-button').on('click', function () {
        page.redirect(util.appendParamToURL(Urls.compareShow, 'category', _currentCategory));
    });

    // Button to clear all compared items
    // rely on refreshContainer to take care of hiding the container
    $('#clear-compared-items').on('click', function () {
        $('.compare-items .active').each(function () {
            removeItem($(this));
        });
    });
}

exports.init = function () {
    initializeDom();
    initializeEvents();
};

exports.addProduct = addProduct;
exports.removeProduct = removeProduct;

},{"./page":18,"./util":48,"promise":54}],8:[function(require,module,exports){
'use strict';

var dialog = require('./dialog');

/**
 * @function cookieprivacy	Used to display/control the scrim containing the cookie privacy code
 **/
module.exports = function() {
    /**
     * If we have not accepted cookies AND we're not on the Privacy Policy page, then show the notification
     * NOTE: You will probably want to adjust the Privacy Page test to match your site's specific privacy / cookie page
     */
    if (SitePreferences.COOKIE_HINT === true && document.cookie.indexOf('dw_cookies_accepted') < 0) {
        // check for privacy policy page
        if ($('.privacy-policy').length === 0) {
            dialog.open({
                url: Urls.cookieHint,
                options: {
                    closeOnEscape: false,
                    dialogClass: 'no-close',
                    buttons: [{
                        text: Resources.I_AGREE,
                        click: function () {
                            $(this).dialog('close');
                            enableCookies();
                        }
                    }]
                }
            });
        }
    } else {
        // Otherwise, we don't need to show the asset, just enable the cookies
        enableCookies();
    }

    function enableCookies() {
        if (document.cookie.indexOf('dw=1') < 0) {
            document.cookie = 'dw=1; path=/';
        }
        if (document.cookie.indexOf('dw_cookies_accepted') < 0) {
            document.cookie = 'dw_cookies_accepted=1; path=/';
        }
    }
};

},{"./dialog":10}],9:[function(require,module,exports){
'use strict';

exports.init = function init() {
    $('.country-selector .current-country').on('click', function () {
        $('.country-selector .selector').toggleClass('active');
        $(this).toggleClass('selector-active');
    });
    // set currency first before reload
    $('.country-selector .selector .locale').on('click', function (e) {
        e.preventDefault();
        var url = this.href;
        var currency = this.getAttribute('data-currency');
        $.ajax({
            dataType: 'json',
            url: Urls.setSessionCurrency,
            data: {
                format: 'ajax',
                currencyMnemonic: currency
            }
        })
        .done(function (response) {
            if (!response.success) {
                throw new Error('Unable to set currency');
            }
            window.location.href = url;
        });
    });
};

},{}],10:[function(require,module,exports){
'use strict';

var ajax = require('./ajax'),
    util = require('./util'),
    _ = require('lodash'),
    imagesLoaded = require('imagesloaded');

var dialog = {
    /**
     * @function
     * @description Appends a dialog to a given container (target)
     * @param {Object} params  params.target can be an id selector or an jquery object
     */
    create: function (params) {
        var $target, id;

        if (_.isString(params.target)) {
            if (params.target.charAt(0) === '#') {
                $target = $(params.target);
            } else {
                $target = $('#' + params.target);
            }
        } else if (params.target instanceof jQuery) {
            $target = params.target;
        } else {
            $target = $('#dialog-container');
        }

        // if no element found, create one
        if ($target.length === 0) {
            if ($target.selector && $target.selector.charAt(0) === '#') {
                id = $target.selector.substr(1);
                $target = $('<div>').attr('id', id).addClass('dialog-content').appendTo('body');
            }
        }

        // create the dialog
        this.$container = $target;
        this.$container.dialog(_.merge({}, this.settings, params.options || {}));
        return this.$container; // PREVAIL-Added Return value.
    },
    /**
     * @function
     * @description Opens a dialog using the given url (params.url) or html (params.html)
     * @param {Object} params
     * @param {Object} params.url should contain the url
     * @param {String} params.html contains the html of the dialog content
     */
    open: function (params) {
        // close any open dialog
        this.close();
        this.create(params);
        this.replace(params);
    },
    /**
     * @description populate the dialog with html content, then open it
     **/
    openWithContent: function (params) {
        var content, position, callback;

        if (!this.$container) {
            return;
        }
        content = params.content || params.html;
        if (!content) {
            return;
        }
        this.$container.empty().html(content);
        if (!this.$container.dialog('isOpen')) {
            this.$container.dialog('open');
        }

        if (params.options) {
            position = params.options.position;
        }
        if (!position) {
            position = this.settings.position;
        }
        imagesLoaded(this.$container).on('done', function () {
            this.$container.dialog('option', 'position', position);
        }.bind(this));

        callback = (typeof params.callback === 'function') ? params.callback : function () {};
        callback();
    },
    /**
     * @description Replace the content of current dialog
     * @param {object} params
     * @param {string} params.url - If the url property is provided, an ajax call is performed to get the content to replace
     * @param {string} params.html - If no url property is provided, use html provided to replace
     */
    replace: function (params) {
        if (!this.$container) {
            return;
        }
        if (params.url) {
            params.url = util.appendParamToURL(params.url, 'format', 'ajax');
            ajax.load({
                url: params.url,
                data: params.data,
                callback: function (response) {
                    params.content = response;
                    this.openWithContent(params);
                }.bind(this)
            });
        } else if (params.html) {
            this.openWithContent(params);
        }
    },
    /**
     * @function
     * @description Closes the dialog
     */
    close: function () {
        if (!this.$container) {
            return;
        }
        this.$container.dialog('close');
    },
    /**
     * @function
     * @description Submits the dialog form with the given action
     * @param {String} The action which will be triggered upon form submit
     */
    submit: function (action) {
        var $form = this.$container.find('form:first');
        // set the action
        $('<input/>').attr({
            name: action,
            type: 'hidden'
        }).appendTo($form);
        // serialize the form and get the post url
        var data = $form.serialize();
        var url = $form.attr('action');
        // make sure the server knows this is an ajax request
        if (data.indexOf('ajax') === -1) {
            data += '&format=ajax';
        }
        // post the data and replace current content with response content
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'html',
            success: function (html) {
                this.$container.html(html);
                $(".ui-dialog-content:visible").each(function () {
        	        $( this ).dialog("option","position",$(this).dialog("option","position"));
        	    });
            }.bind(this),
            failure: function () {
                window.alert(Resources.SERVER_ERROR);
            }
        });
    },
    exists: function () {
        return this.$container && (this.$container.length > 0);
    },
    isActive: function () {
        return this.exists() && (this.$container.children.length > 0);
    },
    settings: {
        autoOpen: false,
        height: 'auto',
        modal: true,
        overlay: {
            opacity: 0.5,
            background: 'black'
        },
        resizable: false,
        title: '',
        width: '800',
        close: function () {
            $(this).dialog('close');
        },
        position: {
            my: 'center',
            at: 'center',
            of: window,
            collision: 'flipfit'
        }
    }
};

module.exports = dialog;

},{"./ajax":2,"./util":48,"imagesloaded":50,"lodash":53}],11:[function(require,module,exports){
'use strict';

var ajax = require('./ajax'),
    util = require('./util'),
    tooltip = require('./tooltip'),
    validator = require('./validator'),
    dialog = require('./dialog');

var setDialogify = function(e) {
    e.preventDefault();
    var actionSource = $(this),
        dlgAction = $(actionSource).data('dlg-action') || {}, // url, target, isForm
        dlgOptions = $.extend({}, dialog.settings, $(actionSource).data('dlg-options') || {});

    dlgOptions.title = dlgOptions.title || $(actionSource).attr('title') || '';

    var url = dlgAction.url // url from data
        ||
        (dlgAction.isForm ? $(actionSource).closest('form').attr('action') : null) // or url from form action if isForm=true
        ||
        $(actionSource).attr('href'); // or url from href

    if (!url) {
        return;
    }

    var form = jQuery(this).parents('form');
    var method = form.attr('method') || 'POST';

    if (actionSource[0].tagName === 'BUTTON' && !form.valid() || actionSource[0].tagName === 'INPUT' && !form.valid()) {
        return false;
    }

    // if this is a content link, update url from Page-Show to Page-Include
    if ($(this).hasClass('attributecontentlink')) {
        var uri = util.getUri(url);
        url = Urls.pageInclude + uri.query;
    }
    var postData;
    if (method && method.toUpperCase() === 'POST') {
        postData = form.serialize() + '&' + jQuery(this).attr('name') + '=submit';
    } else {
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }
        url += form.serialize();
        url = util.appendParamToURL(url, jQuery(this).attr('name'), 'submit');
    }

    var dlg = dialog.create({
        target: dlgAction.target,
        options: dlgOptions
    });

    ajax.load({
        url: $(actionSource).attr('href') || $(actionSource).closest('form').attr('action'),
        target: dlg,
        callback: function () {
            dlg.dialog('open'); // open after load to ensure dialog is centered
            validator.init();
            tooltip.init();
            if (dlg.find('.closedialog').length > 0) {
                dialog.close();
            }
        },
        data: !$(actionSource).attr('href') ? postData : null,
        type: method

    });
}

exports.setDialogify = setDialogify;

},{"./ajax":2,"./dialog":10,"./tooltip":46,"./util":48,"./validator":49}],12:[function(require,module,exports){
'use strict';

var ajax = require('./ajax'),
    util = require('./util');
/**
 * @function
 * @description Load details to a given gift certificate
 * @param {String} id The ID of the gift certificate
 * @param {Function} callback A function to called
 */
//PREVAIL-Added pin to handle Custom GC.
exports.checkBalance = function (id, callback) {
    // load gift certificate details
    var url = util.appendParamToURL(Urls.giftCardCheckBalance, 'giftCertificateID', id);
    ajax.getJson({
        url: url,
        callback: callback
    });
};

},{"./ajax":2,"./util":48}],13:[function(require,module,exports){
'use strict';

var ajax = require('./ajax'),
    minicart = require('./minicart'),
    util = require('./util');

var setAddToCartHandler = function (e) {
    e.preventDefault();
    var form = $(this).closest('form');

    var options = {
        url: util.ajaxUrl(form.attr('action')),
        method: 'POST',
        cache: false,
        data: form.serialize()
    };
    $.ajax(options).done(function (response) {
        if (response.success) {
            ajax.load({
                url: Urls.minicartGC,
                data: {
                    lineItemId: response.result.lineItemId
                },
                callback: function (response) {
                    minicart.show(response);
                    form.find('input,textarea').val('');
                }
            });
        } else {
            form.find('span.error').hide();
            for (var id in response.errors.FormErrors) {
                var $errorEl = $('#' + id).addClass('error').removeClass('valid').next('.error');
                if (!$errorEl || $errorEl.length === 0) {
                    $errorEl = $('<span for="' + id + '" generated="true" class="error" style=""></span>');
                    $('#' + id).after($errorEl);
                }
                $errorEl.text(response.errors.FormErrors[id].replace(/\\'/g, '\'')).show();
            }
        }
    }).fail(function (xhr, textStatus) {
        // failed
        if (textStatus === 'parsererror') {
            window.alert(Resources.BAD_RESPONSE);
        } else {
            window.alert(Resources.SERVER_CONNECTION_ERROR);
        }
    });
};

exports.init = function() {
    $('#AddToBasketButton').on('click', setAddToCartHandler);
};

},{"./ajax":2,"./minicart":17,"./util":48}],14:[function(require,module,exports){
'use strict';

var uievents = require('./uievents'),
	dialog = require('./dialog'),
    progress = require('./progress');

var $con = $('body');
var appGlobal = {
	globalTimer: 0
};
var headerEvents = {
		initializeEvent: function() {
			$("body").find("input, select.input-select").focusin(function() {
				$(this).closest(".formfield").removeClass('inputlabel');
				$(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
				$(this).removeClass('errorclient');
				$(this).closest('.formfield').find('.logerror , .existing_register').css('display','none');
			});
		  if($('.logincustomers').length > 0 ){
				 var crrobj=$(this).find('.formfield  .logerror');
				$(crrobj).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
			}

			 $('.privacy-policy').on('click', function (e) {
		        e.preventDefault();
		        dialog.open({
		            url: $(e.target).attr('href'),
		            options: {
		                height: 600
		            }
		        });
		    });
			//label text color change on submit
			if( $('.account-logs').length > 0 ||  $('.new-register').length > 0  ||  $('.wish-logs').length > 0 ||  $('.createan-account').length > 0  || $('.headercustomerinfo').length > 0  ||  $('.ui-login').length > 0 || $('.passwordreset').length > 0 ){
				$('.formactions button').click(function(){
					$('span.existing_register').hide();
					var crrobj=$(this).closest('form').find('.field-wrapper .required');
					$(crrobj).each(function() {
						if($(this).hasClass('errorclient')){
							$(this).closest('.formfield').find('.label .labeltext').addClass('inputlabel');
							$(this).closest('.formfield').find('.label .requiredindicator').addClass('inputlabel');
						} else {
							$(this).closest('.formfield').find('.label .labeltext').removeClass('inputlabel');
							$(this).closest('.formfield').find('.label .requiredindicator').removeClass('inputlabel');
						}
					});
				});
			}
			//login & wish list validations
			if( $('.account-logs').length > 0 ||  $('.new-register').length > 0  ||  $('.wish-logs').length > 0 ||  $('.createan-account').length > 0  || $('.headercustomerinfo').length > 0  ||  $('.ui-login').length > 0 ){
				 $('a.clearbutton').click(function(){
					 $(this).closest('.formfield').find('input') .val("");
				     $(this).closest('.formfield').find('textarea') .val("");
					 $(this).closest(".field-wrapper").find('span').remove();
					 $(this).closest(".field-wrapper").find('.required').removeClass('errorclient');
					 $(this).closest('.formfield').find('a.clearbutton').hide();
					 $(this).closest('.formfield ').find('.form-row').removeClass('inputlabel');
					 $(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
					 $(this).closest(".formfield").find("span.logerror , .existing_register").hide();

		        });
		      }
			$(".ui-login .sign-up-blk > a").on('mouseenter click',function(e){
				if($(window).width() < 960) {
					return true;

				} else {
					if(e.type == 'click' && $('.accountcontent').is(':visible')){
						clearTimeout(appGlobal.globalTimer);
						appGlobal.globalTimer == 0;
						$('.accountcontent').hide();
						$('.headermask').hide();
						$('.confirmationcontainer').hide();
							return false;
					}
					if($('.header-create').is(':visible')){
						return false;
					}
					$('.accountcontent').removeClass('js-entered');
					$('.accountcontent').hide();
					$('.sign-up-blk').addClass('js-active');
					if(!$(this).closest('.ui-login').find('.header-sign-in').is(':visible')){
						headerEvents.accountContPos($(".ui-login .sign-up-blk > a"),$(this).closest('.ui-login').find('.header-sign-in'));
						$(this).closest('.ui-login').find('.header-sign-in').show();
					}
					$('.headermask').show();
					/*if(appGlobal.util.readCookie("emailId")){
						$('.header-sign-in.accountcontent .guestemail').val(appGlobal.util.readCookie("emailId"));
						$('.header-sign-in.accountcontent .login_password').removeAttr('placeholder').val('');
					}*/
					clearTimeout(appGlobal.globalTimer);
					appGlobal.globalTimer == 0;
					appGlobal.globalTimer = setTimeout(function(){
						$('.accountcontent').hide();
					$('.headermask').hide();
					$('.headercustomerinfo').find('.js-active').removeClass('js-active');
					}, 5000);
					$('.confirmationcontainer').hide();
				}

			});
			  	$(".signingin").click(function(e){
					e.preventDefault();
					$('.accountcontent').hide();
					var validator = $(this).closest('form').validate();
					if(validator.element($(this).closest('form').find('.guestemail'))){
						$('.accountcontent .guestemail').val($(this).closest('.accountcontent').find('.guestemail').val());
						$('.accountcontent .guestemail').removeClass('error');
						$('.accountcontent .guestemail').next('span.error').remove();
						$('.login_password').removeClass('error');
						$('.login_password').next('span.error').remove();
						$('.accountcontent .guestemail').addClass('click-mark valid');
					}
					$(this).closest('.ui-login').find('.header-sign-in').show();
					$('.header-sign-in .signin_main .loginfail.errormessage').hide();
					$('.headermask').addClass('no-hide').show();
				});

		 		$(".sign-message a, .ExistedUser-error .createaccount").click(function(e){
		 			e.preventDefault();
		 			$('.accountcontent').hide();
		 			$(this).closest('.ui-login').find('.header-create').show();
		 			var validator = $(this).closest('form').validate();
		 			if(validator.element($(this).closest('form').find('.guestemail'))){
		 				$('.accountcontent .guestemail').val($(this).closest('.accountcontent').find('.guestemail').val());
		 				$('.accountcontent .guestemail').removeClass('error');
		 				$('.accountcontent .guestemail').next('span.error').remove();
		 				$('.accountcontent .guestemail').addClass('click-mark valid');
		 			}
		 			headerEvents.accountContPos($(".ui-login .sign-up-blk > a"),$(this).closest('.ui-login').find('.header-create'));
		 			$('.headermask').show();
		 			$('.ExistedUser-error').hide();
		 			clearTimeout(appGlobal.globalTimer);
		 			appGlobal.globalTimer == 0;
		 			appGlobal.globalTimer = setTimeout(function(){
		 				$('.accountcontent').hide();
		 				$('.headermask').hide();
		 				$('.headercustomerinfo').find('.js-active').removeClass('js-active');
		 			}, 5000);
		 		});


		 		$(".forgot-password a").click(function(e){
		 			e.preventDefault();
		 			$('.accountcontent').hide();
		 			$(".header-forgot-pwd span.reset_email_error").hide();
		 			$(this).closest('.ui-login').find('.header-forgot-pwd').show();
		 			headerEvents.accountContPos($(".ui-login .sign-up-blk > a"),$(this).closest('.ui-login').find('.header-forgot-pwd'));
		 			$('.headermask').show();
		 			var validator = $(this).closest('form').validate({
		 				onkeyup: false
		 			});
		 			if(validator.element($(this).closest('form').find('.guestemail'))){
		 				$('.accountcontent .guestemail').val($(this).closest('.accountcontent').find('.guestemail').val());
		 				$('.accountcontent .guestemail').removeClass('error');
		 				$('.accountcontent .guestemail').next('span.error').remove();
		 				$('.accountcontent .guestemail').addClass('click-mark valid');
		 			}
		 			clearTimeout(appGlobal.globalTimer);
		 			appGlobal.globalTimer == 0;
		 			appGlobal.globalTimer = setTimeout(function(){
		 				$('.accountcontent').hide();
		 				$('.headermask').hide();
		 				$('.headercustomerinfo').find('.js-active').removeClass('js-active');
		 			}, 5000);
		 		});

		 		$('.accountcontent').mouseenter(function(){
		     		$('.headermask').removeClass('no-hide');
		     		$('.headermask').show();
		     		$('.confirmationcontainer').hide();
		     		$('.sign-up-blk').addClass('js-active');
		     		clearTimeout(appGlobal.globalTimer);
		     		appGlobal.globalTimer == 0;
		     	});

		 		$(".headermask").click(function(e){
		 			headerEvents.maskEvent(e);
		 	  	});

		 		$(".headermask").mouseenter(function(e){
		 			headerEvents.maskEvent(e);
		 	  	});
		 		$('.accountcontent').mouseenter(function(){
		 			$('.headermask').removeClass('no-hide');
		 			$('.headermask').show();
		 			$('.confirmationcontainer').hide();
		 			$('.sign-up-blk').addClass('js-active');
		 			clearTimeout(appGlobal.globalTimer);
		 			appGlobal.globalTimer == 0;
		 		});
		 	   $('.user-account').on('click', function (e) {
		 	        e.preventDefault();
		 	        $(this).parent('.user-info').toggleClass('active');
		 	    });
		 	   	$(".change-regionnew").mouseenter(function (e) {
		 	        $(".domainswitch-header").show();
		 	        $('.headermask').show();
		 	    });
		 	   $(".change-region").mouseenter(function(e) {
		 	        jQuery(".domainswitch").show();
		 	        $(".region_overlay").show()
		 	    });
		 	    $(".region_overlay").mouseenter(function(e) {
		 	        jQuery(".domainswitch").hide();
		 	        $(this).hide()
		 	    });
		 	   $("button").on('click',function () {
		 			if($('.resetpassword').is(':Visible')) {
		 				$('.resetpassword').closest('div.dialog-content').addClass('confirmationcontainer')
		 			}
		 			else {}
		 		});
		 		$(".sample-section").click(function(){
		 			if(!$(this).find('.sample_mail_main').is(':visible')){
		 				$(this).find('.sample_mail_main').slideDown(500);
		 			}
		 		});
		 		$(".signupfor-email .seesamples").click(function(e){
		 			$(this).closest('.signupfor-email').find('.sample_mail_main').slideToggle(500);
		 		});

		 		$("body").click(function(event){
		 			if (!$(event.target).is(".signupfor-email .seesamples") && (!$(event.target).is(".create_email_checkbox .seesamples"))) {
		 				$('.sample_mail_main').slideUp(500);
		 			}
		 		});
		 		/**This is used to get the tick mark for create account when the field is valid*/
		 		$('.ui-login input.required').blur(function(){
		 			if($(this).hasClass("valid")){ $(this).addClass("click-mark");}
		 			else{$(this).removeClass("click-mark");}
		 		});

		 		$('.back-link, .signingin').click(function(e){
		 			$('.accountcontent').hide();
		 			$(this).closest('.ui-login').find('.header-sign-in').show();
		 			$('.header-sign-in .signin_main .loginfail.errormessage').hide();
		 		});

		 		$('.forgot_create').click(function(e){
		 			$('.header-forgot-pwd').hide();
		 			$('.header-create').show();
		 			$('.header-create .errormessage').hide();
		 	  	});

		 		$('.loggeduser a, .headercustomerinfo .second_name').on('mouseenter', function(e){
		 			e.preventDefault();
		 			if($('.rapala_device').length == 0){
		 				$('.accountcontent').hide();
		 				headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'),$('.user-info'));
		 			$('.user-info').show();
		 			}
		 		});

		 		$('.rapala_device .loggeduser a,.headercustomerinfo .second_name').on('click', function(e){
		 			e.preventDefault();
		 			$('.accountcontent').hide();
		 			headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'),$('.user-info'));
		 			$('.user-info').show();
		 			$('.headermask').show();
		 		});
				jQuery(window).bind("message", function(e) {
					var str;
					e = e.originalEvent;
					if (e.origin.indexOf(document.location.host) === -1) {
						return;
					}
					var obj = e.data;
					try {
						str = JSON.parse(obj);
					} catch (err) {
						return;
					}
					if (str.process !== "sign-in") {
						return;
					}

					if (str.status === "success") {
						if (typeof str.email === "string") {
							headerEvents.userCookie(str.email);
						}
						document.location.reload(true);
					} else {
						$('.ExistedUser-error').hide();
						$('.custom_signin').find('.loading').remove();
						progress.hide();
						$('.custom_signin input[type="text"], .custom_signin input[type="password"]').addClass('errorclient');
						$('.loginfail').show();
						$('.accountcontent .loading').remove();
					}
				});
		 		jQuery('.signin-button').click(function(e){
		 			e.preventDefault();
					var realForm = $(this).closest('form');
			  		if(!realForm.valid()){
			  			return false;
			  		}
			  		$('.loginfail').hide();
			  		progress.show('.header-sign-in.accountcontent');
			  		var iframeId = 'js-header-signin-iframe';
			  		var formId = 'js-header-signin-form';
			  		$("#" + iframeId).remove();
			  		$("#" + formId).remove();
			  		var $form = $('<form></form>');
			  		$form.attr('id', formId);
			  		$form.attr('action', realForm.attr('action'));
			  		$form.attr('target', iframeId);
			  		$form.attr('method', 'POST');

			  		$('<iframe name="' + iframeId + '" id="' + iframeId + '" />').appendTo('body');
			  		$("#" + iframeId).attr('style', 'display: none;');

			  		realForm.find('input, select, textarea').each(function(){
			  			var $input = $(this).clone();
			  			$form.append($input);
			  		});

			  		$("body").append($form);
			  		$form.hide();
			  		$form.submit();
		 	  	});
		 		/*$(".PasswordResetForm").on("keyup",".guestemail",function(e){
	       	  		if(e.keyCode == 13) {
	       	  			$('.lost_btn .send').trigger("click");
	       	  		}
	       	  	});*/
		 		$(".PasswordResetForm").unbind("submit").on("submit",function(e){
		 			$(".header-forgot-pwd span.reset_email_error").hide();
		 			$('.lost_btn .send').addClass('clickedButton');
		 	  		e.preventDefault();
		 	  		var $form = $(this);
		 		  	if(!$form.valid()){
		 			  return false;
		 		  	}
		 		  	progress.show('.header-forgot-pwd.accountcontent');
		 		  	$.ajax({
			 	        dataType: "html",
			 	        url: $form.attr('action'),
			 	        data: $form.serialize(),
			 	        success: function(data){
			 	        	if($(data).find("div#messages.error").length>0 )
			 	    		{
			 	        		progress.hide();
			 	        		$(".header-forgot-pwd").show();
			 	        		$(".header-forgot-pwd span.reset_email_error").show();
			 	        		$('.accountcontent .loading').remove();

			 	    		}else{
			 	    			progress.hide();
			 	            	$('.header-forgot-pwd').hide();
			 	            	$('.confirmationcontainer').fadeIn(400);
			 	            	//to display the messeage
			 	            	headerEvents.initializeEvent();
			 	            	headerEvents.accountContPos($(".ui-login .sign-up-blk > a"),$('.confirmationcontainer'));
			 	            	$('.accountcontent .loading').remove();
			 	            	$('.confirmationcontainer').find('.headermask').hide();
			 	            	$('.confirmationcontainer').delay(4000).fadeOut();
			 	    		}
			 	        }
		 		  	});
		 		 return false;
		 	  	});
				jQuery(window).bind("message", function(e) {
					var str;
					e = e.originalEvent;
					if (e.origin.indexOf(document.location.host) === -1) {
						return;
					}
					var obj = e.data;
					try {
						str = JSON.parse(obj);
					} catch (err) {
						return;
					}
					if (str.process !== "create-account") {
						return;
					}

					if (str.status === "success") {
						if (typeof str.email === "string") {
							headerEvents.userCookie(str.email);
						}
						$.ajax({
			                dataType: "html",
			                url: document.location.toString(),
			                success: function(data){
			                	progress.hide();
			                	$('.headermask').removeClass('no-hide').hide();
				           		$('.header-sign-in.accountcontent').remove();
				           		$('.headercustomerinfo #user').html($(data).find('#user').html());
				           		$('#userinfo').html($(data).find('#userinfo').html());
				           		headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'),$('.congrats-message.accountcontent'));
				           		$('.congrats-message').fadeIn(400).show().delay(3000).fadeOut(400);
				           		headerEvents.initializeEvent();
			                }
			             });
					} else {
						$('.accountcontent').hide();
						progress.hide();
						$('.ExistedUser-error').show();
						$('.errormessage').hide();
						$('.ui-login').find('.header-sign-in').show();
						//$('.ui-login').find('.header-sign-in .accountemail').val(emailId);
						$('.accountcontent .guestemail').removeClass('errorclient');
						$('.accountcontent .guestemail').next('span.errorclient').remove();
						$('.ui-login').find('.header-sign-in .accountemail').addClass('click-mark valid');
						$('.headermask').addClass('no-hide').show();
						$('.custom_signup input[type="text"], .custom_signup input[type="password"]').removeClass('errorclient');
					}
				});

		 		jQuery('.create-account').unbind('click').click(function(e){
		 			e.preventDefault();
		 			var realForm = $(this).closest('form');
		 			if(!realForm.valid()) {
		 				return false;
		 			}
		 			progress.show('.header-create.accountcontent');
		 			var iframeId = 'js-header-create-account-iframe';
		 			var formId = 'js-header-create-account-form';
		 			$("#" + iframeId).remove();
		 			$("#" + formId).remove();
		 			var $form = $('<form></form>');
		 			$form.attr('id', formId);
		 			$form.attr('action', realForm.attr('action'));
		 			$form.attr('target', iframeId);
		 			$form.attr('method', 'POST');

		 			$('<iframe name="' + iframeId + '" id="' + iframeId + '" />').appendTo('body');
		 			$("#" + iframeId).attr('style', 'display: none;');

		 			realForm.find('input, select, textarea').each(function(){
		 				var $input = $(this).clone();
		 				$form.append($input);
		 			});

		 			$("body").append($form);
		 			$form.hide();
		 			$form.submit();
			  	});

		 	  	if($('#user').length > 0){firstnamesplit();}
		 	  	function firstnamesplit(){
		     	  	  var firstname = $('.loggeduser > a span.username').text();
		       	  var firstname_words = firstname.split(' ');
		       	  var textlength = 0;
		       	  var limit = 19;
		       	  var nameLength = $('.loggeduser > a span.username').text() +' '+$.trim($('.loggeduser > a .prostaff-header.badge-header').text());
		       	  if(nameLength.length <= 19){
		       		 $('.loggeduser > a span.username').text($('.loggeduser > a span.username').text() +' '+$.trim($('.loggeduser > a .prostaff-header.badge-header').text()));
			         	 $('.loggeduser > a .prostaff-header.badge-header').remove();
		       	  }else if(firstname_words.length > 0){
		       		 $('.loggeduser > a span.username').text('');
		       		 if($('.loggeduser > a span.username .first_name').length == 0){
		       			$('.loggeduser > a span.username').html('<span class="first_name"></span>');
		       		 }
		       		 if($('.headercustomerinfo .second_name').length == 0){
		       			$('.headercustomerinfo').append('<span class="second_name"></span>');
		       		 }

		       		 var fName = $('.loggeduser > a span.username span.first_name').eq(0);
			         	 var Lname = $('.headercustomerinfo > .second_name');

			         	 jQuery.each(firstname_words, function(i,v){
			         		  textlength = textlength == 0 ? textlength + v.length : textlength + v.length + 1;
			         		  if(i == 0 && v.length > limit){
			         			 fName.text(v.substr(0,16) + '...');
			         		  }else if(textlength < 20){
			         			 if(fName.text().length == 0){
			         				fName.text(v);
			         			 }else{
			         				fName.text(fName.text() +' '+ v);
			         			 }
			         		  }else{
			         			 if(Lname.text().length == 0){
			         				Lname.text(v);
			         			 }else{
			         				Lname.text(Lname.text() +' '+ v);
			         			 }
			         		  }

			         	  });
			         	 Lname.text(Lname.text() +' '+ $.trim($('.loggeduser > a .badge-mini').text()));
			         	 if($('#user .loggeduser').width() > Lname.width()){
			         		$('.loggeduser').append(Lname.clone());
			         		Lname.remove();
			         	 }
			            $('.loggeduser > a .prostaff-header.badge-header').remove();
			         	 $('.loggeduser > a .badge-mini').remove();
		       	}else{
		       		$('.loggeduser > a span.username span').hide();
		       	}
		 	  	}

		 	  	$('.accountcontent input[type="text"], .accountcontent input[type="password"]').bind('keyup', function(e){
		 	  		var keycode =  e.keyCode ? e.keyCode : e.which;
		 	  		if(!$(this).closest('.accountcontent').hasClass('js-entered')){
		 	  			$(this).closest('.accountcontent').addClass('js-entered');
		 	  		}

		 	  		if(keycode == 13){
		 	  			$(this).closest('form').find('.formactions button').trigger('click');
		 	  		}
		     	  	clearTimeout(appGlobal.globalTimer);
		     	  	appGlobal.globalTimer == 0;
		 	  	});

		 	  	$('.rapala_device .user-profile a').on('hover', function(){
		 	  		window.location.href = $(this).attr('href');
		 	  	});
		},
		/** ON HOVER */
		accountContPos: function($source,$destiny){
			var leftPos = $source.offset().left + $source.width() - $('.headercustomerinfo').offset().left - $destiny.width()/2;
			var arrowPos = ($destiny.width() - $destiny.find('.top_arrow').width())/2 - 4;
			$('.accountcontent .loading').remove();
			if($destiny.length != 0){
				$destiny.css('left', leftPos);
				$destiny.find('.top_arrow').css('left', arrowPos);
			}
			$('.accountcontent .formfield .label .errorlabel').addClass('labeltext').removeClass('errorlabel');
		},
		userCookie: function ($val){
 			var dateObj = new Date();
			dateObj.setTime(dateObj.getTime() + (365*24*60*60*1000));
			//document.cookie="emailId="+$val+"; expires="+dateObj.toUTCString()+"; path=/";
 		},
		maskEvent: function (ele){
			$(".domainswitch-header").hide();
			$(".domainswitch").hide();
			if(!$('.headermask').hasClass('no-hide')){
				clearTimeout(appGlobal.globalTimer);
				appGlobal.globalTimer == 0;
				if(ele.type != "click" && $('.rapala_device').length == 0 && ele.pageY > 60 && ele.pageY < 100){
					$('.headermask').hide();
				}
				if(ele.type == "click"){
					$('.headermask').hide();
					$('.accountcontent').hide();
					$('.headercustomerinfo').find('.js-active').removeClass('js-active');
				}else{
					clearTimeout(appGlobal.globalTimer);
					appGlobal.globalTimer == 0;
					if($('.accountcontent:visible').hasClass('js-entered')){
						appGlobal.globalTimer = setTimeout(function(){
							$('.accountcontent').hide();
							$('.headermask').hide();
						}, 5000);
					}else{
						$('.accountcontent').hide();
						$('.headermask').hide();
					}
				}
			}
		}
}
var headerinit = {
	init: function() {
		headerEvents.initializeEvent();
	}
}

module.exports = headerinit;
},{"./dialog":10,"./progress":39,"./uievents":47}],15:[function(require,module,exports){
'use strict';
// jQuery extensions

module.exports = function() {
    // params
    // toggleClass - required
    // triggerSelector - optional. the selector for the element that triggers the event handler. defaults to the child elements of the list.
    // eventName - optional. defaults to 'click'
    $.fn.toggledList = function (options) {
        if (!options.toggleClass) { return this; }
        var list = this;
        return list.on(options.eventName || 'click', options.triggerSelector || list.children(), function (e) {
            e.preventDefault();
            var classTarget = options.triggerSelector ? $(this).parent() : $(this);
            classTarget.toggleClass(options.toggleClass);
            // execute callback if exists
            if (options.callback) {
                options.callback();
            }
        });
    };

    $.fn.syncHeight = function () {
        var arr = $.makeArray(this);
        arr.sort(function (a, b) {
            return $(a).height() - $(b).height();
        });
        return this.height($(arr[arr.length - 1]).height());
    };
};

},{}],16:[function(require,module,exports){

var $main = $("#main"),
	$footer = $("#footernew");
	$banner = $(".banner_prostaff");

var megamenu = {
	globalTimer: 0,
    init: function () {
    	megamenu.megamenuEvent();
    },
    open: function() {

    	var $width = $("#brand-tabs-header").width();
    	// To make default menu based on the brand active
	    $("#brand-tabs-header > ul > li.active .mobile-main-menu-heading").trigger("click");
		$('#container').addClass("js-container-active");
		$(".menu-toggle").addClass("js-menu-toggle");
		$(".menu-open-shadow").remove();
		$main.wrap("<div class='open-menu-wrap'></div>");
		$("body").addClass("js-body");
		$(".open-menu-wrap").prepend($banner);
		$(".open-menu-wrap").append($footer).prepend("<a href='javascript:void(0);' class='menu-open-shadow'></a>");
		//$("#main, #footernew").prepend("<div class='menu-open-shadow'></div>")
		$('#container, .open-menu-wrap').animate({marginLeft: "280px"},300);
		$("#brand-tabs-header").wrap("<div class='brand-active'></div>");
		$(".brand-active").animate({left: "0"},300);
		$(".banner_prostaff").animate({left: "280px"},300);
		$('.owl-carousel').find(".owl-item, .owl-item img").trigger("mouseenter");
    },
    close: function() {
    	$('#container, .open-menu-wrap').animate({marginLeft: "0"},300);
    	$(".banner_prostaff").animate({left: "0"},300);
    	$('#container').removeClass("js-container-active");
    	$("body").removeClass("js-body");
		$('.owl-carousel').find(".owl-item, .owl-item img").trigger("mouseout");
		$("#main, #footernew").unwrap();
		$('.magnifier-icon').removeClass("js-magnifier-icon-active");
		$(".menu-toggle").removeClass("js-menu-toggle");
		$("#brand-tabs-header").unwrap();
		setTimeout(function(){
			$(window).scrollTop(0);
		},300);

    },
    megamenuEvent: function($con){
		if($con == null){
			$con = $('#brand-tabs-header > ul > li .megamenudrop');
		}
		$con.each(function(){
			var maxlength = 24;
			var $mega = $(this);
			var textlinklength = $(this).find('> a').length;
			var divlength = 4;
			if($(this).attr('id') == 'rapala'){divlength = 6;}
			else if($(this).attr('id') == 'vmc'){divlength = 6;}
			else if($(this).attr('id') == 'luhrjensen'){divlength = 4;}
			else if($(this).attr('id') == 'sufix'){divlength = 6;}
			else if($(this).attr('id') == 'storm'){divlength = 4;}
			else if($(this).attr('id') == 'triggerx'){divlength = 4;}
			else if($(this).attr('id') == 'bluefox'){divlength = 4;}
			else if($(this).attr('id') == 'terminator'){divlength = 4;}
			else if($(this).attr('id') == 'williamson'){divlength = 4;}
			else if($(this).attr('id') == 'strikemaster'){divlength = 6;}
			else if($(this).attr('id') == 'marcum'){divlength = 6;}
			else if($(this).attr('id') == 'otter'){divlength = 6;}
			else if($(this).attr('id') == 'iceforce'){divlength = 4;}
			var intial = 0;
			var end = maxlength;
			var datalist = "";
			var brandlist = $(this).find('.brand-assets').clone();
			var containerwidth = $('.megamenu-drop .wrapper').width()/divlength + 'px';
			var lasttext = "";
			var prev = "";
			var next = "";
			$mega.find('.brand-assets').remove();

			for(var i=1; i<= divlength; i++){
				$mega.append('<div class="menulist menulist-'+ i +'" style="width:'+ containerwidth +'"></div>');
				$mega.find('.mega_subcategory').each(function(){
					if($(this).find('a.level-1').eq(0).hasClass('column-'+i)){
					datalist = $(this).html();
					$mega.find(".menulist-"+i).append(datalist);
					}
				});
				if(i == divlength){
					$mega.find(".menulist-"+i).append(brandlist);
				}
			}

			$mega.find('.menulist').each(function($i){
				$i = $i + 1;
				if($(this).find('> a').length > maxlength){
					end = $(this).find('> a').length;
					if(end > maxlength){
						datalist = $(this).find('> a').slice(maxlength, end).clone();
						if($mega.find(".menulist-"+($i+1)).length != 0){
							$mega.find(".menulist-"+($i+1)).prepend(datalist);
						}
					}
				}
				if($i != 1){
					if($mega.find(".menulist-"+$i+"> a").eq(0).hasClass('level-2')){
						prev = $i - 1;
						lasttext = $mega.find(".menulist-"+ prev +"> a.level-1").last().attr('hreflang');
						$mega.find(".menulist-"+$i).prepend('<div class="level-continue">'+ lasttext +', Continued</div>');
					}
				}
				$(this).find('> a').slice(maxlength, end).remove();
			});
			$mega.find('.mega_subcategory').remove();
		});
		/* Click event for brands to see sub menus in mobile */
		$('#brand-tabs-header > ul > li .mobile-main-menu-heading').on("click",function(e){
			if($(window).width() <= 959){
				e.preventDefault();
				var $this = $(this).closest("li");
				$this.closest("ul").addClass("hide-after");
				$this.siblings("li").removeClass("js-sub-menu-active").addClass("js-sub-menu-inactive");
				$this.removeClass("js-sub-menu-inactive").addClass("js-sub-menu-active");
				$this.find(".megamenu-drop").animate({ "left": [0, 'easeOutExpo'] });
				$this.find(".shop-rapala").each(function(){
					$curObj = $(this);
					if(!$curObj.closest(".sub-category-section-1").hasClass("js-active-sub-menu")) {
						$curObj.next(".sub-cat-drop-down").trigger("click");
					}
				});
				$this.find('.menulist .sub-category-section-1 > a').each(function($i){
					var menuList = $(this).closest(".menulist");
					var mainContent = $(this).closest(".sub-category-section-1");
					$(mainContent).find(".sub-cat-drop-down").removeAttr("style");
					var achorWidth = $(this).width();
					var dropDownWisth = $(menuList).width() - achorWidth;
					dropDownWisth = dropDownWisth - 70;
					if (dropDownWisth > 17 ) {
						$(mainContent).find(".sub-cat-drop-down").width(dropDownWisth);
					}
				});

			}
			else if($(window).width() > 959 && $(window).width() < 1025){
				var deviceAgent = navigator.userAgent.toLowerCase(),
				deviceType = deviceAgent.match(/(iphone|ipod|ipad|android|blackBerry)/);
				if(deviceType[0] == "iphone" || deviceType[0] == "ipad"){
					/*$(".mobile-main-menu-heading > a").removeClass("selected");
					if(!$(this).hasClass('selected')) {
						e.preventDefault();
						megamenu.megamenuEvent();
						$(this).addClass('selected');
						return false;
					}
					else {
						return true;
					}*/
				}
			}
		});
		/* Click event for to see all the brands in mobile */
		$("body").off("click",".see-all-brands").on("click",".see-all-brands",function(e){
			var $width = $("#brand-tabs-header").width();
			if($(window).width() <= 959){
				e.preventDefault();
				var $width = $("#brand-tabs-header").width();
				var $this = $(this).closest("li");
				$this.find(".megamenu-drop").animate({ "left": [$width, 'easeOutExpo'] });
				$this.siblings("li").removeClass("js-sub-menu-inactive");
				$this.closest("ul").removeClass("hide-after");
				setTimeout(function(){
					if($this.find(".megamenu-drop").position().left == $width) {

						$this.removeClass("js-sub-menu-active");
					}
				},400);
			}
		});

		/* Click event for sub menu drop down in mobile */
		$("body").off("click",".sub-category-section-1 .sub-cat-drop-down").on("click",".sub-category-section-1 .sub-cat-drop-down",function(e){
			if($(window).width() <= 959){
				if(!$(this).hasClass("no-click")) {
					e.preventDefault();
					var $this = $(this).closest(".sub-category-section-1");
					if(!$this.hasClass("js-active-sub-menu")) {
						$this.addClass("js-active-sub-menu");
						$this.find(".sub-category-section-2").removeAttr("style");
						$this.find(".sub-category-section-2").slideDown();
					}
					else {
						$this.find(".sub-category-section-2").slideUp();
						$this.delay(1000).removeClass("js-active-sub-menu");
					}
				}

			}
		});
	    // main menu toggle
	    $('body').off('click','.menu-toggle').on('click','.menu-toggle', function (e) {
	    	e.preventDefault();
	    	if($(window).width() <= 959){
	    		if( !$('#container').hasClass("js-container-active")) {
	    			megamenu.open();
	    		}else {
	    			megamenu.close();
	    		}
	    	}
	    });
	    $('body').off('touchstart click','a.menu-open-shadow').on('touchstart click','a.menu-open-shadow', function (e) {
	    	e.preventDefault();
	    	if($(window).width() <= 959){
	    		if( !$('#container').hasClass("js-container-active")) {
	    			megamenu.open();
	    		}else {
	    			megamenu.close();
	    		}
	    	}
	    });
	    $('body').off('click',"a.magnifier-icon").on('click',"a.magnifier-icon", function (e) {
	    	e.preventDefault();
	    	if($(window).width() <= 959){
	    		var $width = $("#brand-tabs-header").width();
	    		if( !$('#container').hasClass("js-container-active")) {
	    			$('.magnifier-icon').addClass("js-magnifier-icon-active");
	    			megamenu.open();
	    			if( $('.magnifier-icon').hasClass("js-magnifier-icon-active") ){
	    				$('#container').find(".simplesearchinput").focus();
	    			}
	    		}
	    	}
	    });

	    // Mega menu events for window width greater than 959
		$('#brand-tabs-header > ul > li').mouseenter(function(e){
			var $id = $(this).find(".mobile-main-menu-heading > a").attr('class');
			var $this = $(this);

			if($(window).width() > 959){
				$('.owl-carousel').find(".owl-item, .owl-item img").trigger("mouseenter");
				$this.siblings("li").find('.megamenudrop, .megamenu-drop').hide();
				$('.accountcontent').hide();
				clearTimeout(megamenu.globalTimer);
				megamenu.globalTimer == 0;
				$('#brand-tabs-header li').removeClass('current');
				if($this.find('.megamenudrop').find('a').length != 0){
					$this.find('.megamenudrop').show();
					$this.find('.megamenu-drop').show();
				//$('.megamenudrop[id="'+ $id +'"]').closest('.mega-menu').find('.mask').css('left',$(this).offset().left);
				//$('.megamenudrop[id="'+ $id +'"]').closest('.mega-menu').find('.mask').attr('href',$(this).find('a').attr('href'));
				}
				var containerwidth = $('.megamenu-drop .wrapper').width()/$('#'+$id+' .menulist').length;
				containerwidth = containerwidth - 21;
				$('#'+$id+' .menulist').removeAttr('style');
				$('#'+$id+' .menulist').width(containerwidth);
				megamenu.syncheight($('#'+$id+'.megamenudrop .menulist'));

				$(this).addClass('current');
				if(!$(this).hasClass('active')){
					$('#brand-tabs-header li.active').addClass('inactive');
				}else{
					$(this).removeClass('inactive');
				}
				$('.brand-tabs-header-mask').show();
			}
		}).mouseleave(function(){

			if($(window).width() > 959){
				$('.owl-carousel').find(".owl-item, .owl-item img").trigger("mouseout");
				/*var deviceAgent = navigator.userAgent.toLowerCase(),
				deviceType = deviceAgent.match(/(iphone|ipod|ipad|android|blackBerry)/);
				if(deviceType[0] == "iphone" || deviceType[0] == "ipad"){
					var $this = $(this);
					$this.find(".mobile-main-menu-heading > a").removeClass('selected');
				}*/
			}
		});

		/** single click redirecting of megamenu categories*/
		/*$('.rapala_device .menulist a').mouseenter(function(){
			window.location.href = $(this).attr('href');
		});*/
		$('#brand-tabs-header').mouseleave(function(){
			if($(window).width() > 959){
				$('.megamenu-drop').hide();
				$('.megamenudrop').hide();
				$('#brand-tabs-header > ul > li.active').removeClass('inactive');
				$('#brand-tabs-header > ul > li').removeClass('current');
			}
		});

		$(".brand-tabs-header-mask").mouseenter(function(){
			if($(window).width() > 959){
				$('.megamenu-drop').hide();
				$('.megamenudrop').hide();
				$('#brand-tabs-header > ul > li.active').removeClass('inactive');
				$('#brand-tabs-header > ul > li').removeClass('current');
				$(this).hide();
			}
		});

		/*$(".rapala_device #brand-tabs-header a").click(function(e){
			e.preventDefault();
			if($(this).hasClass('selected')){
				$(this).removeClass('selected');
				window.location.href = $(this).attr('href');
			}else{
				$(this).closest("li").siblings().find("a").removeClass('selected');
				$(this).addClass('selected');
			}
		});*/
    },
    syncheight: function ($sel) {
    	var current = 0;
		if($($sel).hasClass('menulist')){
			$sel.each(function () {
				if($(this).height() > current) {
					current = $(this).height();
				}
			});
		}else{
			$sel.each(function () {
				if($(this).height() > current) {
					current = $(this).height();
				}
			});
		}
		$sel.height(current);
    }
}

module.exports = megamenu;
},{}],17:[function(require,module,exports){
'use strict';

var util = require('./util'),
    bonusProductsView = require('./bonus-products-view');

var timer = {
    id: null,
    clear: function () {
        if (this.id) {
            window.clearTimeout(this.id);
            delete this.id;
        }
    },
    start: function (duration, callback) {
        this.id = setTimeout(callback, duration);
    }
};

var minicart = {
	url: util.ajaxUrl(Urls.addProduct),
    init: function () {
    	minicart.reset();
    	$('.checkoutminicart').slimscroll();
        this.$el = $('#minicart');
        this.$content = this.$el.find('.minicartcontent');
        jQuery(".minicarticon-cont").on('mouseover touchstart', function (e) {
            (minicart.isShow() ? true : minicart.hoverSlide());
            $('.Custom-tooltip, .cvc_tooltip, .ordergothrough_tooltip').each(function(){
            	if($('.rapala_device').length == 1){
            		jQuery(this).tooltipster({
    					content: jQuery(this).find('.tooltipcontainer').html(),
    					contentAsHTML: true,
    					maxWidth: 300,
    					touchDevices: true,
    					trigger: 'click'
    				});
            	}else{
            		jQuery(this).tooltipster({
    					content: jQuery(this).find('.tooltipcontainer').html(),
    					contentAsHTML: true,
    					maxWidth: 300,
    					touchDevices: true
    				});
            	}
			});

        });
        // register close button event
        $('.minicartcontent .minicartclose').click(function () {
            // reset all the events bindings
            minicart.reset();
            minicart.close(0);
            $('.rapala_device .minicart-button').removeClass('clicked');
        });
        $('.minicartcontent').click(function (e) {
            clearTimeout(minicart.timer);
            minicart.timer = null;
        });
        $('.minicart').mouseenter(function(){
        	minicart.setminicarheight();
        	 clearTimeout(minicart.timer);
             minicart.timer = null;
                 if($(".minicartcontent").is(':animated')) {
  		         $(".minicartcontent").stop();
  		         $(".minicartcontent").css({"opacity":'1','height':'auto'})
  		         minicart.init();
             }
        }).mouseleave(function () {
        	 $('.rapala_device .minicart-button').removeClass('clicked');
            clearTimeout(minicart.timer);
            minicart.timer = null;
            // after a time out automatically close it
            minicart.timer = setTimeout(
                'minicart.close()', 30);
            	minicart.close();
        });

        if($('.mini-cart-product').length > 1) {
        	$('.minicartcontent').removeClass('lessone');
        	$('.minicartcontent .slimScrollDiv').removeClass('less');
        }
        else {
        	$('.minicartcontent').addClass('lessone');
        	$('.minicartcontent .slimScrollDiv').addClass('less');
        }


    },


    // returns a boolean if a minicart is visible/shown or hidden
    isShow: function () {
        return jQuery('.minicartcontent').css('display') == 'none' ? false : true;
    },

    // reset minicart
    reset: function () {
        jQuery(".minicarticon-cont").unbind("hover");
        jQuery('.minicart').unbind("mouseenter").unbind(
            "mouseleave");
    },

    enablehovereffect : function(){
   	 jQuery(".minicarttotal").mouseenter(function(){
   		 minicart.setminicarheight();
   		 //clearTimeout(minicart.timer);
            //minicart.timer = null;
   		 	timer.clear();
            if($(".minicartcontent").is(':animated')) {
		         $(".minicartcontent").stop();
		         $(".minicartcontent").css({"opacity":'1','height':'auto'})
		         minicart.init();
            }

   	 });
   	 jQuery(".minicarttotal").mouseleave(function(){
   		 jQuery(".minicartcontent").fadeOut(1000);
   		 $('.rapala_device .minicart-button').removeClass('clicked');

   	 });

   },
    /**
     * @function
     * @description Shows the given content in the mini cart
     * @param {String} A HTML string with the content which will be shown
     */
   // shows the given content in the mini cart
   show: function (html) {
       jQuery('#minicart').html(html);
       // bind all the events
       minicart.init();
      if(minicart.suppressSlideDown && minicart.suppressSlideDown()) {
           // do nothing
           // the hook 'MiniCart.suppressSlideDown()' should have done
           // the refresh
       }
       else {
           minicart.slide();
       }
   },
    setminicarheight: function (){
    	var scrollheight = $(".mini-cart-product:eq(0)").height();
        if($('.mini-cart-product').length > 1){
        	var scrollheight2 = $(".mini-cart-product:eq(1)").height();
        	var avgheight = (scrollheight+scrollheight2)/2;
        	var newscrollheight=((avgheight)+(avgheight-(avgheight/4))) + 20;

        	$('.slimScrollDiv').css('height',newscrollheight + "px");
        	$('.checkoutminicart').css('height',newscrollheight + "px");
        }
        else{
        	var heightImg = $('.minibrandcolumn').find('a').height();
        	var heightImg1 = $('.minibrandcolumn').find('img').height();


        	while(scrollheight < heightImg + heightImg1) {
        		heightImg = $('.minibrandcolumn').find('a').height();
        		scrollheight = $( ".tr_rotation" ).height();
        		$('.slimScrollDiv').css('height',scrollheight + "px");

        		var scrollheight1 = $( ".checkoutminicart" ).height();
            	if(scrollheight1 > scrollheight) {
            		$('.checkoutminicart').css('height',scrollheight1 + "px");
            	} else {
            		$('.checkoutminicart').css('height',scrollheight + "px");
            	}
        	}
        }
    },
 // hook which can be replaced by individual pages/page types (e.g.
    // cart)
    suppressSlideDown: function () {
        return false;
    },
    /**
     * @function
     * @description Slides down and show the contents of the mini cart
     */
    slide: function () {
        timer.clear();
        // show the item
        this.$content.slideDown('slow');
        // after a time out automatically close it
        timer.start(6000, this.close.bind(this));

       if(minicart.suppressSlideDown && minicart.suppressSlideDown()) {
            return;
        }
        // register close button event
        jQuery('.minicartcontent .minicartclose').click(function () {
            // reset all the events bindings
            minicart.reset();
            minicart.close(0);
            $('.rapala_device .minicart-button').removeClass('clicked');
        });

      //Removing padding from the banner if it doesnot contains data/image
	  	if($('.slot_banner').find('img').length==0){
	  		$('.slot_banner').css('padding','0 0 0px 0');
	  	}

        // register the mouseout events
        jQuery('.minicartcontent').mouseenter(function (e) {
        	minicart.setminicarheight();
            clearTimeout(minicart.timer);
            minicart.timer = null;
            if($(this).is(':animated')) {
		         $(this).stop();
		         $(this).css({"opacity":'1','height':'auto'});
		         minicart.init();
            }
        });
         $('.minicart').mouseleave(function (){
        	 $('.rapala_device .minicart-button').removeClass('clicked');
                clearTimeout(minicart.timer);
                minicart.timer = null;
                // after a time out automatically close it
                minicart.timer = setTimeout(
                    'minicart.close()', 30);
                minicart.init();
                minicart.close();
            });

        // show the item
        jQuery('.minicartcontent').slideDown('2000', function(){
        	 minicart.setminicarheight();
        });
        // show("slide",
        // { direction:
        // "up" },
        // 1000);

        // add the open class to the total
        jQuery('.minicart .minicarttotal').addClass('open');

        jQuery('.summaryproduct').each(
            function () {
                var $this = jQuery(this);
               if($this.find(".imageexpanded").is(":visible")) {
                    $this.find(".hideoncollapse").hide().end()
                        .find(".attribute").addClass(
                            "collapsed");
                    var height = $(this).find('.attributes')
                        .height();
                    height += $(this).find('.name').height();
                    jQuery(this).find('.image').css({
                        'min-height': height
                    }) + 30;
                }
               if($this.find(".imagecollapsed").is(":visible")) {
                    var height = $(this).find('.attributes')
                        .height();
                    height += $(this).find('.name').height() + 30;
                    jQuery(this).find('.image').css({
                        'min-height': height
                    });
                }
            });

        clearTimeout(minicart.timer);
        minicart.timer = null;

        // after a time out automatically close it
        minicart.timer = setTimeout('minicart.close()', 1000);

        // Google Analytics code to track mini cart open.
        if (isEventTrackingEnabled && isGoogleAnalyticsEnabled) {
            googleAnalyticsEvents.miniCart();
        }

    },
    hoverSlide: function () {
        if(minicart.suppressSlideDown && minicart.suppressSlideDown()) {
             return;
         }
         // register close button event
         jQuery('.minicartcontent .minicartclose').click(function () {
             // reset all the events bindings
             minicart.reset();
             minicart.close(0);
             $('.rapala_device .minicart-button').removeClass('clicked');
         });

       //Removing padding from the banner if it doesnot contains data/image
 	  	if($('.slot_banner').find('img').length==0){
 	  		$('.slot_banner').css('padding','0 0 0px 0');
 	  	}

         // register the mouseout events
         jQuery('.minicartcontent').mouseenter(function (e) {
         	minicart.setminicarheight();
             clearTimeout(minicart.timer);
             minicart.timer = null;
             if($(this).is(':animated')) {
		         $(this).stop();
		         $(this).css({"opacity":'1','height':'auto'});
		         minicart.init();
             }
         });
          $('.minicart').mouseleave(function (e){
         	 $('.rapala_device .minicart-button').removeClass('clicked');
                 clearTimeout(minicart.timer);
                 minicart.timer = null;
                 // after a time out automatically close it
                 minicart.timer = setTimeout(
                     'minicart.close()', 30);
                 minicart.close();
             });

         // show the item
         jQuery('.minicartcontent').slideDown('2000', function(){
         	 minicart.setminicarheight();
         });
         // show("slide",
         // { direction:
         // "up" },
         // 1000);

         // add the open class to the total
         jQuery('.minicart .minicarttotal').addClass('open');

         jQuery('.summaryproduct').each(
             function () {
                 var $this = jQuery(this);
                if($this.find(".imageexpanded").is(":visible")) {
                     $this.find(".hideoncollapse").hide().end()
                         .find(".attribute").addClass(
                             "collapsed");
                     var height = $(this).find('.attributes')
                         .height();
                     height += $(this).find('.name').height();
                     jQuery(this).find('.image').css({
                         'min-height': height
                     }) + 30;
                 }
                if($this.find(".imagecollapsed").is(":visible")) {
                     var height = $(this).find('.attributes')
                         .height();
                     height += $(this).find('.name').height() + 30;
                     jQuery(this).find('.image').css({
                         'min-height': height
                     });
                 }
             });


         // Google Analytics code to track mini cart open.
         if (isEventTrackingEnabled && isGoogleAnalyticsEnabled) {
             googleAnalyticsEvents.miniCart();
         }

         jQuery(".minicarttotal").addClass("enablehover");
         minicart.enablehovereffect();

         $('#main , #header , #footernew, #footernew .row').unbind('touchstart').bind('touchstart',function(e){
         	if($(".minicartcontent").is(":visible")) {
         		var currentLinkLength = $(e.target).closest('.minicartcontent').length;
         		var minicarttotal = $(e.target).closest('.minicart-button').length;
         		if (currentLinkLength === 0 && minicarttotal === 0) {
         			clearTimeout(minicart.timer);
                     minicart.timer = null;
                     // after a time out automatically close it
                     minicart.timer = setTimeout(
                         'minicart.close()', 30);
                     minicart.reset();
                     minicart.close();
                     minicart.init();
                     $('.rapala_device .minicart-button').removeClass('clicked');
         		}
         		else if (minicarttotal > 0 && cartPageLength == 0) {

         			$('.rapala_device .minicart-button').trigger('click');
         		}
         	}

         });
     },
     // adds a product to the mini cart
     // @params
     // progressImageSrc - source/url of the image to show when the item
     // is being added to the cart
     // postdata - form data containing the product information to be
     // added to mini-cart
     // callback - call back function/handler
     add: function (progressImageSrc, postdata, callback) {
         // get the data of the form as serialized string
         var postdata = postdata;

         // get button reference
         var addButtons = [];

         // the button to update
         var addButton = null;

         // it is an array of buttons, but we need only one all
         // other combinations are strange so far
        if(addButtons.length == 1) {
             addButton = addButtons[0];
         }

         var previousImageSrc = null;

         // show progress indicator
        if(addButton != null) {
             previousImageSrc = addButton.src;
             addButton.src = progressImageSrc;
         }

         // handles successful add to cart
         var handlerFunc = function (req) {
             // hide progress indicator
            if(addButton != null) {
                 addButton.src = previousImageSrc;
             }

             // replace the content
             jQuery('#minicart').html(req);

             // bind all the events
             minicart.init();
             if($('.mini-cart-product').length > 1 ){
                   $('.checkoutminicart').slimscroll({
			  			railVisible: true,
			  		    alwaysVisible: true
			  		});
             	$('.minicarttable').find('thead').first().addClass('theadfixedTop');
             	$('.checkoutminicart').find('.cartordertotals').removeClass('carttotals');
     	  		$('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
     	  		$('.minicartcontent').find('.minicarttableheader').removeClass('miniwithoutScrollhead');
     	  		$(".minicarttableheader").css('border-bottom','1px solid #ccc');

     	  	}
     	  	else {
     	  		$('.minicarttable').find('.theadfixedTop').removeClass('theadfixedTop');
     	  		$('.minicarttable').find('.fixedTop').removeClass('fixedTop');
     	  		$('.minicart').find('.cartordertotals').addClass('carttotals');
     	  		$('.checkoutminicart').find('.minicarttable').addClass('miniwithoutScroll');
     	  		$('.minicartcontent').find('.minicarttableheader').addClass('miniwithoutScrollhead');
     	  		$(".minicarttableheader").css('border-bottom','1px solid #ccc');
             }
             $(".minicarttable .mini-cart-product:last-child").find('.mini-cart-product').css('border','0px');

             if($('body').hasClass('rapala_device')){
             	$(".checkoutminicart").find(".minicarttable").removeClass("miniwithoutScroll");
             	// $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','1px');
             	 $('.minicarttable').find('thead').first().addClass('theadfixedTop');
             	 $(".minicarttable .mini-cart-product:last-child").find('.mini-cart-product').css('border','0px');
             	 $(".minicarttableheader").css('border-bottom','1px solid #ccc');
             }


            if(minicart.suppressSlideDown && minicart.suppressSlideDown()) {
                 // do nothing
                 // the hook 'MiniCart.suppressSlideDown()' should have
                 // done the refresh
             }
             else {
                 minicart.slide();
                 minicart.setminicarheight();
                if(callback)
                     callback();
             }
             $("#pdpMain .addtocartconfirm-tooltip").fadeIn(400).show()
                 .delay(1500).fadeOut(400);
             // fire the BonusDiscountLineItemCheck event so we can check
             // if there is a bonus discount line item
             jQuery(document).trigger(
                 jQuery.Event("BonusDiscountLineItemCheck"));
         }

         // handles add to cart error
         var errFunc = function (req) {
             // hide progress indicator
            if(addButton != null) {
                 addButton.src = previousImageSrc;
             }
         }

         // closes a previous mini cart
         minicart.close();

         // add the product
         jQuery.ajax({
             type: "POST",
             url: minicart.url,
             cache: true,
             data: postdata,
             success: handlerFunc,
             error: errFunc
         });
     },

     // closes the mini cart with given delay
     close: function (delay) {
        if(minicart.timer != null || delay == 0) {
             clearTimeout(minicart.timer);
             minicart.timer = null;
             jQuery('.minicartcontent').fadeOut(1000);
             // hide with "slide" causes to fire mouse enter/leave events
             // sometimes infinitely thus changed it to fadeOut
             // add the open class to the total
             jQuery('.minicart .minicarttotal').removeClass('open');
             jQuery('.minicartcontent .minicartclose').unbind("click");
         }
     }
};

module.exports = minicart;

},{"./bonus-products-view":4,"./util":48}],18:[function(require,module,exports){
'use strict';

var util = require('./util');

var page = {
    title: '',
    type: '',
    params: util.getQueryStringParams(window.location.search.substr(1)),
    redirect: function (newURL) {
        setTimeout(function () {
            window.location.href = newURL;
        }, 0);
    },
    refresh: function () {
        setTimeout(function () {
            window.location.assign(window.location.href);
        }, 500);
    }
};

module.exports = page;

},{"./util":48}],19:[function(require,module,exports){
'use strict';

var giftcert = require('../giftcert'),
    tooltip = require('../tooltip'),
    util = require('../util'),
    dialog = require('../dialog'),
    page = require('../page'),
    validator = require('../validator');

/**
 * @function
 * @description Initializes the events on the address form (apply, cancel, delete)
 * @param {Element} form The form which will be initialized
 */
function initializeAddressForm() {
    var $form = $('#edit-address-form');

    $form.find('input[name="format"]').remove();
    tooltip.init();
    //$("<input/>").attr({type:"hidden", name:"format", value:"ajax"}).appendTo(form);

    $form.on('click', '.apply-button', function (e) {
        e.preventDefault();
        if (!$form.valid()) {
            return false;
        }
        var url = util.appendParamToURL($form.attr('action'), 'format', 'ajax');
        var applyName = $form.find('.apply-button').attr('name');
        var options = {
            url: url,
            data: $form.serialize() + '&' + applyName + '=x',
            type: 'POST'
        };
        $.ajax(options).done(function (data) {
            if (typeof(data) !== 'string') {
                if (data.success) {
                    dialog.close();
                    page.refresh();
                } else {
                    window.alert(data.message);
                    return false;
                }
            } else {
                $('#dialog-container').html(data);
                account.init();
                tooltip.init();
            }
        });
    })
    .on('click', '.cancel-button, .close-button', function (e) {
        e.preventDefault();
        dialog.close();
    })
    .on('click', '.delete-button', function (e) {
        e.preventDefault();
        if (window.confirm(String.format(Resources.CONFIRM_DELETE, Resources.TITLE_ADDRESS))) {
            var url = util.appendParamsToUrl(Urls.deleteAddress, {
                AddressID: $form.find('#addressid').val(),
                format: 'ajax'
            });
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json'
            }).done(function (data) {
                if (data.status.toLowerCase() === 'ok') {
                    dialog.close();
                    page.refresh();
                } else if (data.message.length > 0) {
                    window.alert(data.message);
                    return false;
                } else {
                    dialog.close();
                    page.refresh();
                }
            });
        }
    });
    if($('.logerror:visible').length > 0){
  		$('.account-logs .returningcustomers').find('.accountemail').addClass('errorclient');
  		$('.account-logs .logincustomers .login_password').addClass('errorclient');
  		//$(".pt_account .wrapper .account-section .returningcustomers .value ").css("margin-bottom", "0");
  	}
    $(".registration-button").click(function () {
  		var maskheight= $('.createan-account .formsubmit').parent('div').outerHeight();
  		var realForm = jQuery(this).closest('form');
	  		if(!realForm.valid()){
	  			$(this).closest(".form-row").addClass("inputlabel");
	  			realForm.find('.max-length-error').each(function(){
	  				if($(this).closest('.value').find('input').val().length > 0){
	  				realForm.find('.max-length-error').remove();
	  				}
	  			});
	  			return false;
	  		}
	  		else{
	  			$('.registration-button span.loadImage').css('display',"block");
   	  		$(".createan-account .formsubmit").css({"height":maskheight + "px", "display":"block"});

	  		}
    });
    if($('.existing_register:visible').length > 0) {
  		$('.createan-account .registration').find('.accountemail').addClass('errorclient');
  		$('.createan-account .registration').find('.formfield_email').find('.labeltext').addClass('inputlabel');
  		$('.createan-account .registration').find('.formfield_email').find('.requiredindicator').addClass('inputlabel');
	  		if($('.registration').find("input.required").val().length > 0) {
				$('.registration').find('.clearbutton').show();
			}
  	}
    if($('.account-email.err.log_error:visible').length > 0) {
    	$('.returningcustomers').find('.formfield_email').find('.labeltext').addClass('inputlabel');
    	$('.returningcustomers').find('.formfield_email').find('.requiredindicator').addClass('inputlabel');
    }
    $(".signinbtn").click(function () {
  		var maskheight= $('.account-logs .formsubmit').parent('div').outerHeight();
  		var maskheightwishlist= $('.wish-logs .formsubmit').parent('div').outerHeight();
  		var realForm = jQuery(this).closest('form');
	  		if(!realForm.valid()){
	  			return false;
	  		}
	  		else{
	  		//$(this).closest('.formactions').addClass('loadImage');
	  		$('.signinbtn span.loadImage').css('display',"block");
	  		$(".account-logs .formsubmit").css({"height":maskheight + "px", "display":"block"});
	  		$(this).closest(".wish-logs").find('.formsubmit').css({"height":maskheightwishlist + "px", "display":"block"});
	  		}
    });
  	if( $('.ui-login .header-forgot-pwd').length > 0){
	  	$(this).find("input.required").bind('keydown keyup focusin focusout keypress', function(e) {
			//e.stopPropagation();
			$(this).closest(".value").find('errorclient').remove();

		});
		$(".ui-login header-forgot-pwd").find("input.required").bind('focusin', function(e) {
			$(this).closest(".value").find('errorclient').remove();
		});
  	}
	$(".sample-section").click(function(){
	  if(!$(this).find('.sample_mail_main').is(':visible')){
		$(this).find('.sample_mail_main').slideDown(500);
		  }
	});
    validator.init();
}
/**
 * @private
 * @function
 * @description Toggles the list of Orders
 */
function toggleFullOrder() {
    $('.order-items')
        .find('li.hidden:first')
        .prev('li')
        .append('<a class="toggle">View All</a>')
        .children('.toggle')
        .click(function () {
            $(this).parent().siblings('li.hidden').show();
            $(this).remove();
        });
}
/**
 * @private
 * @function
 * @description Binds the events on the address form (edit, create, delete)
 */
function initAddressEvents() {
    var addresses = $('#addresses');
    if (addresses.length === 0) {
        return;
    }

    addresses.on('click', '.address-edit, .address-create', function (e) {
        e.preventDefault();
        dialog.open({
            url: this.href,
            options: {
            	dialogClass:"addressadd",
                open: initializeAddressForm
            }
        });
    }).on('click', '.delete', function (e) {
        e.preventDefault();
        if (window.confirm(String.format(Resources.CONFIRM_DELETE, Resources.TITLE_ADDRESS))) {
            $.ajax({
                url: util.appendParamToURL($(this).attr('href'), 'format', 'ajax'),
                dataType: 'json'
            }).done(function (data) {
                if (data.status.toLowerCase() === 'ok') {
                    page.redirect(Urls.addressesList);
                } else if (data.message.length > 0) {
                    window.alert(data.message);
                } else {
                    page.refresh();
                }
            });
        }
    });
}
/**
 * @private
 * @function
 * @description Binds the events of the payment methods list (delete card)
 */
function initPaymentEvents() {
    $('.add-card').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            //PREVAIL-Added  to handle validation issues
            url: $(e.target).attr('href'),
            options: {
            	dialogClass:"payment-settings",
                open: initializePaymentForm
            }
        });
    });

    var paymentList = $('.payment-list');
    if (paymentList.length === 0) {
        return;
    }

    util.setDeleteConfirmation(paymentList, String.format(Resources.CONFIRM_DELETE, Resources.TITLE_CREDITCARD));

    $('form[name="payment-remove"]').on('submit', function (e) {
        e.preventDefault();
        // override form submission in order to prevent refresh issues
        var button = $(this).find('.delete');
        $('<input/>').attr({
            type: 'hidden',
            name: button.attr('name'),
            value: button.attr('value') || 'delete card'
        }).appendTo($(this));
        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: data
        })
        .done(function () {
            page.redirect(Urls.paymentsList);
        });
    });
}
function initializePaymentForm() {

	$('#CreditCardForm').on('click', '.cancel-button', function (e) {
      e.preventDefault();
      dialog.close();
	});

}
/**
 * @private
 * @function
 * @description init events for the loginPage
 */
function initLoginPage() {
    //o-auth binding for which icon is clicked
    $('.oAuthIcon').bind('click', function () {
        $('#OAuthProvider').val(this.id);
    });

    //toggle the value of the rememberme checkbox
    $('#dwfrm_login_rememberme').bind('change', function () {
        if ($('#dwfrm_login_rememberme').attr('checked')) {
            $('#rememberme').val('true');
        } else {
            $('#rememberme').val('false');
        }
    });
}
/**
 * @private
 * @function
 * @description Binds the events of the order, address and payment pages
 */
function initializeEvents() {
    initializeAddressForm(); // JIRA PREV-63: 'Add Address' or 'Edit address' overlay changing to page after click on Apply button,when there is an error message on overlay.
    toggleFullOrder();
    initAddressEvents();
    initPaymentEvents();
    initLoginPage();
    if($(".server-error").length > 0 ) {
    	$(window).scrollTop($(".server-error").offset().top);
    }
    $("body").on("change input",".desktop-accesscode",function(){
    	var curValue = $(this).val();
    	$("body").find(".mobile-accesscode").val(curValue);
    	$("body").find(".mobile-accesscode").attr("value",curValue);
    });
    $("body").on("change input",".mobile-accesscode",function(){
    	var curValue = $(this).val();
    	$("body").find(".desktop-accesscode").val(curValue);
    	$("body").find(".desktop-accesscode").attr("value",curValue);
    });
}

var account = {
    init: function () {
        initializeEvents();
        giftcert.init();
    },
    initCartLogin: function () {
        initLoginPage();
    }
};

module.exports = account;

},{"../dialog":10,"../giftcert":13,"../page":18,"../tooltip":46,"../util":48,"../validator":49}],20:[function(require,module,exports){
'use strict';

var account = require('./account'),
    bonusProductsView = require('../bonus-products-view'),
    quickview = require('../quickview'),
    validator = require('../validator'),
    cartStoreInventory = require('../storeinventory/cart');

/**
 * @private
 * @function
 * @description Binds events to the cart page (edit item's details, bonus item's actions, coupon code entry)
 */

function initQuickViewrecommButtons() {
        var $qvButton = $('.pt_cart .producttile #quickviewbutton');
        var $link = $(this).find('.thumb-link');
        $qvButton.attr({
            'href': $link.attr('href'),
            'title': $link.attr('title')
        }).appendTo(this);
        $qvButton.off('click').on('click', function (e) {
	        e.preventDefault();
	        quickview.show({
	            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
	            source: 'quickview'
	        });
	    });
}
function initQuickVieweditButtons() {
    var $qvButton = $('.pt_cart  table#cart-table td.itemtotalcolumn.cartactions .item-edit-details #quickviewbutton');
    var $link = $(this);
    $qvButton.attr({
        'href': $link.attr('href'),
        'title': $link.attr('title')
    }).appendTo(this);
    $qvButton.off('click').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
            source: 'quickview'
        });
    });
}
function initializeEvents() {
	quickview.init();
	validator.init();
	initQuickViewrecommButtons();
	initQuickVieweditButtons();
    $('#cart-table').on('click', '.bonus-item-actions a, .item-details .bonusproducts a', function (e) {
        e.preventDefault();
        bonusProductsView.show(this.href);
    });
    /* used to slide toggle event in cart page promo code*/
  	if($('.pt_cart').length>0){
  		$(this).find('.applycoupon .label').text('Have a Promo Code?');
	  	$(".couponcode .label").click(function(){
	  		if($(this).hasClass('pre_label')) {
		  		var $curObj = $(this);
		  		var fieldSection = $curObj.closest(".cart-coupon-code").find(".promo-sec.pre-promo");
		  		if($(fieldSection).is(":visible")==true){
		  			$(fieldSection).slideUp();
		  		}
		  		else {
		  			$(fieldSection).slideDown();
		  		}
	  		}
	  		else if($(this).hasClass('post-couponcode')) {
		  		var $curObj = $(this);
		  		var fieldSection = $curObj.closest(".cart-coupon-code").find(".promo-sec.bottom-promo-section");
		  		if($(fieldSection).is(":visible")==true){
		  			$(fieldSection).slideUp();
		  		}
		  		else {
		  			$(fieldSection).slideDown();
		  		}
	  		}
	  	});
	    var $curObj = $(".couponcode .label.post-couponcode");
	  	var fieldSection = $curObj.closest(".cart-coupon-code").find(".promo-sec.bottom-promo-section");
	  	if($(fieldSection).length>0){
	  		if ($(".promo-sec.bottom-promo-section .error").length>0) {
	  			$(fieldSection).slideDown();
	  			$(".promo-sec.bottom-promo-section").find('.couponinput').addClass('inputlabel');
	  			if( $(window).width() < 481 ) {
		  		$("body, html").animate({
		  			scrollTop: $('.couponcode .label.post-couponcode').offset().top
		  			}, 600);
	  			}
	  		}
	  	}
	  	var $curObjtop = $(".couponcode .label.pre_label");
	  	var fieldSectiontop = $curObjtop.closest(".cart-coupon-code").find(".promo-sec.pre-promo");
	  	if($(fieldSectiontop).length>0){
	  		if ($(".promo-sec.pre-promo .error").length>0) {
	  			$(fieldSectiontop).slideDown();
	  			$(".promo-sec.pre-promo").find('.couponinput').addClass('inputlabel');
		  		$("body, html").animate({
		  			scrollTop: $('.couponcode .label.pre_label').offset().top
		  			}, 600);
	  			}
	  	}

  	}
  	$(".promo-sec").find('.couponinput').click(function(){
  		$('.promo-sec').find('.couponinput').removeClass('inputlabel');
  	});


  	var cartpromo = $('.pt_cart .upshift.cell.contentbox .contentboxcontent table#cart-table tr.cart-row td.itemtotalcolumn');
  	cartpromo.each(function(){
  	if($(this).find('.promo-adjustment').length >= 1) {
  	 $(this).addClass('promodiv');
  	}
  	else {
  	 $(this).removeClass('promodiv');
  	}
  	});

  	$("body").on("click",".cartcoupon-apply",function(){
  		if($(this).closest(".bottom-promo-section").length > 0) {
  			$(".promo-applied-position").val("bottomsection");
  			$(".promo-applied-position").attr("value","bottomsection");
  			var $curObj = $(".couponcode .label");
  		  	var fieldSection = $curObj.closest(".cart-coupon-code").find(".promo-sec.bottom-promo-section");
  		  	if($(fieldSection).length>0){
  		  		if ($(".error").length>0) {
  		  			$(fieldSection).slideDown();
  		  			$(".promo-sec.bottom-promo-section").find('.couponinput').addClass('inputlabel');
  		  		}
  		  	}
  		}
  		else if($(this).closest(".top-promo-section").length > 0) {
  			$(".promo-applied-position").val("topsection");
  			$(".promo-applied-position").attr("value","topsection");
  			var $curObj = $(".couponcode .label");
  		  	var fieldSection = $curObj.closest(".cart-coupon-code").find(".promo-sec.top-promo-section");
  		  	if($(fieldSection).length>0){
  		  		if ($(".error").length>0) {
  		  			$(fieldSection).slideDown();
  		  			$(".promo-sec.top-promo-section").find('.couponinput').addClass('inputlabel');
  		  		}
  		  	}
  		}
  	});
  	$('.pt_cart .cartrecommads_cont').css( "height", "44px" );
    // override enter key for coupon code entry
    $('form input.couponinput').on('keydown', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(this).closest("form").find('.cartcoupon-apply').click();
        } // JIRA PREV-30 : Cart page:  Coupon Code is not applying, when the user hit enter key.
    });

    $("body").on("change,input", function(){
    	var	$curObj = $(this);
    	$("body").find(".couponinput").val($curObj.val());
    	$("body").find(".couponinput").attr("value",$curObj.val());
    });
    //to prevent multiple submissions of the form when removing a product from the cart
    var removeItemEvent = false;
    $('button[name$="deleteProduct"]').on('click', function (e) {
        if (removeItemEvent) {
            e.preventDefault();
        } else {
            removeItemEvent = true;
        }
    });
	var owl = $('.owl-carousel');
	owl.owlCarousel({
		items:3,
		slideBy: 3,
        rewind: true,
		nav: true,
		loop: true,
        dots: false,
	});
}

exports.init = function() {
    initializeEvents();
    if (SitePreferences.STORE_PICKUP) {
        cartStoreInventory.init();
    }
    account.initCartLogin();
};

},{"../bonus-products-view":4,"../quickview":40,"../storeinventory/cart":43,"../validator":49,"./account":19}],21:[function(require,module,exports){
'use strict';

var util = require('../../util'),
	uievents = require('../../uievents'),
	shipping = require('./shipping');

/**
 * @function
 * @description Selects the first address from the list of addresses
 */
exports.init = function() {
    var $form = $('.address');
    // select address from list
    $('select[name$="_addressList"]', $form).on('change', function () {
        var selected = $(this).children(':selected').first();
        var selectedAddress = $(selected).data('address');
        if (!selectedAddress) {
        	if($(".checkout").hasClass("billingsection")) {
        		$(".addressoptions-addToAddressBook,.addressoptions-makedefault ").removeClass("hide");
    			$("input[name$='shippingAddress_selectedaddress']").val("");
    			$(".selected-shipping-address").empty()
    			$("input[name$='_addressid']").val('');
    			$("input[name$='_addressFields_firstName']").val("");
    			$("input[name$='_addressFields_lastName']").val("");
    			$("input[name$='_addressFields_address1']").val("");
    			$("input[name$='_addressFields_address2']").val("");
    			$("input[name$='_addressFields_city']").val("");
    			$("input[name$='_addressFields_postal']").val("");
    			$("input[name$='_addressFields_phone']").val("");
    			uievents.changeFormSelection(jQuery("select[name$='_addressFields_states_state']")[0], "");
    			uievents.changeFormSelection(jQuery("select.address-select")[0], "");
    			$(".shipping-address-field-section").removeClass("hide");
    			$(".selected-shipping-address, .new-address-field, .edit-address-field").addClass("hide");
    			$("input[name$='_addressFields_phone']").closest("div.phone").find("span.errorclient").remove();
    			$("input[name$='_addressFields_postal']").closest("div.zip").find("span.errorclient").remove();
    			$(".addressform .form-row.custom-select").removeClass("customselect-error");
    			$('.custom-select').each(function(){
    				var select_val = $(this)	.find(":selected").text();
    				$(this).find('.selectorOut').text(select_val);
    			});
    			$("a.clearbutton").hide();
    			$('.shipping-address-field-section .form-row').find('input').removeClass('errorclient');
    			uievents.customFields();
        	}else {
        		$(".selected-shipping-address, .new-address-field").addClass("hide");
            	$(".shipping-address-field-section").removeClass("hide");
        	}
        	uievents.synccheckoutH();
            return;
        }
        $(".selected-shipping-address").empty();
        if(selectedAddress.address2 == null) {
        	selectedAddress.address2="";
        }
        $(".selected-shipping-address").append(selectedAddress.firstName+" "+selectedAddress.lastName+"<br/>"+selectedAddress.address1+" "+selectedAddress.address2+"<br/>"+selectedAddress.city+" "+selectedAddress.stateCode+" "+selectedAddress.postalCode+"<br/>"+selectedAddress.phone);
        if($(".checkout").hasClass("billingsection")) {
        	var editAddressObject = {
        			firstName: selectedAddress.firstName,
                    lastName: selectedAddress.lastName,
                    address1: selectedAddress.address1,
                    address2: selectedAddress.address2,
                    postalCode: selectedAddress.postalCode,
                    city: selectedAddress.city,
                    stateCode: selectedAddress.stateCode,
                    countryCode: "US",
                    phone: selectedAddress.phone,
        	}
        	$(".new-address-field").addClass("hide");
        	$(".edit-address-field").attr("data-address",editAddressObject);
        	$(".selected-shipping-address, .edit-address-field").removeClass("hide");
        }
        else {
        	$(".selected-shipping-address, .new-address-field").removeClass("hide");
        }
        $(".shipping-address-field-section").addClass("hide");
        util.fillAddressFields(selectedAddress, $form);
        $("body").find("input[name$=_sameasshippingaddress]").removeAttr("checked");
        $("body").find("input[name$=_sameasshippingaddress]").closest(".custom-checkbox").find(".custom-link").removeClass("active");
        uievents.synccheckoutH();
        shipping.updateShippingMethodList();
        // re-validate the form
        /* JIRA PREV-95 : Highlighting the Credit card  details field, when the user select any saved address from the 'Select An Address' drop down.
           (logged-in user) .Commented to prevent form from re-validation.
		*/
        //$form.validate().form();
    });
   /* if($("body").find("input[name$=_sameasshippingaddress]").is(":checked")) {
    	 var pageLoadSelectedAddress = $('select[name$="_addressList"]').children(':selected').first();
    	    var onPageLoadSelectedAddress = $(pageLoadSelectedAddress).data('address');
    	    if (!onPageLoadSelectedAddress) {
    	    	$(".selected-shipping-address, .new-address-field").addClass("hide");
    	        return;
    	    }
    	    else {
    	    	var selectedAddress = onPageLoadSelectedAddress;
    	    	$(".selected-shipping-address").empty();
    	        $(".selected-shipping-address").append(selectedAddress.firstName+" "+selectedAddress.lastName+"<br/>"+selectedAddress.address1+" "+selectedAddress.address2+"<br/>"+selectedAddress.city+" "+selectedAddress.stateCode+" "+selectedAddress.postalCode+"<br/>"+selectedAddress.phone);
    	        $(".selected-shipping-address, .new-address-field").removeClass("hide");
    	        $(".shipping-address-field-section").addClass("hide");
    	    }

    }*/

};

},{"../../uievents":47,"../../util":48,"./shipping":26}],22:[function(require,module,exports){
'use strict';

var ajax = require('../../ajax'),
    formPrepare = require('./formPrepare'),
    uievents = require('../../uievents'),
    tooltip = require('../../tooltip'),
    progress = require('../../progress'),
    validator = require('../../validator'),
    giftcard = require('../../giftcard'),
    util = require('../../util');


/**
 * @function
 * @description updates the order summary based on a possibly recalculated basket after a shipping promotion has been applied
 */
var flageallotmentcover = $("input.flageallotmentcover").val();
var allotmentAmount = parseInt($("input.allotmentAmount").val());
var couponMenthods = {
	updateSummary: function() {
	    var $summary = $('#secondary .new-summery-cart');
	    // indicate progress
	    progress.show($summary);
	    var stateValue = $("body").find(".shipping-state").val();
	    var url = util.appendParamToURL(Urls.summaryRefreshURL,"selectedState",stateValue);
	    // load the updated summary area
	    $summary.load(url, function() {
	        // hide edit shipping method link
	        $summary.fadeIn('fast');
	        $summary.find('.checkout-mini-cart .minishipment .header a').hide();
	        $summary.find('.order-totals-table .order-shipping .label a').hide();
	        uievents.synccheckoutH();
	    });
	},
	updatecartsummary: function ()
	{
        var url = util.appendParamToURL(Urls.UpdateCartSummary);
        // load the updated cart summary area
        jQuery.ajax({
           url: url,
           dataType: "html",
           success: function(data){
        	   jQuery(".ajax-cartsummary").html(data);
        	   uievents.synccheckoutH();
           }
        });
	},
	setCouponRedemptionInfo: function(redemption) {
		if(!redemption) return;
		//var redeemMsg = "${Resource.msg('billing.couponnotapplied','checkout',null)}";
		//if(redemption.applied) redeemMsg = "${Resource.msg('billing.couponapplied','checkout',null)}";
		//jQuery("${'#'}couponentry .redemption").append("<div class=\"discount-success\">${Resource.msg('billing.couponlabel','checkout',null)} <span class=\"submitedcoupon\">" + redemption.couponCode + "</span> " + redeemMsg + "<button  value="+redemption.couponCode+" class='removecoupon'>Remove</button></div>");
		var url = util.appendParamToURL(Urls.SuccessDisplayCoupon);
		jQuery.get( url, function( data ) {
			jQuery("#couponentry .redemption").html( data );
			uievents.synccheckoutH();
		});
	},
	setCouponError: function(msg) {
		var $couponcode = jQuery("input[name$='_billing_couponCode']").closest('.couponcode');
		if(!msg) {
			jQuery("#couponentry span.error").remove();
			return;
		}
		if($couponcode.find('span.error').length == 0){
			$("input[name$='_billing_couponCode']").closest('.couponcode').append("<span class='error'><\/span>");
		}
		$couponcode.find('span.error').html(msg);
		jQuery("input[name$='_billing_couponCode']").addClass("errorclient")
	},
	setGiftCertError: function(msg) {
		var $redeemcode = jQuery("input[name$='_billing_giftCertCode']").closest('.giftcertfields');
		if(!msg) {
			jQuery(".giftcertfields .error").remove();
			jQuery("input[name$='_billing_couponCode']").removeClass("errorclient");
			return;
		}
		if($redeemcode.find('span.error').length == 0){
			jQuery("input[name$='_billing_giftCertCode']").closest('.giftcertfields').append("<span class='error'><\/span>");
		}
		$redeemcode.find('span.error').html(msg);
		jQuery("input[name$='_billing_giftCertCode']").addClass("errorclient");
		//jQuery("input[name=${pdict.CurrentForms.billinggiftcert.giftCertCode.htmlName}]").parent().append("<span class=\"errormessage\">" + msg + "<\/span>");
	},
	//refresh CC form
	refreshCC: function(){
		var url = util.appendParamToURL(Urls.ClearCCForm);
		jQuery.ajax({
			   url: url,
			   dataType: "html",
			   success: function(data){
				   uievents.synccheckoutH();
			   }
			});
	},
	setPaymentSection: function(orderBalance) {

		/*if(!orderBalance) {
			return;
		}*/

		if (orderBalance <= 0) {
			//Clearing the CC Form if the remaining balance after allotment and GC is zero
			couponMenthods.refreshCC();

			// if the whole order total was paid with gift certs then hide other payment methods and show a message
			$("#paymentmethods").hide();
			$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
			// if the order total is zero, determine was it because of the gift certificate use or a promotion? and show appropriate message
			if(flageallotmentcover == "true"){
				$(".giftcertused").addClass("allotmentcover");
				$(".giftcertused").html("<p class='first-para'>Your allotment balance will cover the full cost of this order.</p><p>No further payment will be necessary.</p>").show();
			}
			else{
				if(allotmentAmount > 0){
					$(".giftcertused").addClass("allotmentcover");
					var allotmentMessage = '<div class="greater-than-767"><p class="first-para">Your allotment balance will cover the full cost of this order.</p><p>No further payment will be necessary.</p></div><div class="less-than-767"><p>Your allotment balance will cover the full cost of this order. No further payment will be necessary.</p></div>'
					$(".giftcertused").html(allotmentMessage).show();
				}
				else{
					$(".giftcertused").addClass("merchantcover").html($(".giftcertpi").length > 0 ? "<p class='first-para'>"+ Resources.GIFTCERT_NO +"</p>" : "<p class='first-para'>"+ Resources.ZERO_BALANCE +"</p>").show();
				}
			}
			$(".cardnotworking").hide();
		}
		if ((orderBalance > 0) && ($('input[name$="paymentMethods_selectedPaymentMethodID"]:checked').val() == "CREDIT_CARD")) {
			$(".cardnotworking").show();
		}else{
			$(".cardnotworking").hide();
		}
	},
	ordertotals: function(){
		 var url = Urls.GetOrderTotalJson;
	 	 ajax.getJson({
				url: url,
				callback: function(data) {
					if(data.Total.OrderTotal.indexOf('0.00') != -1){
						couponMenthods.setPaymentSection('0.0');
					}else{
						$('#paymentmethods').show();
						jQuery('.giftcertused ').removeClass('merchantcover').hide();
					}
					uievents.synccheckoutH();
				}
		 });
	},
	removeGiftCertificate: function(giftCertificateId) {
		jQuery(".balance").empty();
		// remove gift certificate
		var url = util.appendParamToURL(Urls.RemoveGiftCertificate, "giftCertificateID", giftCertificateId);
		var result = ajax.getJson({
			url: url,
			callback: function(data) {
				if(!data || !data.giftCertificate || !data.giftCertificate.removed) {
					couponMenthods.setGiftCertError(Resources.GIFTCERT_ERROR);
					return false;
				}
				// remove message in UI
				$("#gc-"+giftCertificateId).remove();
				// reinstate payment methods section which might have been hidden if the whole order was paid with gift certs
				if(!flageallotmentcover){
					$("#paymentmethods").show();
				}
					// hide gift cert used for otder total message
					if(!flageallotmentcover){
						jQuery(".giftcertused").hide();
					}
				//commenting this since we don't need to clear the payment form on applying GC as in order CC fields are first.
				//var countryCode = jQuery("input[name=${pdict.CurrentForms.billing.billingAddress.addressFields.country.htmlName}]").val();
				//updatePaymentMethods( countryCode );
				var countryCode = jQuery("input[name$='addressFields_country']").val();
				if(typeof countryCode == 'undefined'){
					countryCode = 'US';
				}
				couponMenthods.updatePaymentMethods(countryCode);
				couponMenthods.updateSummary();
				couponMenthods.ordertotals();
				uievents.synccheckoutH();
				if($('#paymentmethods .toggle').eq(0).hasClass('active')){
					$('.cardnotworking').show();
				}

			}
		});
	},
	bindGiftCertificateRemoval: function () {
		$("#giftcertentry a.remove").unbind("click").bind("click", function() {
			var gcId = util.trimPrefix($(this).attr("id"), "rgc-");
			couponMenthods.removeGiftCertificate(gcId);
			uievents.synccheckoutH();
			return false;
		});
	},
	setGiftCertRedemptionInfo: function(giftCertificateId, amountExpr) {

		if(!giftCertificateId || !giftCertificateId) {
			return;
		}
		$("#gc-"+giftCertificateId).remove();
		/*jQuery("${'#'}giftcertentry .redemption").append("<div class='success giftcertpi' id='gc-"+ giftCertificateId+"'><div class='gcremove discount-success'><div class='gcremove_icon'><a id='rgc-"+giftCertificateId +"' class='remove' href='${'#'}'><img src='${URLUtils.staticURL('/images/icon_remove.gif')}' alt='${Resource.msg('global.remove','locale',null)}'/></a></div><div class='gc_idlabel'>${Resource.msg('minibillinginfo.giftcertificate','checkout',null)} - "+giftCertificateId+" </div><div class='gcredeemamount'>"+'-'+""+amountExpr+"</div></div><div class='gcdiscapplied'>"+ amountExpr+" "+' '+" ${Resource.msg('billing.giftcertredeemed','checkout',null)}</div></div>");*/
		$("#giftcertentry .redemption").append("<div class='success giftcertpi' id='gc-"+ giftCertificateId+"'><div class='gcremove discount-success'><div class='gc_idlabel'>"+giftCertificateId+" </div><div class='gcredeemamount'>"+' - '+""+amountExpr+" "+Resources.GIFT_CERTIFICATE_CREDIT+"</div><div class='gcremove_icon'><a id='rgc-"+giftCertificateId +"' class='remove' href='#'><span>"+Resources.REMOVE+"</span></a></div></div></div>");
		$('.giftcertfields').css({"display":"none"});
		couponMenthods.bindGiftCertificateRemoval();
	},
	// initializes the payment method forms
	initPaymentMethodSelection: function() {

		// get selected payment method from payment method form
		var paymentMethodID = jQuery("input[name$='_selectedPaymentMethodID']:checked").val();
		if( !paymentMethodID )
		{
			// if necessary fall back to default payment method (first non-gift-certificate method)
		    paymentMethodID = $("input[value='CREDIT_CARD']").attr("id");
		}

		// show payment method section
		couponMenthods.changePaymentMethod(paymentMethodID);
	},
	// changes the payment method form
	changePaymentMethod: function(paymentMethodID) {
		//if (jQuery(".giftcertused").css("display") != "none") return;
	 /*
		jQuery(".paymentform").hide();
		jQuery("#PaymentMethod_" + paymentMethodID).show();
		if( jQuery("#PaymentMethod_" + paymentMethodID).length == 0 )
		{
			jQuery("#PaymentMethod_Custom").show();
		}

		// ensure checkbox of payment method is checked
		jQuery("#is-" + paymentMethodID).attr("checked", true);
		if($("#PaymentMethod_CREDIT_CARD").is(':visible')){
			if(paymentMethodID == "PayPal"){
				$('.cardnotworking').hide();
			}else{
				$('.cardnotworking').show();
				jQuery('.paymentform.paypal .paypalmsg').removeClass('error');
			}
		}*/

		var $paymentMethods = $('.payment-method');
	    $paymentMethods.removeClass('payment-method-expanded');

	    var $selectedPaymentMethod = $paymentMethods.filter('[data-method="' + paymentMethodID + '"]');
	    if ($selectedPaymentMethod.length === 0) {
	        $selectedPaymentMethod = $('[data-method="Custom"]');
	    }
	    $selectedPaymentMethod.addClass('payment-method-expanded');

	    // ensure checkbox of payment method is checked
	    $('input[name$="_selectedPaymentMethodID"]').removeAttr('checked');
	    $('input[value=' + paymentMethodID + ']').prop('checked', 'checked');
	},
	bindCreditCardPopulationHandler: function()
	{
		// select credit card from list
		$(".creditcardlist select").change(function() {
			var cardUUID = $(this).val();
			  if(!cardUUID){
					 jQuery("input[name$='paymentMethods_creditCard_owner']").val('');
					 jQuery("input[name$='paymentMethods_creditCard_number']").val('');
					 jQuery("select[name$='paymentMethods_creditCard_month']").val('');
					 jQuery("select[name$='paymentMethods_creditCard_year']").val('');
					 jQuery("select[name$='paymentMethods_creditCard_cvn']").val('');
					 $('.cardtypeimg > div').hide();
					 $('.expirationdate.error').hide();
					 jQuery('.paymentform a.clearbutton').hide();
					 $('.custom-select').each(function(){var select_val = $(this)	.find(":selected").text();	 $(this).find('.selectorOut').text(select_val); });
					 return false;
			  }else{
				  jQuery("form[id$='paymentMethods_creditCard'] input, form[id$='paymentMethods_creditCard'] select").removeClass('errorclient');
					 jQuery("form[id$='paymentMethods_creditCard'] span.errorclient").hide();
					 jQuery("form[id$='paymentMethods_creditCard'] .custom-select").removeClass('customselect-error');
					  jQuery("form[id$='paymentMethods_creditCard'] .expirationdate.error").hide();
			  }
			  couponMenthods.populateCreditCardForm(cardUUID);
			  uievents.synccheckoutH();
			return false;
		});
	},
	bindPaymentMethodChangeHandler: function()
	{
		// bind payment method change handler
		$("#paymentmethods .toggle").click(function() {
			 if(jQuery('input[name$="billing_paypalprocessed"]').val() != "true"){
					$("#paymentmethods .toggle").removeClass('active');
					$(this).addClass('active');
					var selectedID = jQuery(this).find('input[name$="_billing_paymentMethods_selectedPaymentMethodID"]').val();
					if(selectedID == "PayPal"){
						var paypalStatus = jQuery('input[name$="_billing_paypalval_paypalprocessed"]').val();
						$('.cardnotworking').hide();
						if(paypalStatus == "true"){
							 //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
						}
						else{
							//$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
						}
					}else if(selectedID == "CREDIT_CARD"){
						if (!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_expiration_month"]').val() != '' && $('select[name$="paymentMethods_creditCard_expiration_month"]').val() != '') {
							 //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
						}
						else{
							//$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
						}
					}
					$(this).find('input[name="billing_paymentMethods_selectedPaymentMethodID"]').prop('checked', true);
					couponMenthods.changePaymentMethod(selectedID);
				}
		});
		$("#paymentmethods .paymentform.creditcardpayment").click(function() {
			$(".paymentmethods .toggle input#is-CREDIT_CARD").closest(".toggle").addClass("active");
		});
		$("#paymentmethods .paymentform.paypal").click(function() {
			$(".paymentmethods .toggle input#is-PayPal").closest(".toggle").addClass("active");
		});
	},
	updatePaymentMethods: function(countryCode)
	{

		var url = util.appendParamToURL(Urls.RefreshPaymentMethods, "countryCode", countryCode);

		// indicate progress
		progress.show("#paymentmethodform");

		// load the updated payment method area
		$("#paymentmethodform").load( url, function() {
			$("#paymentmethodform").fadeIn("fast");
			//$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
			//couponMenthods.initPaymentMethodSelection();
			couponMenthods.bindPaymentMethodChangeHandler();
			couponMenthods.bindCreditCardPopulationHandler();
		    validator.init();
		    tooltip.init();
		    util.cardtype.init();
		    $(".expirationdate .custom-select select");
		    $('#PaymentMethod_CREDIT_CARD input');
		    $('#PaymentMethod_CREDIT_CARD select');
		    uievents.init($("#paymentmethodform"));
		  //load checking for payment type
			var $paySelected = jQuery('#paymentmethods').find('input[name$="paymentMethods_selectedPaymentMethodID"]:checked');
			if($paySelected.length == 1){
				$paySelected.closest('.toggle').addClass('active');
				var selectedID = $paySelected.val();
				couponMenthods.changePaymentMethod(selectedID);
			}
			couponMenthods.ordertotals();
			uievents.synccheckoutH();
		});
		//app.execUjs();
	},
	removeCouponCode: function(couponCode) {
		couponMenthods.setCouponError(null);
		// nothing entered
		if(!couponCode) {
			couponMenthods.setCouponError(Resources.BILLING_COUPONMIS);
			return;
		}
		// attempt to remove
		jQuery("input[name$='billing_couponCode']").val("");

		var url = util.appendParamToURL(Urls.RemoveCoupon,"couponCode", couponCode);
		$.get( url, function( data ) {
			couponMenthods.updateSummary();
			couponMenthods.updatecartsummary();
			jQuery("#couponentry .redemption").html( data );

			var giftCertificates = jQuery(data).filter('#giftCertificateData').text();
			if(giftCertificates != 'undefined' && giftCertificates.length > 0 ){
				var giftCertificatedata = giftCertificates.split("|");
				for(var index = 0;index < giftCertificatedata.length; index++){
					couponMenthods.setGiftCertRedemptionInfo(giftCertificatedata[index].split("-")[0].trim(), giftCertificatedata[index].split("-")[1].trim());
				}
			}
			uievents.synccheckoutH();
		});
		var countryCode = jQuery("input[name$='addressFields_country']").val();
		if(typeof countryCode == 'undefined'){
			countryCode = 'US';
		}
		couponMenthods.updatePaymentMethods(countryCode);
		couponMenthods.ordertotals();


		// Determine if a bonus-product promotion was triggered by the coupon.
		// If so, display a popup alert and give the customer a chance to
		// return to the cart and select the bonus product.

		/*$('.noBonusBtn').unbind("click").click( function() {
            $('.bonusdiscountcontainer').dialog('close');
      	});*/
	},
	populateCreditCardForm: function(cardID)
	{
		// load card details
		var url = Urls.billingSelectCC;
			url = util.appendParamToURL(url, "creditCardUUID", cardID);
		var result = ajax.getJson({
			url: url,
			callback: function(data) {
					if(!data) {
						alert(Resources.CC_LOAD_ERROR);
						return false;
					}
					var $creditCard = $("body").find(".creditcardpayment");
					// fill the form / clear the former cvn input
					$creditCard.find('input[name$="creditCard_owner"]').val(data.holder).trigger('change');
				    $creditCard.find('select[name$="_type"]').val(data.type).trigger('change');
				    $creditCard.find('.creditCard-number').val(data.maskedNumber).trigger('change');
				    $creditCard.find('[name$="_month"]').val(data.expirationMonth).trigger('change');
				    var date = new Date();
				    var currentYear = date.getFullYear();
				    if((data.expirationYear <= currentYear)) {
				    	$creditCard.find('[name$="_year"]').val("").change();
				    }
				    else {
				    	$creditCard.find('[name$="_year"]').val(data.expirationYear).trigger('change');
				    }
				    $creditCard.find('input[name$="_cvn"]').val('').trigger('change');
					jQuery('input[name$="creditCard_owner"]').val(data.creditCard.holder);
					uievents.changeFormSelection($('select[name$="_type"]')[0], data.creditCard.type);
					$('.creditCard-number').val(data.creditCard.maskedNumber);
					uievents.changeFormSelection($('[name$="_month"]')[0], data.creditCard.expirationMonth);
					uievents.changeFormSelection($('[name$="_year"]')[0], data.creditCard.expirationYear);
					$('input[name$="_cvn"]').val("");
					// remove error messaging
					$("#PaymentMethod_CREDIT_CARD span.errormessage").remove();
					$("#PaymentMethod_CREDIT_CARD input.errormessage").removeClass("errormessage");
					$("#PaymentMethod_CREDIT_CARD .errorlabel").removeClass("errorlabel");

					$(".paymentform.creditcardpayment .formfield .field-wrapper").each(function(){
						if($(this).find("input").val() != undefined){
				    		if($(this).find("input").val().length > 0){
				    			$(this).parent('.formfield').find('a.clearbutton').show();
				    		}
				    		else{
				    			$(this).parent('.formfield').find('a.clearbutton').hide();
				    		}
						}
					});
						if(data.creditCard.type=="Visa"){
							result = "Visa";
							//visa
						}else if(data.creditCard.type=="Discover"){
							result = "Discover";
							//Discover
						}else if(data.creditCard.type=="Amex"){
							result = "Amex";
							//American Express
						}else if(data.creditCard.type=="MasterCard"){
							result = "MasterCard";
							//Master Card
						}
					 //errorspan.hide();
	                 $('#paymentmethods').find('select[name$="_paymentMethods_creditCard_type"]').val(result);
	                 $('.cardtypeimg > div').hide();
	                 $('.cardtypeimg > div.'+result).show();
			}
		});
	},
	setGiftCertBalanceInfo: function(amountExpr) {
		if(!amountExpr) {
			jQuery(".balance").empty();
			return;
		}
		$(".balance").append("<div class='balanceamt'>"+ Resources.GIFT_CERT_BALANCE+" "+ amountExpr +" </div>");
	},
	redeemGiftCert: function(giftCertificateId) {
		couponMenthods.setGiftCertError(null);
		couponMenthods.setGiftCertBalanceInfo(null);
		// nothing entered
		if(!giftCertificateId) {
			couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
			return;
		}
		// attempt to redeem
		var url = util.appendParamsToUrl(Urls.redeemGiftCert, {giftCertificateID: giftCertificateId, format: 'ajax'});
		var result = ajax.getJson({
			url: url,
			callback: function(data) {
				if(!data) {
					couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
					return false;
				}
				if(data.redemptionErrorMsg) {
					couponMenthods.setGiftCertError(data.redemptionErrorMsg);
					return false;
				}
				if(!data.redemption)
				{
					couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
					return false;
				}
				// empty input field and display redemption in UI
				$("input[name$='billing_giftCertCode']").val("");
				//couponMenthods.setGiftCertRedemptionInfo(data.redemption.giftCertificateID, data.redemption.amount);
				var countryCode = $("input[name$='_addressFields_country']").val();
				if(typeof countryCode == 'undefined'){
					countryCode = 'US';
				}
				couponMenthods.updatePaymentMethods( countryCode );
				couponMenthods.updateSummary();
				couponMenthods.ordertotals();
				uievents.synccheckoutH();
			}
		});
	},
	checkGiftCertBalance: function(giftCertificateId) {
		couponMenthods.setGiftCertError(null);
		couponMenthods.setGiftCertBalanceInfo(null);
		// nothing entered
		if(!giftCertificateId) {
			couponMenthods.setGiftCertError(Resources.GIFT_CERT_MISSING);
			return;
		}
		// load gift certificate details
		var url = util.appendParamsToUrl(Urls.GetGiftCertificateBalance, {giftCertificateID: giftCertificateId, format: 'ajax'});
		var result = ajax.getJson({
			url: url,
			callback: function(data) {
				if(!data || !data.giftCertificate) {
					couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
					return false;
				}
				// display details in UI
				couponMenthods.setGiftCertBalanceInfo(data.giftCertificate.balance);
				uievents.synccheckoutH();
			}
		});
	}
}
/**
 * @function
 * @description Fills the Credit Card form with the passed data-parameter and clears the former cvn input
 * @param {Object} data The Credit Card data (holder, type, masked number, expiration month/year)
 */
function setCCFields(data) {

    var $creditCard = $('[data-method="CREDIT_CARD"]');
    $creditCard.find('input[name$="creditCard_owner"]').val(data.holder).trigger('change');
    $creditCard.find('input[name$="creditCard_owner"]').val(data.holder).trigger('blur');
    $creditCard.find('select[name$="_type"]').val(data.type).trigger('change');
    $creditCard.find('select[name$="_type"]').val(data.type).trigger('blur');
    $creditCard.find('input[name*="_creditCard_number"]').val(data.maskedNumber).trigger('change');
    $creditCard.find('input[name*="_creditCard_number"]').val(data.maskedNumber).trigger('blur');
    $creditCard.find('[name$="_expiration_month"]').val(data.expirationMonth).trigger('change');
    var date = new Date();
    var currentYear = date.getFullYear();
    if((data.expirationYear <= currentYear)) {
    	$creditCard.find('[name$="_year"]').val("").change();
    }
    else {
    	$creditCard.find('[name$="_year"]').val(data.expirationYear).trigger('change');
    }
    $creditCard.find('[name$="_expiration_month"]').val(data.expirationMonth).trigger('blur');
    if((data.expirationYear <= currentYear)) {
    	$creditCard.find('[name$="_year"]').val("").blur();
    }
    else {
    	$creditCard.find('[name$="_year"]').val(data.expirationYear).trigger('blur');
    }
    $creditCard.find('input[name$="_cvn"]').val('').trigger('change');
    $creditCard.find('input[name$="_cvn"]').val('').trigger('blur');
    uievents.synccheckoutH();
}

/**
 * @function
 * @description Updates the credit card form with the attributes of a given card
 * @param {String} cardID the credit card ID of a given card
 */
function populateCreditCardForm(cardID) {
    // load card details
    var url = util.appendParamToURL(Urls.billingSelectCC, 'creditCardUUID', cardID);
    ajax.getJson({
        url: url,
        callback: function (data) {
        	uievents.synccheckoutH();
            if (!data) {
                window.alert(Resources.CC_LOAD_ERROR);
                return false;
            }
            setCCFields(data);
            uievents.synccheckoutH();
        }
    });
}

/**
 * @function
 * @description Changes the payment method form depending on the passed paymentMethodID
 * @param {String} paymentMethodID the ID of the payment method, to which the payment method form should be changed to
 */
function updatePaymentMethod(paymentMethodID) {
    var $paymentMethods = $('.payment-method');
    $paymentMethods.removeClass('payment-method-expanded');

    var $selectedPaymentMethod = $paymentMethods.filter('[data-method="' + paymentMethodID + '"]');
    if ($selectedPaymentMethod.length === 0) {
        $selectedPaymentMethod = $('[data-method="Custom"]');
    }
    $selectedPaymentMethod.addClass('payment-method-expanded');

    // ensure checkbox of payment method is checked
    $('input[name$="_selectedPaymentMethodID"]').removeAttr('checked');
    $('input[value=' + paymentMethodID + ']').prop('checked', 'checked');

    //formPrepare.validateForm();
}

/**
 * @function
 * @description loads billing address, Gift Certificates, Coupon and Payment methods
 */
exports.init = function() {
    var $checkoutForm = $('.checkout-billing');
    var $addGiftCert = $('#add-giftcert');
    var $giftCertCode = $('input[name$="_giftCertCode"]');
    var $addCoupon = $('#add-coupon');
    var $couponCode = $('input[name$="_couponCode"]');
    var $selectPaymentMethod = $('.payment-method-options');
    var selectedPaymentMethod = $selectPaymentMethod.find(':checked').val();

   /* formPrepare.init({
        formSelector: 'form[id$="billing"]',
        continueSelector: '[name$="billing_save"]'
    });*/
    var activePaymentMethodID = $("body").find(".paymentmethods_cont .input-radio:checked").attr("id");
    if( activePaymentMethodID == "is-PayPal" ) {
    	$(".paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput").removeClass("required");
		$(".cardnotworking").hide();

    } else {
    	  $(".paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput").addClass("required");
    	  $(".cardnotworking").show();

	}
    if(!jQuery(".creditcardlist select").val()){
			 $(".creditcard_name").val('');
			 $(".creditCard-number").val('');
			 $(".monthselect").val('');
			 $(".yearselect").val('');
			 $(".creditcard_cvn").val('');
			 $('.cardtypeimg > div').hide();
			 $('.expirationdate.error').hide();
			 $('.expirationdatevalid.error').hide();
			 $('.paymentform a.clearbutton').hide();
	}
    $(".expirationdate .custom-select select").on('blur', function() {
    	var d = new Date(),
        mth = d.getMonth() + 1,
        yy = d.getFullYear();
    		if(!jQuery(this).val()){
    			$('.expirationdate.error').show();
    			$('.expirationdatevalid.error').hide();
    		}else{
    		  if(jQuery('.expirationdate .custom-select.customselect-error').length == 0){
    			  $('.expirationdate.error').hide();
    			  $('.expirationdatevalid.error').hide();
    		  }
    		  var selectedMth = $(".expirationdate .custom-select select[id$='billing_paymentMethods_creditCard_expiration_month']").val();
    		  var selectedyear = $(".expirationdate .custom-select select[id$='billing_paymentMethods_creditCard_expiration_year']").val();
    				if(selectedyear && selectedMth){
    					selectedyear = selectedyear.replace(',','');
    					if((selectedyear <= yy) && (selectedMth < mth)){
    						  $('.expirationdate.error').hide();
    						  $('.expirationdatevalid.error').show();
    					  }
    				}
    		}
    });
    $("body").on('click','.redemption .discount-success button.remove-cop',function(e) {
		e.preventDefault();
		var url = $(this).val();
		couponMenthods.removeCouponCode(url);
		return false;
	});
    /* JIRA PREV-135 : Disabled Credit Card in BM is displaying in the application.
       Changed default option from 'CREDIT_CARD' to first available payment method.*/
    updatePaymentMethod((selectedPaymentMethod) ? selectedPaymentMethod : $('.payment-method-options input').first().val());
    $('body').on('click', '.payment-method-options input[type="radio"]', function () {
        updatePaymentMethod($(this).val());
        if($(this).is(":checked")) {
	        $(this).closest(".toggle").siblings(".toggle").removeClass("active");
	        if( $(this).attr("id") == "is-PayPal" ) {
	          $(".paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput").removeClass("required");
	          $(".cardnotworking").hide();
	        } else {
	          $(".paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput").addClass("required");
	          $(".cardnotworking").show();
	        }
	        $(this).closest(".toggle").addClass("active");
	      }
        uievents.customFields();
        uievents.synccheckoutH();
    });
    $('body').on('click', '.payment-method-options .toggle  img', function () {
    	$(this).closest("label").find('input[type="radio"]').trigger("click");
    });


    // select credit card from list
    $('body').on('change',"#creditCardList", function () {
        var cardUUID = $(this).val();
        if (!cardUUID) {
            return;
        }
        populateCreditCardForm(cardUUID);

        // remove server side error
        $('.required.error').removeClass('error');
        $('.error-message').remove();
    });
    $("body").on("click","#giftcertentry a.remove", function() {
		var gcId = util.trimPrefix($(this).attr("id"), "rgc-");
		couponMenthods.removeGiftCertificate(gcId);
		return false;
	});
    $("body").on('click', '#check-giftcert',function (e) {
        e.preventDefault();
        var gcId = jQuery("input[name$='billing_giftCertCode']").val().toUpperCase();
        couponMenthods.checkGiftCertBalance(gcId);
        uievents.synccheckoutH();
		return false;
    });

    $("body").on('click','#add-giftcert', function (e) {
        e.preventDefault();
        var gcId = jQuery("input[name$='billing_giftCertCode']").val().toUpperCase();
        couponMenthods.redeemGiftCert(gcId);
        uievents.synccheckoutH();
		return false;
    });

    $("body").on('click','#add-coupon', function (e) {
        e.preventDefault();
        var $error = $checkoutForm.find('.coupon-error'),
            code = $('input[name$="_couponCode"]').val();
        couponMenthods.setCouponError(null);
        if (code.length === 0) {
            couponMenthods.setCouponError(Resources.COUPON_CODE_MISSING);
            return false;
        }

        var url = util.appendParamsToUrl(Urls.addCoupon, {
            couponCode: code,
            format: 'ajax'
        });
        $.getJSON(url, function (data) {
        	 var msg = '';
        	 if(!data) {
         		msg = Resources.COUPON_INVALID;
 				couponMenthods.setCouponError(msg);
 				return false;
 			}
        	 if(data.redemption.redemptionErrorMsg) {
        		 couponMenthods.setCouponError(data.redemption.redemptionErrorMsg);
				return false;
			}
			if(!data.redemption)
			{
				msg = Resources.COUPON_INVALID;
				couponMenthods.setCouponError(msg);
				return false;
			}
			// empty input field and display redemption in UI
			jQuery("input[name$='_billing_couponCode']").val("");
			jQuery("input[name$='_billing_couponCode']").removeClass("errorclient")
			couponMenthods.setCouponRedemptionInfo(data.redemption);
			// update gift card redemptions as amounts might have changed after coupon
			jQuery.each(data.redemption.gcRedemptions, function(){
				couponMenthods.setGiftCertRedemptionInfo(this.giftCertificateID, this.amount);
			});
			var countryCode = $("input[name$='_addressFields_country']").val();
			if(typeof countryCode == 'undefined'){
				countryCode = 'US';
			}

            couponMenthods.updateSummary();
            couponMenthods.updatecartsummary();
            couponMenthods.updatePaymentMethods( countryCode );
			couponMenthods.ordertotals();
			uievents.synccheckoutH();
			// Determine if a bonus-product promotion was triggered by the coupon.
			// If so, display a popup alert and give the customer a chance to
			// return to the cart and select the bonus product.
			if (data.redemption.bonusPromotionApplied)
			{
				$(".bonusdiscountcontainer .bonusproductpromo").append(data.redemption.bonusPromotionCallout);
				$(".bonusdiscountcontainer div.details").html(data.redemption.bonusPromotionDetails);

				$('.bonusdiscountcontainer').show();
			   	$('.bonusdiscountcontainer').dialog({
				   		title: Resources.BONUS_PRODUCT,
				   		bgiframe: true,
						autoOpen: false,
						modal: true,
				    	height: 250,
						width: 500,
				    	resizable: false
				});
				jQuery('.bonusdiscountcontainer').dialog('open');

			}

			jQuery('.selectBonusBtn').unbind("click").click( function() {
	            jQuery('.bonusdiscountcontainer').dialog('close');
	            location.href = "${URLUtils.https('Cart-Show')}";
	            return false;
	      	});

			jQuery('.noBonusBtn').unbind("click").click( function() {
	            jQuery('.bonusdiscountcontainer').dialog('close');
	      	});
        });
    });

    // trigger events on enter
    $("body").on('keydown','input[name$="_couponCode"]', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#add-coupon').click();
        }
    });
    $("body").on('keydown','input[name$="_giftCertCode"]', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $("#add-giftcert").click();
        }
    });

    $('.trypaypal').on("click",function(){
        $('.continuecheckout-paypallogin').trigger('click');
    });

    if($('.pt_checkout .paymentform.paypal .error-paypal-heading').length > 0 || $('.pt_checkout .paymentform.paypal .paypalmsg.success-paypal').length > 0 ){
    	$("body, html").animate({
    		scrollTop: $('#paymentmethodform legend').offset().top
    	  	}, 600);
    }

	$('.switchtocredit').on("click",function(){
		$('.paymentmethods_cont .toggle').eq(0).find(".input-radio").trigger('click');
	});
    //PREVAIL - init Address Validation
    require('../../addressvalidation').init();

    util.cardtype.init();
    $("body").on("click",".couponcode .label",function(){
		if($(".promo-input-button").is(":visible")==true){
			$(".promo-input-button").hide();
			$(this).closest(".couponcode").find("span.error").hide();
		}
		else {
			$(".promo-input-button").show();
			$(this).closest(".couponcode").find("span.error").show();
	  		}
			uievents.synccheckoutH();
	});
    if($('.guestbillingform .password .errormessage').length > 0) {
		$('.guestbillingform .password .errormessage').remove();
	}

    $('.guestbillingform .billing-conpassword').blur(function () {
		var billing_pas = $( '.guestbillingform .billing-password').val();
		var billing_conpas = $('.guestbillingform .billing-conpassword').val();
		$('.guestbillingform .password .errormessage').remove();
		if(billing_pas.length > 0) {
			if(billing_conpas.length < 5) {
				$('.guestbillingform .billing-conpassword').addClass('errorclient');
                $('.billingconfpassword').text(app.resources.billingpasswordconfirm_min).removeClass('hide');
                //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
			}
			else if(billing_pas != billing_conpas) {
				$('.guestbillingform .billing-conpassword').addClass('errorclient');
				$('.billingconfpassword').text(app.resources.billingpasswordconfirm).removeClass('hide');
                //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
			}
			else {
				$('.guestbillingform .billing-conpassword').removeClass('errorclient');
				$('.billingconfpassword').text(app.resources.billingpasswordconfirm).addClass('hide');
				if(!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
					//$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
				}
            }
	        }  else {
	        	$('.guestbillingform .billing-conpassword').removeClass('errorclient');
	        	$('.billingconfpassword').text(app.resources["billingpasswordconfirm"]).addClass('hide');
	        	if(!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
	        		//$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
	        	}
	        }
	});
    $('.guestbillingform .billing-password').bind('blur',function(){
		var billing_pas = $( '.guestbillingform .billing-password').val();
		var billing_conpas = $('.guestbillingform .billing-conpassword').val();
		//$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');

		if($(this).length > 0) {
			$('.guestbillingform .billing-conpassword').addClass('required');
		}
		else {
			$('.guestbillingform .billing-conpassword').removeClass('required');
			$('.guestbillingform .billing-conpassword').removeClass('errorclient');
		}
		if(billing_pas.length > 0) {
			if(billing_pas.length < 5) {
				$('.guestbillingform .billing-password').addClass('errorclient');
				$('.billingpassword').text(app.resources["billingpasswordconfirm_min"]).removeClass('hide');
 //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
			}else{
				$('.guestbillingform .billing-password').removeClass('errorclient');
				$('.billingpassword').addClass('hide');
			}
		}else{
			$('.guestbillingform .billing-password').removeClass('errorclient');
			$('.billingpassword').addClass('hide');
		}

		if((billing_pas == billing_conpas) && (billing_pas.length >= 5)){
			if(!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
		//$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
			}
		}
	});

    if($('.expirationdate .custom-select .field-wrapper span.errormessage').length > 0) {
		$('.expirationdate .custom-select span.errormessage').hide();
		$('.expirationdate.error').show();
	}
    $( '.checkoutbilling .continue-checkout-button .continuecheckout').click(function () {
		var errorcount = 0;
		if(!($("#PaymentMethod_CREDIT_CARD").is(':visible'))){
			$(".paymentform .textinput, .paymentform select").removeClass("required");
		}
        if(!jQuery('form[id$="_billing"]').valid()){
        	jQuery('.state-blk select').trigger('blur');
        	if(jQuery('.billing-address-fields').hasClass('hide'))
			{
        		$('select[name$=billing_addressList]').val('');
				$('input[name$="billingAddress_selectedbillingadd"]').val('');
				$('.custom-select').each(function(){
					var select_val = $(this)	.find(":selected").text();
					$(this).find('.selectorOut').text(select_val);
				});
				jQuery('.billing-address-fields').removeClass('hide');
				jQuery('.selected-billing-address , .selected-shipping-address').addClass('hide');
				uievents.customFields();
			}
        	errorcount++;
    	}
       if($("#PaymentMethod_CREDIT_CARD").is(':visible')) {
        	if(!$('form[id$="dwfrm_billing"]').valid()){
        		$('.expirationdate select').trigger('blur');

               if($('.vip-terms .custom-link').is(':visible')) {
                   if(!$('input[name$="_isvip"]').is(':checked')) {
                    	if( $('.vip-terms .custom-checkbox .vip-message #message').length == 0){
                            $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                            $('.singleshipping_error').show();
                    	}
                            $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                            uievents.synccheckoutH();
                    }
                }
               if($('.knife .custom-link.agecheck-link').is(':visible')) {
                   if(!$('input[name$="agecheck_ischeck"]').is(':checked')) {
                    	if($('.addressoptions.knife .agecheck_message #message').length == 0){
                            $('.addressoptions.knife .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                            $('.singleshipping_error').show();
                    	}
                            $('.addressoptions.knife > .custom-checkbox .custom-link').addClass('error');
                            uievents.synccheckoutH();
                    }
                }
                errorcount++;
        	}else{

        		if ($('.vip-terms .custom-link').is(':visible')) {
                   if(!$('input[name$="_isvip"]').is(':checked')) {
                    	if( $('.vip-terms .custom-checkbox .vip-message #message').length == 0){
                            $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                            $('.singleshipping_error').show();
                    	}
                            $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                            uievents.synccheckoutH();
                            errorcount++;
                    }
                }
               if($('.knife .custom-link.agecheck-link').is(':visible')) {
                   if(!$('input[name$="agecheck_ischeck"]').is(':checked')) {
                    	if($('.addressoptions.knife .agecheck_message #message').length == 0){
                            $('.addressoptions.knife .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                            $('.singleshipping_error').show();
                    	}
                            $('.addressoptions.knife > .custom-checkbox .custom-link').addClass('error');
                            uievents.synccheckoutH();
                            errorcount++;
                    }
                }

        	}
        }
        else {
           if($('.vip-terms .custom-link').is(':visible') && !$('input[name$="_isvip"]').is(':checked')) {
                    	if( $('.vip-terms .custom-checkbox .vip-message #message').length == 0){
                            $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                            $('.singleshipping_error').show();
                    	}
                        $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                        uievents.synccheckoutH();
                        errorcount++;
            }
           if($('.knife .custom-link.agecheck-link').is(':visible') && !$('input[name$="agecheck_ischeck"]').is(':checked')) {
                	if($('.addressoptions.knife .agecheck_message #message').length == 0){
                        $('.addressoptions.knife  .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                        $('.singleshipping_error').show();
                	}
                	$('.addressoptions.knife  > .custom-checkbox .custom-link').addClass('error');
                    uievents.synccheckoutH();
                    errorcount++;
            }
       /*     if(!$('input.paypalprocessed').val()){
            	$('.paymentform.paypal .paypalmsg').addClass('error');
            	 return false;

            }*/
        }
        if(errorcount > 0){
        	$('.singleshipping_error').show();
         	return false;
         }
        if($('.billing-address-fields').is(':visible')){
        	$('.billing-address-fields .state-blk select').blur();
        }
    });
    //JIRA PREV-38 : Billing page_Credit Card Section: CVV number should not pre-populate.
    /*if ($('.bypassDAV').length === 0) {
        $('.spc-billing .form-row.cvn input').val('');
    }*/
    if($('.invalidCreditcard').length>0){
		//$('.singleshipping_error').show();
		$('.cardnumber input').addClass('errorclient');
		$('.cardnumber .labeltext').addClass('error');
		$('<span class="invalidcredit error">- Invalid Credit Card Number</span>').appendTo('.cardnumber .field-wrapper');
		//$('.singleshipping_error').show();
		$('.cardnumber .errormessage').css('display','none');
	}
};

},{"../../addressvalidation":1,"../../ajax":2,"../../giftcard":12,"../../progress":39,"../../tooltip":46,"../../uievents":47,"../../util":48,"../../validator":49,"./formPrepare":23}],23:[function(require,module,exports){
'use strict';

var _ = require('lodash');

var $form, $continue, $requiredInputs, validator;

var hasEmptyRequired = function () {
    // filter out only the visible fields
    var requiredValues = $requiredInputs.filter(':visible').map(function () {
        return $(this).val();
    });
    return _(requiredValues).contains('');
};

var validateForm = function () {
    // only validate form when all required fields are filled to avoid
    // throwing errors on empty form
    if (!validator) {
        return;
    }
    if (!hasEmptyRequired()) {
        if (validator.form()) {
            //$continue.removeAttr('disabled');
        }
    } else {
        //$continue.attr('disabled', 'disabled');
    }
};

var validateEl = function () {
    if ($(this).val() === '') {
       // $continue.attr('disabled', 'disabled');
    } else {
        // enable continue button on last required field that is valid
        // only validate single field
        if (validator.element(this) && !hasEmptyRequired()) {
            //$continue.removeAttr('disabled');
        } else {
            //$continue.attr('disabled', 'disabled');
        }
    }
};

var init = function (opts) {
    if (!opts.formSelector || !opts.continueSelector) {
        throw new Error('Missing form and continue action selectors.');
    }
    $form = $(opts.formSelector);
    $continue = $(opts.continueSelector);
    validator = $form.validate();
    $requiredInputs = $('.required', $form).find(':input');
    validateForm();
    // start listening
    $requiredInputs.on('change', validateEl);
    $requiredInputs.filter('input').on('keyup', _.debounce(validateEl, 200));
};

exports.init = init;
exports.validateForm = validateForm;
exports.validateEl = validateEl;

},{"lodash":53}],24:[function(require,module,exports){
'use strict';

var address = require('./address'),
    billing = require('./billing'),
    multiship = require('./multiship'),
    uievents = require('../../uievents'),
    util = require('../../util'),
    shipping = require('./shipping');



/**
 * @function Initializes the page events depending on the checkout stage (shipping/billing)
 */
exports.init = function () {
    address.init();
    if( $(".allotment-label").length > 0 || $(".brand-rapala-checkout").length > 0 ) {
    	$("body").find("#main").addClass("allotment-available");
    }
    if ($('.checkout-shipping').length > 0) {
        shipping.init();
    } else if ($('.checkout-multi-shipping').length > 0) {
        multiship.init();
    }/* else if ($('.checkout-billing').length > 0) { //PREVAIL-Added $('.checkout-billing').length > 0 to handle SPC
        billing.init();
    } */else {
        billing.init();
    }
    $(window).resize(function(){
    	 $(".ui-dialog-content:visible").each(function () {
 	        $( this ).dialog("option","position",$(this).dialog("option","position"));
 	    });
    });
    $("body").find('.form-row').each(function () {
		if($(this).find('.field-wrapper .clearbutton').length == 0 &&  $(this).find('.field-wrapper').find("input[type='text']").length > 0) {
			$(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
			if($(this).find('.field-wrapper').find("input[type='text']").val().length > 0 ) {
    			$(this).find('.field-wrapper').find('.clearbutton').show();
			}
		}
		else if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper').find("input[type='password']").length > 0) {
			$(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
			if($(this).find('.field-wrapper').find("input[type='password']").val().length > 0) {
				$(this).find('.field-wrapper').find('.clearbutton').show();
			}
		}
	});
    $("body").find('.form-row .field-wrapper input').on('focus', function () {
    	if($(this).hasClass("errorclient")) {
    		$(this).removeClass("errorclient");
    	}
 	});
    $("body").find('.form-row .field-wrapper input').on('keyup input blur', function () {
        if($(this).val() != undefined) {
            if($(this).val().length > 0) {
         	   $(this).closest('.form-row').find('a.clearbutton').show();
             }
             else {
             	$(this).closest('.form-row').find('a.clearbutton').hide();
             }
         }
 	});
    $('body').find("input").focusin(function() {
    	$(this).closest(".formfield, .form-row").removeClass('inputlabel');
		$(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
		$(this).removeClass('errorclient');
		$(this).closest('.formfield , .form-row').find('.logerror , .existing_register').css('display','none');
	});
	$("body").find('.form-row a.clearbutton').on("click",function(){
		$(this).closest(".field-wrapper").find('span').remove();
		$(this).closest(".field-wrapper").find('.required').removeClass('errorclient');
		$(this).closest('.form-row').find('.form-row , .label span').removeClass('inputlabel');
		$(this).closest('.form-row').find('input') .val("");
		$(this).closest('.form-row').find('a.clearbutton').hide();
		$(this).closest(".form-row").find("span.logerror , .existing_register").hide();
	});

	$('.pt_checkout .textinput, .pt_checkout .custom-select-wrap, .pt_checkout .textinputpw').bind('keyup blur', function () {
        if(jQuery(".New-shipping-authentication-detail").find("input[name$='_ProcessWay']").val() == 2) {
             var errordiv = "<div class='error loginerror'>" + app.resources['checkout_login_error'] + "</div>";
            if($('.shippinglogindetails').is(':visible') || !$('.checkoutshipping form[id$="_login"]').valid()) {
                if($('.checkout .loginerror').length > 0) {
                     $('.checkout .loginerror').remove();
                 }
                 jQuery('.state-blk .stateerror.error').hide();
                if($(this).closest('.formfield').find('.loginerror').length == 0) {
                     $(this).closest('.formfield').append(errordiv);
                 }
             }
         }
        setTimeout(function(){
  			uievents.synccheckoutH();
  		},100);
	});

	$(".new-address-button").bind('click', function(){
		//jQuery("input[name=${pdict.CurrentForms.singleshipping.shippingAddress.makedefault.htmlName}]").attr('checked', true);
		$(".addressoptions-addToAddressBook,.addressoptions-makedefault ").removeClass("hide");
		$("input[name$='shippingAddress_selectedaddress']").val("");
		$(".selected-shipping-address").empty()
		$("input[name$='_addressid']").val('');
		$("input[name$='_addressFields_firstName']").val("");
		$("input[name$='_addressFields_lastName']").val("");
		$("input[name$='_addressFields_address1']").val("");
		$("input[name$='_addressFields_address2']").val("");
		$("input[name$='_addressFields_city']").val("");
		$("input[name$='_addressFields_postal']").val("");
		$("input[name$='_addressFields_phone']").val("");
		uievents.changeFormSelection(jQuery("select[name$='_addressFields_states_state']")[0], "");
		uievents.changeFormSelection(jQuery("select.address-select")[0], "");
		$(".shipping-address-field-section").removeClass("hide");
		$(".selected-shipping-address, .new-address-field").addClass("hide");
		$("input[name$='_addressFields_phone']").closest("div.phone").find("span.errorclient").remove();
		$("input[name$='_addressFields_postal']").closest("div.zip").find("span.errorclient").remove();
		$(".addressform .form-row.custom-select").removeClass("customselect-error");
		$('.custom-select').each(function(){
			var select_val = $(this)	.find(":selected").text();
			$(this).find('.selectorOut').text(select_val);
		});
		if($(".checkout").hasClass("billingsection")) {
			$("body").find("input[name$=_sameasshippingaddress]").removeAttr("checked");
	        $("body").find("input[name$=_sameasshippingaddress]").closest(".custom-checkbox").find(".custom-link").removeClass("active");
		}
		$("a.clearbutton").hide();
		$('.shipping-address-field-section .form-row').find('input').removeClass('errorclient');
		uievents.customFields();
		uievents.synccheckoutH();
	});
	$(".edit-address-field .edit-billing-button").bind('click', function(){
		var $form = $('.address');
		var selectedAddress = $(this).closest(".edit-address-field").data('address');
		util.fillAddressFields(selectedAddress, $form);
        $(".edit-address-field").addClass("hide");
        $(".selected-shipping-address, .new-address-field").addClass("hide");
        $(".billing-address-fields").removeClass("hide");
		uievents.customFields();
		uievents.synccheckoutH();
	});
	uievents.synccheckoutH();
    //if on the order review page and there are products that are not available diable the submit order button
   /* if ($('.order-summary-footer').length > 0) {
        if ($('.notavailable').length > 0) {
            $('.order-summary-footer .submit-order .button-fancy-large').attr('disabled', 'disabled');
        }
    }*/
};

},{"../../uievents":47,"../../util":48,"./address":21,"./billing":22,"./multiship":25,"./shipping":26}],25:[function(require,module,exports){
'use strict';

var address = require('./address'),
    formPrepare = require('./formPrepare'),
    dialog = require('../../dialog'),
    util = require('../../util'),
    shipping = require('./shipping'), //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.
    ajax = require('../../ajax'); //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.

/**
 * @function
 * @description Initializes gift message box for multiship shipping, the message box starts off as hidden and this will display it if the radio button is checked to yes, also added event handler to listen for when a radio button is pressed to display the message box
 */
function initMultiGiftMessageBox() {
    $.each($('.item-list'), function () {
        var $this = $(this);
        var $giftMessage = $this.find('.gift-message-text');

        //handle initial load
        $giftMessage.toggleClass('hidden', $('input[name$="_isGift"]:checked', this).val() !== 'true');

        //set event listeners
        $this.on('change', function () {
            $giftMessage.toggleClass('hidden', $('input[name$="_isGift"]:checked', this).val() !== 'true');
        });
    });
}


/**
 * @function
 * @description capture add edit adddress form events
 */
function addEditAddress(target) {
    var $addressForm = $('form[name$="multishipping_editAddress"]'),
        $addressDropdown = $addressForm.find('select[name$=_addressList]'),
        $addressList = $addressForm.find('.address-list'),
        add = true,
        selectedAddressUUID = $(target).parent().siblings('.select-address').val();

    $addressDropdown.on('change', function (e) {
        e.preventDefault();
        var selectedAddress = $addressList.find('select').val();
        if (selectedAddress !== 'newAddress') {
            selectedAddress = $.grep($addressList.data('addresses'), function (add) {
                return add.UUID === selectedAddress;
            })[0];
            add = false;
            // proceed to fill the form with the selected address
            util.fillAddressFields(selectedAddress, $addressForm);
        } else {
            //reset the form if the value of the option is not a UUID
            add = true; //PREVAIL - Added to handle back and forth scenarios.
            $addressForm.find('.input-text, .input-select').val('');
        }
    });

    $addressForm.on('click', '.cancel', function (e) {
        e.preventDefault();
        dialog.close();
    });

    $addressForm.on('submit', function (e) {
        e.preventDefault();

        // PREV-98: validation error messages are not displayed when adding address in Multi-Shipping. Added the following IF block.
        if (!$addressForm.valid()) {
            return false;
        }
        $.getJSON(Urls.addEditAddress, $addressForm.serialize(), function (response) {
            if (!response.success) {
                // @TODO: figure out a way to handle error on the form
                return;
            }
            var address = response.address,
                $shippingAddress = $(target).closest('.shippingaddress'),
                $select = $shippingAddress.find('.select-address'),
                $selected = $select.find('option:selected'),
                newOption = '<option value="' + address.UUID + '">' +
                ((address.ID) ? '(' + address.ID + ')' : address.firstName + ' ' + address.lastName) + ', ' +
                address.address1 + ', ' + address.city + ', ' + address.stateCode + ', ' + address.postalCode +
                '</option>';
            dialog.close();
            if (add) {
                $('.shippingaddress select').removeClass('no-option').append(newOption);
                $('.no-address').hide();
            } else {
                $('.shippingaddress select').find('option[value="' + address.UUID + '"]').html(newOption);
            }
            // if there's no previously selected option, select it
            if ($selected.length === 0 || $selected.val() === '') {
                $select.find('option[value="' + address.UUID + '"]').prop('selected', 'selected').trigger('change');
            }
        });
    });

    //preserve the uuid of the option for the hop up form
    if (selectedAddressUUID) {
        //update the form with selected address
        $addressList.find('option').each(function () {
            //check the values of the options
            if ($(this).attr('value') === selectedAddressUUID) {
                $(this).prop('selected', 'selected');
                $addressDropdown.trigger('change');
            }
        });
    }
}

/**
 * @function
 * @description shows gift message box in multiship, and if the page is the multi shipping address page it will call initmultishipshipaddress() to initialize the form
 */
exports.init = function() {
    initMultiGiftMessageBox();
    if ($('.cart-row .shippingaddress .select-address').length > 0) {
        formPrepare.init({
            continueSelector: '[name$="addressSelection_save"]',
            formSelector: '[id$="multishipping_addressSelection"]'
        });
    }
    $('.edit-address').on('click', 'a', function (e) {
        e.preventDefault(); //JIRA PREV-205-Checkout Multiple Shipping Page - In Add/Edit address page cancel button not responding
        dialog.open({
            url: this.href,
            options: {
                open: function () {
                    address.init();
                    addEditAddress(e.target);
                    require('../../validator').init(); //JIRA PREV-98 : validation error messages are not displayed when adding  multiple address.re-init validator.
                    require('../../tooltip').init(); // JIRA PREV-84 : Multiple shipping page: Not displaying Tool tip. re-init tooltips.
                }
            }
        });
    });

    /*
      Start JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav
      Start JIRA PREV-103 : Selected shipping method will not update automatically in right nav
    */
    $(document).find('.checkoutmultishipping select[name$="_shippingMethodID"]').on('change', function () {
        var shipmentID = $(this).data('shipmentid');
        var shippingMethodId = $('option:selected', this).attr('value');
        ajax.getJson({
            url: Urls.multiShippingSelectSM,
            data: {
                'shipmentID': shipmentID,
                'shippingMethodId': shippingMethodId
            },
            callback: function (data) {
                shipping.updateSummary();
                if (!data || !data.success) {
                    window.alert('Could not select shipping method.');
                    return false;
                }
            }
        });
    });
    /*End JIRA PREV-103, PREV-99*/
};

},{"../../ajax":2,"../../dialog":10,"../../tooltip":46,"../../util":48,"../../validator":49,"./address":21,"./formPrepare":23,"./shipping":26}],26:[function(require,module,exports){
'use strict';

var ajax = require('../../ajax'),
    formPrepare = require('./formPrepare'),
    progress = require('../../progress'),
    tooltip = require('../../tooltip'),
    util = require('../../util'),
    dialog = require('../../dialog'),
    uievents = require('../../uievents');

var shippingMethods;
/**
 * @function
 * @description Initializes gift message box, if shipment is gift
 */
function giftMessageBox() {
    // show gift message box, if shipment is gift
    $('.gift-message-text').toggleClass('hidden', $('input[name$="_shippingAddress_isGift"]:checked').val() !== 'true');
}

/**
 * @function
 * @description updates the order summary based on a possibly recalculated basket after a shipping promotion has been applied
 */
function updateSummary() {
    var $summary = $('#secondary .new-summery-cart');
    // indicate progress
    progress.show($summary);
    var stateValue = $("body").find('select[id$="_addressFields_states_state"]').val();
    var url = util.appendParamToURL(Urls.summaryRefreshURL,"selectedState",stateValue);
    // load the updated summary area
    $summary.load(url, function() {
        // hide edit shipping method link
        $summary.fadeIn('fast');
        $summary.find('.checkout-mini-cart .minishipment .header a').hide();
        $summary.find('.order-totals-table .order-shipping .label a').hide();
        uievents.synccheckoutH();
    });
}

/**
 * @function
 * @description Helper method which constructs a URL for an AJAX request using the
 * entered address information as URL request parameters.
 */
function getShippingMethodURL(url, extraParams) {
    var $form = $('.address');
    var params = {
        address1: $form.find('input[name$="_address1"]').val(),
        address2: $form.find('input[name$="_address2"]').val(),
        countryCode: $form.find('select[id$="_country"]').val(),
        stateCode: $form.find('select[id$="_state"]').val(),
        postalCode: $form.find('input[name$="_postal"]').val(),
        city: $form.find('input[name$="_city"]').val()
    };
    return util.appendParamsToUrl(url, $.extend(params, extraParams));
}

/**
 * @function
 * @description selects a shipping method for the default shipment and updates the summary section on the right hand side
 * @param
 */
function selectShippingMethod(shippingMethodID) {
    // nothing entered
    if (!shippingMethodID) {
        return;
    }
    // attempt to set shipping method
    var url = getShippingMethodURL(Urls.selectShippingMethodsList, {
        shippingMethodID: shippingMethodID
    });
    ajax.getJson({
        url: url,
        callback: function (data) {
            updateSummary();
            uievents.synccheckoutH();
            if (!data || !data.shippingMethodID) {
                window.alert('Couldn\'t select shipping method.');
                return false;
            }
            // display promotion in UI and update the summary section,
            // if some promotions were applied
            $('.shippingpromotions').empty();


            // if (data.shippingPriceAdjustments && data.shippingPriceAdjustments.length > 0) {
            // 	var len = data.shippingPriceAdjustments.length;
            // 	for (var i=0; i < len; i++) {
            // 		var spa = data.shippingPriceAdjustments[i];
            // 	}
            // }
        }
    });
}

/**
 * @function
 * @description Make an AJAX request to the server to retrieve the list of applicable shipping methods
 * based on the merchandise in the cart and the currently entered shipping address
 * (the address may be only partially entered).  If the list of applicable shipping methods
 * has changed because new address information has been entered, then issue another AJAX
 * request which updates the currently selected shipping method (if needed) and also updates
 * the UI.
 */
function updateShippingMethodList() {
    var $shippingMethodList = $('#shipping-method-list');
    if (!$shippingMethodList || $shippingMethodList.length === 0) {
        return;
    }
    var url = getShippingMethodURL(Urls.shippingMethodsJSON);

    ajax.getJson({
        url: url,
        callback: function (data) {
            if (!data) {
                window.alert('Couldn\'t get list of applicable shipping methods.');
                return false;
            }
            /*if (false && shippingMethods && shippingMethods.toString() === data.toString()) { // PREVAIL-Added for 'false' to handle SPC.
                // No need to update the UI.  The list has not changed.
                return true;
            }*/

            // We need to update the UI.  The list has changed.
            // Cache the array of returned shipping methods.
            shippingMethods = data;
            // indicate progress
            progress.show($shippingMethodList);

            // load the shipping method form
            var smlUrl = getShippingMethodURL(Urls.shippingMethodsList);
            $shippingMethodList.load(smlUrl, function () {
                $shippingMethodList.fadeIn('fast');
                // rebind the radio buttons onclick function to a handler.
                $shippingMethodList.find('[name$="_shippingMethodID"]').click(function () {
                	$(".shipping-methods .shipping-method .value .custom-link ").removeClass("active");
                	$(this).closest(".custom-link").addClass("active");
                    selectShippingMethod($(this).val());
                });

                // update the summary
                updateSummary();
                uievents.synccheckoutH();
                progress.hide();
                tooltip.init();
                //if nothing is selected in the shipping methods select the first one
                if ($shippingMethodList.find('.input-radio:checked').length === 0) {
                    $shippingMethodList.find('.input-radio:first').prop('checked', 'checked');
                }
            });
        }
    });
}

function signin() {
    $('#addressform .textinput').addClass('blured');
    $('#addressform .custom-select').addClass('blured');
    $('#addressform .custom-checkbox').addClass('blured');
    $(".signintomyaccount-block,.shipping-createrapalaaccount,.shipping-confirmemailaddress,.shipping-emailaddress,.shipping-guestconfirmemailaddress,.shipping-guestemailaddress,.shipping-password,.shipping-confirmpassword,.shipping-checkoutasguest,.or1,.createaccountmsg")
        .addClass("hide");
    $(".checkoutasguest-block,.shippinglogindetails,.createanaccount-block,.or2,.addressoptions-addToAddressBook,.addressoptions-makedefault,.addressid").removeClass("hide");
    $(".shippinglogindetails").find("input[name$='_username'],input[name$='_password']").addClass("required");
    $(".New-shipping-authentication-detail").find("input[name$='_passwordconfirm'],input[name$='_password'],input[name$='_email'],input[name$='_emailconfirm'],input[name$='_guestemailconfirm'],input[name$='_guestemail']").removeClass("required");
    $(".New-shipping-authentication-detail").find("input[name$='_ProcessWay']").val("2");
    $(".New-shipping-authentication-detail").find("input[name$='_passwordconfirm'],input[name$='_password']").val("");
    $('.checkout .shipping-address-field-section .formfield span.errorclient').remove();
    $('.shipping-address-field-section').addClass('signin-error');
    uievents.synccheckoutH();
}

exports.init = function() {
    /*formPrepare.init({
        continueSelector: '[name$="shippingAddress_save"]',
        formSelector: '[id$="singleshipping_shippingAddress"]'
    });*/
	if($(document).find('.address-select').val() != "" && $(document).find('.address-select').val() != undefined){
    	$(document).find('.shipping-address-field-section').addClass('hide');
    } else {
    	$(document).find('.shipping-address-field-section').removeClass('hide');
    	$(document).find('.selected-shipping-address').addClass('hide');
    	$(document).find('.new-address-field').addClass('hide');
    }
	if($(document).find('.fromreturn1').val() == 'true'){
	 	$(document).find('.shipping-address-field-section').removeClass('hide');
	}
    $('input[name$="_shippingAddress_isGift"]').on('click', giftMessageBox);

    $('.address').on('change',
        'input[name$="_addressFields_address1"], input[name$="_addressFields_address2"], select[name$="_addressFields_states_state"], input[name$="_addressFields_city"], input[name$="_addressFields_postal"]', // PREVAIL-Changed ZIP to postal
        updateShippingMethodList
    );

    giftMessageBox();
    updateShippingMethodList();

    $('.continue-checkout-button .continue-checkout').on('click', function(){
		var form = $(this).closest('form[id$="_shippingAddress"]');
		if($('.state-blk select').valid() == 0) {
	 		if(!$('.state-blk.custom-select').hasClass('blured')){
	 			$('.state-blk.custom-select').addClass('customselect-error');
				//$('.state-blk .stateerror').show();
	 		}
		}else{
			//$('.state-blk  .stateerror').hide();
			$('.state-blk.custom-select').removeClass('customselect-error');
		}

		if(!$('.checkoutasguestbutton').is(':visible')){
			$('.guestemailcon').blur();
			$('.guestemail').blur();
		}
		if(!form.valid()){
			if(jQuery('.shipping-address-field-section').hasClass('hide'))
			{
				$('select[name$=singleshipping_addressList]').val('');
				$('input[name$="singleshipping_shippingAddress_selectedaddress"]').val('');
				$('.custom-select').each(function(){
					var select_val = $(this)	.find(":selected").text();
					$(this).find('.selectorOut').text(select_val);
				});
				$('.shipping-address-field-section').removeClass('hide');
				$('.selected-shipping-address').addClass('hide');
			}
			if(!$('.shippinglogindetails').is(':visible')){
				$('.singleshipping_error').removeClass("hide");
				$('.signinabove').hide();
			}else  if($('.shippinglogindetails').is( ':visible')) {
	        	if(!$('.shippinglogindetails form').valid()){
	        		$('.shippinglogindetails .username .textinput, .shippinglogindetails .textinputpw').blur();
	        		$('button[name$="login_login"]').trigger('click');
	        	}
	            var errormsg = "<div id='message' class='error-alert signinabove' style='text-align: left;'>Please Log in above to continue</div>";
	           if($('#dwfrm_singleshipping_shippingAddress .formactions #message').length > 0 || $('#dwfrm_singleshipping_shippingAddress .formactions .singleshipping_error').length > 0) {
	                jQuery( "#dwfrm_singleshipping_shippingAddress .formactions #message").remove();
	                jQuery('#dwfrm_singleshipping_shippingAddress .formactions .singleshipping_error').hide();
	            }
	            jQuery('.singleshipping_error').hide();
	            jQuery("#dwfrm_singleshipping_shippingAddress .formactions").prepend(errormsg);
	            uievents.synccheckoutH();
	           return false;
	        }
		}else{
			$('.singleshipping_error').addClass("hide");
		}
		uievents.synccheckoutH();
	});

    $("body").on("click", ".go-as-guest-checkout",function(){
  		$(".shipping-checkoutasguest, .signintomyaccount-block").removeClass("hide");
  		$(".shippinglogindetails , .addressid").addClass("hide");
  		uievents.synccheckoutH();
  	});
    if( $(".state-shipping-valid-dialog").length > 0 ) {
   	 	var dialogWidth = 511;
		var singOutDialog = dialog.create({
			target: "#dialog-container",
			options: {
				 bgiframe: true,
			     autoOpen: false,
			     modal: true,
			     width: dialogWidth,
			     dialogClass: 'state-shipping-dialog'
			}
		});
		$(singOutDialog).empty().append($(".state-shipping-valid-dialog").html());
		singOutDialog.dialog("open");
   }
    $("body").on("click", '.shippingsignout',function(e){
		e.preventDefault();
		$.ajax({
			 url: this.href,
			 success: function(data) {
				 var dialogWidth = 500;
				 /*if( $(window).width() < 767 ){
					 dialogWidth = 300
				 }*/
				 var singOutDialog = dialog.create({
			         target: "#dialog-container",
			         options: {
			        	 bgiframe: true,
			             autoOpen: false,
			             modal: true,
			             width: dialogWidth,
			             dialogClass: 'sing-out-dialog'
			         }
				 });
				 $(singOutDialog).empty().append(data);
				 singOutDialog.dialog("open");
			 }
		});
	});
    $("body").on("click", ".signintomyaccountbutton" ,function () {
        signin();
        $('form[id$="_login"] .formfield.username, form[id$="_login"] .formfield.password').each(function () {
            $(this).find('.value input').val('').removeClass('errorclient');
            $(this).find('.value span.errorclient').hide();
        });
        $('form[id$="_login"] .wrongaddress').hide();
        $('form[id$="_login"] .#message.error').remove();

        $('.singleshipping_error').hide();
        $(".shipping-emaildetaillinks").addClass('loginactive');
        $(".shipping-emaildetaillinks").removeClass('reginactive');
        $('.New-shipping-authentication-detail input[id$="shippingAddress_email"]').removeClass('accemail');
        $('.New-shipping-authentication-detail input[id$="shippingAddress_emailconfirm"]').removeClass('accemailcon');
        $(".New-shipping-authentication-detail input[name$='_guestemailconfirm']").removeClass('guestemailcon');
   	 	$(".New-shipping-authentication-detail input[name$='_guestemail']").removeClass('guestemail');
        $(".shippinglogindetails input[name$='login_username']").addClass('loggedemail');
        $('.shippinglogindetails .correctaddress').removeClass('error').hide();
        if($('.emailhidden').val()){
        	$('input[id$="login_username"]').val($('.emailhidden').val());
        	$('input[id$="login_username"]').blur();
        	$('input[id$="login_username"]').closest('.formfield').find('.correctaddress').show();
        }
        $(".New-shipping-authentication-detail input[name$='shippingAddress_password']").removeClass('c_password');
        $(".New-shipping-authentication-detail input[name$='shippingAddress_passwordconfirm']").removeClass('cm_password');
        $(".shippinglogindetails input[name$='login_password']").addClass('login_password');
        $(".shipping-address-field-section .value input").removeClass('errorclient');
        $('.shipping-address-field-section .value span.errorclient').hide();
        $('.custom-select').removeClass('customselect-error');
        $('.stateerror').hide();
        uievents.synccheckoutH();
    });

    $('.shipping-guestemailaddress .textinput, .shipping-guestconfirmemailaddress .textinput, .shippinglogindetails .username .textinput, .shippinglogindetails .textinputpw, .shipping-emailaddress .textinput, .shipping-confirmemailaddress .textinput, .shipping-password .textinputpw, .shipping-confirmpassword .textinputpw').blur(function () {
        if($(this).valid() == 0) {
            $(this).closest('.formfield').find('.correctaddress').addClass('error').show();
        }
        else {
            $(this).closest('.formfield').find('.correctaddress').removeClass('error').show();
        }
    });
    //PREVAIL - init Address Validation
      require('../../addressvalidation').init();
};

exports.updateShippingMethodList = updateShippingMethodList;
exports.updateSummary = updateSummary; //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.

},{"../../addressvalidation":1,"../../ajax":2,"../../dialog":10,"../../progress":39,"../../tooltip":46,"../../uievents":47,"../../util":48,"./formPrepare":23}],27:[function(require,module,exports){
'use strict';

var addProductToCart = require('./product/addToCart'),
    ajax = require('../ajax'),
    page = require('../page'),
    productTile = require('../product-tile'),
    quickview = require('../quickview');

/**
 * @private
 * @function
 * @description Binds the click events to the remove-link and quick-view button
 */
function initializeEvents() {
    $('#compare-table').on('click', '.remove-link', function (e) {
        e.preventDefault();
        ajax.getJson({
            url: this.href,
            callback: function (response) {
                /* Start JIRA PREV-74 : Compare page: Not navigating to PLP, When user clicks the "Remove (X)" icon on the last product,present in the product compare page.
                   Added condition to check for the last product removal if so navigate back to previous PLP.
                 */
                if (response.success && $('#compare-table .product-tile').length <= 1 && $('#compare-category-list').length === 0) {
                    window.location.href = $('.back').attr('href');
                } else if (response.success && $('#compare-table .product-tile').length <= 1 && $('#compare-category-list').length > 0) {
                    $('#compare-category-list option:selected').remove();
                    $('#compare-category-list').trigger('change');
                } else {
                    page.refresh();
                }
                /*End JIRA PREV-74 */
            }
        });
    })
    .on('click', '.open-quick-view', function (e) {
        e.preventDefault();
        var url = $(this).closest('.product').find('.thumb-link').attr('href');
        quickview.show({
            url: url,
            source: 'quickview'
        });
    });

    $('#compare-category-list').on('change', function () {
        $(this).closest('form').submit();
    });
}

exports.init = function() {
    productTile.init();
    initializeEvents();
    addProductToCart();
};

},{"../ajax":2,"../page":18,"../product-tile":38,"../quickview":40,"./product/addToCart":29}],28:[function(require,module,exports){
var  util = require('../util');

function initializationEvent() {
	var currentSiteID = '';
	var currentSessionSite = $("body").find(".current-session-site").val();
	switch (currentSessionSite) {
	    case "rapala":
	    	currentSiteID = "1";
	    	break;
	    case "sufix":
	    	currentSiteID = "2";
	    	break;
	    case "triggerx":
	    	currentSiteID = "3";
	    	break;
	    case "storm":
	    	currentSiteID = "4";
	    	break;
	    case "luhrjensen":
	    	currentSiteID = "5";
	    	break;
	    case "vmc":
	    	currentSiteID = "6";
	    	break;
	    case "terminator":
	    	currentSiteID = "7";
	    	break;
	    case "bluefox":
	    	currentSiteID = "8";
	    	break;
	    case "williamson":
	    	currentSiteID = "9";
	    	break;
	    case "marcum":
	    	currentSiteID = "10";
	    	break;
	    case "strikemaster":
	    	currentSiteID = "11";
	    	break;
	    case "iceforce":
	    	currentSiteID = "20";
	    	break;
	   case "otter":
	    	currentSiteID = "21";
	    	break;
	    default:
	    	currentSiteID = "1";
	}

	if(document.location.pathname.indexOf('ChangeRegion') < 0) {
		if(typeof geoipCountryCode == 'function') {
			var IP_GeoCode = geoipCountryCode();
			var allowed_countries = $(".allowed-countries").text();
			if(allowed_countries == null || allowed_countries == 'null' || allowed_countries == "undefined"){
				allowed_countries = "US";
			}
			if(allowed_countries.indexOf(IP_GeoCode) != -1){
				var url = util.appendParamToURL(Urls.internationalHomeShow,'id',currentSiteID);
				window.location.href = url;
			 }
		}
	}

}

var international = {
	init: function() {
		initializationEvent();
	}
}
module.exports = international;
},{"../util":48}],29:[function(require,module,exports){
'use strict';

var dialog = require('../../dialog'),
    minicart = require('../../minicart'),
    page = require('../../page'),
    util = require('../../util'),
    TPromise = require('promise'),
    _ = require('lodash');

/**
 * @description Handler to handle the add all items to cart event
 */
var addAllToCart = function (e) {
    e.preventDefault();

    //PREVAIL-Added for GA integration
    //GAcommented
    if (isEventTrackingEnabled && isGoogleAnalyticsEnabled) {
        googleAnalyticsEvents.addProductSet();
    }

    var $productForms = $('#product-set-list').find('form').toArray();
    TPromise.all(_.map($productForms, addItemToCart))
        .then(function (responses) {
            dialog.close();
            // show the final response only, which would include all the other items
            minicart.show(responses[responses.length - 1]);
        });
};

/**
 * @function
 * @description Binds the click event to a given target for the add-to-cart handling
 */
// adds a product to the mini cart
// @params
// progressImageSrc - source/url of the image to show when the item
// is being added to the cart
// postdata - form data containing the product information to be
// added to mini-cart
// callback - call back function/handler
var addToCart = {
	init: function() {
		$('.checkoutminicart').slimscroll();
		$('.add-to-cart[disabled]').attr('title', $('.availability-msg').text());
	    //Start JIRA PREV-454, PREV-469 : Application navigation not consistent when click of add to cart button of the Product set page
	    $('#add-all-to-cart').on('click', addAllToCart);
        if($('.mini-cart-product').length > 1) {
        	$('.minicartcontent .slimScrollDiv').removeClass('less');
        	$('.minicartcontent .slimScrollDiv .slimScrollBar').show();
        }
        else {
        	$('.minicartcontent .slimScrollDiv').addClass('less');
        	$('.minicartcontent .slimScrollDiv .slimScrollBar').hide();
        }
	},
	add : function (progressImageSrc, postdata, callback) {
	    // get the data of the form as serialized string
	    var postdata = postdata;

	    fbq('track','AddToCart', {
			content_ids: [postdata.pid],
			content_type: 'product'
		});

	    // get button reference
	    var addButtons = [];

	    // the button to update
	    var addButton = null;

	    // it is an array of buttons, but we need only one all
	    // other combinations are strange so far
	   if(addButtons.length == 1) {
	        addButton = addButtons[0];
	    }

	    var previousImageSrc = null;

	    // show progress indicator
	   if(addButton != null) {
	        previousImageSrc = addButton.src;
	        addButton.src = progressImageSrc;
	    }

	    // handles successful add to cart
	    var handlerFunc = function (req) {

	    	if ( $("#container").hasClass("pt_cart") ) {
	    		window.location.href = window.location.href;
	    	}
	        // hide progress indicator
	       if(addButton != null) {
	            addButton.src = previousImageSrc;
	        }

	        // replace the content
	        jQuery('#minicart').html(req);
	        addToCart.init();
	        if($('.minirow').length > 1 && !($('body').hasClass('rapala_device'))){
	              $('.checkoutminicart').slimscroll({
		  			railVisible: true,
		  		    alwaysVisible: true
		  		});
	        	$('.minicarttable').find('thead').first().addClass('theadfixedTop');
	        	$('.checkoutminicart').find('.cartordertotals').removeClass('carttotals');
		  		$('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
		  		$('.minicartcontent').find('.minicarttableheader').removeClass('miniwithoutScrollhead');
		  		$(".minicarttableheader").css('border-bottom','1px solid #ccc');

		  	}
		  	else {
		  		$('.minicarttable').find('.theadfixedTop').removeClass('theadfixedTop');
		  		$('.minicarttable').find('.fixedTop').removeClass('fixedTop');
		  		$('.minicart').find('.cartordertotals').addClass('carttotals');
		  		$('.checkoutminicart').find('.minicarttable').addClass('miniwithoutScroll');
		  		$('.minicartcontent').find('.minicarttableheader').addClass('miniwithoutScrollhead');
		  		$(".minicarttableheader").css('border-bottom','1px solid #ccc');

	        }

	        if($('body').hasClass('rapala_device')){
	        	$(".checkoutminicart").find(".minicarttable").removeClass("miniwithoutScroll");
	        	// $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','1px');
	        	 $('.minicarttable').find('thead').first().addClass('theadfixedTop');
	        	 $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','0px');
	        	 $(".minicarttableheader").css('border-bottom','1px solid #ccc');
	        }
	        $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','0px');

	       if(minicart.suppressSlideDown && minicart.suppressSlideDown()) {
	            // do nothing
	            // the hook 'MiniCart.suppressSlideDown()' should have
	            // done the refresh
	        }
	        else {
	            minicart.slide();
	            minicart.setminicarheight();
	           if(callback)
	                callback();
	        }
	        $("#pdpMain .addtocartconfirm-tooltip").fadeIn(400).show()
	            .delay(1500).fadeOut(400);
	        // fire the BonusDiscountLineItemCheck event so we can check
	        // if there is a bonus discount line item
	        jQuery(document).trigger(
	            jQuery.Event("BonusDiscountLineItemCheck"));
	    }

	    // handles add to cart error
	    var errFunc = function (req) {
	        // hide progress indicator
	       if(addButton != null) {
	            addButton.src = previousImageSrc;
	        }
	    }

	    // closes a previous mini cart
	    minicart.close();

	    // add the product
	    if ( $("#container").hasClass("pt_cart") && $(".addTo-cart-section").find(".recommendation_cart").length==0) {
	    	var plItemId = $('input.line-itemid').val();
	    	var params = {updateQty:"true",
	    	lineItemId: plItemId
	    	};
	    	var url = util.appendParamsToUrl(Urls.editLineItem,params);
    	} else {
    		var url = Urls.addProduct;
    	}

	    $.ajax({
	        type: "POST",
	        url: util.ajaxUrl(url),
	        cache: true,
	        data: postdata,
	        success: handlerFunc,
	        error: errFunc
	    });
	}
}
module.exports = addToCart;
},{"../../dialog":10,"../../minicart":17,"../../page":18,"../../util":48,"lodash":53,"promise":54}],30:[function(require,module,exports){
'use strict';

var  pdpEvents = require('./pdpEvents'),
	addToCart = require('./addToCart');

var product = {
    init: function () {
        //initializeDom();
        //initializeEvents();
    	addToCart.init();
    	pdpEvents.init();
    }
};

module.exports = product;

},{"./addToCart":29,"./pdpEvents":31}],31:[function(require,module,exports){
'use strict';
var util = require('../../util'),
	dialog = require('../../dialog'),
	tooltip = require('../../tooltip'),
	uievents = require('../../uievents'),
	quickview = require('../../quickview'),
	addToCart = require('./addToCart'),
	progress = require('../../progress'),
	ajax = require('../../ajax');

var Product = function(response) {
	// product private data

	// product json data
	var model 			= response;
	var resources = Resources;
	// div cotainer id
	var myContainerId	= "";

	// boolean flag to track the variants data request, reset in loadVariants() when the variants data is loaded
	var isLoadingVar	= false;

	// helper function to load variants data from the server
	// once the data is retrieved, it fires VariationsLoaded event so that UI can be refreshed appropriately
	var loadVariants	= function(thisProduct) {
		isLoadingVar = true;
		// build the url and load variants data
		ajax.getJson({
			url		: Urls.getVariants,
			data	: {"pid": thisProduct.pid, "format": "json"},
			callback: function(data){

				if (!data || !data.variations || !data.variations.variants) {
					return;
				}
				model.variations.variants = data.variations.variants;
				isLoadingVar = false; // we have loaded the variants
				jQuery(thisProduct).trigger("VariationsLoaded");
			}
		});
	}

	// helper function to reload availability data.
	// by default, availability data is based on a quantity of 1.
	// if a customer changes the quantity, use this method
	// to reload the availability based on the new quantity.
	var reloadAvailability = function(thisProduct, quantity) {

		var id = "";
		if(thisProduct.master || thisProduct.variant) {
			id = thisProduct.selectedVar.id;
		} else {
			id = thisProduct.pid;
		}

		ajax.getJson({
			url		: Urls.getAvailability,
			data	: {"pid": id, "Quantity": quantity, "format": "json"},
			callback: function(data){

				if (!data || !data.levels) {
					return;
				}

				// update the data in the variant
				if ((thisProduct.master || thisProduct.variant) && thisProduct.selectedVar) {
					thisProduct.selectedVar.avLevels = data.levels;
					thisProduct.selectedVar.avStatus = data.status;
					thisProduct.selectedVar.avStatusQuantity = data.statusQuantity;
				} else {
					model.avLevels = data.levels;
					model.avStatus = data.status;
					model.avStatusQuantity = data.status;
				}
				jQuery(thisProduct).trigger("ReloadAvailability");
			}
		});

	}
	// returns the aggregate available to sell value
	// from all variants
	var getATS = function(variants) {

		var atsCount = 0;
		var variant;
		for (var i=0; i<variants.length; i++) {
			variant = variants[i];
			if (variant.ATS > 0) {
				atsCount = atsCount + variant.ATS;
			}
		}
		return atsCount;
	}

	// returns the aggregate available to sell value
	// from all variants
	var getAvailability = function(variants) {

		var available = false;
		var variant;
		for (var i=0; i<variants.length; i++) {
			variant = variants[i];
			if (variant.avStatus !== "NOT_AVAILABLE") {
				available = true;
				break;
			}
		}
		return available;
	}

	// helper function to bind product options drop downs event handlers
	// Intializes the product.selectedOptions object with the currently selected options
	// it also shows the computed/updated price
	var getOptionsDiv	= function(thisProduct) {

		if (model.isOption) {

			var pdpOpt = jQuery(thisProduct.containerId+" .product_options:last select");

			pdpOpt.change(function(e){
				var vals = this.options[this.selectedIndex].value.split("%?%"); // 0 = value, 1 = price
				thisProduct.selectedOptions[this.id] = vals[0];
				thisProduct.selectedPrice[this.id] = vals[1];
				thisProduct.showUpdatedPrice(computePrice(thisProduct), model.pricing.standard);
			});

			// let us get the currently selected value and intilize the ui
			pdpOpt.each(function(i) {
				var vals = this.options[this.selectedIndex].value.split("%?%"); // 0 = value, 1 = price

				thisProduct.selectedOptions[this.id] = vals[0];
				thisProduct.selectedPrice[this.id] = vals[1];
				thisProduct.showUpdatedPrice(computePrice(thisProduct), model.pricing.standard);
			});
		}
	}

	// binds A2C button click handler
	var getAddToCartBtn = function(thisProduct) {
		var addToCartBtn = jQuery(thisProduct.containerId+" .addtocartbutton:last").click(function(e) {
			if (model.master || model.variant) {
				if (thisProduct.selectedVar == null) {
					return false;
				}

				// it is necessary to update the option id to be variant-specific
				jQuery(thisProduct.containerId+" .product_options:last select").each(function(){
					 var value = thisProduct.selectedOptions[this.id];
					 var newId = this.id.replace(thisProduct.pid, thisProduct.selectedVar.id);
					 thisProduct.selectedOptions[newId] = value;
					 delete thisProduct.selectedOptions[this.id];
					});

				thisProduct.selectedOptions.pid = thisProduct.selectedVar.id;
				thisProduct.selectedOptions.masterPid = thisProduct.pid;
			}
			else {
				// check if we are adding a bundle/productset to the cart
				if (model.bundle || model.productSet) {
					var subProducts = thisProduct.subProducts;
					var comma 		= ",";
					var tempQty 	= "";
					var subproduct 	= null;

					thisProduct.selectedOptions.childPids = "";

					if (model.productSet) {
						thisProduct.selectedOptions.Quantity = "";
					}

					// process each individual products in the set/bundle
					// and prepare product.selectedOptions for final submission
					for (var i = 0; i < subProducts.length; i++) {
						subproduct = subProducts[i];

						if (i == subProducts.length - 1) {
							comma = ""; // at the end of the list
						}

						// see if any of the sub products are variations, if so then get the selected variation id
						// from selectedVar property and make it a comma separated list
						if (subproduct.variant || subproduct.master) {
							if (subproduct.selectedVar == null) {
								return false;
							}
							thisProduct.selectedOptions.childPids += subproduct.selectedVar.id+comma;
						}
						else {
							thisProduct.selectedOptions.childPids += subproduct.pid+comma;
						}

						var tempPid = subproduct.selectedOptions.pid;
						subproduct.selectedOptions.pid = null;
						// merge selected options of sub product with the main product
						thisProduct.selectedOptions = jQuery.extend({}, thisProduct.selectedOptions, subproduct.selectedOptions);
						subproduct.selectedOptions.pid = tempPid;

						// if it is a product set then sub products can have their separate qty
						if (model.productSet) {
							tempQty += subproduct.selectedOptions.Quantity+comma;
						}
					}
				}

				// if it is a product set then sub products can have their separate qty
				// tempQty is a comma separated list of qty for each product in the set
				if (model.productSet) {
					thisProduct.selectedOptions.Quantity = tempQty;
				}

				// make sure the pid which gets submitted is for the main product
				thisProduct.selectedOptions.pid = thisProduct.pid;
			}

			if (model.bundle) {
				thisProduct.selectedOptions.Quantity = 1; // hard coded qty=1 when we the product is a bundle
			}
			else if (!model.productSet) {
				// grab the user entered qty
				thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();

			}

			// if it is not a productset then make sure qty is specified greater than 0
			if (model.productSet || thisProduct.selectedOptions.Quantity > 0) {
				// disable a2c button
				addToCartBtn.prop("disabled", true);

				// close the quick view when user clicks A2C.
				if( $("#QuickViewDialog").length > 0 ) {
					$('#QuickViewDialog').dialog('close');
				}
				// find if there is a handler bound to AddToCart event e.g. cart -> edit details or wishlist -> edit details etc.
				// then fire it otherewise call addToCart.add to add the selected product to the cart and show minicart
				var event = jQuery.Event("AddToCart");
				event.selectedOptions = thisProduct.selectedOptions;

				(jQuery.event.global["AddToCart"] == undefined || jQuery.event.global["AddToCart"] == null) ? addToCart.add( "", thisProduct.selectedOptions, function(){addToCartBtn.prop("disabled",false)} ) : jQuery(document).trigger(event);
			}
			return false;
		} );

		return addToCartBtn;
	}

	// bind qty box keyup handler
	// the handler grabs the value and updates
	// product.selectedOption.Quantity
	// show the updated availabilty message in case the available qty is different than available etc.
	// trigger AddtoCartEnabled event
	var getQtyBox 		= function(thisProduct) {

		jQuery(thisProduct.containerId+" .quantityinput:last").keyup(function(e){
			var val = null;
			try {
				val = parseInt(jQuery(thisProduct.containerId+" .quantityinput:last").val());
			} catch(e){val = null};

			if (val) {
				thisProduct.selectedOptions.Quantity = val;

				// if the product has variations check for non selected ones and display missing value
				if (model.variations != undefined) {
					var nonSelectedVars = [];

					// get the non-selected variations
					jQuery.each(model.variations.attributes, function(){
						if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
							nonSelectedVars.push(this.name);
						}
					});

					if (nonSelectedVars.length > 0) {

						// make sure there is something to sell
						var atsCount = getATS(model.variations.variants);
						if (atsCount == 0) {
							return;
						}

						var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
						var missingMsg = $.validator.format(Resources["MISSING_VAL"], tooltipStr);
						setAvailabilityMsg(missingMsg);
						return;
					}
				}

				// If the quantity value is different than
				// when we loaded the availability data, then
				// refresh availability data for this variant
				if (val != thisProduct.getAvailabilityQty()) {
					reloadAvailability(thisProduct, val);
				}
				//JCK: this isn't being run AFTER AJAX?
				//setAvailabilityMsg(createAvMessage(thisProduct, val));
				//jQuery(thisProduct).trigger("AddtoCartEnabled");
			}
		});

		// grab the currently displayed value basically the initial displayed value
		thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();

		if (!isLoadingVar) {
			// show proper availability message
			setAvailabilityMsg(createAvMessage(thisProduct, thisProduct.selectedOptions.Quantity));
		}
	}

	// create product tabs i.e. description, Attributes, Reviews etc.
	// it depends on jQuery to create tab display.
	// also bind tab print button click handler
	var getTabs 		= function(containerId) {

		var tabsDiv = jQuery(containerId+" #tabs");
		tabsDiv.tabs();

		// tab print handler
		jQuery("a.printpage").click(function() {
			window.print();
			return false;
		});
	}


	// register initializations here
	//show and hide handling of specific country.
	if(typeof geoipCountryCode == 'function') {
		var IP_GeoCode = geoipCountryCode();
		var allowed_countries = $(".allowed-countries").text();
		if(allowed_countries == null || allowed_countries == 'null' || allowed_countries == "undefined"){
			allowed_countries = "US";
		}
		if(allowed_countries.indexOf(IP_GeoCode) == -1){
			$(".addtowishlist").addClass("hide");
		 }
	}

	// bind addtowishlist, giftregistry, send to friend click handlers
	// bind handlers to AddtoCartDisabled, AddtoCartEnabled events for disabling/enabling wishlist/gift registry links
	var getMiscLinks 	= function(thisProduct) {

		var disablelinks = function() {
			if ((model.master || model.variant) && thisProduct.selectedVar == null) {
				// disable wishlist/gift registry links for master products
				jQuery(thisProduct.containerId+" .addtowishlist, "+thisProduct.containerId+" .addtoregistry").addClass("unselectable");
			}
		}

		disablelinks(); // call it for initial display and then register it with AddtoCartDisabled event

		jQuery(thisProduct).bind("AddtoCartDisabled", {}, disablelinks);

		jQuery(thisProduct).bind("AddtoCartEnabled", {}, function(e, source){
			// enable wishlist/gift registry links for variant products
			jQuery(thisProduct.containerId+" .addtowishlist, "+thisProduct.containerId+" .addtoregistry").removeClass("unselectable");
		});

		// listen for availability reload events
		jQuery(thisProduct).bind("ReloadAvailability", {}, function(e) {
			// update the availability message
			var variant = e.target.selectedVar;
			setAvailabilityMsg(createAvMessage(e.target, (variant == null ? model.avStatusQuantity : variant.avStatusQuantity)));
			jQuery(e.target).trigger("AddtoCartEnabled");

		});


		// Add to wishlist, Add to gift registry click handler

		jQuery(thisProduct.containerId+" .addtowishlist a.auth").click(function(e) {
			// append the currently selectied options to the url

			// create a local copy of the selected options
			var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

			if (model.master || model.variant) {
				if (thisProduct.selectedVar != null) {
					selectedOptions.pid = thisProduct.selectedVar.id;
				}
				else {
					return false; // do not allow master product to be added to gift registry/wishlist
				}
			}
			else {
				selectedOptions.pid = thisProduct.pid;
			}

			var tempUrl = this.href;

			if (!(tempUrl.indexOf("?") > 0)) {
				tempUrl = tempUrl + "?";
			}
			else {
				tempUrl = tempUrl + "&";
			}
			// serialize the name/value into url query string and append it to the url, make request
			var url = tempUrl + jQuery.param(selectedOptions);
			$.ajax({
				type : "GET",
				url : url,
				dataType : "html",
				success : function () {
					jQuery('#pdpMain .addtowishlist .addtowish-tooltip').fadeIn(400).delay(1500).fadeOut(400);
				},
				failure : function () {
					alert("${Resource.msg('global.serverconnection','locale',null)}");
				}
			});
			setTimeout(function () {
				$('.ui-dialog-titlebar-close').trigger('click');
				}, 1500);
			//window.location = tempUrl + jQuery.param(selectedOptions);
			return false;
		});

		// Add to wishlist, Add to gift registry click handler
		jQuery(thisProduct.containerId+" .addtowishlist a.non-auth, "+thisProduct.containerId+" .addtoregistry a").click(function(e) {
			// append the currently selectied options to the url

			// create a local copy of the selected options
			var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

			if (model.master || model.variant) {
				if (thisProduct.selectedVar != null) {
					selectedOptions.pid = thisProduct.selectedVar.id;
				}
				else {
					return false; // do not allow master product to be added to gift registry/wishlist
				}
			}
			else {
				selectedOptions.pid = thisProduct.pid;
			}

			var tempUrl = this.href;

			if (!(tempUrl.indexOf("?") > 0)) {
				tempUrl = tempUrl + "?";
			}
			else {
				tempUrl = tempUrl + "&";
			}
			// serialize the name/value into url query string and append it to the url, make request
			//var url = tempUrl + jQuery.param(selectedOptions);
			window.location = tempUrl + jQuery.param(selectedOptions);
			return false;
		});

		jQuery(thisProduct.containerId+" .sendtofriend").click(function(e) {
			 // create a local copy of the selected options
            var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

            if ((model.master || model.variant) && thisProduct.selectedVar != null) {
                        selectedOptions.pid = thisProduct.selectedVar.id;
            }
            else {
                  selectedOptions.pid = thisProduct.pid;
            }
            var tempURL = Urls.sendToFriend + "?" + jQuery.param(selectedOptions);
            dialog.open(tempURL, Resources.SEND_TO_FRIEND);
            return false;
		} );
	}

	// binds product reviews click handlers
	// read review link opens reviews tab
	var getRatingSection = function(containerId) {

		jQuery(containerId+" #pdpReadReview").click(function(e) {
			jQuery(containerId+" #tabs").tabs("select", "pdpReviewsTab");
		} );

		jQuery(containerId+" #pdpWriteReview").click(function(e) {
		} );
	}

	// based on availability status, creates a message
	// param val - the stock value to compare i.e. qty entered by user
	var createAvMessage = function(thisProduct, val) {

		var avStatus 	= thisProduct.getAvStatus(); // availability status
		var avMessage 	= Resources[avStatus];
		var ats 		= thisProduct.getATS(); // get available to sell qty
		var avLevels	= thisProduct.getAvLevels();
		var nonCloseoutLowQtyThreshold = thisProduct.getNonCloseoutLowQtyThreshold();

		// get ats levels per-status
		var inStockLevel = avLevels[Constants.AVAIL_STATUS_IN_STOCK];
		var backOrderLevel = avLevels[Constants.AVAIL_STATUS_BACKORDER];
		var preOrderLevel = avLevels[Constants.AVAIL_STATUS_PREORDER];
		var notAvailLevel = avLevels[Constants.AVAIL_STATUS_NOT_AVAILABLE];

		if (avStatus === Constants.AVAIL_STATUS_IN_STOCK) {
			avMessage = "<span class='in-stock'>" + avMessage + "</span>";
		}
		if (avStatus === "NOT_AVAILABLE") {
			avMessage = "<span class='out-of-stock'>" + avMessage + "</span>";
		}
		if (avStatus === Constants.AVAIL_STATUS_BACKORDER ||
				avStatus === Constants.AVAIL_STATUS_PREORDER) {
			if (val > ats && ats > 0)
			{
				avMessage = avMessage + "<span class='in-stock'>" + $.validator.format(Resources["QTY_"+avStatus], ats) + "</span>";
			}
			// display backorder/preorder availability
			avMessage = avMessage + getInStockDateMsg(thisProduct);
		}
		else if (val > inStockLevel && avStatus !== Constants.AVAIL_STATUS_NOT_AVAILABLE) {

			avMessage = "";
			if (inStockLevel > 0) {
				avMessage = avMessage + "<span class='in-stock'>" + $.validator.format(Resources["QTY_"+Constants.AVAIL_STATUS_IN_STOCK], inStockLevel) + "</span>";
			}
			if (backOrderLevel > 0) {
				avMessage = avMessage + $.validator.format(Resources["QTY_"+Constants.AVAIL_STATUS_BACKORDER], backOrderLevel);
				// uncomment the following line to display availability message with back order information
				// avMessage = avMessage + getInStockDateMsg(thisProduct);
			}
			if (preOrderLevel > 0) {
				avMessage = avMessage + $.validator.format(Resources["QTY_"+Constants.AVAIL_STATUS_PREORDER], preOrderLevel);
				// uncomment the following line to display availability message with back order information
				// avMessage = avMessage + getInStockDateMsg(thisProduct);
			}
		}
		else if (ats !== 0 && ats <= nonCloseoutLowQtyThreshold) {
			avMessage = "<span class='low'>" + $.validator.format(Resources["LOW"], nonCloseoutLowQtyThreshold) + "</span>";
		}
		if(thisProduct.selectedVar != null) {
			var standardPrice 	= Number(thisProduct.selectedVar.pricing.standard || 0);
		} else {
			var standardPrice 	= Number(model.pricing.standard || 0);

		}
		var salePrice 		= Number(computePrice(thisProduct) || 0);

		if(standardPrice === 0 && salePrice === 0){
			if(thisProduct.selectedVar != null){
				if(thisProduct.selectedVar.earlyBirdMessage != ""){
					avMessage = "<span class='coming-soon'>" + thisProduct.selectedVar.earlyBirdMessage + "</span>";
				}else{
					avMessage = "";
				}
			}else{
				if($(".ebm-std-prod").length >0 && $.trim($(".ebm-std-prod").text()) != ""){
					avMessage = "<span class='coming-soon'>" + $(".ebm-std-prod").text() + "</span>";
				}else{
					avMessage = "";
				}
			}
		}
		return avMessage;
	}

	// helper function that returns the in-stock date
	var getInStockDateMsg = function(product) {
		var msg = "";
		if (product.getInStockDate() && product.getInStockDate() != "null") {
			msg = $.validator.format(Resources["IN_STOCK_DATE"], (new Date(product.getInStockDate())).toDateString() );
		}
		return msg;
	}

	// helper function to set availability message
	var setAvailabilityMsg = function(msg) {
		jQuery(myContainerId+" .availability:last .value").html(msg);
	}

	/**
	 * Private. Computes price of a given product instance based on the selected options.
	 *
	 * @param thisProduct - the product instance
	 * @return price of the product to 2 decimal points.
	 */
	var computePrice = function(thisProduct) {

		var price = thisProduct.selectedVar != null ? thisProduct.selectedVar.pricing.sale : model.pricing.sale;
		// calculate price based on the selected options prices
		jQuery.each(thisProduct.selectedPrice, function(){
			price = (new Number(price) + new Number(this)).toFixed(2);
		});

		return price;
	}
	// Load the youtube videos only on demand
	// when the user clicks on the videos tab, then the youtube videos will be fetched dynamically
	// and loads the content in the pdpVideoTab div.
	jQuery(".videoTab").click(function(){
		if($(this).hasClass('loaded')){
			 return false;
		 }
		 $(this).addClass('loaded');
		 var target = $("#pdpVideoTab");
		 var url= $("#productURL").val();
		 ajax.load({
			 url : url,
			 dataType : 'html',
			 callback : function (data){
				 target.html(data);
			 }
		 });
	});
	// bind click handlers for prev/next buttons on pdp from search
	var getNavLinks = function() {

		// NOTE:  WE COMMENT THIS OUT BECAUSE POWER REVIEWS RENDERING LIBRARY DOES NOT
		// WORK IN SOME BROWSERS WHEN A PRODUCT DETAIL PAGE IS PARTIALLY RELOADED USING AJAX.
		// IF WE DO NOT BIND EVENTS, THEN THE PREV/NEXT ANCHORS JUST WORK AS STANDARD
		// HYPERLINKS AND POWERREVIEWS WORKS FINE.

		// bind events
		//jQuery(".productnavigation a").click(function(e) {
		//	app.getProduct({url: this.href, source: "search"});
		//	return false;
		//});
	}

	// size chart link click binding
	var getSizeChart = function() {
		jQuery(".attributecontentlink").click(function(e){
			// add size chart dialog container div if its not added yet
			// only added once
			if (jQuery("#sizeChartDialog").length == 0) {
				jQuery("<div/>").attr("id", "sizeChartDialog").appendTo(document.body);
			}

			var sizeChartDialog = dialog.create({id: 'sizeChartDialog', options: {
		    	height: 530,
		    	width: 800,
		    	title: Resources["SIZECHART_TITLE"]
			}});

			sizeChartDialog.dialog('open');

			// make the server call to load the size chart html
			$("#sizeChartDialog").load(this.href);

			return false;
		});

		$(".product-specifications").ready(function(){
			$(".product-specifications").load(jQuery('.attributecontentlink').attr("href"));
		});
	}
	// build the tooltip string for non selected variations
	var getNonSelectedTooltip = function(nonSelectedVars) {
		var tooltipStr = '';
		var nsLen = nonSelectedVars.length;
		if (nsLen == 1 || nsLen == 2) {
			tooltipStr = nonSelectedVars.join(" & ");
		}
		else {
			for (var i=0; i < nsLen; i++) {
				if (i == nsLen - 2) {
					tooltipStr += nonSelectedVars[i] + " & " + nonSelectedVars[i+1];
					break;
				}
				else {
					tooltipStr += nonSelectedVars[i] + ", ";
				}
			}
		}

		return tooltipStr;
	}


	// Product instance
	return  {
		pid					: model.ID,
		name				: model.name,
		variant				: model.variant,
		master				: model.master,
		bundled				: model.bundled,
		selectedVarAttribs	: {}, // object containing variation attributes values as name value e.g. {color: "blue", size: "3", width: ""}
		selectedVar			: null, // currently selected variant
		selectedOptions		: {}, // holds currently selected options object {optionName, selected val}
		selectedPrice		: {}, // holds prices for selected options as {warranty: ""}
		containerId			: null, // holds the html container id of this product
		subProducts			: [], // array to keep sub products instances
		bonusProduct		: false,

		/**
		 * Enable Add to Cart Button.
		 */
		enableA2CButton: function() {
			jQuery(this.containerId+" .addtocart input, "+this.containerId+" .addtocartbutton:last").prop('disabled',false);
			jQuery(this.containerId+" .addtocartbutton:last, "+this.containerId+" .addtocart").removeClass("disabled");

		},

		/**
		 * Disable Add to Cart Button.
		 */
		disableA2CButton: function() {
			jQuery(this.containerId+" .addtocart input, "+this.containerId+" .addtocartbutton:last").prop('disabled',true);
			jQuery(this.containerId+" .addtocartbutton:last, "+this.containerId+" .addtocart").addClass("disabled");

		},

		removeA2CButton: function() {

			jQuery('.addtocart').css('display','none');
			jQuery('.productinfo .price').css('display','none');
			if(ProductCache.master) {
				jQuery('.productinfo .productid').css('display','none');
			}
			//jQuery(this.containerId+" .variationattributes").css('display','none');
		},
		// show availability
		showAvailability: function() {
			jQuery(this.containerId+" .availability").show();
		},
		// hide availability
		hideAvailability: function() {
			jQuery(this.containerId+" .availability").hide();
		},
		// show selected item #
		showItemNo: function() {
			jQuery(this.containerId+" .productid .value").html(this.selectedVar.id);
		},
		// removes  item #
		removeItemNo: function() {
			jQuery(this.containerId+" .productid .value").empty();
		},
		revertPrice: function() {
			var $price = jQuery(this.containerId+" .productinfo .price:first");
			if(!$price.data('originalPrice')) {
				$price.data('originalPrice',$price.html());
			} else {
				$price.html($price.data('originalPrice'));
			}
		},
		// determine if this product is part of a bundle/product set VIEW
		setBonusProduct		: function(bonusProduct) {
			this.bonusProduct = bonusProduct;
		},

		// determine if this product is part of a bundle/product set VIEW
		isBonusProduct		: function() {
			return this.bonusProduct;
		},

		// determine if this product is part of a bundle/product set VIEW
		isSubProduct		: function() {
			return (model.bundled || model.productSetProduct);
		},

		// show the selected variation attribute value next to the attribute label e.g. Color: Beige
		showSelectedVarAttrVal: function(varId, val) {
			jQuery(this.containerId+" .variationattributes div:not(.clear)").each(function(){
				var id = jQuery(this).data("data");

				if (varId === id) {
					jQuery(this).find('span.selectedvarval').html(val);
				}
			});
		},

		// selects review tab
		readReviews: function() {
			jQuery(this.containerId+" #tabs").tabs("select", "pdpReviewsTab");
		},

		// shows product images and thumbnails
		// @param selectedVal - currently selected variation attr val
		// @param vals - total available variation attr values
		showImages: function(selectedVal, vals)  {
			var that = this;
			vals = vals || {};

			// show swatch related images for the current variation value
			jQuery.each(vals, function(){
				var imgCounter = -1;
				var thisVal = this;
				if (this.val === selectedVal && this.images) {

					if (this.images.small.length > 0) {
						jQuery(that.containerId+" .productthumbnails:last").html("");
						/**
						 * Show MagicZoom data - added by lgelberg 9/14/11
						 */
						var zoomimageurl=(thisVal.images.original.length >0 ) ? thisVal.images.original[0].url : app.noimageUrl;
						//jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',thisVal.images.large[i].url);
						jQuery('.MagicZoom').attr('href',zoomimageurl);
						$("body").find('.MagicZoom img').attr('src',zoomimageurl);
						MagicZoom.update('product-image',zoomimageurl,zoomimageurl);
						// jQuery(that.containerId+" .productimage").html("").append(jQuery("<img/>").attr("src", thisVal.images.large[0].url).attr("alt", thisVal.images.large[0].alt).attr("title", thisVal.images.large[0].title));
					}

					// make sure to show number of images based on the smallest of large or small as these have to have 1-1 correspondence.
					var noOfImages = this.images.large.length >= this.images.small.length ? this.images.small.length : this.images.large.length;

					// show thumbnails only if more than 1 or if this is a subproduct (bundled/subproduct)
					if ((this.images.small.length > 1 || that.isSubProduct()) && !that.isBonusProduct()) {
						jQuery.each(this.images.small, function(index){
							imgCounter++;
							var imageInd = imgCounter;
							if (imgCounter > noOfImages - 1) {
								return;
							}
							var href = null;
							if($("#container").hasClass("pt_product-details")) {
								href = thisVal.images.original[index].url;
							}
							else {
								// In quick view since magic zoom is not there, Hence we need to set javascript:void(0); for a tag href value
								href= "javascript:void(0);";
							}
							$(that.containerId+" .productthumbnails:last").append("<div class='alternate-images'><a data-zoom-id='product-image' href='"+href+"' class='alternate-image' data-image='"+thisVal.images.original[index].url+"'><img class='index"+index+"' src='"+this.url+"' title='"+this.title+"' alt='"+this.alt+"'/></a></div>");
							if(that.containerId.indexOf("ui-dialog") == 1) {
								$(that.containerId+" .productthumbnails:last .alternate-image img").on('click touchstart', function (e) {
									e.preventDefault();
									$(this).closest(".owl-item").siblings(".owl-item").find('a.alternate-image').removeClass('selected');
									$(this).closest(".owl-item").find('a.alternate-image').addClass('selected');
									var zoomimageurl=$(this).closest(".alternate-image").data("image");
									//jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',thisVal.images.large[imageInd].url);
									$("body").find('.MagicZoom').attr('href', zoomimageurl);
									$("body").find('.MagicZoom img').attr('src',zoomimageurl);
									MagicZoom.update('product-image',zoomimageurl,zoomimageurl);
									MagicZoom.update('primary-image',zoomimageurl,zoomimageurl);
									//$("body").find('.product-image').trigger("click");
								});
							}
						});
						jQuery(that.containerId+" .productthumbnails:last .owl-item").first().find("img").click();
						//var $images = jQuery(that.containerId+" .productthumbnails:last .owl-item img");
						//var numOfRows = Math.ceil($images.size()/6);
						//$images.slice(numOfRows * 6 - 6, numOfRows * 6 - 1).css('margin-bottom','0');
						var desktopItems = 4;
						if(that.containerId.indexOf("ui-dialog") == 1) {
							desktopItems = 3;
						}
						if ($(window).width() > 480) {
							if(this.images.small.length > 4) {

								var pdpOwlCarousel = $('.pdp-owl-customization');
				    	    	pdpOwlCarousel.owlCarousel({
				    	    		margin:10,
				    	    		navRewind: false,
				    	    		rewind:false,
				    	    		nav: true,
				    	    	    dots: true,
				    	    	    navigation:false,
				    	    	    responsive:{
					    		        0:{
					    		            items:1,
					    		            slideBy: 1
					    		        },
					    		        481:{
					    		            items:3,
					    		            slideBy: 3
					    		        },
					    		        960:{
					    		            items: desktopItems,
					    		            slideBy: desktopItems
					    		        }
					    		    }
				    	    	});
				    	    	$('img.index0').parents('.owl-item').find('a.alternate-image').addClass('selected');
							}
							else {
								var pdpOwlCarousel = $('.pdp-owl-customization');
								if($(pdpOwlCarousel).hasClass("owl-carousel")) {
									pdpOwlCarousel.trigger('destroy.owl.carousel');
								}
				    	    	pdpOwlCarousel.owlCarousel({
				    	    		items: desktopItems,
				    	    		navRewind: false,
				    	    		margin:10,
				    	    		rewind:false,
				    	    		nav: false,
				    	    	    dots: false,
				    	    	    navigation:false,
				    	    	    responsive:{
					    		        0:{
					    		        	items:1,
					    		            slideBy: 1
					    		        },
					    		        481:{
					    		        	items:3,
					    		            slideBy: 3
					    		        },
					    		        960:{
					    		        	items: desktopItems,
					    		            slideBy: desktopItems
					    		        }
					    		    }
				    	    	});
				    	    	$('img.index0').parents('.owl-item').find('a.alternate-image').addClass('selected');
							}
						}
						else if ($(window).width() < 481) {
							var pdpOwlCarousel = $('.pdp-owl-customization');

			    	    	pdpOwlCarousel.owlCarousel({
			    	    		items:1,
			    	    		slideBy: 1,
			    	    		margin:10,
			    	    		navRewind: false,
			    	    		rewind:false,
			    	    		nav: true,
			    	    	    dots: true,
			    	    	    navigation:false,
			    	    	    responsive:{
				    		        0:{
				    		        	items:1,
				    		            slideBy: 1
				    		        },
				    		        481:{
				    		        	items:3,
				    		            slideBy: 3
				    		        },
				    		        960:{
				    		        	items: desktopItems,
				    		            slideBy: desktopItems
				    		        }
				    		    }
			    	    	});
						}
					}
				}
			});
		},

		/**
		* Event handler when a variation attribute is selected/deselected.
		*/
		varAttrSelected: function(e) {
			// update the selected value node
			this.showSelectedVarAttrVal(e.data.id, e.data.val || "");

			this.selectedVarAttribs[e.data.id] = e.data.val;

			// if this is a deselection and user landed on a variant page then reset its variant flag
			// as now user has deselected an attribute thus making it essentially a master product view
			if (e.data.val == null && this.variant) {
				this.variant = false;
				this.master = true;
			}

			// store this ref
			var that = this;

			// trigger update event which will update every other variation attribute i.e. enable/disable etc.

			// first reset the contents of each attribute display
			// when we have got the varriations data
			if (!isLoadingVar) {
				// find variants which match the current selection
				var selectedVarAttrVariants = e.data.val != null ? this.findVariations({id: e.data.id, val: e.data.val}): null;
				var selectedVarAttrs = jQuery.extend({}, {}, this.selectedVarAttribs);
				var validVariants = null;
				var unselectedVarAttrs = new Array();

				// for each selected variation attribute find valid variants
				for (var selectedVar in selectedVarAttrs) {
					if (selectedVarAttrs[selectedVar]) {
						validVariants = this.findVariations({id: selectedVar, val: selectedVarAttrs[selectedVar]}, validVariants);
					}
					else {
						unselectedVarAttrs.push(selectedVar);
					}
				}
				// update each variation attribute display
				jQuery.each(model.variations.attributes, function () {
					if ((this.id != e.data.id || e.data.val == null) && selectedVarAttrs[this.id] == null) {
						that.varAttrDisplayHandler(this.id, validVariants);
					}
					else if (this.id != e.data.id && selectedVarAttrs[this.id] != null) {
						that.varAttrDisplayHandler(this.id, selectedVarAttrVariants);
					}
					else {
						// show swatch related images for the current value
						that.showImages(e.data.val, this.vals);
					}
				});

				// based on the currently selected variation attribute values, try to find a matching variant
				this.selectedVar = this.findVariation(this.selectedVarAttribs);
			}

			// lets fire refresh view event to enable/disable variations attrs
			this.refreshView();
		},

		/**
		* go thru all variations attr and disable which are not available
		*/
		resetVariations: function() {
			if (isLoadingVar) {
				return ; // we don't have the complete data yet
			}
			var that = this;
			var validVariants = model.variations.variants;
			if(this.selectedVarAttribs) {
				for(var selectedVarAttr in this.selectedVarAttribs) {
					if(this.selectedVarAttribs[selectedVarAttr]) {
						validVariants = that.findVariations({id:selectedVarAttr, val:this.selectedVarAttribs[selectedVarAttr]}, validVariants);
					}
				}
			}

			jQuery(this.containerId + " .variationattributes .swatches").not(".current").not(".selected").each(function(){
				var dataa = jQuery(this).data("data"); // data is id set via app.hiddenData api
				jQuery(this).find("a.swatchanchor").each(function(){
					// find A variation with this val
					var filteredVariants = that.findVariations({id:dataa, val:this.title}, validVariants);
					if (filteredVariants.length > 0) {
						// found at least 1 so keep it enabled
						jQuery(this).parent().removeClass("unselectable");
					}
					else {
						jQuery(this).parent().addClass("unselectable");
						jQuery(this).parent().removeClass("selected");
					}
				});
			});
			jQuery(this.containerId + " .variationattributes .variantdropdown select").not(".current select").not(".selected select").each(function(){
				var $select = jQuery(this);
				var vaId = $select.data("data").id;  // data is id set via app.hiddenData api
					var options = $select.data('options');
					if(!options) {
						options = [];
						$select.find('option').each(function() {
							var $option = jQuery(this);
				            options.push({value: $option.val(), text: $option.text(), selected: false});
				        });
				        $select.data('options', options);
					}
					var len = options.length;
					var selectedVal = $select.val();
					$select.empty();
					jQuery.each(options, function(index, value){

						if (len > 1 && index == 0) {
							$select.append(
									jQuery('<option></option>').text(value.text).val(value.value)
							);
							return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
						}
						var filteredVariants = that.findVariations({id:vaId, val:value.value}, validVariants);
						if (filteredVariants.length > 0) {
							//add it
							$select.append(
								jQuery('<option></option>').text(value.text).val(value.value)
							);
						}
						else {
							// no variant found with this value combination so disable it
							//this.disabled = true;

							/**if (this.selected) {
								// remove the currently selected value if the value is not selectable
								that.showSelectedVarAttrVal(attrId, "");
								that.selectedVarAttribs[attrId] = null;
							}*/
							// remove current selection
							//this.selected = false;
						}

					});
					$select.val(selectedVal);
			});
		},

		/**
		* given a variation attribute id and valid variants, it would adjust the ui i.e. enable/disable
		* appropriate attribute values.
		*
		* @param attrId - String, id of the variation attribute
		* @param validVariants - Array of json objects of valid variants for the given attribute id
		* */
		varAttrDisplayHandler: function (attrId, validVariants) {
			var that = this; // preserve this instance
			var futureVariants = validVariants;
			if(this.selectedVarAttribs) {
				for(var selectedVarAttr in this.selectedVarAttribs) {
					if(this.selectedVarAttribs[selectedVarAttr]) {
						futureVariants = that.findVariations({id:selectedVarAttr, val:this.selectedVarAttribs[selectedVarAttr]}, futureVariants);
					}
				}
			}
			// loop thru all non-dropdown ui elements i.e. swatches e.g. color, width, length etc.
			jQuery(this.containerId + " .variationattributes .swatches.future, " + this.containerId + " .variationattributes .swatches.current").each(function(){
				var $swatch = jQuery(this);
				var swatchId = $swatch.data("data");  // data is id set via app.hiddenData api

				if (swatchId === attrId && validVariants) {

					$swatch.find("a.swatchanchor").each(function(){
						var $this = jQuery(this);
						var parentLi= $this.parent();

						// find A variation with this val
						if($swatch.hasClass("future")) {
							var filteredVariants = that.findVariations({id:attrId, val:this.title}, futureVariants);
						} else {
							var filteredVariants = that.findVariations({id:attrId, val:this.title}, validVariants);
						}
						if (filteredVariants.length > 0) {
							// found at least 1 so keep it enabled
							parentLi.removeClass("unselectable");
							if( $swatch.hasClass("color") ) {
								if ( !getAvailability(filteredVariants) ) {
									if( $this.find(".out-of-stock").size() === 0 ) {
										$this.prepend("<span class='out-of-stock'></span>");
									}
								} else {
									$this.find(".out-of-stock").remove();
								}
							} else {
								if ( !getAvailability(filteredVariants) ) {
									if ( $this.find("span").text().indexOf("Out of Stock") === -1 ) {
										if ( $this.find("span").text().indexOf("New") !== -1 ) {
											$this.find("span").text( $this.find("span").text() + " / Out of Stock" );
										} else {
											$this.find("span").text( "Out of Stock" );
										}
									}
								} else {
									if ( $this.find("span").text().indexOf("New") !== -1 ) {
										$this.find("span").text( $this.find("span").text().replace(" / Out of Stock" , ""));
									} else {
										$this.find("span").text( $this.find("span").text().replace("Out of Stock" , ""));
									}
								}
							}
						}
						else {
							// no variant found with this value combination so disable it
							parentLi.addClass("unselectable");

							if (parentLi.hasClass("selected")) {
								// remove the currently selected value if the value is not selectable
								that.showSelectedVarAttrVal(attrId, "");
								that.selectedVarAttribs[attrId] = null;
							}
							// remove current selection
							parentLi.removeClass("selected");
						}
					});
				}
			});

			// loop thru all the non-swatches(drop down) attributes
			jQuery(this.containerId + " .variationattributes .variantdropdown.future select, " + this.containerId + " .variationattributes .variantdropdown.current select").each(function(){
				var $select = jQuery(this);
				var vaId = $select.data("data").id;  // data is id set via app.hiddenData api
				if (vaId === attrId && validVariants) {

					var options = $select.data('options');
					if(!options) {
						options = [];
						$select.find('option').each(function() {
							var $option = jQuery(this);
				            options.push({value: $option.val(), text: $option.text(), selected: false});
				        });
				        $select.data('options', options);
					}
					var len = options.length;
					var selectedVal = $select.val();
					$select.empty();
					jQuery.each(options, function(index, value){

						if (len > 1 && index == 0) {
							$select.append(
									jQuery('<option></option>').text(value.text).val(value.value)
							);
							return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
						}

						// find A variation with this val
						if($select.closest(".variantdropdown").hasClass("future")) {
							var filteredVariants = that.findVariations({id:attrId, val:value.value}, futureVariants);
						} else {
							var filteredVariants = that.findVariations({id:attrId, val:value.value}, validVariants);
						}
						if (filteredVariants.length > 0) {
							// found at least 1 so keep it enabled
							var oos = "";
							if (!getAvailability(filteredVariants)) {
								oos = " - Out of Stock";
							};
							//add it
							$select.append(
								jQuery('<option></option>').text(value.text + oos).val(value.value)
							);
						}
						else {
							// no variant found with this value combination so disable it
							//this.disabled = true;

							/**if (this.selected) {
								// remove the currently selected value if the value is not selectable
								that.showSelectedVarAttrVal(attrId, "");
								that.selectedVarAttribs[attrId] = null;
							}*/
							// remove current selection
							//this.selected = false;
						}
					});
					$select.val(selectedVal);
				}
			});

		},

		/**
		 * refresh the UI i.e. availability, price, A2C button and variation attributes display
		 */
		refreshView: function() {
			var thisProduct = this;

			if (!isLoadingVar && this.selectedVar == null) {
				// if we have loaded the variations data then lets if the user has already selected some values
				// find a matching variation
				this.selectedVar = this.findVariation(this.selectedVarAttribs);
			}

			if (!isLoadingVar && this.selectedVar != null) {
				//Facebook Pixel Code for variant view
					fbq('track','ViewContent',{
						content_ids: [thisProduct.selectedVar.id],
						content_type:'product'
						});
				// update availability
				reloadAvailability(thisProduct, thisProduct.selectedOptions.Quantity);
				// update price
				this.showUpdatedPrice(computePrice(thisProduct), this.selectedVar.pricing.standard);

				if (!(!this.selectedVar.inStock && this.selectedVar.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE) && (this.getPrice() > 0 || this.isPromoPrice()))
				{
					// Replace the hero shot with the specific variant chosen
					var varID = this.selectedVar.id;
					var imageUrl = model.images.variants[varID];
					var zoomImageUrl = model.images.zoomvariants[varID];
					// load the fully qualified variation image
					if (imageUrl != null)
					{
						//jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',imageUrl);
						jQuery('.MagicZoom').attr('href', zoomImageUrl);
						$("body").find('.MagicZoom img').attr('src',zoomImageUrl);
						MagicZoom.update('product-image',zoomImageUrl,zoomImageUrl);
					}

					this.showItemNo();
					this.showAvailability();
					// enable add to cart button
					this.enableA2CButton();
					jQuery(this).trigger("AddtoCartEnabled");
				}
				else if(this.selectedVar.earlyBirdMessage != "") {
					this.showItemNo();
					//this.hideAvailability();
					this.disableA2CButton();
					jQuery(this).trigger("AddtoCartDisabled");
				}
				else {
					//this.removeItemNo();
					this.showItemNo();
					this.showAvailability();
					//this.revertPrice();
					this.disableA2CButton();
					jQuery(this).trigger("AddtoCartDisabled");
				}
				if(this.selectedVar.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE)
				{
					//this.removeA2CButton();
				}
			}
			else {
				if (isLoadingVar) {
				// update availability
					setAvailabilityMsg(progress.show("productloader"));
				}
				else {
					setAvailabilityMsg(Resources["NON_SELECTED"]);
				}
				this.removeItemNo();
				this.showAvailability();
				this.revertPrice();
				// disable add to cart button
				this.disableA2CButton();
				jQuery(this).trigger("AddtoCartDisabled");


			}

			var nonSelectedVars = [];

			var validVariants = null;

			for (var selectedVar in this.selectedVarAttribs) {
				if (this.selectedVarAttribs[selectedVar]) {
					validVariants = this.findVariations({id: selectedVar, val: this.selectedVarAttribs[selectedVar]}, validVariants);
				}
			}

			// update selected var attr vals and refresh their display
			jQuery.each(model.variations.attributes, function(){
				thisProduct.showSelectedVarAttrVal(this.id, thisProduct.selectedVarAttribs[this.id]);

				if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
					nonSelectedVars.push(this.name);

					thisProduct.varAttrDisplayHandler(this.id, validVariants);
				}
			});

			// process non-selected vals and show updated tooltip for A2C button as a reminder
			// and show it along availability
			var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
			//var missingvalue = $(".missingvalue").val();
			if (nonSelectedVars.length > 0) {
				var availMsg = $.validator.format(Resources.MISSING_VAL, tooltipStr);
				setAvailabilityMsg(availMsg);
				//jQuery(thisProduct.containerId+" .addtocartbutton:last").attr("title", availMsg);
			}
		},

		/**
		 * renders pricing div given a sale price and optional standard price
		 * To format the price display, it goes to server via an ajax call.
		 *
		 * @param sale - sale price
		 * @param standard - standard price
		 */
		showUpdatedPrice: function(sale, standard) {
			var standardPrice 	= Number(standard || 0);
			var salePrice 		= Number(sale || 0);
			var priceHtml 		= "";
			var formattedPrices = {"salePrice": salePrice, "standardPrice": standardPrice};

			// send server request to format the money baed on site settings using Money api
			ajax.getJson({
				url		: Urls.formatMoney,
				cache	: true,
				async	: false,
				data	: {"salePrice": salePrice, "standardPrice": standardPrice},
				callback: function(data){
					formattedPrices = data;
				}
			});

			// in case it is a promotional price then we do not care if it is 0
			priceHtml = (salePrice > 0 || this.isPromoPrice()) ? '<div class="salesprice">' + formattedPrices.salePrice + '</div>' : ' <div class="salesprice">N/A</div>';

			if (standardPrice > 0 && standardPrice > salePrice) {
				// show both prices
				priceHtml = '<div class="standardprice">' + formattedPrices.standardPrice + '</div>' + priceHtml;
			}
			if (standardPrice === 0 && salePrice === 0) {
				if(this.selectedVar.earlyBirdMessage != ""){
					priceHtml = '<div class="salesprice">' + this.selectedVar.earlyBirdMessage + '</div>';
				}else{
					priceHtml = '<div class="salesprice"></div>';
				}

			}
			var $price = jQuery(this.containerId+" .productinfo .price:first");
			if(!$price.data('originalPrice')) {
				$price.data('originalPrice',$price.html());
			}
			$price.html(priceHtml);
			// containerId contains #, get rid of it before finding the right price div
			jQuery(this.containerId+" #pdpATCDiv"+this.containerId.substring(1)+" .price").html(priceHtml);
		},

		/**
		 * returns a computed price for this product
		 */
		getPrice: function() {
			return computePrice(this);
		},

		/**
		 * Determines if the selected product has promotional price.
		 * 			 *
		 * @return boolean true if promotional price is present otherwise false
		 */
		isPromoPrice: function() {
			return (this.selectedVar != null ? this.selectedVar.pricing.isPromoPrice : model.pricing.isPromoPrice);
		},

		/**
		 * receives 2 or 1 variation attribute values and tries to figure out if there is a variant with these values.
		 *
		 * @param val1 - variation attribute value
		 * @param val2 - variation attribute value
		 * @return boolean - true if a variant exists otherwise false
		 */
		isVariation: function(val1, val2) {
			var variant = null;

			for (var i=0; i<model.variations.variants.length; i++) {
				variant = model.variations.variants[i];
				if (variant.attributes[val1.id] == val1.val && (val2 == undefined || variant.attributes[val2.id] == val2.val)) {
					return true;
				}
			}
			/**
			 * apparently there is no way to break out of jQuery.each half way :(
			jQuery.each(model.variations.variants, function(){
				if (!found && this.attributes[val1.id] == val1.val && this.attributes[val2.id] == val2.val) {
					found = true;
					return;
				}
			});*/
			return false;
		},

		/**
		* find 0 or more variants matching the given attribs object(s) and in stock
		* return null or found variants
		*/
		findVariations: function(attr, variants) {
			var foundVariants = new Array();
			variants = variants || model.variations.variants;

			var variant = null;
			for (var i=0; i<variants.length; i++) {
				variant = variants[i];
				if ((variant.attributes[attr.id] === attr.val) /*&&
						//(variant.inStock || (variant.avStatus === app.constants.AVAIL_STATUS_BACKORDER && variant.ATS > 0) || (variant.avStatus === app.constants.AVAIL_STATUS_PREORDER && variant.ATS > 0))*/
					) {
					foundVariants.push(variant);
				}
			}

			return foundVariants;
		},

		/**
		* find a variant with the given attribs object
		* return null or found variation json
		*/
		findVariation: function(attrs) {
			if (!this.checkAttrs(attrs)) {
				return null;
			}

			var attrToStr = function(attrObj) {
				var result = "";
				jQuery.each(model.variations.attributes, function(){
					result += attrObj[this.id];
				});
				return result;
			}

			var attrsStr = attrToStr(attrs);
			var variant = null;
			for (var i=0; i<model.variations.variants.length; i++) {
				variant = model.variations.variants[i];
				if (attrToStr(variant.attributes) === attrsStr) {
					return variant;
				}
			}
			return null;
		},

		// find a variation with the give id otherwise empty object
		findVariationById: function(id) {

			for (var i=0; i<model.variations.variants.length; i++) {
			// IE7 does NOT support this!!!
			//for each(var variation in model.variations.variants) {
				var variation = model.variations.variants[i];
				if (variation && variation.id === id) {
					return variation;
				}
			}

			return {};
		},

		/**
		* see if the specified attrs object has all the variation attributes present in it
		* return true/false
		*/
		checkAttrs: function(attrs) {
			for (var i=0; i<model.variations.attributes.length; i++) {
				if (attrs[model.variations.attributes[i].id] == null) {
					return false;
				}
			}
			return true;
		},

		// given an id, return attr definition from model.variations.attributes
		getAttrByID: function(id) {
			for (var i=0; i<model.variations.attributes.length; i++) {
				if (model.variations.attributes[i].id === id) {
					return model.variations.attributes[i];
				}
			}
			return {};
		},

		// returns current availability status e.g. in_stock, preorder etc.
		getAvStatus: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.avStatus;
			}
			else {
				return model.avStatus;
			}
		},

		// return available to sell qty
		getATS: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.ATS;
			}
			else {
				return model.ATS;
			}
		},

		// return non-closeout low qty threshold
		getNonCloseoutLowQtyThreshold: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.nonCloseoutLowQtyThreshold;
			}
			else {
				return model.nonCloseoutLowQtyThreshold;
			}
		},

		// return the quantity that was used to calculate availability
		getAvailabilityQty: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.avStatusQuantity;
			}
			else {
				return model.avStatusQuantity;
			}
		},

		// return the availability levels
		getAvLevels: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.avLevels;
			}
			else {
				return model.avLevels;
			}
		},

		// returns in stock date
		getInStockDate: function() {
			if ((this.variant || this.master) && this.selectedVar != null) {
				return this.selectedVar.inStockDate;
			}
			else {
				return model.inStockDate;
			}
		},

		// set the add to cart button and bind handlers for bundle/product set
		getSubProductsBinding: function() {
			var thisProduct = this;

			// For bundles and product-sets, enable or disable the add-to-cart button.
			// The button should be disabled if the add-to-cart button of any subproduct is disabled, enabled otherwise.
			// For product-sets, display a price which is the sum of the set-products prices as long as the add-to-cart button is enabled.
			if (model.bundle || model.productSet) {

				var bundleA2CEnabled = false;
				var price = new Number();
				for (var i = 0; i < thisProduct.subProducts.length; i++) {
					var subProduct = thisProduct.subProducts[i];
					bundleA2CEnabled = subProduct.isA2CEnabled();
					if (!bundleA2CEnabled) {
						break;
					}

					// collect price info
					price += new Number(subProduct.getPrice());
				}

				// if any of the bundled product has its A2C button disabled then the bundle is not orderable
				if (!bundleA2CEnabled) {
					this.disableA2CButton();
				}
				else {
					this.enableA2CButton();

					// show total price except for a bundle
					if (!model.bundle) {
						thisProduct.showUpdatedPrice(price);
					}
				}
			}

			// bind AddtoCartDisabled event for each subproduct (bundle or product set)
			jQuery.each(thisProduct.subProducts, function(){
				jQuery(this).bind("AddtoCartDisabled", {},
				/**
				* Event handler when a subproduct of a product set or a bundle is selected.
				* disable the add to cart button
				*/
				function() {
					thisProduct.disableA2CButton();
				});
			});

			// see if have any sub-products and bind AddtoCartEnabled event
			jQuery.each(thisProduct.subProducts, function(){
				jQuery(this).bind("AddtoCartEnabled", {},
					/**
					* Event handler when a subproduct of a product set or a bundle is selected.
					* Basically enable the add to cart button or do other  refresh if needed like price etc.
					*/
					function() {
						// enable Add to cart button if all the sub products have been selected
						// and show the updated price
						var enableAddToCart = true;
						var subProducts = thisProduct.subProducts;
						var price = new Number();

						for (var i = 0; i < subProducts.length; i++) {
							if (((subProducts[i].variant || subProducts[i].master) && subProducts[i].selectedVar == null) ||
								(!subProducts[i].bundled && (subProducts[i].selectedOptions["Quantity"] == undefined ||
								subProducts[i].selectedOptions["Quantity"] <= 0))) {
								enableAddToCart = false;
								break
							}
							else {
								if (subProducts[i].selectedVar != null) {
									subProducts[i].selectedOptions.pid = subProducts[i].selectedVar.pid;
								}
								else {
									subProducts[i].selectedOptions.pid = subProducts[i].pid;
								}

								// Multiply the subproduct quantity-one price by the entered quantity.
								// Important note:  This value will be incorrect if subproduct uses
								// tiered pricing !!!!!
								var subproductQuantity = subProducts[i].selectedOptions["Quantity"];
								if (subproductQuantity == undefined) {
									subproductQuantity = 1;
								}
								price += new Number(subproductQuantity * subProducts[i].getPrice())
							}
						}

						if (enableAddToCart && (model.productSet || model.inStock) && (price > 0 || thisProduct.isPromoPrice())) {
							thisProduct.enableA2CButton();

							// show total price except for a bundle
							if (!model.bundle) {
								thisProduct.showUpdatedPrice(price);
							}
						}
						else {
							thisProduct.disableA2CButton();
						}
					}
				);
			});
		},

		// determine if A2C button is enabled or disabled
		// true if enabled, false otherwise
		isA2CEnabled: function() {
			if (this.variant || this.master) {
				if (this.selectedVar != null) {
					return (this.selectedVar.avStatus === Constants.AVAIL_STATUS_IN_STOCK ||
							this.selectedVar.avStatus === Constants.AVAIL_STATUS_BACKORDER ||
							this.selectedVar.avStatus === Constants.AVAIL_STATUS_PREORDER);
				}
				else {
					return false;
				}
			}
			else {
				return (model.avStatus === Constants.AVAIL_STATUS_IN_STOCK ||
						model.avStatus === Constants.AVAIL_STATUS_BACKORDER ||
						model.avStatus === Constants.AVAIL_STATUS_PREORDER);
			}
		},

		/**
		 * work horse of the product detail page getting everything tied together i.e. all the dynamic stuff
		 * and one time initialization. called only ONCE
		 * bind all the product display events and handlers
		 * load variants in case this is a variation product
		 * bind subproducts a2c button enable event handler
		 *
		 * @param options.cotainerId - id of the containing div
		 * @param options.source - source of this product show request, mainly quickview
		 */
		show: function(options) {
			// preserve this instance
			var thisProduct = this;

			// bind VariationsLoaded which gets fired when the variation data is received from the server
			// and we need to refresh the ui
			jQuery(this).bind("VariationsLoaded", {}, function(e, source){
				// enable/disable unavailable values
				// and set the currently selected values
				// reset the currently selected variation attributes i.e. reset the ui
				thisProduct.resetVariations();

				// create the default availability message based on ATS count
				// from the variants
				var atsCount = getATS(model.variations.variants);
				if (atsCount == 0) {
					setAvailabilityMsg("<span class='out-of-stock'>" + Resources[Constants.AVAIL_STATUS_NOT_AVAILABLE] + "</span>");
				}
				// We will use this in the 2nd of the two following loops
				var someAreNotSelected = false;
				// Determine the selected state of each option
				var $attributes = jQuery(thisProduct.containerId + " .variationattributes .swatches," + thisProduct.containerId + " .variationattributes .variantdropdown");
				$attributes.each(function(){
					var $this = jQuery(this);
					if($this.hasClass("swatches")) {
						//if it is swatches, find the selected swatch
						if($this.find(".selected").size() > 0) {
							$this.addClass("selected");
						} else {
							$this.removeClass("selected");
						}
					} else {
						var selectBox = $this.find("select").get(0);
						if($(selectBox).find("option").length == 2) {
							$(selectBox).find("option").eq(1).prop('selected', true);
						}
						if(selectBox.selectedIndex >= 0 && selectBox.options[selectBox.selectedIndex].value != "" ) {
							$this.addClass("selected");
						} else {
							$this.removeClass("selected");
						}
					}

				}).each(function(index) {
					var $this = jQuery(this);
					if(someAreNotSelected) {
						$this.removeClass("selected").addClass("future").find(".selected").removeClass("selected");
						$this.find(".optionwrapper").slideUp();
					}
					if(!$this.hasClass("selected")) {
						if(!someAreNotSelected) {
							$this.addClass("current");
							someAreNotSelected = true;
						}
					} else {
						// if it's not the last item, hide the selections and leave the button enabled
						if($attributes.size() - 1 != index) {
							$this.find(".optionwrapper").slideUp().find("button").removeClass("non-selectable");
						} else {
							//it is the last item, and it's selected, so it's current
							$this.removeClass('selected').addClass("current");
						}
					}
				});

				// Grab the currently selected values and update the UI
				// swatch variation attributes
				jQuery(thisProduct.containerId + " .variationattributes .swatches, "+thisProduct.containerId + " .variationattributes .variantdropdown select").each(function(index){
					if(index===0) {
						var $swatch = jQuery(this);
						var swatchId = $swatch.data("data");  // data is id set via app.hiddenData api

						if (model.variations.variants) {
							if(typeof this.selectedIndex === "undefined") {
								$swatch.find("a.swatchanchor").each(function(){
									var $this = jQuery(this);
									var parentLi= $this.parent();
									// find A variation with this val
									var filteredVariants = thisProduct.findVariations({id:swatchId, val:this.title}, model.variations.variants);

									if( $swatch.hasClass("color") ) {
										if ( !getAvailability(filteredVariants) ) {
											if( $this.find(".out-of-stock").size() === 0 ) {
												$this.prepend("<span class='out-of-stock'></span>");
											}
										} else {
											$this.find(".out-of-stock").remove();
										}
									} else {
										if ( !getAvailability(filteredVariants) ) {
											if ( $this.find("span").text().indexOf("Out of Stock") === -1 ) {
												if ( $this.find("span").text().indexOf("New") !== -1 ) {
													$this.find("span").addClass('outofstockpdp');
													$this.find("span").text( $this.find("span").text() + " / Out of Stock" );
												} else {
													$this.find("span").addClass('outofstockpdp');
													$this.find("span").text( "Out of Stock" );
												}
											}
										} else {
											if ( $this.find("span").text().indexOf("New") !== -1 ) {
												$this.find("span").text( $this.find("span").text().replace(" / Out of Stock" , ""));
											} else {

												$this.find("span").text( $this.find("span").text().replace("Out of Stock" , ""));
											}
										}
									}
								});
							} else {

								$swatch.find("option").each(function(){
									if(this.value !== "") {
										var filteredVariants = thisProduct.findVariations({id:swatchId.id, val:this.value}, model.variations.variants);
										if (!getAvailability(filteredVariants)) {
											this.text = this.text + " - Out of Stock";
										}
									}
								});
							}
						}
					}

					if(typeof this.selectedIndex === "undefined") {
						var thisSwatch 	= jQuery(this),
							pdpVarId 	= thisSwatch.data("data"); // data is id which is set via app.hiddenData onload

						// grab the currently selected variation attribute val
						thisSwatch.find(".selected a").each(function(){
							thisProduct.varAttrSelected({data: {id: pdpVarId, val: this.title}});
						});
					} else {
						// non-swatch variation attributes
						if (this.selectedIndex >= 0 && this.options[this.selectedIndex].value != "") {
							// grab the currently selected val by firing update ui api
							// when dealing with a select element, data returns an object so we must ask for id
							thisProduct.varAttrSelected({data: {id: jQuery(this).data("data").id, val: this.options[this.selectedIndex].value}});
						}
					}
				});
				/**
				// loop thru all non-dropdown ui elements i.e. swatches e.g. color, width, length etc.
				jQuery(this.containerId + " .variationattributes .swatches").each(function(){

				});*/
			});

			this.containerId 	= "#"+options.containerId;
			var isQuickView 	= false;

			if (options.source && options.source == "quickview") {
				isQuickView = true;
				this.containerId 	= ".ui-dialog #"+options.containerId;
			}

			myContainerId = this.containerId;

			// bind click handlers for prev/next links
			getNavLinks();

			// size chart click binding
			getSizeChart();

			// variation attributes handling in case it is a master or a variant product
			if (model.master || model.variant) {
				loadVariants(this); // make a server call to load the variants, this is due to the performance reasons
				// meanwhile display the available variation attributes

				// bind the "next" buttons in the picker
				jQuery("button.next").click(function() {
					/**var $this = jQuery(this);
					if(!$this.hasClass("non-selectable")) {
					$this.closest(".swatches, .variantdropdown").find(".optionwrapper").slideUp(400,function(){
						jQuery(this).closest(".swatches, .variantdropdown")
							.removeClass("current").addClass("selected")
							.nextUntil(".swatches, .variantdropdown").next()
								.addClass("current").removeClass("future")
									.find(".optionwrapper").slideDown().find('select').change();
					});
					}*/
				});

				//bind the "previous" buttons in the picker
				jQuery("a.previous").click(function(e) {
					e.preventDefault();
					jQuery(this)
						.closest(".swatches, .variantdropdown")
						.prevUntil(".swatches, .variantdropdown")
						.prev()
						.find("a.filter").click();
				});
				$('.MagicZoom img.primary-image').bind('click', function(e) {
					$('.new-swim,.old-swim').addClass('swimHide');

					setTimeout(function(){
						var zoomedContent = $('.mz-expand-stage').html();
						$('.mz-button-close').on('click', function(e) {
							$('.new-swim,.old-swim').removeClass('swimHide');
						});
					}, 500);
				});
				// clicking on a previous step
				jQuery(".variationattributes").delegate(".selected a.filter","click",function(e){
					e.preventDefault();
					var $this = jQuery(this).closest(".selected");
					jQuery(".variationattributes .swatches,.variationattributes .variantdropdown").removeClass("current");
					$this.removeClass("selected").addClass("current");
					$this.nextAll('.swatches, .variantdropdown').each(function(){
						var $variant = jQuery(this);
						$variant.addClass("future").removeClass("selected");
						if($variant.hasClass("swatches")) {
							$variant.find(".selected a").click();
						} else if($variant.hasClass("variantdropdown")) {
							var $select = $variant.find("select");
							if($select.find("option").size() > 1) {
								$select.val('').change();
							}
						}
					});
					$(this).parent().find(".swatchesdisplay .selected a").click();
					$(this).parent().find('select').val('');


					jQuery(".variationattributes").find(".future .optionwrapper").slideUp(400,function() {
						jQuery(".current .optionwrapper").slideDown(400, function(){
							$(this).find('.filter .value').text('');
						});
					});
					jQuery(".variationattributes").find(".current .optionwrapper").slideDown(400,function() {
						  $(this).closest('.current').find('.filter .value').text('');
					});
				});

				// bind the "learn more" links
				jQuery("span.learnmore a").click(function(e){
					e.preventDefault();
					// add learn more dialog container div if its not added yet
					// only added once
					if (jQuery("#learnMoreDialog").length == 0) {
						jQuery("<div></div>").attr("id", "learnMoreDialog").appendTo(document.body);
					}

					var learnMoreDialog = dialog.create({id: 'learnMoreDialog', options: {
				    	height: 530,
				    	width: 800,
				    	title: Resources["SIZECHART_TITLE"]
					}});

					learnMoreDialog.dialog('open');

					// make the server call to load the learn more html
					jQuery("#learnMoreDialog").load(this.href);
				});

				// loop thru all the swatches and bind events etc.
				jQuery(thisProduct.containerId + " .variationattributes .swatches").each(function(){
					var thisSwatch 	= jQuery(this);
					var pdpVarId 	= thisSwatch.data("data"); // data is id which is set via app.hiddenData onload
					var attrDef 	= thisProduct.getAttrByID(pdpVarId);

					if (!attrDef) {
						return;
					}

					// click handler for swatches links
					var varEventHandler = function(e){
						var thisObj = jQuery(this);

						e.data = {id: pdpVarId, val: this.title};

						if (thisObj.parent().hasClass("unselectable")) {
							return false;
						}
						else if (thisObj.parent().hasClass("selected")) {
							// deselection
							e.data = {id: pdpVarId, val: null};
							thisObj.parent().removeClass("selected");
							// clear the current selection
							thisProduct.varAttrSelected(e);

							thisProduct.resetVariations();
						}
						else {
							// selection
							e.data = {id: pdpVarId, val: this.title};
							// remove the current selection
							thisSwatch.find(".selected").removeClass("selected");
							if (thisObj.closest(".swatches").nextUntil(".swatches, .variantdropdown").next().size() > 0) {
								thisObj.parent().addClass("selected").closest(".swatches").find("button").removeClass("non-selectable");
								var $this = jQuery(this);
								if(!$this.hasClass("non-selectable")) {
									$this.closest(".swatches").find(".optionwrapper").slideUp(400,function(){

										 jQuery(this).closest(".swatches").removeClass("current").addClass("selected").nextUntil(".swatches").next().not(".clear").first()
										.addClass("current").removeClass("future").find(".optionwrapper").slideDown(400,function(){
											jQuery(this).find("select option").each(function(index){
													if($(this).closest('select').find('option').length == 2 && index == 1){
														$(this).prop('selected', true).trigger('change');
														//$(this).attr('selected','selected').trigger('change');
													}
												});

										}).find('select').change();



									});
								}
							} else {
								thisObj.parent().addClass("selected");
							}
							thisProduct.varAttrSelected(e);
						}

						return false;
					}

					// all swtach anchors
					var varJqryObjs = thisSwatch.find("a.swatchanchor");

					// if its a color attr then render its swatches and images
					if (pdpVarId === "color") {
						var colorAttrDef = thisProduct.getAttrByID('color');

						varJqryObjs.each(function(){

							// given a variation attr value, find its swatch image url
							var findSwatch = function(val) {
								for (var i=0; i<colorAttrDef.vals.length; i++){
									if (colorAttrDef.vals[i].val === val) {
										return colorAttrDef.vals[i].images.swatch;
									}
								}
								return ""; // no swatch image found
							}

							var swatchUrl = (findSwatch(this.title)).url; // find swatch url

							if (swatchUrl && swatchUrl != "") {
								//jQuery(this).css("color", "transparent").parent().css("background", "url(" + swatchUrl + ")");
								jQuery(this).css("text-indent", "-9999px").prepend('<img alt="'+this.title+'" src="'+swatchUrl+'"/>');
							}
							else {
								jQuery(this).css("color", "transparent"); // no swatch image found
							}
						});

						// swatches click, hover and mouseleave event handlers
						varJqryObjs.data("data", {id: pdpVarId}).click(varEventHandler);
						if ($(window).width() > 1024) {
							varJqryObjs.data("data", {id: pdpVarId}).mouseenter(function(e){
								thisProduct.showSelectedVarAttrVal("color", this.title);
								thisProduct.showImages(this.title, colorAttrDef.vals)
							}).mouseleave(function(e) {
								if(thisProduct.selectedVar) {
									thisProduct.showImages(thisProduct.selectedVar.id,[{"val":thisProduct.selectedVar.id,"images":{"original":[{"url":model.images.zoomvariants[thisProduct.selectedVar.id]}],"small":[{"url":model.images.variants[thisProduct.selectedVar.id]}],"large":[{"url":model.images.variants[thisProduct.selectedVar.id]}]}}]);
								}
								else if (thisProduct.selectedVarAttribs["color"]) {
									thisProduct.showImages(thisProduct.selectedVarAttribs["color"], colorAttrDef.vals)
								}
								else {
									thisProduct.showImages("", [{val: "", images: model.images}]);
								}

								thisProduct.showSelectedVarAttrVal("color", thisProduct.selectedVarAttribs["color"] || "");
							});
						}

					}
					else {
						// not a color swatch, we only have click handler for this type of variation attribute e.g. width, length etc.
						varJqryObjs.data("data", {id: pdpVarId}).click(varEventHandler);
					}
				});

				jQuery(thisProduct.containerId + " .variationattributes .variantdropdown select option").each(function(index){
					if(jQuery(thisProduct.containerId + " .variationattributes .variantdropdown select option").length == 2 && index == 1){
						$(this).prop('selected', true).trigger('change');
					}
				});

				// loop thru all the non-swatches attributes and bind events etc.
				jQuery(thisProduct.containerId + " .variationattributes .variantdropdown select").each(function(){
					// default ui i.e. drop downy
					jQuery(this).data("data", {id: jQuery(this).data("data"), val: ''}).change(function(e){
						// if there is only 1 value to be selected then return i.e. no deselection available
						//if (this.selectedIndex == 0 && this.options.length == 1) { return; }

						e.data = jQuery(this).data("data"); // data is id
						// this.selectedIndex == 0, it is deselection
						e.data.val = (this.selectedIndex == 0 && this.options.length > 1) ? null: this.options[this.selectedIndex].value;

						if (this.selectedIndex == 0 && this.options.length > 1) {
							// deselection
							//jQuery(this).closest(".variantdropdown").find("button").addClass("non-selectable");
						} else {
							// selection
							//jQuery(this).closest(".variantdropdown").find("button").removeClass("non-selectable");
							jQuery(this).closest(".variantdropdown").find(".optionwrapper").slideUp(400,function(){
								jQuery(this).closest(".variantdropdown")
									.removeClass("current").addClass("selected")
									.nextUntil(".future").next()
										.addClass("current").removeClass("future")
											.find(".optionwrapper").slideDown(400, function(){
												jQuery(this).find("select option").each(function(index){
													if($(this).closest('select').find('option').length == 2 && index == 1){
														$(this).prop('selected', true).trigger('change');
														//$(this).attr('selected','selected').trigger('change');
													}
												});
											}).find('select').change();
							});
						}

						thisProduct.varAttrSelected(e);
						if (this.selectedIndex == 0 && this.options.length > 1) {
							// clear the current selection
							thisProduct.resetVariations();
						}
					});
				});

				if (thisProduct.selectedVarAttribs["color"]) {
					// show swatch related images for the current value
					thisProduct.showImages(thisProduct.selectedVarAttribs["color"], thisProduct.getAttrByID('color').vals);
				}
				else {
					// show images and bind hover event handlers for small/thumbnails to toggle large image
					thisProduct.showImages("", [{val: "", images: model.images}]);
				}
			}
			else {
				// show images and bind hover event handlers for small/thumbnails to toggle large image
				thisProduct.showImages("", [{val: "", images: model.images}]);
			}

			// bind product options event(s)
			getOptionsDiv(this);

			if(!model.productSet) {
				// quantity box
				if (!model.bundle) {
					getQtyBox(this);
				}// update avaiability for a bundle product, for everything else its done inside getQtyBox
				else if (model.bundle) {
					setAvailabilityMsg(createAvMessage(this, 1));
				}
			}

			// Add to cart button click binding
			getAddToCartBtn(this);
			// intial display of A2C button
			// if the price is 0 or not available, its disabled
			// if not in stock, its disabled
			// isPromoPrice would be true in case if a product has a promotional price which could make product's price 0
			if (!(this.getPrice() > 0 || this.isPromoPrice()) ||
				model.master || model.variant || model.productSet || model.bundle ||
				(!model.inStock && model.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE && !model.productSet)) {
				this.disableA2CButton();
				/** if((this.getPrice() == 0 && !this.isPromoPrice())) {
					this.hideAvailability();
				}*/
			}
			if(model.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE)
			{
				//this.removeA2CButton();
			}

			// customer rating section only displayed for the main product
			if (!model.productSetProduct && !model.bundled) {
				if (!model.productSet && !isQuickView && !model.bundle) {
					getRatingSection(this.containerId);
				}
			}

			// wish list, sent to friend, add to gift
			getMiscLinks(this);

			// product tabs
			getTabs(this.containerId);

			// setup bundle/product set
			this.getSubProductsBinding();

			},
		toString: function() {
			return this.model;
		}
	}
} // Product defintion end
var ProductCache = null;
var quickviewShow = function(options) {
	var url = options.url;
	url = url = util.appendParamToURL(url, 'source', options.source);
	$("#QuickViewDialog").html("");
    var quickViewDialog = dialog.create({
        target: "#QuickViewDialog",
        options: {
            height: 530,
            width: 760,
            dialogClass: 'quickview',
            title: Resources.QUICK_VIEW_POPUP,
        }
    });
    quickViewDialog.dialog("open");
    progress.show("#QuickViewDialog");

	$.ajax({
		url: url,
		success: function(data){
			$(quickViewDialog).html("").append(data);
			util.hiddenData();
			var ProductCache = null;
	    	var producJson = $("#QuickViewDialog .productjson").data('productjson');
	    	ProductCache = Product(producJson);
	    	ProductCache.show({containerId: "pdpMain", append: false, source: options.source});
			addToCart.init();
			$("body").find(".quantityinput").off("keydown").on("keydown", function(e){
	    		if(e.keyCode == 13){
	    			e.preventDefault();
	    		}
	    	});
			progress.hide();
		}
	});
};
var pdpEvents = {
	    init: function () {
	    	util.hiddenData();
	    	var producJson = $("body").find(".productjson").data('productjson');
	    	var sourceValue = $("body").find(".http-source").val();
	    	ProductCache = Product(producJson);
	    	ProductCache.show({containerId: "pdpMain", append: false, source: sourceValue});
	    	$('#tabs').find('a[href="#pdpTab1"]').trigger('click');
    		var getDataOption = $('.product-primary-image').find('a').attr('data-options');
	    /*	if ( $(window).width() < 481) {
	    		$('.pdp-owl-customization .alternate-images').find('a').addClass('MagicZoom').attr('data-options',getDataOption);
	    		if ($('.pdp-owl-customization').contents().length > 0) {
		    		$('.product-primary-image.app-figure').addClass('invisible-style');
		    	}
		    	else {
		    		$('.product-primary-image.app-figure').removeClass('invisible-style');
		    	}
	    	}
	    	else {
	    		$('.pdp-owl-customization .alternate-images').find('a').removeClass('MagicZoom').removeAttr('data-options',getDataOption);
	    		$('.product-primary-image.app-figure').removeClass('invisible-style');
	    	}*/
	    	$("body").find(".quantityinput").on("keydown", function(e){
	    		if(e.keyCode == 13){
	    			e.preventDefault();
	    		}
	    	});
	    	$(document).on("click", ".youtube-list-video a" ,function(e){
	    		if ( $(window).width() > 480 && $(window).width() < 959) {
	    			util.scrollBrowser($(".tab-sec").offset().top);
	    		}
	    		else if ( $(window).width() < 481) {
	    			util.scrollBrowser($(".mobile-tabs-section .tabsHeader.videoTab").offset().top);
	    		}
	    	});
	    	$(document).on("click", ".video-link" ,function(e){
	    	    if ( $(window).width() > 480) {
	    	    	util.scrollBrowser($(".tab-sec").offset().top);
		    	    $('#tabs #videoTab').find('a[href="#pdpVideoTab"]').trigger('click');
		    	}
		    	else if ( $(window).width() < 481) {
		    		util.scrollBrowser($(".mobile-tabs-section .tabsHeader.videoTab").offset().top);
		    		$(".tabsHeader.videoTab").parent('.mobile-tabs-section ').addClass("active");
		    		if($('.videoTab').hasClass('loaded')){
			   			 return false;
			   		 }
			   		 $('.videoTab').addClass('loaded');
			   		 var target = $("#pdpVideoTab");
			   		 var url= $("#productURL").val();
			   		 ajax.load({
			   			 url : url,
			   			 dataType : 'html',
			   			 callback : function (data){
			   				 target.html(data);
			   			 }
			   		 });
		    	}
	    	});
	    	$('#add-to-cart').bind('click', function () {
    	    	$('.addedto-cartoverlay').addClass('added-overlay');
    	    	setTimeout(function(){
    	    		$('.addedto-cartoverlay').removeClass('added-overlay');
	    		}, 2000);
    	    });
	    	$('#QuickViewDialog .product-primary-image').find('.product-image').click(function () {
	    		return false;
	    	});
	    	if(($('.provideo-spec-link').length > 0 )){
		    	if(!($('.video-link').length > 0 )){
		    		if ($(window).width() > 480) {
		    			$(".productname.h-one-tag").css({"width": "auto", "margin-bottom": "-26px", "float": "left", "padding-bottom": "8px"});
		    		}
		    	}
	    	}
	    	else{
	    		if ($(window).width() > 480) {
	    			$(".productname.h-one-tag").css({"padding-bottom": "4px"});
	    		}
	    	}
	    	$(document).on("click", ".specChart-link" ,function(e){
	    		if ( $(window).width() > 480) {
	    			util.scrollBrowser($(".tab-sec").offset().top);
		    		$('#tabs').find('a[href="#specChartTab"]').trigger('click');
		    	}
		    	else if ( $(window).width() < 481) {
		    		util.scrollBrowser($(".mobile-tabs-section .tabsHeader.specTab").offset().top);
		    		$(".tabsHeader.specTab").parent('.mobile-tabs-section ').addClass("active");
		    	}
	    	});
	    	var pdpRecomendation = function(){
	    		  var pdpRecomendationCarousel = $('.pt_product-details .jcarouselcont .recommendations').find('.pdprecomo-owl');
		    		  pdpRecomendationCarousel.owlCarousel({
		    			nav: true,
		    	    	dots: true,
		    	    	navigation:false,
		    		    navRewind: false,
	    	    		rewind:false,
	    	    		loop: false,
		    		    items: 5,
		    		    responsiveClass:true,
		    		    responsive:{
		                    0:{
		                        items:2,
		                        slideBy:2
		                    },
		                    767:{
		                        items:2,
		                        slideBy:2
		                    },
		                    768:{
		                       items:5,
		                       slideBy:5
		                    }
		                }
		    		  });
		    		  var viewport = jQuery(window).width();
		    	      var itemCount = jQuery(".owl-carousel .item").length;
		    		  if(
	                      (viewport >= 959 && itemCount > 5) //desktop
	                      || ((viewport >= 481 && viewport < 600) && itemCount > 3) //tablet
	                      || (viewport < 480 && itemCount > 2) //mobile
	                  )
	                  {
	                       $('.pdprecomo-owl').find('.owl-prev, .owl-next').show();
	                       $('.pdprecomo-owl').find('.owl-dots').show();

	                  }
	                  else
	                  {
	                	  $('.pdprecomo-owl').find('.owl-prev, .owl-next').hide();
	                	  $('.pdprecomo-owl').find('.owl-dots').hide();
	                  }
		    		  $(".product-listing").find("h2.hide").removeClass("hide");
		    		  var height = $('.owl-item').height();
		    		  $('.pdprecomo-owl').find('.owl-item').find('.product-tile.item').height(height - 100);
	    		  $('.pt_product-details .product-tile .product-image').on('mouseenter', function () {
	    		        var $qvButton = $('#quickviewbutton');
	    		        if ($qvButton.length === 0) {
	    		            $qvButton = $('<a id="quickviewbutton" class="quickview">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
	    		        }
	    		        var $link = $(this).find('.thumb-link');
	    		        $qvButton.attr({
	    		            'href': $link.attr('href'),
	    		            'title': $link.attr('title')
	    		        }).appendTo(this);
	    		        $qvButton.off('click').on('click', function (e) {
		  			        e.preventDefault();
		  			        var options = {
	  			        			url: $(this).attr('href'), //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
			        				source: 'quickview'
		  			        };
		  			        quickviewShow(options);
					    });
	    		    });
	    		};
	    		setTimeout(pdpRecomendation, 5500);
	    }
	};

module.exports = pdpEvents;
},{"../../ajax":2,"../../dialog":10,"../../progress":39,"../../quickview":40,"../../tooltip":46,"../../uievents":47,"../../util":48,"./addToCart":29}],32:[function(require,module,exports){
'use strict';
var progress = require('../progress'),
    uievents = require('../uievents'),
    tooltip = require('../tooltip'),
    validator = require('../validator'),
    ajax = require('../ajax'),
    util = require('../util');

var rapalainsider= {
    init: function () {
    	tooltip.init();
    	validator.init();
    	uievents.init();
            if(jQuery("#dialogcontainer123").length == 0) {
                jQuery(document.body).append("<div id='dialogcontainer123' class='vipinsider-container'></div>");
            }
            jQuery.each(jQuery("form:not(.suppress)"), function () {
                jQuery(this).validate(settings);
            });

           var $vipinsider = $('.vipinsider-container'),
           	 	vipform = $('.VipinsiderForm');
           var validatorinit = $(this).closest('form').validate();
           $('#PasswordReset123').click(function(e){
		                e.preventDefault();
		                $vipinsider.load(Urls.vipInsider, function(){
			            	$vipinsider.dialog({
			                   bgiframe: true,
			                   autoOpen: false,
			                   modal: true,
			                   overlay: {
			                       opacity: 0.5,
			                       background: "white"
			                   },
			                   width: 358,
			                   dialogClass: 'vipInsider-dlg',
			                   resizable: false,
			                   open: function(){
			                       tooltip.init();
			                       validator.init();
			                       uievents.init();
			                       rapalainsider.dialogEvents();
			                       rapalainsider.formPrepare({
			                 		formSelector:'#VipinsiderForm',
			                 		continueSelector: '#VIPInsider-form-sbmt-id',
			                 		type:'opacity'
			                 	  });
			                 	 rapalainsider.vipinsiderevents();
			                 	if( $(window).width() > 1200 ) {
			                 		rapalainsider.customselecteventsb();
			                 	}
			                 	 rapalainsider.textarearapala();
			                 	 rapalainsider.clearbuttonfunct();
			                 	  $('.remove').click(function(e){
			        	    	      e.preventDefault();
			        	    	      var filename = $(this).attr('data-file');
			        	    	      var form = $(this).closest('form');
			        	    	      var url= form.attr('action');
			        	    	      var finalURL = util.appendParamToURL(url,'filename',filename);
			        	    	      ajax.load({
			        	         			url: finalURL,
			        	     				callback : function () {
			        	     				  }
			        	     			});
			        	    	 });
			                   }
			        	   });
			               jQuery("#dialogcontainer123").dialog("open");
			               $(window).scrollTop(0);
			           });
		    });
    },
    dialogEvents: function(){
    	var $vipinsider = $('.vipinsider-container'),
   	 	vipform = $('.VipinsiderForm');
    	rapalainsider.clearbuttonfunct();
    	$vipinsider.find('#VIPInsider-form-sbmt-id').on('click',function(e){
				e.preventDefault();
				var prodid = $('.fieldstaff form .dyn-cat-select select').find(':selected').val();
				 if($('.trigger_singleupload').is(":visible") && prodid!= 'donation'){
					if(!($(".vip-uploadform-holder .filelist").find(".updatetext").length != 0)){
						$(".vip-uploadform-holder").find(".empty-attachment-error").removeClass("hide");
						if(!$(this).closest('form').valid()){return false;}
						return false;
					}
				 }
				if(!$(this).closest('form').valid()){return false;}
				$(".vip-uploadform-holder").find(".empty-attachment-error").addClass("hide");
				 var vipURL = $(this).closest('form').attr('action');
				 var vipData = $(this).closest('form').serialize();
				 progress.show($(".fieldstaff form"));
				jQuery("#msgcontianer").remove();
				 $("<div/>").attr("id", "msgcontianer").html(" ").appendTo(document.body);
				 ajax.load({
					url: vipURL,
					data: vipData,
					type: "POST",
					callback : function (vipData) {
						$("body").find(".vipInsider-dlg .ui-dialog-titlebar-close").trigger("click");
						var present= $(vipData).find('.exiting_user').length,
							width = present > 0 ? '316px' : '358px',
							height = present > 0 ? 'auto' : '184',
							dlgClass = present > 0 ? 'existinguserdlg' : 'newuserdlg';
						$("#msgcontianer").find(".regcheck").remove();
						jQuery("#msgcontianer").append(vipData);
						jQuery("#msgcontianer").dialog({
		                   bgiframe: true,
		                   autoOpen: false,
		                   modal: true,
		                   overlay: {
		                       opacity: 0.5,
		                       background: "white"
		                   },
		                   width: width,
		                   height: height,
		                   dialogClass: 'vipInsider-dlg '+dlgClass,
		                   resizable: false,
		                   open: function(){
		                   }
		        	   });
						jQuery("#msgcontianer").dialog("open");
					   	 $('.vipInsider-dlg.ui-dialog.existinguserdlg button.close, .vipInsider-dlg.ui-dialog.newuserdlg button.close').on("click",function(e){
							 e.preventDefault();
							 $(this).closest(".ui-dialog").find(".ui-dialog-titlebar-close").trigger("click");
						 });
					  }
				});
			 });
		   $('.vipInsider-dlg.ui-dialog.existinguserdlg button.close, .vipInsider-dlg.ui-dialog.newuserdlg button.close').on("click",function(e){
			 e.preventDefault();
			 $(this).closest(".ui-dialog").find(".ui-dialog-titlebar-close").trigger("click");
		   });
		 $vipinsider.find('.trigger_singleupload input[type="file"]').on("click" ,function(){
			 if($(this).closest(".vip-uploadform-holder").find(".empty-attachment-error").is(":visible")){
				 $(this).closest(".vip-uploadform-holder").find(".empty-attachment-error").addClass("hide");
			 }
		 });
		    //VIP insider dropdown change
		 $(".fieldstaff form").find(".dyn-cat-select select").off("change").on("change", function(e){
		    	e.preventDefault();
		    	var $curObj = $(this);
		    	if( $(this).closest(".dyn-cat-select").find(".sbHolder").length > 0 ) {
		    		var selectedText = $(this).closest(".dyn-cat-select").find(".sbSelector").text();
		    		var prodid = $(this).find('option[label="'+selectedText+'"]').attr("value");
		    	}
		    	else {
		    		var prodid = $(this).find(':selected').val();
		    	}
		    	//alert($(this).find(':selected').val());
		    	var url =  Urls.vipInsiderDynamicForms;

		    	if(prodid == 'field' || prodid == 'sports' || prodid == 'industry' || prodid == 'donation'){
		    		if (prodid == 'sports'){
		    			$('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Upload Business Card or Pay Stub</span>' );
		    			$('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload Business card or Pay Stub');
		    		}
		    		if (prodid == 'field') {
		    			$('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Attach Resume</span>');
		    			$('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload your Resume');
		    		}
		    		if (prodid == 'industry') {
		    			$('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Upload Business Card</span>' );
		    			$('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload a Business Card');
		    		}
		    		if (prodid == 'donation') {
		    			$('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">Upload Flyer</span>');
		    			//$('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload a Flyer');
		    			//$('.vip-uploadform-holder').find('span.text-holder-upload').closest('form').removeClass('trigger_singleupload');
		    		}
					$('.vip-uploadform-holder').removeClass('hide');
				}else{
					$('.vip-uploadform-holder').addClass('hide');
				}

		    	if(prodid != undefined && prodid != null && prodid.length>0){
					 url = url+"?prodid="+prodid;
				}else {return false};

				progress.show($(".fieldstaff form"));
				ajax.load({
					url: url,
					callback : function (data) {
						if(($('.fieldstaff form .dynamic-content-holder-vip')!= undefined && $('.fieldstaff form .dynamic-content-holder-vip').length > 0) && ($(data).filter('.vipinsider-onload-data-holder')!= undefined && $(data).filter('.vipinsider-onload-data-holder').length > 0)){
							$('.fieldstaff form .dynamic-content-holder-vip').html($(data).filter('.vipinsider-onload-data-holder').html());
							$('.trigger_singleupload .pro_id').val(prodid);
							var dateObj = new Date();
							dateObj.setTime(dateObj.getTime() + (60*60*1000));
							document.cookie="progcookie="+prodid+"; expires="+dateObj.toUTCString()+"; path=/";
							progress.hide();
							if( $(window).width() > 1200 ) {
		                 		rapalainsider.customselecteventsb();
		                 	}
							rapalainsider.textarearapala();
						    rapalainsider.clearbuttonfunct();
							rapalainsider.formPrepare({
		                 		formSelector:'#VipinsiderForm',
		                 		continueSelector: '#VIPInsider-form-sbmt-id',
		                 		type:'opacity'
		                 	});
							if( $curObj.closest(".dyn-cat-select").find(".sbHolder").length > 0 ) {
					    		var selectedText = $curObj.closest(".dyn-cat-select").find(".sbSelector").text();
					    		var prodid = $curObj.find('option[label="'+selectedText+'"]').attr("value");
					    	}
					    	else {
					    		var prodid = $curObj.find(':selected').val();
					    	}
							if(prodid != "Select A Program") {
								$(".dyn-cat-select").find(".label").removeClass("erroroccured");
								$(".dyn-cat-select").find(".label span.errorclient.inputlabel").remove();
								$(".dyn-cat-select").find(".label span").removeClass("inputlabel");
								$(".dyn-cat-select").find("select").removeClass("errorclient").addClass("valid");
							}
							if($('.filelist').find('ul').length>0){
								$('.filelist').find('ul').css({"display":'none'});
		    					}
		    			  }
		    			}
		    		});
		         });
    },
    // sub namespace app.ajax.* contains application specific ajax
    // components
    ajax: {
        Success: "success",
        currentRequests: {}, // request cache

        // ajax request to get json response
        // @param - reqName - String - name of the request
        // @param - async - boolean - asynchronous or not
        // @param - url - String - uri for the request
        // @param - data - name/value pair data request
        // @param - callback - function - callback function to be called
        getJson: function (options) {
            var thisAjax = this;

            // do not bother if the request is already in progress
            // and let go null reqName
           if(!options.reqName || !this.currentRequests[options.reqName]) {
                this.currentRequests[options.reqName] = true;
               if(options.async == "undefined")
                    options.async = true;
                // make the server call
                jQuery.ajax({
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: options.url,
                    cache: true,
                    async: options.async,
                    data: options.data,

                    success: function (response, textStatus) {
                        thisAjax.currentRequests[options.reqName] = false;

                        if(!response.Success){
                            // handle failure
                        }

                        options.callback(response, textStatus);
                    },

                    error: function (request, textStatus, error) {
                       if(textStatus === "parsererror") {
                            alert(app.resources["BAD_RESPONSE"]);
                        }

                        options.callback({
                            Success: false,
                            data: {}
                        });
                    }
                });
            }
        },

        // ajax request to load html response in a given container
        // @param - reqName - String - name of the request
        // @param - url - String - uri for the request
        // @param - data - name/value pair data request
        // @param - callback - function - callback function to be called
        // @param - selector - string - id of the container div/span
        // (#mycontainer) - it must start with '#'
        load: function (options) {

            var thisAjax = this;

            // do not bother if the request is already in progress
            // and let go null reqname
           if(!options.reqName || !this.currentRequests[options.reqName]) {
                this.currentRequests[options.reqName] = true;
                // make the server call
                jQuery.ajax({
                    dataType: "html",
                    url: options.url,
                    cache: true,
                    data: options.data,

                    success: function (response, textStatus) {
                        thisAjax.currentRequests[options.reqName] = false;

                       if(options.selector) {
                            jQuery(options.selector).html(response);
                        }

                        (options.callback != undefined ? options.callback(
                            response, textStatus) : null)
                    },

                    error: function (request, textStatus, error) {
                       if(textStatus === "parsererror") {
                            alert(resources["BAD_RESPONSE"]);
                        }

                        options.callback(null, textStatus);
                    }
                });
            }
        }
    },

    vipinsiderevents: function(){
    	var $vipinsider = $('.vipinsider-container'),
   	 	vipform = $('.VipinsiderForm');
  		 $vipinsider.find('.trigger_singleupload input[type="file"]').unbind('change').change(function(){

	    		var xhr = new XMLHttpRequest(),
	    			data = new FormData(),
	    			files = $("#fileid").get(0).files,
	    			form = $(this).closest('form');
	    			//if($(this).hasClass('errorclient')){ $(this).trigger('blur'); }
	    			var totalsize= 0;
	    				totalsize = $('.vip-uploadform-holder .remove_singleupload span.updatetext').eq(0).attr('value');

	    			if((this.files[0].size/1024/1024) > 2 || totalsize > 2 ){
	    		 		$vipinsider.find(".vip-uploadform-holder .file-size-exceed-error").removeClass("hide");
	    		 		return false;
	    	 		}

	    			var extension = this.files[0].name.split('.')[1].toLowerCase();
	    			if((extension != "jpg") && (extension != "png") && (extension != "PNG") && (extension != "jpeg") && (extension != "pdf") && (extension != "gif") && (extension != "doc")  && (extension != "docx") && (extension != "pages")){
	    		 		$vipinsider.find(".vip-uploadform-holder .file-format-exceed-error").removeClass("hide");
	    		 		return false;
	    	 		}

	    			$vipinsider.find(".vip-uploadform-holder .file-format-exceed-error").addClass("hide");
	    			$vipinsider.find(".vip-uploadform-holder .file-size-exceed-error").addClass("hide");
	    			form.find(".progressbar").fadeIn(500);

	    			for (var i = 0; i < files.length; i++) {
		   		      data.append(files[i].name, files[i]);
		   		    }
		   		    xhr.upload.addEventListener("progress", function (evt) {
			   		    if (evt.lengthComputable) {
			   		      var progress = Math.round(evt.loaded * 100 / evt.total);
			   		      form.find(".progressbar .count").text(progress+'% Complete');
			   		 	  form.find(".progressbar .progressload").width(progress+'%');
			   		    }
		   		    }, false);
		   		    xhr.open("POST", form.attr('action'));
		   		    xhr.send(data);

			   		  xhr.upload.addEventListener('loadend', function(evt) {
			   			form.find("#fileid").val('');
			   			setTimeout(function(){
			   				form.find(".progressbar").fadeOut(100, function(){
				   				form.find(".progressbar .count").text('0%');
					   			form.find(".progressbar .progressload").width('0');
				   			});
			   			}, 500);
			   		  });

		   		  xhr.onload=function(){
		   			$('.vip-uploadform-holder .filelist').html(xhr.responseText);
		   			rapalainsider.vipinsiderevents();
		   		  }
	    	 });

  		 if($(window).width() <= 767){
	    		 $('.insider_body.rapala_device [maxlength]').bind('keypress keyup',function(e){
                   var $this = $(this);
                   var val = $this.val();
                   var valLength = val.length;
                   var maxCount = $this.attr('maxlength');
                   if(valLength>maxCount){
                       $this.val($this.val().substring(0,maxCount));
                   }
               });
  		 }

  		 $vipinsider.find('.remove').unbind('click').click(function (e) {
	    	      e.preventDefault();
	    	      var filename = $(this).attr('data-file');
	    	      var form = $(this).closest('form');
	    	      var url= form.attr('action');
	    	      var finalURL = util.appendParamToURL(url,'filename',filename);
	    	      ajax.load({
	         			url: finalURL,
	         			type: "POST",
	     				callback : function (data) {
	     					$('.vip-uploadform-holder .filelist').html(data);
	     					rapalainsider.vipinsiderevents();
	     				  }
	     			});
	    	 });


  	 },

     formPrepare: function (opts) {

     	var $form, $continue, $requiredInputs, validator;

     	var hasEmptyRequired = function () {
     		// filter out only the visible fields
     		var requiredValues = $requiredInputs.filter(':visible').map(function () {
     			return $(this).val();
     		});
     		return $.inArray("",requiredValues) != -1;
     	};

     	var validateForm = function () {
     		// only validate form when all required fields are filled to avoid
     		// throwing errors on empty form
     		if (!hasEmptyRequired() && validator.form()) {
     			$continue.removeAttr('disabled').removeClass('button_invisible');
     		} else {
     			opts.type == "disable" ? $continue.attr('disabled', 'disabled') : $continue.addClass('button_invisible');
     		}
     	};

     	var validateEl = function () {
     		if ($(this).val() === '') {
     			opts.type == "disable" ? $continue.attr('disabled', 'disabled') : $continue.addClass('button_invisible');
     		} else {
     			// enable continue button on last required field that is valid
     			// only validate single field
     			if (validator.element(this) && !hasEmptyRequired()) {
     				$continue.removeAttr('disabled').removeClass('button_invisible');
     			} else {
     				opts.type == "disable" ? $continue.attr('disabled', 'disabled') : $continue.addClass('button_invisible');
     			}
     		}
     	};
     	//type optional value disable or opacity
     	$form = $(opts.formSelector);
     	$continue = $(opts.continueSelector);
     	validator = $form.validate();
     	$requiredInputs = $('.required', $form).filter(':input');
     	validateForm();
     	// start listening
     	$requiredInputs.change(validateEl);
     	$requiredInputs.filter('input').blur(validateEl);
     },

     customselecteventsb: function(){
         if(!$('body').hasClass('rapala_device')){
         	var $con = $('body');
      	   $con.find(".customized-select").find("select").each(function(){
 				if($(this).attr('disabled')){ $(this).selectbox('disable');}
 				else{ $(this).selectbox();}
 				$('.sbOptions li:last').addClass('last');
 			}).focus(function(){
 				$(this).next('.sbHolder').trigger('focus');
 			});

         }


     },

     textarearapala: function(){
 	  	$('textarea[maxlength]').each(function(){
			charcount($(this));
			// trigger the keydown event so that any existing character data is calculated
		}).on('keyup keypress', function(){
			charcount($(this));
		});

		function charcount($this){
			var characterLimit = "1200";
			var charRemains = characterLimit - $this.val().trim().length;
			var charCountContainer='';
			var charCountHtml = 'Characters Remaining ' + charRemains
			if($this.hasClass("vip-textarea")){
				if ($this.next('div.char-count').length === 0) {
					charCountContainer = $('<div class="char-count"/>').insertAfter($this);
				}
				$this.next('div.char-count').html(charCountHtml);
			}else {
				if ($this.prev('div.char-count').length === 0) {
					charCountContainer = $('<div class="char-count"/>').insertBefore($this);
				}
				$this.prev('div.char-count').html(charCountHtml);
			}
		}


     },

     clearbuttonfunct: function(){
 	 	if($('#dialogcontainer123').length > 0){
			$('#dialogcontainer123').find('.formfield').each(function () {
	               if($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0 || $(this).find('.field-wrapper textarea').length > 0){
	                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
	                }
			});
		}
		$("body").find('#dialogcontainer123 .field-wrapper input, textarea').on('keyup input blur', function () {
		       if($(this).val() != undefined) {
		           if($(this).val().length > 0) {
		        	   $(this).closest('.formfield').find('a.clearbutton').show();
		            }
		            else {
		            	$(this).closest('.formfield').find('a.clearbutton').hide();
		            }
		        }
			});

		$("body").find('#dialogcontainer123 .field-wrapper a.clearbutton').on('click', function () {
			var characterLimit = "Characters Remaining 1200";
			 $(this).closest('.formfield').find('input') .val("");
		     $(this).closest('.formfield').find('textarea') .val("");
			 $(this).closest(".field-wrapper").find('span').remove();
			 $(this).closest(".field-wrapper").find('.required').removeClass('errorclient');
			 $(this).closest('.formfield').find('a.clearbutton').hide();
			 $(this).closest('.formfield ').find('.form-row').removeClass('inputlabel');
			 $(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
			 $(this).closest(".formfield").find("span.logerror , .existing_register").hide();
			 $('div.char-count').html(characterLimit);
        });
     }


};
module.exports = rapalainsider;
},{"../ajax":2,"../progress":39,"../tooltip":46,"../uievents":47,"../util":48,"../validator":49}],33:[function(require,module,exports){
'use strict';

var addProductToCart = require('./product/addToCart'),
    ajax = require('../ajax'),
    quickview = require('../quickview'),
    account = require('./account'),
    util = require('../util');

/**
 * @function
 * @description Loads address details to a given address and fills the address form
 * @param {String} addressID The ID of the address to which data will be loaded
 */
function populateForm(addressID, $form) {
    // load address details
    var url = Urls.giftRegAdd + addressID;
    ajax.getJson({
        url: url,
        callback: function (data) {
            if (!data || !data.address) {
                window.alert(Resources.REG_ADDR_ERROR);
                return false;
            }
            // fill the form
            $form.find('[name$="_addressid"]').val(data.address.ID);
            $form.find('[name$="_firstname"]').val(data.address.firstName);
            $form.find('[name$="_lastname"]').val(data.address.lastName);
            $form.find('[name$="_address1"]').val(data.address.address1);
            $form.find('[name$="_address2"]').val(data.address.address2);
            $form.find('[name$="_city"]').val(data.address.city);
            $form.find('[name$="_country"]').val(data.address.countryCode).trigger('change');
            $form.find('[name$="_postal"]').val(data.address.postalCode);
            $form.find('[name$="_state"]').val(data.address.stateCode);
            $form.find('[name$="_phone"]').val(data.address.phone);
            // $form.parent('form').validate().form();
        }
    });
}

/**
 * @private
 * @function
 * @description Initializes events for the gift registration
 */
function initializeEvents() {
    var $eventAddressForm = $('form[name$="_giftregistry"]'),
        $beforeAddress = $eventAddressForm.find('fieldset[name="address-before"]'),
        $afterAddress = $eventAddressForm.find('fieldset[name="address-after"]');

    $('.usepreevent').on('click', function () {
        // filter out storefront toolkit
        $(':input', $beforeAddress).not('[id^="ext"]').not('select[name$="_addressBeforeList"]').each(function () {
            var fieldName = $(this).attr('name'),
                $afterField = $afterAddress.find('[name="' + fieldName.replace('Before', 'After') + '"]');
            $afterField.val($(this).val()).trigger('change');
        });
    });

    $eventAddressForm.on('change', 'select[name$="_addressBeforeList"]', function () {
        var addressID = $(this).val();
        if (addressID.length === 0) {
            return;
        }
        populateForm(addressID, $beforeAddress);
    })
    .on('change', 'select[name$="_addressAfterList"]', function () {
        var addressID = $(this).val();
        if (addressID.length === 0) {
            return;
        }
        populateForm(addressID, $afterAddress);
    });

    $('form[name$="_giftregistry_items"]').on('click', '.item-details a', function (e) {
        e.preventDefault();
        var productListID = $('input[name=productListID]').val();
        quickview.show({
            url: e.target.href,
            source: 'giftregistry',
            productlistid: productListID
        });
    });
}

exports.init = function () {
    initializeEvents();
    addProductToCart();
    //Start JIRA PREV-333 : On click of Forgot Password link navigates to the page instead of overlay.
    account.initCartLogin();
    util.setDeleteConfirmation('.item-list', String.format(Resources.CONFIRM_DELETE, Resources.TITLE_GIFTREGISTRY));
};

},{"../ajax":2,"../quickview":40,"../util":48,"./account":19,"./product/addToCart":29}],34:[function(require,module,exports){
'use strict';

var compareWidget = require('../compare-widget'),
    productTile = require('../product-tile'),
    progress = require('../progress'),
    uievents = require('../uievents'),
    imagesLoaded = require('imagesloaded'),
    util = require('../util');

function infiniteScroll() {
    // getting the hidden div, which is the placeholder for the next page
    var loadingPlaceHolder = $('.infinite-scroll-placeholder[data-loading-state="unloaded"]');
    // get url hidden in DOM
    var gridUrl = loadingPlaceHolder.attr('data-grid-url');
    if (loadingPlaceHolder.length === 1 && util.elementInViewport(loadingPlaceHolder.get(0), 250)) {
        // switch state to 'loading'
        // - switches state, so the above selector is only matching once
        // - shows loading indicator
        loadingPlaceHolder.attr('data-loading-state', 'loading');
        loadingPlaceHolder.addClass('infinite-scroll-loading');


        // named wrapper function, which can either be called, if cache is hit, or ajax repsonse is received
        var fillEndlessScrollChunk = function (html) {
            loadingPlaceHolder.removeClass('infinite-scroll-loading');
            loadingPlaceHolder.attr('data-loading-state', 'loaded');
            $('div.search-result-content').append(html);
        };

        // old condition for caching was `'sessionStorage' in window && sessionStorage["scroll-cache_" + gridUrl]`
        // it was removed to temporarily address RAP-2649

        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: gridUrl,
            success: function (response) {
                // put response into cache
                try {
                    sessionStorage['scroll-cache_' + gridUrl] = response;
                } catch (e) {
                    // nothing to catch in case of out of memory of session storage
                    // it will fall back to load via ajax
                }
                // update UI
                fillEndlessScrollChunk(response);
                productTile.init();
            }
        });
    }
}
/**
 * @private
 * @function
 * @description replaces breadcrumbs, lefthand nav and product listing with ajax and puts a loading indicator over the product listing
 */
function updateProductListing(url) {
    if (url == null) {
        return;
    }
    $('#main').addClass('hidecontent');
    progress.show("#main");
	  $('#main').load(util.appendParamToURL(url, 'format', 'ajax'), function () {
		searchRefinment.searchRefinementToggle();
		uievents.init();
	    compareWidget.init();
	    productTile.init();
	    owlcarousel();
	   /* $('.scrollable').each(function(){
	    	$(this).slimScroll({
	            size: '10px',
	            height: '200px',
	            railVisible: true,
	            alwaysVisible: true
	        });

	    });*/

	    progress.hide();
	    $('#main').removeClass('hidecontent');
	    history.pushState(undefined, '', url);
	    $("html, body").animate({ scrollTop: 0 }, "fast");
	    if($('.pt_product-search-result .search-blk').length > 0) {
	    	$('.pt_product-search-result').find('#primary').addClass('search-result');
	    }
	    if($('.refine-display.refine-values .breadcrumb-refinement').length > 0){
	    	$('.pt_product-search-result.searchresult').find('#primary').addClass('search-result');
	    	$('.pt_product-search-result.categorylanding').find('#primary').addClass('search-result');
	    }
	    else {
	    	$('.pt_product-search-result.searchresult').find('#primary').addClass('search-result');
	    	$('.pt_product-search-result.categorylanding').find('#primary').removeClass('search-result');
	    }
	    gridSyncheight();
	    $("#secondary").removeClass("visible-hidden").addClass("secondary-hide");
    });
}
// updates the grid using the 'post hash' refinement values
function gridSyncheight() {
    $('.tiles-container .product-tile').syncHeight();
}
function updateGrid() {
	if(util.readCookie("selectedOption") && window.location.hash.length == 0 && window.location.href.indexOf('srule=') == -1 && $('.sortitem-blk').is(":visible")){
		window.location.hash = "srule="+util.readCookie("selectedOption");
	}

	if (window.location.hash)
	{
		var url = window.location.href;
		if((url.indexOf('?') != -1) && (url.indexOf('#') != -1)){
			url = url.replace('#','&');
		}
		else if (url.indexOf('?') == -1) {
			url = url.replace('#','?');
		}
		updateProductListing(url);
	}
}
function owlcarousel() {
setTimeout(function(){
    var owl = $('.owl-carousel');
       owl.owlCarousel({
    	       items:5,
                  slideBy: 5,
            rewind: false,
                  nav: true,
                  navRewind: false,
                  loop: false,
            dots: true,
            responsive:{
                0:{
                    items:2,
                    slideBy:2
                },
                767:{
                    items:2,
                    slideBy:2
                },
                768:{
                   items:5,
                   slideBy:5
                }
            }
       });

       var viewport = jQuery(window).width();
       var current = $(this);
       var itemCount = $(".recommendations.cross-sell.Recommended.For.You .owl-carousel .owl-item").length;
       if(
           (viewport >= 768 && itemCount > 5) || (viewport < 768 && itemCount > 2)
       )
       {
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-prev, .owl-next').show();
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-dots').show();

       }
       else
       {
    	   $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-prev, .owl-next').hide();
    	   $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-dots').hide();
       }

       var viewportone = jQuery(window).width();
       var currentone = $(this);
       var itemCountone = $(".recommendations.cross-sell.Recently.Viewed .owl-carousel .owl-item").length;

       if(
           (viewport >= 768 && itemCountone > 5) || (viewport < 768 && itemCountone> 2)
       )
       {
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-prev, .owl-next').show();
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-dots').show();

       }
       else
       {
    	   $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-prev, .owl-next').hide();
    	   $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-dots').hide();
       }
       $(".product-listing").find("h2.hide").removeClass("hide");

       productTile.init();
       $('.pt_product-search-result .recommendations.cross-sell .search-result-items .product-tile.item').last().addClass('recomlast');
 },5500);

}
var searchRefinment = {
		searchRefinementToggle : function(){
			//$("#secondary").removeAttr("style");
			$(".js-scrollbar").each(function($i){
				var curObj = $(this);
				var thresholdValue = $(curObj).closest('.refinement').find('.device-refine').val();
        		if($('.rapala_device').length == 0){
        			if($(this).closest('.navgroup').hasClass('refinement')){
            			if($(this).find('li').length > 8){
            				$(this).addClass('js-scrollbar-height');
            				$(this).find(".overview").slimScroll({
                        		railVisible: true,
                        		height: "200px",
                        		size: '10px',
                        		railColor: 'transparent',
                        		color: '#a0a0a0',
                        	    alwaysVisible: true
                            });
            				//$(this).tinyscrollbar({trackSize : 200});
            			}else{
            				$(this).find('.overview').css('position','static');

            			}
            		}else{
            			//$(this).tinyscrollbar({trackSize : 200});
            			$(this).find(".overview").slimScroll({
                    		railVisible: true,
                    		height: "200px",
                    		size: '10px',
                    		railColor: 'transparent',
                    		color: '#a0a0a0',
                    	    alwaysVisible: true
                        });

            		}
        		}else{
        			/*if($(this).find('li').length > thresholdValue && $(this).find('.seeMoreRefinements').length == 0){
        				if($(this).find('.seeNextRefinements').length == 0 && $(this).find('.seePrevRefinements').length == 0){
        					$(this).append('<a href="#" class="seeNextRefinements">See Next</a>');
            				$(this).append('<a href="#" class="seePrevRefinements">See Previous</a>');
        				}
        				thresholdValue -= 1;
        				$(this).find('li').eq(thresholdValue).nextAll('li').hide();
        				$('.seePrevRefinements').hide();
        			}
        			else{
        				$(this).find('li').show();
        				$(this).find('.seeNextRefinements').hide();
        			}*/
        		}

        		if($i == ($(".js-scrollbar").length - 1)){
        			$('#searchrefinements div.navgroup').each(function (i) {
        				if($(window).width() < 960 ) {
        					if ($(this).find('li.selected').length == 0) {
                           	  $(this).find('div.refineattributes').hide();
                           	  $(this).find(".filter").addClass('expand');
                           	  $(this).addClass('collapse-expand');
                             }
        				}
        				else {
							if (i > 2 && $(this).find('li.selected').length == 0) {
                         	  $(this).find('div.refineattributes').hide();
                         	  $(this).find(".filter").addClass('expand');
                         	  $(this).addClass('collapse-expand');
							} else if(i < 3 ) {
								  $(this).find('div.refineattributes').show();
	                         	  $(this).find(".filter").removeClass('expand');
	                         	  $(this).removeClass('collapse-expand');
							}
        				}

                   });
        		}
        	});


			// init refinement toggling
			$('#searchrefinements .filter').off('click').on("click",function(e) {
					e.preventDefault();
					jQuery(this).toggleClass("expand");
					$(this).closest('.navgroup').toggleClass('collapse-expand');
					jQuery(this).closest('.navgroup').find("div.refineattributes").toggle();
					//jQuery(this).closest('.navgroup').find(".js-scrollbar").tinyscrollbar({trackSize : 200});
			});

			$(window).load(function(){
				$("#secondary").removeClass("visible-hidden").addClass("secondary-hide");
			});
			if($(window).width() > 959) {
				$(".mobile-filter-by").removeClass("js-filter-active");
				$("#secondary").removeClass(".visible-hidden").removeAttr("style");
			}
		}
}

/**
 * @private
 * @function
 * @description Initializes events for the following elements:<br/>
 * <p>refinement blocks</p>
 * <p>updating grid: refinements, pagination, breadcrumb</p>
 * <p>item click</p>
 * <p>sorting changes</p>
 */
function initializeEvents() {
	updateGrid();
	owlcarousel();
	gridSyncheight();
	productTile.init();
    var $main = $('#main');
    // compare checked
    $main.on('click', 'input[type="checkbox"].compare-check', function () {
        var cb = $(this);
        var tile = cb.closest('.product-tile');

        var func = this.checked ? compareWidget.addProduct : compareWidget.removeProduct;
        var itemImg = tile.find('.product-image a img').first();
        func({
            itemid: tile.data('itemid'),
            uuid: tile[0].id,
            img: itemImg,
            cb: cb
        });

    });

	if($('.contentAsset-new').find('.html-slot-container').length > 0 ) {
        var current = $('.contentAsset-new').find('.html-slot-container');
        current.parents('.desktop').removeClass('promohide').addClass('promoshow');
        }
		else {
		$('.desktop').removeClass('promoshow').addClass('promohide');
   }

    $main.on('click', '.mobile-filter-by', function () {
	    if(!$(".mobile-filter-by").hasClass("js-filter-active")) {
	    	$(".mobile-filter-by").addClass("js-filter-active");
	    	$("#secondary").show();
	        //$("#secondary").css("top",secondaryTop+"px");
	    }else {
	    	$(".mobile-filter-by").removeClass("js-filter-active");
	    	$("#secondary").hide();
	        //$("#secondary").css("top",secondaryTop+"px");
	    }
    });
    $("#tabs a").click(function(e){
        e.preventDefault();
        $(this).prev('input[type="radio"]').prop('checked', true);
        var href = $(this).attr("href");
        window.location = href;
    });

    $main.on('click', '#tabs input[type="radio"]', function () {
    	var checked = $(this).prop('checked', true);
    	if(checked){
    	    $(this).prop('checked', false);
    	  }
    	  else{
    	    $(this).prop('checked', true);
    	  }
        $(this).next('a').trigger('click');
        $(this).prop('checked', true);
    });

    //searchcontent-section
    $main.on('click', '.mobile-filter-by.results-content', function () {
	    if(!$(".mobile-filter-by.results-content").hasClass("js-filter-active")) {
	    	$(".mobile-filter-by.results-content").addClass("js-filter-active");
	    	$("#secondary.searchResult-refinement").show();
	        //$("#secondary").css("top",secondaryTop+"px");
	    }else {
	    	$(".mobile-filter-by.results-content").removeClass("js-filter-active");
	    	$("#secondary.searchResult-refinement").hide();
	        //$("#secondary").css("top",secondaryTop+"px");
	    }
    });

    if($('.pt_product-search-result .search-blk').length > 0) {
    	$('.pt_product-search-result').find('#primary').addClass('search-result');
    }

    if($('.pt_content-search-result .folder-content-list').length > 0) {
    	$('.pt_content-search-result').find('#tabs #producttab').prop('checked', false);
    	$('.pt_content-search-result').find('#tabs #contenttab').prop('checked', true);
    }

    $main.on('click', '.sortby-button', function () {
	    if( $(window).width() >= 481 &&  $(window).width() <= 959 ) {
	    	    if(!$(".sortby-button").hasClass("js-sort-active")) {
	    	    	$(".sortby-button").addClass("js-sort-active");
	    	    	$('.search-result-options').addClass('show-sort');
	    	    	$(".mobile-sort-by-content").show();
	    	    }else {
	    	    	$(".sortby-button").removeClass("js-sort-active");
	    	    	$('.search-result-options').removeClass('show-sort');
	    	    	$(".mobile-sort-by-content").hide();
	    	    }

	       }
    });

    searchRefinment.searchRefinementToggle();

    /*$(window).resize(function(){
		searchRefinment.searchRefinementToggle();
    });*/

    /* $('.scrollable').each(function(){
    	$(this).slimScroll({
            size: '10px',
            height: '200px',
            railVisible: true,
            alwaysVisible: true
        });

    });*/
    // handle toggle refinement blocks
   /* $main.on('click', '.refinement h3', function () {
    	 if( !$(this).hasClass('expand') ){
         	$(this).addClass('expand').closest('.navgroup').addClass('collapse-expand').find('.sub-refinement').hide();

         }else {
         	$(this).removeClass('expand').closest('.navgroup').removeClass('collapse-expand').find('.sub-refinement').show();
         }
    });*/

    // color swatches events //
    $main.on('click', '.product-swatches .product-swatches-all', function () {
    	if($(this).hasClass('loaded')){
    		$(this).next('.swatch-list.swatch-toggle').show();
			 return false;
		 }
		 $(this).addClass('loaded');
         var cont = $(this).parent().find("ul.swatch-list.swatch-toggle");
 		 cont.show().focus();
         $(this).parent().find('ul.swatch-toggle li > a').each(function(i){
        	 if($(this).data('href')){
        		 $(this).find('img').attr('src', $(this).data('href'));
        	 }

		 });
         cont.show().focus();
    });
    // prepare swatch palettes and thumbnails
	// show the palette

	// hide the palette
	$("#content div.product-swatches div.swatch-image").mouseout(function(e) {
		// fix for event bubbling (http://www.quirksmode.org/js/events_mouse.html)
		if(!e) var e = window.event;
		var tg = (window.event) ? e.srcElement : e.target;
		if(tg.nodeName != 'DIV') return;
		var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
		while(reltg != tg && reltg.nodeName != 'BODY')
			reltg = reltg.parentNode
		if (reltg == tg) return;

		// mouseout took place when mouse actually left layer
		// handle event now
		$(this).hide();
		return false;
	});

    $(".swatch-list.swatch-toggle").mouseleave(function() {
    	$(".swatch-list.swatch-toggle").hide();
    });

	jQuery("#content .producttile div.swatches div.invisible").hide();
	jQuery("#content .producttile div.swatches a.swatch img.hiddenthumbnail").hide();

	$("#content.product-swatches .product-swatches-all.loaded").click(function() {
		var swatch = jQuery(this);
		updateProductListing(this.href);
		// omit following the swatch link
		return false;
	});

    $('body').mouseleave(function() {
    	if($(window).width() > 960) {
    		$(".swatch-list.swatch-toggle").hide();
    	}
    });
    $('body').bind('blur',function(){
    	$(".swatch-list.swatch-toggle").hide();

    });

    // handle events for updating grid
    $main.on('click', '.refinement a, .sorthitscontainer .pagination a, .breadcrumb-refinement-value a, .mobile-sort-by-content a', function (e) {
        // don't intercept for category and folder refinements, as well as unselectable
        if ($(this).parents('.category-refinement').length > 0 || $(this).parents('.folder-refinement').length > 0 || $(this).parent().hasClass('unselectable')) {
            return;
        }
        e.preventDefault();
        var query = util.getQueryString(this.href);
        window.location.hash = query;
        if (this.href === window.location.href) {
            return;
        }
        updateProductListing(this.href);
    });

    $('.productlisting.sub-cat').each(function() {
  	  $(this).find('.product.producttile.cell').first().addClass( "subfirst");
  	});

    // handle events item click. append params.
    $main.on('click', '.product-tile a:not("#quickviewbutton")', function () {
        var a = $(this);
        // get current page refinement values
        var wl = window.location;

        var qsParams = (wl.search.length > 1) ? util.getQueryStringParams(wl.search.substr(1)) : {};
        var hashParams = (wl.hash.length > 1) ? util.getQueryStringParams(wl.hash.substr(1)) : {};

        // merge hash params with querystring params
        var params = $.extend(hashParams, qsParams);
        if (!params.start) {
            params.start = 0;
        }
        // get the index of the selected item and save as start parameter
        var tile = a.closest('.product-tile');
        var idx = tile.data('idx') ? +tile.data('idx') : 0;

        /*Start JIRA PREV-50 : Next and Previous links will not be displayed on PDP if user navigate from Quick View.Added cgid to hash*/
        if (!params.cgid && tile.data('cgid') !== null && tile.data('cgid') !== '') {
            params.cgid = tile.data('cgid');
        }
        /*End JIRA PREV-50*/

        // convert params.start to integer and add index
        params.start = (+params.start) + (idx + 1);
        // set the hash and allow normal action to continue
        a[0].hash = $.param(params);
    });

    // handle sorting change
    $main.on('change', '.sort-by select', function (e) {
		var selectedOption = $( ".sort-by option:selected" ).val().split('?')[1].split('&');
		var url = $(this).val();
		var	selectedOptionval = "";
		$.each(selectedOption, function(i, v){
			if(v.indexOf('srule') != -1){
				selectedOptionval = v.split('=')[1];
			}
		});

		if(selectedOptionval.length != 0){
			var dateObj = new Date();
			dateObj.setTime(dateObj.getTime() + (60*60*1000));
			document.cookie="selectedOption="+selectedOptionval+"; expires="+dateObj.toUTCString()+"; path=/";
			var sortRule = url.split('?')[1].split('&');
			var sortType = "";

			$.each(sortRule, function(i, v){
				if(v.indexOf('srule') != -1){
					sortType = v.split('=')[1];
				}
			});
		}
       e.preventDefault();
       var query = util.getQueryString($(this).find('option:selected').val());
       window.location.hash = query;
       if ($(this).find('option:selected').val() === window.location.href) {
           return;
       }
       updateProductListing($(this).find('option:selected').val());
    }).on('change', '.items-per-page select', function () {
        var refineUrl = $(this).find('option:selected').val();
        if (refineUrl === 'INFINITE_SCROLL') {
            $('html').addClass('infinite-scroll').removeClass('disable-infinite-scroll');
        } else {
            $('html').addClass('disable-infinite-scroll').removeClass('infinite-scroll');
            var query = util.getQueryString(refineUrl);
            window.location.hash = query;
            if (refineUrl === window.location.href) {
                return;
            }
            updateProductListing(refineUrl);
        }
    });
}

exports.init = function () {
    compareWidget.init();
    if (SitePreferences.LISTING_INFINITE_SCROLL) {
        $(window).on('scroll', infiniteScroll);
    }
    productTile.init();
    initializeEvents();
};

},{"../compare-widget":7,"../product-tile":38,"../progress":39,"../uievents":47,"../util":48,"imagesloaded":50}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
'use strict';
var dialog = require('../dialog'),
	util = require('../util'),
	validator = require('../validator');

exports.init = function () {
    $('.store-details-link').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            url: $(e.target).attr('href')
        });
    });
    storeLocator.init();
};
$('.customersubmit').on('click', function(){
	if($('.floatleft.state.custom-select select').valid() == 0) {
 		if(!$('.floatleft.state.custom-select').hasClass('blured')){
 			$('.floatleft.state.custom-select').addClass('customselect-error');
 		}
	}else{
		$('.floatleft.state.custom-select').removeClass('customselect-error');
	}
});
var storeLocator = {
		init: function () {
			validator.init();
			$(".googlemap").on('click',function() {
				window.open(this.name);
			});
			$('body').find("form.locatorForm").submit(function (e) {
				e.preventDefault();
				var $form = jQuery(this);
				if( $('#locatorForm button').prop('disabled')) {
					return false;
				}
		    	$('#noresultserror').hide();
		    	$('#message.success').hide();
		    	$('#results').hide();
		    	$('#locatorForm button').prop('disabled', true);
		    	var param = {countryCode: 'US',
					     distanceUnit: 'mi',
					     postalCode: $('.postalCheck').val(),
					     maxdistance: $('.mxdistanceCheck').val(),
					     rapala: $('.rapalaCheck').prop("checked"),
					     vmc: $('.vmcCheck').prop("checked"),
					     storm: $('.stormCheck').prop("checked"),
					     luhrjensen: $('.luhrCheck').prop("checked"),
					     bluefox: $('.bluefoxCheck').prop("checked"),
					     terminator: $('.terminatorCheck').prop("checked"),
					     williamson: $('.williamCheck').prop("checked"),
					     triggerx: $('.triggerCheck').prop("checked"),
					     sufix: $('.sufixCheck').prop("checked"),
					     marcum: $('.marcumCheck').prop("checked"),
					     strikemaster: $('.strikeCheck').prop("checked"),
					     },
				serviceParam = {countryCode: 'US',
					      distanceUnit: 'mi',
					      postalCode: $('.postalCheck').val(),
					      maxdistance: $('.mxdistanceCheck').val()
					     }
		    	var url = util.appendParamsToUrl(Urls.storeJson,param),
		    		serviceUrl = util.appendParamsToUrl(Urls.serviceStoreJson,serviceParam);
		    	if($('.store-Locator-page').length > 0 ) {
		    		$.ajax({
				    	  type: 'POST',
			    		  url: url,
			    		  data: $form.serialize(),
			    		  success: function (data) {
			    			 // alert(data);
						    	 $('#locatorForm button').removeProp('disabled');
								    if(data.storeCount > 0) {
								    	$('#storeCount').html(data.storeCount);
								    	$('#message.success').show();
								    	var store = {};
								    	var html = [];
								    	var allStoreHtml = "";
								    	for(var i = 0; i < data.stores.length; i++) {
									    	store = data.stores[i];
									    	html = [];
									    	html.push('<div class="storeresult"><div class="storeinformation">');
											html.push('<h2 class="input-style">'+store.name+'</h2>');
							                html.push('<div>'+store.address1+'<br/>');
							                html.push(store.city);
							                if(store.city != "" && store.state != "") {
												html.push(',');
							                }
							                html.push(store.state + " " + store.postalCode + "<br />");
							                if(store.phone != "") {
												html.push('<div class="storephone">'+store.phone+'</div>');
							                }
							                if(store.storeHours != "") {
												html.push('<div class="storeHours">'+store.storeHours+'</div>');
							                }
							                if(store.storeEvents != "") {
												html.push('<div class="storeEvents">'+store.storeEvents+'</div>');
							                }
							                html.push('</div></div><div class="storebrands">');
							                html.push('<span class="brandlabel">'+ Resources.BRAND_CATEGORY1 +'</span><hr></hr>');
							                if(store.custom.brands.rapala) {
												html.push('<img alt='+ Resources.STORELOCATER_RAPALA +' class="logo medium" src='+ Urls.rapalalogo +'></img>');
							                }
							                if(store.custom.brands.vmc) {
							                	html.push('<img alt='+ Resources.STORELOCATER_VMC +' class="logo medium" src='+ Urls.vmclogo +'></img>');
							                }
							                if(store.custom.brands.sufix) {
							                	html.push('<img alt='+ Resources.STORELOCATER_SUFIX +' class="logo medium" src='+ Urls.sufixlogo +'></img>');
							                }
							                if(store.custom.brands.storm) {
							                    html.push('<img alt='+ Resources.STORELOCATER_STORM +' class="logo medium" src='+ Urls.stormlogo +'></img>');
							                }
							                if(store.custom.brands.triggerx) {
							                	html.push('<img alt='+ Resources.STORELOCATER_TRIGGERX +' class="logo medium" src='+ Urls.triggerxlogo +'></img>');
								    		}
							    			if(store.custom.brands.luhrjensen) {
							    				html.push('<img alt='+ Resources.STORELOCATER_LUHRJONSON +' class="logo medium" src='+ Urls.luhrjonsonlogo +'></img>');
											}
											if(store.custom.brands.terminator) {
												html.push('<img alt='+ Resources.STORELOCATER_TERMINATOR +' class="logo medium" src='+ Urls.terminatorlogo +'></img>');
											}
											if(store.custom.brands.bluefox) {
												html.push('<img alt='+ Resources.STORELOCATER_BLUEFOX +' class="logo medium" src='+ Urls.bluefoxlogo +'></img>');
											}
											if(store.custom.brands.williamson) {
												html.push('<img alt='+ Resources.STORELOCATER_WILLIAMSON +' class="logo medium" src='+ Urls.williamsonlogo +'></img>');
											}
											if(store.custom.brands.marcum) {
												html.push('<img alt='+ Resources.STORELOCATER_MARCUM +' class="logo medium" src='+ Urls.marcumlogo +'></img>');
											}
											if(store.custom.brands.strikemaster) {
												html.push('<img alt='+ Resources.STORELOCATER_STRIKEMASTER +' class="logo medium" src='+ Urls.strikemasterlogo +'></img>');
											}
											/* if(store.custom.brands.otter) {
												html.push('<img alt="${Resource.msg('storelocator.otter','forms',null)}" class="logo medium" src="${URLUtils.staticURL('/images/logo-otter.jpg')}"></img>');
											} */
											html.push('</div>');
							                html.push('<div class="storemap"><a class="button googlemap" name="'+store.map+'">'+ Resources.STORELOCATER_MAP +'</a>');
							                if(store.website != "") {
												html.push('<br /><a target="_blank" class="button" href="'+store.website+'">'+ Resources.STORELOCATER_WEBSITE +'</a>');

							                }
							                html.push('</div><div class="clear"><!-- FLOAT CLEAR --></div></div>');
							                allStoreHtml += html.join('');
								    	}
								    	$('div.storelocatorsearchresults').html(allStoreHtml);
								    	$('#results').show();
								    } else {
								    	$('#message.success').hide();
								    	$('#results').hide();
								    	$('#noresultserror').show();
								    }
						            if (data.Status === 400) {
						            	jQuery('.email-form #message')
						            	.removeClass('success-email')
						            	.addClass('error-alert')
						            	.html(data.Message)
						            	.show();
						            } else { // 200
						            	$('.email-form #message').removeClass('error-alert').addClass('success-email').html("You have successfully subscribed to the Rapala Email Newsletter.").show();
						            	$('.email-form input, .email-form select').val('');
						            }
						            $(".googlemap").on('click',function() {
										window.open(this.name);
									});
					        	}
			    		});
		    	}
		    	else if($('.service-locator-form').length > 0 ) {
		    		$.ajax({
				    	  type: 'POST',
			    		  url: serviceUrl,
			    		  data: $form.serialize(),
			    		  success: function (data) {
			    			 // alert(data);
						    	 $('#locatorForm button').removeProp('disabled');
								    if(data.storeCount > 0) {
								    	$('#storeCount').html(data.storeCount);
								    	$('#message.success').show();
								    	var store = {};
								    	var html = [];
								    	var allStoreHtml = "";
								    	for(var i = 0; i < data.stores.length; i++) {
									    	store = data.stores[i];
									    	html = [];
									    	html.push('<div class="storeresult"><div class="storeinformation">');
											html.push('<h2 class="input-style">'+store.name+'</h2>');
							                html.push('<div>'+store.address1+'<br/>');
							                html.push(store.city);
							                if(store.city != "" && store.state != "") {
												html.push(',');
							                }
							                html.push(store.state + " " + store.postalCode + "<br />");
							                if(store.phone != "") {
												html.push('<div class="storephone">'+store.phone+'</div>');
							                }
							                if(store.storeHours != "") {
												html.push('<div class="storeHours">'+store.storeHours+'</div>');
							                }
							                if(store.storeEvents != "") {
												html.push('<div class="storeEvents">'+store.storeEvents+'</div>');
							                }
											html.push('</div></div>');
							                html.push('<div class="storemap"><div class="storedistance">'+store.distance+'</div><a class="button googlemap" name="'+store.map+'">'+ Resources.STORELOCATER_MAP +'</a>');
							                if(store.website != "") {
												html.push('<br /><a target="_blank" class="button" href="'+store.website+'">'+ Resources.STORELOCATER_WEBSITE +'</a>');

							                }
							                html.push('</div><div class="clear"><!-- FLOAT CLEAR --></div></div>');
							                allStoreHtml += html.join('');
								    	}
								    	$('div.storelocatorsearchresults').html(allStoreHtml);
								    	$('#results').show();
								    } else {
								    	$('#message.success').hide();
								    	$('#results').hide();
								    	$('#noresultserror').show();
								    }
						            $(".googlemap").on('click',function() {
										window.open(this.name);
									});
					        	}
			    		});
		    		}
			});
			//$('#locatorForm').data('validator','').validate(storelocatorFormSettings);
		}
	};
	module.exports = storeLocator;
},{"../dialog":10,"../util":48,"../validator":49}],37:[function(require,module,exports){
'use strict';

var addProductToCart = require('./product/addToCart'),
    page = require('../page'),
    account = require('./account'),
    util = require('../util');

exports.init = function() {
   // addProductToCart();
    //Start JIRA PREV-412 : SG Issue: Password reset overlay displayed as a page
    account.initCartLogin();
    $('#editAddress').on('change', function () {
        page.redirect(util.appendParamToURL(Urls.wishlistAddress, 'AddressID', $(this).val()));
    });

    //add js logic to remove the , from the qty feild to pass regex expression on client side
    $('.option-quantity-desired input').on('focusout', function () {
        $(this).val($(this).val().replace(',', ''));
    });
};

},{"../page":18,"../util":48,"./account":19,"./product/addToCart":29}],38:[function(require,module,exports){
'use strict';

var imagesLoaded = require('imagesloaded'),
	util = require('./util'),
    quickview = require('./quickview');

function initQuickViewButtons() {
	    $('.product-tile .product-image').on('mouseenter', function () {
	        var $qvButton = $('#quickviewbutton');
	        if ($qvButton.length === 0) {
	            $qvButton = $('<a id="quickviewbutton" class="quickview">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
	        }
	        var $link = $(this).find('.thumb-link');
	        $qvButton.attr({
	            'href': $link.attr('href'),
	            'title': $link.attr('title')
	        }).appendTo(this);
	        $qvButton.off('click').on('click', function (e) {
		        e.preventDefault();
		        quickview.show({
		            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
		            source: 'quickview'
		        });
		    });
	    });
	}


function gridViewToggle() {
	var CookieImageValue=util.readCookie("ImageSize");
	//This is used to persist the ImageSizes overall site.
	if(CookieImageValue!=null){
		if(CookieImageValue=="listview"){
			jQuery('.search-result-content').addClass('wide-tiles');
			jQuery('.product-image').addClass('grid');
			$('.toggle-grid i').removeClass('active');
			$('.toggle-grid .listview').addClass('active');
            $('.search-result-content.wide-tiles .product-tile .product-image img').each(function() {
            	this.src = this.src.replace("sw=130&sh=92", "sw=352&sh=251");
            });
			$('.product-img').each(function(){
				$(this).find('img').remove();
				$(this).append('<img src="'+ $(this).attr('data-large-src')  +'" title="'+ $(this).attr('data-title')+'" alt="'+ $(this).attr('data-alt')+'"></img>')

			});

		}else{
			jQuery('.search-result-content').removeClass('wide-tiles');
			jQuery('.product-image').removeClass('grid');
			$('.toggle-grid i').removeClass('active');
			$('.toggle-grid .gridview').addClass('active');
			$('.search-result-content.wide-tiles .product-tile .product-image img').each(function() {
            	this.src = this.src.replace("sw=130&sh=92", "sw=130&sh=92");
            });
			$('.product-img').each(function(){
				$(this).find('img').remove();
				$(this).append('<img src="'+ $(this).attr('data-small-src')  +'" title="'+ $(this).attr('data-title')+'" alt="'+ $(this).attr('data-alt')+'"></img>')
			});
		}

		if($('.listview.active').length == 1){
			$('.pt_product-search-result').attr('data-viewType','listview');
		}else{
			$('.pt_product-search-result').attr('data-viewType','gridview');
		}
	}

	     $('.toggle-grid i').on('click', function () {
		     var dateObj = new Date();
		     dateObj.setTime(dateObj.getTime() + (60*60*1000));
	         if ($(this).hasClass('gridview')) {
	        	 document.cookie="ImageSize="+"gridview"+"; expires="+dateObj.toUTCString()+"; path=/";
	             $('.toggle-grid i').parent('.toggle-grid').removeClass('wide');
	             $('.toggle-grid i').removeClass('active');
	             $(this).parent('.toggle-grid').removeClass('wide');
	             $(this).addClass('active');
	             $('.search-result-content').removeClass('wide-tiles');
				$('.product-img').each(function(){
					$(this).find('img').remove();
					$(this).append('<img src="'+ $(this).attr('data-large-src')  +'" title="'+ $(this).attr('data-title')+'" alt="'+ $(this).attr('data-alt')+'"></img>')
				});
	         }
	         else if($(this).hasClass('listview')) {
	        	 document.cookie="ImageSize="+"listview"+"; expires="+dateObj.toUTCString()+"; path=/";
	             $('.toggle-grid i').parent('.toggle-grid').removeClass('wide');
	             $('.toggle-grid i').removeClass('active');
	             $(this).parent('.toggle-grid').addClass('wide');
	             $(this).addClass('active');
	             $('.search-result-content').addClass('wide-tiles');
	             $('.search-result-content.wide-tiles .product-tile .product-image img').each(function() {
	            	this.src = this.src.replace("sw=130&sh=92", "sw=352&sh=251");
	            });
	             $('.product-img').each(function(){
					$(this).find('img').remove();
					$(this).append('<img src="'+ $(this).attr('data-small-src')  +'" title="'+ $(this).attr('data-title')+'" alt="'+ $(this).attr('data-alt')+'"></img>')
				});
	         }
			var currObj = $(this);
			jQuery('.toggle-grid .fa').removeClass('active');
			$(currObj).addClass('active');
			if($('.large.active').length == 1){
				$('.pt_product-search-result').attr('data-viewType','listview');
			}else{
				$('.pt_product-search-result').attr('data-viewType','gridview');
			}
	    });

}

/**
 * @private
 * @function
 * @description Initializes events on the product-tile for the following elements:
 * - swatches
 * - thumbnails
 */
function initializeEvents() {
    initQuickViewButtons();
    gridViewToggle();
    $('.swatch-list').on('mouseleave', function () {
        // Restore current thumb image
        var $tile = $(this).closest('.product-tile'),
            $thumb = $tile.find('.product-image .thumb-link img').eq(0),
            data = $thumb.data('current');
        $thumb.attr({
            src: data.src,
            alt: data.alt,
            title: data.title
        });
        $('.search-result-content.wide-tiles .product-tile .product-image a.thumb-link.currentimg img').each(function() {
        	this.src = this.src.replace("sw=130&sh=92", "sw=352&sh=251");
        });
    });
    $('.swatch-list .swatch').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('selected')) {
            return;
        }

        var $tile = $(this).closest('.product-tile');
        $(this).closest('.swatch-list').find('.swatch.selected').removeClass('selected');
        $(this).addClass('selected');
        $tile.find('.thumb-link').attr('href', $(this).attr('href'));
        $tile.find('name-link').attr('href', $(this).attr('href'));

        var data = $(this).children('img').filter(':first').data('thumb');
        var $thumb = $tile.find('.product-image .thumb-link img').eq(0);
        var currentAttrs = {
            src: data.src,
            alt: data.alt,
            title: data.title
        };
        $thumb.closest('.thumb-link').addClass('currentimg');
        $thumb.attr(currentAttrs);
        $thumb.data('current', currentAttrs);

        /*Start JIRA PREV-466 : Product images are not updating in the compare section when the color swatches are changed in PLP.*/
        var pid = $(this).closest('.product-tile').attr('data-itemid');
        $('.compare-items-panel .compare-item').each(function () {
            var compareid = $(this).attr('data-itemid');
            if (pid === compareid) {
                var $compare = $(this).find('.compare-item-image').eq(0);
                $compare.attr(currentAttrs);
                $compare.data('current', currentAttrs);
            }
        });
        /*End JIRA PREV-466*/
    }).bind('mouseenter click', function () {
        // get current thumb details
        var $tile = $(this).closest('.product-tile'),
            $thumb = $tile.find('.product-image .thumb-link img').eq(0),
            data = $(this).children('img').filter(':first').data('thumb'),
            current = $thumb.data('current');

        // If this is the first time, then record the current img
        if (!current) {
            $thumb.data('current', {
                src: $thumb[0].src,
                alt: $thumb[0].alt,
                title: $thumb[0].title
            });
        }

        // Set the tile image to the values provided on the swatch data attributes
        $thumb.attr({
            src: data.src,
            alt: data.alt,
            title: data.title
        });
        $('.search-result-content.wide-tiles .product-tile .product-image a.thumb-link.currentimg img').each(function() {
        	this.src = this.src.replace("sw=130&sh=92", "sw=352&sh=251");
        });

    });
}

exports.init = function() {
    var $tiles = $('.tiles-container .product-tile');
    if ($tiles.length === 0) {
        return;
    }
    imagesLoaded('.tiles-container').on('done', function () {
        $tiles.syncHeight()
            .each(function (idx) {
                $(this).data('idx', idx);
            });
    });
    initializeEvents();
};


},{"./quickview":40,"./util":48,"imagesloaded":50}],39:[function(require,module,exports){
'use strict';

var $loader;

/**
 * @function
 * @description Shows an AJAX-loader on top of a given container
 * @param {Element} container The Element on top of which the AJAX-Loader will be shown
 */
var show = function (container) {
    var target = (!container || $(container).length === 0) ? $('body') : $(container);
    $loader = $loader || $('.loader');

    if ($loader.length === 0) {
        $loader = $('<div/>').addClass('loader')
            .append($('<div/>').addClass('loader-indicator'), $('<div/>').addClass('loader-bg'));
    }
    return $loader.appendTo(target).show();
};
/**
 * @function
 * @description Hides an AJAX-loader
 */
var hide = function () {
    if ($loader) {
        $loader.hide();
    }
};

exports.show = show;
exports.hide = hide;
},{}],40:[function(require,module,exports){
'use strict';

var dialog = require('./dialog'),
    product = require('./pages/product'),
    progress = require('./progress'),
    util = require('./util'),
    _ = require('lodash');


var makeUrl = function (url, source, productListID) {
    if (source) {
        url = util.appendParamToURL(url, 'source', source);
    }
    if (productListID) {
        url = util.appendParamToURL(url, 'productlistid', productListID);
    }
    return url;
};

var removeParam = function (url) {
    if (url.indexOf('?') !== -1) {
        return url.substring(0, url.indexOf('?'));
    } else {
        return url;
    }
};

var quickview = {
    init: function () {
        if (!this.exists()) {
            this.$container = $('<div/>').attr('id', 'QuickViewDialog').appendTo(document.body);
        }
        this.productLinks = $('#search-result-items .thumb-link').map(function (index, thumbLink) {
            return $(thumbLink).attr('href');
        });
    },

    setup: function (qvUrl) {
        var $btnNext = $('.quickview-next'),
            $btnPrev = $('.quickview-prev');

        product.init();

        this.productLinkIndex = _(this.productLinks).findIndex(function (url) {
            return removeParam(url) === removeParam(qvUrl);
        });

        // hide the buttons on the compare page or when there are no other products
        if (this.productLinks.length <= 1 || $('.compareremovecell').length > 0) {
            $btnNext.hide();
            $btnPrev.hide();
            return;
        } else {
            /*  Start JIRA PREV-50: Next and Previous links will not be displayed on PDP if user navigate from Quick View.
              Added current URL parameters and index to viewfulldetails link
            */
            var a = $('#view-full-details');
            var wl = window.location;
            var qsParams = (wl.search.length > 1) ? util.getQueryStringParams(wl.search.substr(1)) : {};
            var hashParams = (wl.hash.length > 1) ? util.getQueryStringParams(wl.hash.substr(1)) : {};
            var params = $.extend(hashParams, qsParams);
            params.start = parseInt(this.productLinkIndex, 10) + 1;
            var tile = $('#search-result-items .product-tile').first();
            if (!params.cgid && tile.data('cgid') !== null && tile.data('cgid') !== '') {
                params.cgid = tile.data('cgid');
            }
            a.attr('href', a.attr('href') + '#' + $.param(params));
            /*End JIRA PREV-50*/
        }

        if (this.productLinkIndex === this.productLinks.length - 1) {
            $btnNext.attr('disabled', 'disabled');
        }
        if (this.productLinkIndex === 0) {
            $btnPrev.attr('disabled', 'disabled');
        }

        $btnNext.on('click', function (e) {
            e.preventDefault();
            this.navigateQuickview(1);
        }.bind(this));
        $btnPrev.on('click', function (e) {
            e.preventDefault();
            this.navigateQuickview(-1);
        }.bind(this));
    },

    /**
     * @param {Number} step - How many products away from current product to navigate to. Negative number means navigate backward
     */
    navigateQuickview: function (step) {
        // default step to 0
        this.productLinkIndex += (step ? step : 0);
        var url = makeUrl(this.productLinks[this.productLinkIndex], 'quickview');
        dialog.replace({
            url: url,
            callback: this.setup.bind(this, url)
        });
    },

    /**
     * @description show quick view dialog
     * @param {Object} options
     * @param {String} options.url - url of the product details
     * @param {String} options.source - source of the dialog to be appended to URL
     * @param {String} options.productlistid - to be appended to URL
     * @param {Function} options.callback - callback once the dialog is opened
     */
    show: function (options) {
        var url;
        if (!this.exists()) {
            this.init();
        }
        url = makeUrl(options.url, options.source, options.productlistid);
        $("#QuickViewDialog").empty();
        var quickViewDialog = dialog.create({
            target: this.$container,
            options: {
                height: 530,
                width: 760,
                dialogClass: 'quickview',
                title: Resources.QUICK_VIEW_POPUP
            }
        });
        quickViewDialog.dialog("open");
        progress.show("#QuickViewDialog");
    	$.ajax({
    		url: url,
    		success: function(data){
    			$(quickViewDialog).append(data);
    			product.init();
    			progress.hide();
    		}
    	})
        //PREVAIL-Added for GA integration
        //GAcommented
        if (isEventTrackingEnabled && isGoogleAnalyticsEnabled) {
            googleAnalyticsEvents.quickView();
        }
    },
    exists: function () {
        return this.$container && (this.$container.length > 0);
    },
    close : function () {
        jQuery('#QuickViewDialog').dialog('close');
    }
};

module.exports = quickview;

},{"./dialog":10,"./pages/product":30,"./progress":39,"./util":48,"lodash":53}],41:[function(require,module,exports){
'use strict';

/**
 * @private
 * @function
 * @description Binds event to the place holder (.blur)
 */
function initializeEvents() {
    /* Start JIRA PREV-53:No search result page: When the search text field is
      empty,on clicking of "GO" button user is navigating to Home page.
      Replaced #q with 'input[name=q]'*/
    $('input[name=q]').focus(function () {
        var input = $(this);
        if (input.val() === input.attr('value')) {
            input.val('');
        }
    })
    .blur(function () {
        var input = $(this);
        /* Start JIRA PREV-53:No search result page: When the search text field is empty,on clicking of "GO"
             button user is navigating to Home page.Added $.trim(input.val()) === ""*/
        if ($.trim(input.val()) === '' || input.val() === '' || input.val() === input.attr('value')) {
            input.val(input.attr('value'));
        }
    })
    .blur();

    /* Start JIRA-PREV-54:General Error page: When the new search field empty, on clicking of "GO" user is navigating to Home page.
         Added condition for disabling search button in header and No search results page and error pages.
         Start JIRA-PREV-53:No search result page: When the search text field is empty,on clicking of "GO" button user is navigating to Home page.*/
    $('input[name=q]').closest('form').submit(function (e) {
        var input = $(this).find('input[name=q]');
        if ($.trim(input.val()) === input.attr('value') || $.trim(input.val()) === '') {
            e.preventDefault();
            return false;
        }
    });

    if($('.pt_product-search-noresult .nohits .noresult-banner').length > 0) {
    	$('.pt_product-search-noresult .nohits').css("height", "auto");
    }
    /*End JIRA PREV-53,PREV-54 */
}

exports.init = initializeEvents;

},{}],42:[function(require,module,exports){
'use strict';

var util = require('./util');

var currentQuery = null,
    lastQuery = null,
    runningQuery = null,
    listTotal = -1,
    listCurrent = -1,
    delay = 30,
    $resultsContainer;
/**
 * @function
 * @description Handles keyboard's arrow keys
 * @param keyCode Code of an arrow key to be handled
 */
function handleArrowKeys(keyCode) {
    switch (keyCode) {
        case 38:
            // keyUp
            listCurrent = (listCurrent <= 0) ? (listTotal - 1) : (listCurrent - 1);
            break;
        case 40:
            // keyDown
            listCurrent = (listCurrent >= listTotal - 1) ? 0 : listCurrent + 1;
            break;
        default:
            // reset
            listCurrent = -1;
            return false;
    }

    $resultsContainer.children().removeClass('selected').eq(listCurrent).addClass('selected');
    $('input[name="q"]').val($resultsContainer.find('.selected .suggestionterm').first().text());
    return true;
}

var searchsuggest = {
    /**
     * @function
     * @description Configures parameters and required object instances
     */
    init: function (container, defaultValue) {
        var $searchContainer = $(container);
        var $searchForm = $searchContainer.find('form[name="simpleSearch"]');
        var $searchField = $searchForm.find('input[name="q"]');

        // disable browser auto complete
        $searchField.attr('autocomplete', 'off');

        // on focus listener (clear default value)
        $searchField.focus(function () {
            if (!$resultsContainer) {
                // create results container if needed
                //$resultsContainer = $('<div/>').attr('id', 'search-suggestions').appendTo($searchContainer);
                $resultsContainer = $('<div/>').attr('class', 'suggestions').attr('id','suggestions').appendTo($searchContainer);
            }
            if ($searchField.val() === defaultValue) {
                $searchField.val('');
            }
        });
        $searchField.blur(function() {
        	var temp = $searchField.val();
        		if ($.trim(temp) == "") {
                	$searchField.val("Search Entire Site...");
                }

        });
        $(document).on('click', function (e) {
            if (!$searchContainer.is(e.target)) {
                setTimeout(this.clearResults, 200);
            }
        }.bind(this));
     // on submit we do not submit the form, but change the window location
		// in order to avoid https to http warnings in the browser
		// only if it's not the default value and it's not empty
        $searchForm.submit(function() {
			var searchUrl = $searchForm.attr("action");
			var sessionId=jQuery("#footerhiddenid").text();
			if(sessionId == "rapala")
			{
				var k=searchUrl+'?id=1';
			}
			else if(sessionId == "sufix")
			{
				var k=searchUrl+'?id=2';
			}
			else if(sessionId == "triggerx")
			{
				var k=searchUrl+'?id=3';
			}
			else if(sessionId == "storm")
			{
				var k=searchUrl+'?id=4';
			}
			else if(sessionId == "luhrjensen")
			{
				var k=searchUrl+'?id=5';
			}
			else if(sessionId == "vmc")
			{
				var k=searchUrl+'?id=6';
			}
			else if(sessionId == "terminator")
			{
				var k=searchUrl+'?id=7';
			}
			else if(sessionId == "bluefox")
			{
				var k=searchUrl+'?id=8';
			}
			else if(sessionId == "williamson")
			{
				var k=searchUrl+'?id=9';
			}
			else if(sessionId == "marcum")
			{
				var k=searchUrl+'?id=10';
			}
			else if(sessionId == "strikemaster")
			{
				var k=searchUrl+'?id=11';
			}
			else if(sessionId == "otter")
			{
				var k=searchUrl+'?id=21';
			}
			var searchTerm = $searchField.val();
			if (searchTerm != defaultValue && searchTerm != '') {
				window.location = util.appendParamToURL(k, "q", searchTerm).replace("https", "http");
			}
			return false;
		});
        // on key up listener
        $searchField.keyup(function (e) {

            // get keyCode (window.event is for IE)
            var keyCode = e.keyCode || window.event.keyCode;

            // check and treat up and down arrows
            if (handleArrowKeys(keyCode)) {
                return;
            }
            // check for an ENTER or ESC
            if (keyCode === 13 || keyCode === 27) {
                this.clearResults();
                return;
            }

            currentQuery = $searchField.val().trim();

            // no query currently running, init an update
            if (!runningQuery) {
                runningQuery = currentQuery;
                setTimeout(this.suggest.bind(this), delay);
            }
        }.bind(this));
    },

    /**
     * @function
     * @description trigger suggest action
     */
    suggest: function () {
        // check whether query to execute (runningQuery) is still up to date and had not changed in the meanwhile
        // (we had a little delay)
        if (runningQuery !== currentQuery) {
            // update running query to the most recent search phrase
            runningQuery = currentQuery;
        }

        // if it's empty clear the results box and return
        if (runningQuery.length === 0) {
            this.clearResults();
            runningQuery = null;
            return;
        }

        // if the current search phrase is the same as for the last suggestion call, just return
        if (lastQuery === runningQuery) {
            runningQuery = null;
            return;
        }

        // build the request url
        var reqUrl = util.appendParamToURL(Urls.searchsuggest, 'q', runningQuery);

        // execute server call
        $.get(reqUrl, function (data) {
            var suggestionHTML = data,
                ansLength = suggestionHTML.trim().length;

            // if there are results populate the results div
            if (ansLength === 0) {
                this.clearResults();
            } else {
                // update the results div
                $resultsContainer.html(suggestionHTML).fadeIn(200);
            }

            // record the query that has been executed
            lastQuery = runningQuery;
            // reset currently running query
            runningQuery = null;

            // check for another required update (if current search phrase is different from just executed call)
            if (currentQuery !== lastQuery) {
                // ... and execute immediately if search has changed while this server call was in transit
                runningQuery = currentQuery;
                setTimeout(this.suggest.bind(this), delay);
            }
            this.hideLeftPanel();
        }.bind(this));
    },
    /**
     * @function
     * @description
     */
    clearResults: function () {
        if (!$resultsContainer) { return; }
        $resultsContainer.fadeOut(200, function () {$resultsContainer.empty(); });
    },
    /**
     * @function
     * @description
     */
    hideLeftPanel: function () {
        //hide left panel if there is only a matching suggested custom phrase
        if ($('.search-suggestion-left-panel-hit').length === 1 && $('.search-phrase-suggestion a').text().replace(/(^[\s]+|[\s]+$)/g, '').toUpperCase() === $('.search-suggestion-left-panel-hit a').text().toUpperCase()) {
            $('.search-suggestion-left-panel').css('display', 'none');
            $('.search-suggestion-wrapper-full').addClass('search-suggestion-wrapper');
            $('.search-suggestion-wrapper').removeClass('search-suggestion-wrapper-full');
        }
    }
};

module.exports = searchsuggest;

},{"./util":48}],43:[function(require,module,exports){
'use strict';

var inventory = require('./');

var cartInventory = {
    setSelectedStore: function (storeId) {
        var $selectedStore = $('.store-tile.' + storeId),
            $lineItem = $('.cart-row[data-uuid="' + this.uuid + '"]'),
            storeAddress = $selectedStore.find('.store-address').html(),
            storeStatus = $selectedStore.find('.store-status').data('status'),
            storeStatusText = $selectedStore.find('.store-status').text();
        this.selectedStore = storeId;

        $lineItem.find('.instore-delivery .selected-store-address')
            .data('storeId', storeId)
            .attr('data-store-id', storeId)
            .html(storeAddress);
        $lineItem.find('.instore-delivery .selected-store-availability')
            .data('status', storeStatus)
            .attr('data-status', storeStatus)
            .text(storeStatusText);
        $lineItem.find('.instore-delivery .delivery-option').removeAttr('disabled').trigger('click');
    },
    cartSelectStore: function (selectedStore) {
        var self = this;
        inventory.getStoresInventory(this.uuid).then(function (stores) {
            inventory.selectStoreDialog({
                stores: stores,
                selectedStoreId: selectedStore,
                selectedStoreText: Resources.SELECTED_STORE,
                continueCallback: function () {},
                selectStoreCallback: self.setSelectedStore.bind(self)
            });
        }).done();
    },
    setDeliveryOption: function (value, storeId) {
        // set loading state
        $('.item-delivery-options')
            .addClass('loading')
            .children().hide();

        var data = {
            plid: this.uuid,
            storepickup: (value === 'store' ? true : false)
        };
        if (value === 'store') {
            data.storepickup = true;
            data.storeid = storeId;
        } else {
            data.storepickup = false;
        }
        $.ajax({
            url: Urls.setStorePickup,
            data: data,
            success: function () {
                // remove loading state
                $('.item-delivery-options')
                    .removeClass('loading')
                    .children().show();
            }
        });
    },
    init: function () {
        var self = this;
        $('.item-delivery-options .set-preferred-store').on('click', function (e) {
            e.preventDefault();
            self.uuid = $(this).data('uuid');
            var selectedStore = $(this).closest('.instore-delivery').find('.selected-store-address').data('storeId');
            if (!User.zip) {
                inventory.zipPrompt(function () {
                    self.cartSelectStore(selectedStore);
                });
            } else {
                self.cartSelectStore(selectedStore);
            }
        });
        $('.item-delivery-options .delivery-option').on('click', function () {
            // reset the uuid
            var selectedStore = $(this).closest('.instore-delivery').find('.selected-store-address').data('storeId');
            self.uuid = $(this).closest('.cart-row').data('uuid');
            self.setDeliveryOption($(this).val(), selectedStore);
        });
    }
};

module.exports = cartInventory;

},{"./":44}],44:[function(require,module,exports){
'use strict';

var _ = require('lodash'),
    dialog = require('../dialog'),
    TPromise = require('promise'),
    util = require('../util');

var newLine = '\n';
var storeTemplate = function (store, selectedStoreId, selectedStoreText) {
    return [
        '<li class="store-tile ' + store.storeId + (store.storeId === selectedStoreId ? ' selected' : '') + '">',
        '	<p class="store-address">',
        '		' + store.address1 + '<br/>',
        '		' + store.city + ', ' + store.stateCode + ' ' + store.postalCode,
        '	</p>',
        '	<p class="store-status" data-status="' + store.statusclass + '">' + store.status + '</p>',
        '	<button class="select-store-button" data-store-id="' + store.storeId + '"' +
        (store.statusclass !== 'store-in-stock' ? 'disabled="disabled"' : '') + '>',
        '		' + (store.storeId === selectedStoreId ? selectedStoreText : Resources.SELECT_STORE),
        '	</button>',
        '</li>'
    ].join(newLine);
};

var storeListTemplate = function (stores, selectedStoreId, selectedStoreText) {
    if (stores && stores.length) {
        return [
            '<div class="store-list-container">',
            '<ul class="store-list">',
            _.map(stores, function (store) {
                return storeTemplate(store, selectedStoreId, selectedStoreText);
            }).join(newLine),
            '</ul>',
            '</div>',
            '<div class="store-list-pagination">',
            '</div>'
        ].join(newLine);
    } else {
        return '<div class="no-results">' + Resources.INVALID_ZIP + '</div>';
    }
};

var zipPromptTemplate = function () {
    return [
        '<div id="preferred-store-panel">',
        '	<input type="text" id="user-zip" placeholder="' + Resources.ENTER_ZIP + '" name="zipCode"/>',
        '</div>'
    ].join(newLine);
};

/**
 * @description test whether zipcode is valid for either US or Canada
 * @return {Boolean} true if the zipcode is valid for either country, false if it's invalid for both
 **/
var validateZipCode = function (zipCode) {
    var regexes = {
            canada: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
            usa: /^\d{5}(-\d{4})?$/
        },
        valid = false;
    if (!zipCode) {
        return;
    }
    _.each(regexes, function (re) {
        var regexp = new RegExp(re);
        valid = regexp.test(zipCode);
    });
    return valid;
};

var storeinventory = {
    zipPrompt: function (callback) {
        var self = this;
        dialog.open({
            html: zipPromptTemplate(),
            options: {
                title: Resources.STORE_NEAR_YOU,
                width: 500,
                buttons: [{
                    text: Resources.SEARCH,
                    click: function () {
                        var zipCode = $('#user-zip').val();
                        if (validateZipCode(zipCode)) {
                            self.setUserZip(zipCode);
                            if (callback) {
                                callback(zipCode);
                            }
                        }
                    }
                }],
                open: function () {
                    $('#user-zip').on('keypress', function (e) {
                        if (e.which === 13) {
                            // trigger the search button
                            $('.ui-dialog-buttonset .ui-button').trigger('click');
                        }
                    });
                }
            }
        });
    },
    getStoresInventory: function (pid) {
        return TPromise.resolve($.ajax({
            url: util.appendParamsToUrl(Urls.storesInventory, {
                pid: pid,
                zipCode: User.zip
            }),
            dataType: 'json'
        }));
    },
    /**
     * @description open the dialog to select store
     * @param {Array} options.stores
     * @param {String} options.selectedStoreId
     * @param {String} options.selectedStoreText
     * @param {Function} options.continueCallback
     * @param {Function} options.selectStoreCallback
     **/
    selectStoreDialog: function (options) {
        var self = this,
            stores = options.stores,
            selectedStoreId = options.selectedStoreId,
            selectedStoreText = options.selectedStoreText,
            storeList = storeListTemplate(stores, selectedStoreId, selectedStoreText);
        dialog.open({
            html: storeList,
            options: {
                title: Resources.SELECT_STORE + ' - ' + User.zip,
                buttons: [{
                    text: Resources.CHANGE_LOCATION,
                    click: function () {
                        self.setUserZip(null);
                        // trigger the event to start the process all over again
                        $('.set-preferred-store').trigger('click');
                    }.bind(this)
                }, {
                    text: Resources.CONTINUE,
                    click: function () {
                        if (options.continueCallback) {
                            options.continueCallback(stores);
                        }
                        dialog.close();
                    }
                }],
                open: function () {
                    $('.select-store-button').on('click', function (e) {
                        e.preventDefault();
                        var storeId = $(this).data('storeId');
                        // if the store is already selected, don't select again
                        if (storeId === selectedStoreId) {
                            return;
                        }
                        $('.store-list .store-tile.selected').removeClass('selected')
                            .find('.select-store-button').text(Resources.SELECT_STORE);
                        $(this).text(selectedStoreText)
                            .closest('.store-tile').addClass('selected');
                        if (options.selectStoreCallback) {
                            options.selectStoreCallback(storeId);
                        }
                    });
                }
            }
        });
    },
    setUserZip: function (zip) {
        User.zip = zip;
        $.ajax({
            type: 'POST',
            url: Urls.setZipCode,
            data: {
                zipCode: zip
            }
        });
    },
    shippingLoad: function () {
        var $checkoutForm = $('.address');
        $checkoutForm.off('click');
        $checkoutForm.on('click', 'input[name$="_shippingAddress_isGift"]', function () {
            $(this).parent().siblings('.gift-message-text').toggleClass('hidden', $('input[name$="_shippingAddress_isGift"]:checked').val());
        });
    }
};

module.exports = storeinventory;

},{"../dialog":10,"../util":48,"lodash":53,"promise":54}],45:[function(require,module,exports){
'use strict';

/**
 * Checks the TLS and displays a warning if appropriate
 * @function getUserAgent Checks the TLS and displays a warning if appropriate
 **/
function getUserAgent() {

	var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };


}










/**
 * Export the getUserAgent function
 */

exports.getUserAgent = getUserAgent;

},{}],46:[function(require,module,exports){
'use strict';

/**
 * @function
 * @description Initializes the tooltip-content and layout
 */
var settings = {
	items: '.tooltip, .Custom-tooltip',
    delay: 0,
    track: false,
    showURL: false,
    extraClass: "tooltipshadow",
    top: 5,
    left: -150,
}
exports.init = function () {
    $(document).tooltip(
    	 $.extend({}, settings, {
    		 content: function () {
	            return $(this).find('.tooltip-content , .tooltip-body').html();
	        }
    }));
	/*$('.Custom-tooltip').tooltipster({
			content: jQuery(this).find('.tooltipcontainer').html(),
			contentAsHTML: true,
			maxWidth: 300,
			touchDevices: true,
			trigger: 'click'
	}); */
    $('.share-link').on('click', function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        if (!target) {
            return;
        }
        $(target).toggleClass('active');
    });

    /*JIRA PREV-282 : DEV-32: SG issue- 'What is this' link in checkout billing page should not be clickable. Added the folloiwng block.*/
    $('a.tooltip').click(function (e) {
        e.preventDefault();
    });
};

},{}],47:[function(require,module,exports){
'use strict';
var util = require('./util');
/*function charcount($this){
	var characterLimit = parseInt($this.data("character-limit"));
	var charRemains = characterLimit - $this.val().trim().length;
	var charCountHtml = 'Characters Remaining ' + charRemains
	if($this.hasClass("vip-textarea")){
		if ($this.next('div.char-count').length === 0) {
			charCountContainer = $('<div class="char-count"/>').insertAfter($this);
		}
		$this.next('div.char-count').html(charCountHtml);
	}else {
		if ($this.prev('div.char-count').length === 0) {
			charCountContainer = $('<div class="char-count"/>').insertBefore($this);
		}
		$this.prev('div.char-count').html(charCountHtml);
	}
}*/
var uievents= {
	customFields : function() {
			var $con = $('body');
		   $con.find('.custom-checkbox').each(function () {
			   if(jQuery(this).find('input[type="checkbox"]').is(':checked')) {
			        jQuery(this).find('.custom-link').addClass('active');
			   }
		   });

		   $con.find('.custom-checkbox .custom-link').off('click').on('click', function () {
		        var $customcheck = $(this).closest('.custom-checkbox');
		        $(this).removeClass('error');
		       if($customcheck.find('input[type="checkbox"]').is(':checked')) {
		            $customcheck.find('input[type="checkbox"]').click();
		            $customcheck.find('.custom-link').removeClass('active');
		        }
		        else {
		            $customcheck.find('input[type="checkbox"]').click();
		            $customcheck.find('.custom-link').addClass('active');
		            }
		   });
		   /*if($('body').hasClass('rapala_device')){
			   $con.find(".ui-dialog #dialogcontainer123 #VipinsiderForm .select-style .selectbox").off('click').on("click",function(){
				   $(this).closest(".field-wrapper").addClass('expanded');
	   			}).on("blur change", function(){
	   				$(this).closest(".field-wrapper").removeClass('expanded');
	   			});
		   }*/


	   		// custom select implementation in VIP insider
	   		/*if(!$('body').hasClass('rapala_device')){
	   			$con.find(".customized-select").find("select").each(function(){
	   				if($(this).attr('disabled')){
	   					$(this).selectbox('disable');
	   				}
					else{
						$(this).selectbox();
					}
	   				$('.sbOptions li:last').addClass('last');
	   			}).focus(function(){
	   				$(this).next('.sbHolder').trigger('focus');
	   			});

	   		}
		   */
	   		$con.find('.custom-checkbox input[type="checkbox"]').off('change').on('change', function () {
	   			$(this).closest('.custom-checkbox').find('.custom-link').removeClass('error');
	   			var $form = $('.address');
	   			if($(this).is(':checked')){
	   				$(this).closest('.custom-checkbox').find('.custom-link').addClass('active');
	   				if($(this).is("[name$=_sameasshippingaddress]")) {
		   				var selectedAddress = $(this).closest(".custom-checkbox").data("address")
		   				$(".selected-shipping-address").empty();
		   		        $(".selected-shipping-address").append(selectedAddress.firstName+" "+selectedAddress.lastName+"<br/>"+selectedAddress.address1+" "+selectedAddress.address2+"<br/>"+selectedAddress.city+" "+selectedAddress.stateCode+" "+selectedAddress.postalCode+"<br/>"+selectedAddress.phone);
		   		        util.fillAddressFields(selectedAddress, $form);
		   		        $(".edit-address-field").addClass("hide");
		   		        $(".selected-shipping-address, .new-address-field").removeClass("hide");
		   		        $(".shipping-address-field-section").addClass("hide");
		   		        uievents.customFields();
		   		        uievents.synccheckoutH();
	   				}

	   			}else{
	   				$(this).closest('.custom-checkbox').find('.custom-link').removeClass('active');
	   				if($(this).is("[name$=_sameasshippingaddress]")) {
	   					$(".addressoptions-addToAddressBook,.addressoptions-makedefault ").removeClass("hide");
	   					$("input[name$='shippingAddress_selectedaddress']").val("");
	   					$(".selected-shipping-address").empty()
	   					$("input[name$='_addressid']").val('');
	   					$("input[name$='_addressFields_firstName']").val("");
	   					$("input[name$='_addressFields_lastName']").val("");
	   					$("input[name$='_addressFields_address1']").val("");
	   					$("input[name$='_addressFields_address2']").val("");
	   					$("input[name$='_addressFields_city']").val("");
	   					$("input[name$='_addressFields_postal']").val("");
	   					$("input[name$='_addressFields_phone']").val("");
	   					uievents.changeFormSelection(jQuery("select[name$='_addressFields_states_state']")[0], "");
	   					uievents.changeFormSelection(jQuery("select.address-select")[0], "");
	   					$(".shipping-address-field-section").removeClass("hide");
	   					$(".selected-shipping-address, .new-address-field, .edit-address-field").addClass("hide");
	   					$("input[name$='_addressFields_phone']").closest("div.phone").find("span.errorclient").remove();
	   					$("input[name$='_addressFields_postal']").closest("div.zip").find("span.errorclient").remove();
	   					$(".addressform .form-row.custom-select").removeClass("customselect-error");
	   					$('.custom-select').each(function(){
	   						var select_val = $(this)	.find(":selected").text();
	   						$(this).find('.selectorOut').text(select_val);
	   					});
	   					$("a.clearbutton").hide();
	   					$('.shipping-address-field-section .form-row').find('input').removeClass('errorclient');
	   					uievents.customFields();
	   					uievents.synccheckoutH();
	   				}

	   			}
	   		});

	   		$con.find('.custom-select').each(function () {
	   			$(this).find('select').removeAttr("style");
	   			var selWidth = $(this).find('select').width();
	   			if($(this).find('select').hasClass('input-longer')) {
	   				var selWidth = selWidth - 17;
	   			}
	   			$(this).find('select').css({
					'width': selWidth + 20,
					'left': '0px',
					'line-height': '28px',
					'z-index': '99',
					'position': 'relative',
					'float': 'left',
					'padding': '0px'
	   			});
				$(this).find(".field-wrapper").css({
				    'background-position': selWidth,
					'width': selWidth + 20,
					'padding': '0px'
				});
				if($('.creditCard').length>0){
					 $(this).css({
					     'background-position': selWidth,
						 'width': selWidth + 15,
						 'padding': '0px'
					 });
				}


				if($(this).find('.selectorOut').length == 0) {
					$(this).find('select').after("<div class='selectorOut' style='position:absolute;top:0px;z-index:1;padding:0 20px 0 10px;'></div>");
				}
				if($(this).find('.selectorError').length == 0 && !$(this).closest('month') && !$(this).closest('year')) {
					$(this).closest('.formfield .field-wrapper').append("<div class='selectorError error'></div>");
				}
				$(this).find('.selectorOut').text('').text($(this).find(":selected").text());

	   		}).change(function () {
	   			var str = "";
				str = $(this).find(":selected").text();
				$(this).find(".selectorOut").text('').text(str);
				if( $(this).hasClass("addresslist") ) {
					if( $(this).find(".selectorOut").outerWidth() >= 298 ){
						str = str.substr(0,34)+"...";
						$(this).find(".selectorOut").text('').text(str);
					}
				}
	   		});

	   		$con.find('.custom-select select').bind('blur change', function () {
	   			if($(this).hasClass('valid') || $(this).val().length > 0) {
	   				$(this).closest('.custom-select').removeClass('customselect-error');
	   				$(this).removeClass("errorclient").addClass("valid");
	   				//$(this).find("option[value="+$(this).val()+"]").attr("selected","selected");
	   				if(jQuery(this).closest('.formfield').hasClass('state')){
	   					$('.state-blk .stateerror.error').hide();
	   				}
	   			}
	   			else {
	   				$(this).closest('.custom-select').addClass('customselect-error');
					if(jQuery(this).closest('.formfield').hasClass('state') && !jQuery(this).closest('.custom-select').hasClass('blured')){
						jQuery('.state-blk .stateerror.error').show();
					}
	   			}
				if(jQuery(this).hasClass('yearselect') || jQuery(this).hasClass('monthselect') ){
					if(jQuery('.yearselect').valid() == 1 && jQuery('.monthselect').valid() == 1){
				    	jQuery('.expirationdatevalid.error').hide();
				    	jQuery('.expirationdate.error').hide();
				        }
				    }
			});
	},
	//changes the selection of the given form select to the given value
	changeFormSelection: function (selectElem, selectedValue)
	{
		if(!selectElem) return;
		var options = selectElem.options;
		if(options.length > 0) {
			// find index of value to select
			var idx = 0;
			for(var i=0; i<options.length; i++) {
				if(options[i].value != selectedValue) continue;
				idx = i; break;
			}
			selectElem.selectedIndex = idx;
			$('.custom-select').each(function(){
				var select_val = $(this)	.find(":selected").text();
				$(this).find('.selectorOut').text(select_val);
			});
		}
	},
	init: function ($con) {

	   if($con == null) {
	        $con = $('body');
	   }

	   uievents.customFields();
   	  // Dynamicaly generating tabindex for VIP
 	   if($('.ui-dialog').hasClass('vipInsider-dlg')){
 		   $('.vipInsider-dlg .formfield').each(function(i) {
 			   $(this).find(":input:not(:hidden)").attr('tabindex', i + 21); });
 	   }
		/*$(document).ajaxComplete(function () {
			if($('.pt_productsearchresult').length > 0){app.search.searchRefinementToggle();}
		    uievents.synccheckoutH();
		});*/
   		$con.find('a.clearbutton').on('click touchstart', function () {
	        $(this).closest('.formfield').find('input') .val("");
	        $(this).closest('.formfield').find('textarea') .val("");
	        $(this).closest('.formfield').find('a.clearbutton').hide();
	        $(this).closest('.formfield').find('.correctaddress').hide();
	        $(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
	        var textareMaxLength = $(this).closest(".field-wrapper").find("textarea").attr('maxlength');
	        $(this).closest(".field-wrapper").find(".char-count").html("").html("Characters Remaining " +textareMaxLength);
	        if($(this).closest('.formfield').find('input[name$="_creditCard_number"]').length > 0 && $(this).closest('.formfield').find('input[name$="_creditCard_number"]').val().length < 4) {
	            $('.cardtypeimg > div').hide();
	        }
	        if($(this).closest('.formfield').find('.field-wrapper .maxelement').length > 0){
	        	$(this).closest('.formfield').find('.field-wrapper .maxelement').remove();
	        }
		});
		$con.find('.promo-input-button .field-wrapper').on('keyup blur', function () {
		   if($(this).find("input").val() != undefined) {
		       if($(this).find("input").val().length > 0) {
		            $(this).find('a.clearbutton').show();
		        }
		        else {
		            $(this).find('a.clearbutton').hide();
		        }
		    }
		});
		$con.find('.giftcertfields .field-wrapper').on('keyup blur', function () {
		   if($(this).find("input").val() != undefined) {
		    	$(this).find("input").removeClass('errorclient');
		       if($(this).find("input").val().length > 0) {
		            $(this).find('a.clearbutton').show();
		        }
		        else {
		            $(this).find('a.clearbutton').hide();
		            }
	        }
	    });

	   if($('.ui-login').length > 0 || $('.passwordreset').length>0 ) {
		    $con.find('.ui-login .formfield').each(function () {
		 	   var $val = $(this).find('input[type="text"]').length > 0 ? $(this).find('input[type="text"]').val() : $(this).find('input[type="password"]').val()
		       if($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
		            $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
		            $(this).find('.clearbutton').hide();
		        }
		       if(($val != null || $val != undefined) && $val.length > 0){
		     	  $(this).find('.clearbutton').show();
		       }
		    });
		}
		if($('.account-section').length > 0 || $('.passwordreset').length>0) {
            $con.find('.account-section .formfield').each(function () {
         	   var $val = $(this).find('input[type="text"]').length > 0 ? $(this).find('input[type="text"]').val() : $(this).find('input[type="password"]').val()
               if($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                }
               if(($val != null || $val != undefined) && $val.length > 0){
             	  $(this).find('.clearbutton').show();
               }
            });
        }

		$con.find('.formfield .field-wrapper input,.formfield .field-wrapper textarea').on('keyup input blur', function () {
	       if($(this).val() != undefined) {
	           if($(this).val().length > 0) {
	        	   $(this).closest('.formfield').find('a.clearbutton').show();
	            }
	            else {
	            	$(this).closest('.formfield').find('a.clearbutton').hide();
	            }
	        }
	    });
	   var OSName = "Unknown OS";
	   if (navigator.appVersion.indexOf("Mac") != -1) {
	   $('.pt_vipinsider').find('span.rapala-entity-holder i').addClass('macfont');
	   }

	   $('.paymentmethods_cont .toggle').click(function(){uievents.synccheckoutH();});

	   $("button[name='dwfrm_login_login']").click(function(){
		   setTimeout(function(){
	  			uievents.synccheckoutH();
	  		},100);
	   });
	   $("button[name='dwfrm_billinggiftcert_redeemGiftCert']").click(function(){
		   setTimeout(function(){
	  			uievents.synccheckoutH();
	  		},100);
	   });
	   $("button[name='dwfrm_billingcoupon_applyCoupon']").click(function(){
		   setTimeout(function(){
	  			uievents.synccheckoutH();
	  		},100);
	   });
	   $(".checkbalance a").click(function(){
		   setTimeout(function(){
	  			uievents.synccheckoutH();
	  		},100);
	   });
	   $(".giftcertcouponform .gift-heading").click(function(){
			if($(".show-content").is(":visible")==true){
				$(".show-content").hide();
				$(this).closest(".giftcertfield").find("span.error").hide();
			}
			else {
				$(".show-content").show();
				$(this).closest(".giftcertfield").find("span.error").show();
			}
			uievents.synccheckoutH();
		});
	   $("body").on('keypress keyup','input[id$="_addressid"],input[id$="_addressFields_firstName"],input[id$="_addressFields_lastName"],input[id$="_addressFields_address1"],input[id$="_addressFields_address2"],input[id$="_addressFields_city"],input[id$="_addressFields_phone"],input[id$="_addressFields_postal"],input[id$="_contactus_phone"]', function(e){
       	var keycode =  e.keyCode ? e.keyCode : e.which;
       	var maxlength = $(this).attr('maxlength');
       	var maxlmsg = "This field is limited to "+ maxlength +" characters.";
       	if(jQuery(this).hasClass('phone') || jQuery(this).hasClass('phoneCDUS')){
       		maxlength = 14;
       		$(this).attr('maxlength', maxlength);
       		var maxlmsg = "This field is limited to 10 numbers.";
       	}


       	if(jQuery(this).hasClass('postal')){
       		maxlength = 10;
       		$(this).attr('maxlength', maxlength);
       		var maxlmsg = "This field is limited to 9 numbers.";
       	}
       	 if(keycode != 86){
           	var maxElement = "<div class='maxelement hide'>"+maxlmsg+"</div>"
           	if(($(this).val().length >= maxlength)&&(keycode != 9)){
           		if($(this).closest('.field-wrapper').find('span.errorclient').length != 0){
           			$(this).closest('.field-wrapper').find('span.errorclient').remove();
           		}
           		if($(this).closest('.field-wrapper').find('.maxelement').length == 0){
           			$(this).closest('.field-wrapper').append(maxElement);
           		}else {
           				$(this).closest('.field-wrapper').find('.maxelement').removeClass('hide');
           				$(this).val($(this).val().substr(0, maxlength));
           				return false;
           		}
           	}else{
           		if($(this).closest('.field-wrapper').find('.maxelement').length > 0){
           			$(this).closest('.field-wrapper').find('.maxelement').remove();
           		}
           	}
       	 }

       });
	   $("body").on('blur','input[id$="_addressid"],input[id$="_addressFields_firstName"],input[id$="_addressFields_lastName"],input[id$="_addressFields_address1"],input[id$="_addressFields_address2"],input[id$="_addressFields_city"],input[id$="_addressFields_phone"],input[id$="_addressFields_postal"],input[id$="_contactus_phone"]', function(e){
       	$('.maxelement').addClass('hide');
       	$('#customercontactus').find('span').removeClass('maxelement');
       });
		  /* if($(".ordertotalsaving").length > 0 ) {
			   $(".new-summery").removeClass("discount-available");
		   }else {
			   $(".new-summery").addClass("discount-available");
		   }*/
	   if($('.ui-dialog').hasClass('vipInsider-dlg')) {
			$('.vipInsider-dlg .formfield').each(function () {
				if($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper textarea').length > 0 ||  $(this).find('.field-wrapper input[type="password"]').length > 0) {
					$(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
				}
				$(this).find(".field-wrapper input.textinput, .field-wrapper textarea").unbind("change").bind("click change", function(){
					if($(this).hasClass("errorclient")){
						$(this).removeClass("errorclient");
						$(this).closest(".formfield").find(".label").find("span.errorclient").remove();
						$(this).closest(".formfield").find(".label").removeClass("erroroccured");
						$(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
					}else return false;
				});
				$(this).find(".field-wrapper select").unbind("change").bind("focusin change", function(){
					if($(this).hasClass("errorclient")){
						$(this).removeClass("errorclient");
						$(this).closest(".formfield").find(".label").find("span.errorclient").remove();
						$(this).closest(".formfield").find(".label").removeClass("erroroccured");
						$(this).closest(".formfield").find(".form-row , .label span").removeClass('inputlabel');
					}
				});
			});
			$("#VIPInsider-form-cancel-id").click(function(){
				$('.ui-dialog-titlebar-close').trigger("click");
			});

		  /********************* vip phone and zip error exceed code **************************/

		  	 $('input[id$="_vipinsider_customer_zip"],input[id$="_vipinsider_customer_phone"]').bind('keypress keyup', function(e){
		     	var keycode =  e.keyCode ? e.keyCode : e.which;
		     	var maxlength = $(this).attr('maxlength');
		     	var maxlmsg = "This field is limited to "+ maxlength +" characters.";
		     	if(jQuery(this).hasClass('vip-phone')){
		     		maxlength = 14;
		     		$(this).attr('maxlength', maxlength);
		     		var maxlmsg = "-This field is limited to 10 numbers.";
		     	}
		     	if(jQuery(this).hasClass('vip-zip')){
		     		maxlength = 10;
		     		$(this).attr('maxlength', maxlength);
		     		var maxlmsg = "-This field is limited to 9 numbers.";
		     	}
		     	 if(keycode != 86){
		        	var maxElement = "<div class='maxelement hide'>"+maxlmsg+"</div>"
		        	if($(this).val().length >= maxlength){
		        		if($(this).closest('.field-wrapper').find('span.errorclient').length != 0){
		        			$(this).closest('.field-wrapper').find('span.errorclient').remove();
		        		}
		        		if($(this).closest('.formfield').find('.maxelement').length == 0){
		        			$(this).closest('.formfield').find(".label").append(maxElement);
		        		}else {
		        			if((keycode > 47 && keycode < 58)){
		        				$(this).closest('.formfield').find('.maxelement').removeClass('hide');
		        				$(this).closest('.formfield').find(".label").addClass("erroroccured");
		        				$(this).val($(this).val().substr(0, maxlength));
		        				return false;
		        			}
		        		}
		        	}else{
		        		if($(this).closest('.formfield').find('.maxelement').length > 0){
		        			$(this).closest('.formfield').find('.maxelement').remove();
		        			$(this).closest('.formfield').find(".label").removeClass("erroroccured");
		        		}
		        	}
		     	 }
		     });
		     //this is used after to remove the exceeding error message on blur for 1143 ticket
		     jQuery('input[id$="_vipinsider_customer_zip"],input[id$="_vipinsider_customer_phone"]').bind('blur', function(e){
		    	if($(this).closest('.formfield').find(".label").find(".maxelement").is(":visible")){
		    		$('.maxelement').addClass('hide');
		         	$('#VipinsiderForm').find('span').removeClass('maxelement');
		         	$(this).closest('.formfield').find(".label").removeClass("erroroccured");
		    	}
		     });
		}
		/**------- left nav----------------*/
		$con.find('.categorymenusnew li.active').closest('.category-top-level').addClass('current');
		$con.find('.category-top-level').each(function(){
			if($(this).hasClass('current')){
				var $this = $('.categorymenusnew li.active');
				var $notthis = $('.categorymenusnew li').filter(function(){
					if($(this).not('.active')){
						 if($(this).find('> ul').length > 0){
							$(this).find('> a .count-products').addClass('select_sublevelarrow');
						 }
					};
				});
		        $this.find('> ul').show();
		        $this.parents('ul').show();
		        if($this.find('> ul').length > 0){
		        	$this.find('> a .count-products').addClass('sublevelarrow');
		        }
		        $this.parents('li').not('li.active').find('> a .count-products').addClass('sublevelarrow');
		        $this.find('li').each(function(){
		        	if($(this).find('> ul').length > 0){
		        		$(this).find('> a .count-products').addClass('select_sublevelarrow');
		        	}
		        });
			}else{
				if($(this).find('> ul').length > 0){
		    		$(this).find('> a .count-products').addClass('select_sublevelarrow');
		    	}
			}
		});
		/*$('textarea[data-character-limit]').each(function(){
			charcount($(this));
			// trigger the keydown event so that any existing character data is calculated
		}).on('keyup keypress', function(){
			charcount($(this));
		});*/
	},
    synccheckoutH: function () {
        if($('.pt_checkout').length > 0) {
     	   $('.item-cart-scrollbar').removeAttr("style");
            $('.pt_checkout .summary-section .slimScrollDiv').removeAttr("style");
            $('.item-cart-scrollbar').removeClass("scrollbar-active");
            $('.pt_checkout  .ajax-cartsummary').find(".summary-carttable").removeClass("scrollbar-is-active");
            $('.item-cart-scrollbar').slimScroll({destroy: true});
             var checkout_leftH = $('.pt_checkout .checkout_cont').height(),
                 summaryH = $('.pt_checkout .summary-section').height(),
                 newsummaryH = $('.pt_checkout  .new-summery-cart').not(".mobile-view").height();

             var newHeightRight = summaryH + newsummaryH;
             if(newHeightRight >= checkout_leftH) {
             	var summaryHeight = checkout_leftH - newsummaryH;
             	var summaryHeightRightBottom = summaryHeight - 99;
             	$('.pt_checkout .summary-section .slimScrollDiv').css({"height":summaryHeightRightBottom});
             	$('.item-cart-scrollbar').addClass("scrollbar-active").css({"height":summaryHeightRightBottom});
             	$('.item-cart-scrollbar').slimScroll({
             		railVisible: true,
             		color: '#a0a0a0',
             	    alwaysVisible: true
                 });
             	$('.pt_checkout  .ajax-cartsummary').find(".summary-carttable").addClass("scrollbar-is-active");
             }
             else {
             	$('.item-cart-scrollbar').css({"height":"auto"});
             	$('.pt_checkout .summary-section .slimScrollDiv').css({"height":"auto" , "overflow-y": "auto"});
             	$('.item-cart-scrollbar').removeClass("scrollbar-active");
             	$('.pt_checkout  .ajax-cartsummary').find(".summary-carttable").removeClass("scrollbar-is-active");
             	$('.item-cart-scrollbar').slimScroll({destroy: true});
             }
         }
     }
}
module.exports = uievents;
},{"./util":48}],48:[function(require,module,exports){
'use strict';

var _ = require('lodash');
var cardregex = {
    mastercard: /^5[1-5][0-9]{2,14}$/,
    visa: /^4[0-9]{3,15}$/,
    amex: /^3[47]([0-9]{2,13})$/,
    discover: /^6(?:011[0-9]{0,12}|5[0-9]{2,14})$/
}
var util = {
    /**
     * @function
     * @description appends the parameter with the given name and value to the given url and returns the changed url
     * @param {String} url the url to which the parameter will be added
     * @param {String} name the name of the parameter
     * @param {String} value the value of the parameter
     */
    appendParamToURL: function(url, name, value) {
        // quit if the param already exists
        if (url.indexOf(name + '=') !== -1) {
            return url;
        }
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        return url + separator + name + '=' + encodeURIComponent(value);
    },
    hiddenData: function () {
        jQuery.each(jQuery(".hidden"), function () {
            var hiddenStr = jQuery(this).html();

           if(hiddenStr === "") {
                return;
            }

            // see if its a json string
           if(jQuery(this).hasClass("json")) {
                // try to parse it as a json
                try {
                    hiddenStr = window["eval"]("(" + hiddenStr + ")");
                }
                catch (e) {}
            }

            jQuery(this).prev().data("data", hiddenStr);

            jQuery(this).remove();
        });
    },

    	/**** Read cookieee  *****/
    	readCookie : function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },


	/***  Read cookie ***/
    /**
     * @function
     * @description appends the parameters to the given url and returns the changed url
     * @param {String} url the url to which the parameters will be added
     * @param {Object} params
     */
    appendParamsToUrl: function(url, params) {
        var _url = url;
        _.each(params, function(value, name) {
            _url = this.appendParamToURL(_url, name, value);
        }.bind(this));
        return _url;
    },

    /**
     * @function
     * @description remove the parameter and its value from the given url and returns the changed url
     * @param {String} url the url from which the parameter will be removed
     * @param {String} name the name of parameter that will be removed from url
     */
    removeParamFromURL: function(url, name) {
        if (url.indexOf('?') === -1 || url.indexOf(name + '=') === -1) {
            return url;
        }
        var hash;
        var params;
        var domain = url.split('?')[0];
        var paramUrl = url.split('?')[1];
        var newParams = [];
        // if there is a hash at the end, store the hash
        if (paramUrl.indexOf('#') > -1) {
            hash = paramUrl.split('#')[1] || '';
            paramUrl = paramUrl.split('#')[0];
        }
        params = paramUrl.split('&');
        for (var i = 0; i < params.length; i++) {
            // put back param to newParams array if it is not the one to be removed
            if (params[i].split('=')[0] !== name) {
                newParams.push(params[i]);
            }
        }
        return domain + '?' + newParams.join('&') + (hash ? '#' + hash : '');
    },

    /**
     * @function
     * @description extract the query string from URL
     * @param {String} url the url to extra query string from
     **/
    getQueryString: function(url) {
        var qs;
        if (!_.isString(url)) {
            return;
        }
        var a = document.createElement('a');
        a.href = url;
        if (a.search) {
            qs = a.search.substr(1); // remove the leading ?
        }
        return qs;
    },
    /**
     * @function
     * @description
     * @param {String}
     * @param {String}
     */
    elementInViewport: function(el, offsetToTop) {
        var top = el.offsetTop,
            left = el.offsetLeft,
            width = el.offsetWidth,
            height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        if (typeof(offsetToTop) !== 'undefined') {
            top -= offsetToTop;
        }

        if (window.pageXOffset !== null) {
            return (
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
        }

        if (document.compatMode === 'CSS1Compat') {
            return (
                top < (window.document.documentElement.scrollTop + window.document.documentElement.clientHeight) &&
                left < (window.document.documentElement.scrollLeft + window.document.documentElement.clientWidth) &&
                (top + height) > window.document.documentElement.scrollTop &&
                (left + width) > window.document.documentElement.scrollLeft
            );
        }
    },

    /**
     * @function
     * @description Appends the parameter 'format=ajax' to a given path
     * @param {String} path the relative path
     */
    ajaxUrl: function(path) {
        return this.appendParamToURL(path, 'format', 'ajax');
    },

    /**
     * @function
     * @description
     * @param {String} url
     */
    toAbsoluteUrl: function(url) {
        if (url.indexOf('http') !== 0 && url.charAt(0) !== '/') {
            url = '/' + url;
        }
        return url;
    },
    /**
     * @function
     * @description Loads css dynamically from given urls
     * @param {Array} urls Array of urls from which css will be dynamically loaded.
     */
    loadDynamicCss: function(urls) {
        var i, len = urls.length;
        for (i = 0; i < len; i++) {
            this.loadedCssFiles.push(this.loadCssFile(urls[i]));
        }
    },

    /**
     * @function
     * @description Loads css file dynamically from given url
     * @param {String} url The url from which css file will be dynamically loaded.
     */
    loadCssFile: function(url) {
        return $('<link/>').appendTo($('head')).attr({
            type: 'text/css',
            rel: 'stylesheet'
        }).attr('href', url); // for i.e. <9, href must be added after link has been appended to head
    },
    // array to keep track of the dynamically loaded CSS files
    loadedCssFiles: [],

    /**
     * @function
     * @description Removes all css files which were dynamically loaded
     */
    clearDynamicCss: function() {
        var i = this.loadedCssFiles.length;
        while (0 > i--) {
            $(this.loadedCssFiles[i]).remove();
        }
        this.loadedCssFiles = [];
    },
    /**
     * @function
     * @description Extracts all parameters from a given query string into an object
     * @param {String} qs The query string from which the parameters will be extracted
     */
    getQueryStringParams: function(qs) {
        if (!qs || qs.length === 0) {
            return {};
        }
        var params = {},
            unescapedQS = decodeURIComponent(qs);
        // Use the String::replace method to iterate over each
        // name-value pair in the string.
        unescapedQS.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function($0, $1, $2, $3) {
                params[$1] = $3;
            }
        );
        return params;
    },

    fillAddressFields: function(address, $form) {
        for (var field in address) {
            if (field === 'ID' || field === 'UUID' || field === 'key') {
                continue;
            }
            // if the key in address object ends with 'Code', remove that suffix
            // keys that ends with 'Code' are postalCode, stateCode and countryCode
            $form.find('[name$="' + field.replace('Code', '') + '"]').val(address[field]);
            // update the state fields
            if (field === 'countryCode') {
                $form.find('[name$="country"]').trigger('change');
                // retrigger state selection after country has changed
                // this results in duplication of the state code, but is a necessary evil
                // for now because sometimes countryCode comes after stateCode
                $form.find('[name$="state"]').val(address.stateCode);
            }
        }
    },
    /**
     * @function
     * @description Updates the number of the remaining character
     * based on the character limit in a text area
     */
    limitCharacters: function() {
        $('form').find('textarea[data-character-limit]').each(function() {
            var characterLimit = $(this).data('character-limit');
            var charCountHtml = String.format(Resources.CHAR_LIMIT_MSG,
                '<span class="char-remain-count">' + characterLimit + '</span>',
                '<span class="char-allowed-count">' + characterLimit + '</span>');
            var charCountContainer = $(this).next('div.char-count');
            if (charCountContainer.length === 0) {
                charCountContainer = $('<div class="char-count"/>').insertAfter($(this));
            }
            charCountContainer.html(charCountHtml);
            // trigger the keydown event so that any existing character data is calculated
            $(this).change();
        });
    },
    trimPrefix: function (str, prefix) {
        return str.substring(prefix.length);
    },
    cardtype: {
        init: function () {
           if($('#paymentmethods').find('.creditCard-number').length > 0) {
            	$('#paymentmethods').find('.creditCard-number').bind('keypress keyup', function(){
            		if($(this).val().length){
            			$('.carderror.error').hide();
            		}
            		if($(this).val().length < 4){
            		$('.cardtypeimg > div').hide();
            		}
            	});
            	$('.creditCard-number, .creditcard_cvn').on('keypress', function (e) {
                    e = (e) ? e : window.event;
                    var charCode = (e.which) ? e.which : e.keyCode;
                   if(charCode > 31 && (charCode < 48 || charCode > 57)) {
                        return false;
                    }
                    return true;
                });
                $('#paymentmethods').find('.creditCard-number').blur(function () {
                            var val = $.trim($(this).val());
                            var regex = /^[a-zA-Z]+$/;
                            var errorspan = $(this).closest('.formfield').find('span.carderror');
                           if(!val) {
                                errorspan.hide();
                                return;
                            }
                           if(val.length) {
                            	if ($('.carderror.error').length == 0) {
                            		$(this).closest('.formfield').append('<span class="carderror error">Not a valid Credit Card Number, please try again.</span>');
                            	}
                            	$('.carderror.error').hide();
                                var cardTypeval = util.validatecardtype(val);
                               if(cardTypeval != "Error") {
                                    errorspan.hide();
                                    $('#paymentmethods').find('select[name$="_paymentMethods_creditCard_type"]').val(cardTypeval);
                                    $('.cardtypeimg > div').hide();
                                    $('.cardtypeimg > div.' + cardTypeval).show();

                                    if((cardTypeval == "MasterCard") || (cardTypeval == "Visa") || (cardTypeval == "Discover")){
                                    	if(val.length < 16){
                                    		$('.carderror.error').show();
                                    		$(this).addClass('errorclient');
                                    	}
                                    }else if(cardTypeval = "Amex"){
                                    	if(val.length < 15){
                                    		$('.carderror.error').show();
                                    		$(this).addClass('errorclient');
                                    	}
                                    }else{
                                    	$('.carderror.error').hide();
                                    	$(this).removeClass('errorclient');
                                    }
                                }
                                else {
                                	if($(this).val().indexOf('*') == -1){
                                		if(val.length < 16){
                                			$('.carderror.error').show();
                                        	$(this).addClass('errorclient');
                                        	$('.cardtypeimg > div').hide();
                                		}
                                	}
                                }
                            }
                           if($('#paymentmethods').find('.creditCard-number').val().length < 4) {
                                $('.cardtypeimg > div').hide();
                            }
                        });
            }

        }

    },
    validatecardtype: function(val) {
        var result = " ",
            carNo = val;

        // first check for MasterCard
       if(cardregex.mastercard.test(carNo)) {
            result = "MasterCard";
        }
        // then check for Visa
       else if(cardregex.visa.test(carNo)) {
            result = "Visa";
        }
        // then check for AmEx
       else if(cardregex.amex.test(carNo)) {
            result = "Amex";
        }
       else if(cardregex.discover.test(carNo)) {
            result = "Discover";
        }
        else {
            result = "Error"
        }
        return result;
    },
    /**
     * @function
     * @description Binds the onclick-event to a delete button on a given container,
     * which opens a confirmation box with a given message
     * @param {String} container The name of element to which the function will be bind
     * @param {String} message The message the will be shown upon a click
     */
    setDeleteConfirmation: function (container, message) {
        $(container).on('click', '.delete', function() {
            return window.confirm(message);
        });
    },
    /**
     * @function
     * @description Scrolls a browser window to a given x point
     * @param {String} The x coordinate
     */
    scrollBrowser: function (xLocation) {
        $('html, body').animate({
            scrollTop: xLocation
        }, 500);
    },

    isMobile: function () {
        var mobileAgentHash = ['mobile', 'tablet', 'phone', 'ipad', 'ipod', 'android', 'blackberry', 'windows ce', 'opera mini', 'palm'];
        var idx = 0;
        var isMobile = false;
        var userAgent = (navigator.userAgent).toLowerCase();

        while (mobileAgentHash[idx] && !isMobile) {
            isMobile = (userAgent.indexOf(mobileAgentHash[idx]) >= 0);
            idx++;
        }
        return isMobile;
    }
};

module.exports = util;

},{"lodash":53}],49:[function(require,module,exports){
'use strict';

var naPhone = /^\(?([2-9][0-8][0-9])\)?[\-\. ]?([2-9][0-9]{2})[\-\. ]?([0-9]{4})(\s*x[0-9]+)?$/;
var regex = {
    phone: {
        us: naPhone,
        ca: naPhone,
        fr: /^0[1-6]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/,
        it: /^(([0-9]{2,4})([-\s\/]{0,1})([0-9]{4,8}))?$/,
        jp: /^(0\d{1,4}- ?)?\d{1,4}-\d{4}$/,
        cn: /.*/,
        gb: /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
    },
    postal: {
        us: /^\d{5}(-\d{4})?$/,
        ca: /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/,
        fr: /^(F-)?((2[A|B])|[0-9]{2})[0-9]{3}$/,
        it: /^([0-9]){5}$/,
        jp: /^([0-9]){3}[-]([0-9]){4}$/,
        cn: /^([0-9]){6}$/,
        gb: /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/
    },
    notCC: /^(?!(([0-9 -]){13,19})).*$/
};
// global form validator settings
var settings = {
	errorClass: 'errorclient',
	errorElement: 'span',
	focusInvalid: false,
	onkeyup: function (element) {
		if(!this.checkable(element)) {
			$(element).addClass('stopKeypress');
			if($(element).val().length > 0){this.element(element);}
			if($('.account-logs').length > 0 ||  $('.new-register').length > 0  ||  $('.wish-logs').length > 0 || $('.forgot_old').length > 0 ||  $('.createan-account').length > 0 ||  $('.promo-sec').length > 0 || $('.headercustomerinfo').length > 0  ||  $('.ui-login').length > 0 || $('.vipInsider-dlg.ui-dialog ').length > 0 || $('.passwordreset').length > 0){
				$(element).closest(".formfield").find(".label span").removeClass("inputlabel");
				$('.promo-sec').find('.couponinput').removeClass('inputlabel');
			}
		}
	},
	//focusCleanup: false,
	//onfocusout: false,

	onfocusout: function (element) {
		if(!this.checkable(element)) {
			$(element).removeClass('stopKeypress');
			this.element(element);

			if( $('.account-logs').length > 0 ||  $('.new-register').length > 0  ||  $('.wish-logs').length > 0 || $('.forgot_old').length > 0 || $('.passwordreset').length > 0 || $('.vipInsider-dlg.ui-dialog ').length > 0 ||  $('.promo-sec').length > 0 || $('.pt_checkout').length > 0){
				if($(element).hasClass("errorclient")) {
					$(element).closest(".form-row").addClass("inputlabel");
					$(element).closest(".formfield").addClass("inputlabel");
					$(element).closest(".formfield").find(".label span").addClass("inputlabel");
					$(element).closest(".form-row").find(".label span").addClass("inputlabel");
					$(element).closest(".formfield").find(".logerror , .existing_register").hide();
				}
				else {
					$(element).closest(".form-row").removeClass("inputlabel");
					$(element).closest(".formfield").removeClass("inputlabel");
					$(element).closest(".form-row").find(".label span").removeClass("inputlabel");
					$(element).closest(".formfield").find(".label span").removeClass("inputlabel");
					$(element).closest(".formfield").find(".logerror , .existing_register").hide();
				}
			}
			/*** if($(element).closest('.ui-dialog').hasClass('vipInsider-dlg')) {
				if($(element).hasClass("errorclient")) {
					if($(element).closest(".formfield").find(".label span.errorclient").is(':visible')){
						$(element).closest(".form-row").addClass("erroroccured");
					}else {
						$(element).closest(".form-row").removeClass("erroroccured");
					}
				}
			} ***/
		}
	},
	errorPlacement : function(error, element) {
		if($(element).hasClass("errorclient")) {
			$(element).closest(".form-row").addClass("inputlabel");
			$(element).closest(".formfield").addClass("inputlabel");
			$(element).closest(".formfield").find(".label span").addClass("inputlabel");
			$(element).closest(".form-row").find(".label span").addClass("inputlabel");
			$(element).closest(".formfield").find(".logerror , .existing_register").hide();
		}
		else {
			$(element).closest(".form-row").removeClass("inputlabel");
			$(element).closest(".formfield").removeClass("inputlabel");
			$(element).closest(".form-row").find(".label span").removeClass("inputlabel");
			$(element).closest(".formfield").find(".label span").removeClass("inputlabel");
			$(element).closest(".formfield").find(".logerror , .existing_register").hide();
		}
		if($(element).hasClass('emailfooter')){
			$(element).closest('#emailfooter').before(error);
		}
		else if($(element).closest('.ui-dialog').hasClass('vipInsider-dlg')){
			$(element).closest(".formfield").find(".label").append(error);
			if($(element).closest(".formfield").find(".label span.errorclient").is(':visible') && !($(element).closest(".formfield").find(".label").hasClass("erroroccured"))){
				$(element).closest(".formfield").find(".label").addClass("erroroccured");
			}else {
				$(element).closest(".formfield").find(".label").removeClass("erroroccured");
			}
		}
		else {
			if($('.passwordreset').find('button.send.clickedButton').length > 0) {
				$(element).after(error);
				$('.passwordreset').find('button.send.clickedButton').removeClass('clickedButton');
			} else {
				if($('.header-forgot-pwd.accountcontent').css('display') == "none") {
					$(element).after(error);
				} else if($('.header-forgot-pwd.accountcontent').css('display') == "block") {

				}
				else{
					if($(element).hasClass("custom-select-wrap")) {
						$(element).closest(".field-wrapper").after(error);
					} else {
						$(element).after(error);
					}

				}
			}
		}
	}
};

//firstname validation
var ctrl = false;
var selectText = false;
$('input[attributemaxlength],textarea[attributemaxlength]').on('keydown', function (e) {
                var j;
                if($(this).hasClass("firstname")){
                                j = document.getElementById('dwfrm_profile_customer_firstname');
                }
                else if($(this).hasClass("lastname")){
                                j = document.getElementById('dwfrm_profile_customer_lastname');
                }
                                if (e.keyCode == 17) ctrl = true;

                                if(($(this).hasClass('vip-textarea') && e.keyCode != 8 && e.keyCode != 46 && !selectText) || (((e.keyCode >= 48 && e.keyCode <=90) ||(e.keyCode >= 96 && e.keyCode <=105)) && !ctrl && !selectText)) {
                                                var currObj = $(this);
                                    var maxchars = $(this).attr('maxlength');
                                    var tlength = $(this).val().length;
                                    if(tlength >= maxchars) {
                                                $(this).val($(this).val().substring(0, maxchars));
                                                                if($(currObj).closest('.field-wrapper').find('.max-length-error').length == 0 && $(currObj).closest('.formfield').find('.max-length-error').length == 0) {
                                                                                if($(currObj).hasClass("vip-textarea")){
                                                                                                var error = "<div class='max-length-error'> -This field is limited to 1200 characters.</div>";
                                                                                }
                                                                                if($(currObj).hasClass("vip-textarea1")){
                                                                                                var error = "<div class='max-length-error'> -This field is limited to 30 characters.</div>";
                                                                                }
                                                                                else if($(currObj).closest("form").hasClass("vipfieldstaff")){
                                                                                                var error = "<div class='max-length-error'> -This field is limited to 30 characters.</div>";
                                                                                }
                                                                                else{
                                                                                var error = "<div class='max-length-error'> This field is limited to 30 characters.</div>";
                                                                                }

                                                                                $(this).closest('form').hasClass('vipfieldstaff') > 0 ? $(this).closest('.formfield').find('.label').append(error) : $(this).closest('.field-wrapper').append(error);
                                                                                $(this).closest('.formfield').find('.label span').addClass('countlabelerror');
                                                                                $(this).addClass('counterror');
                                                                }
                                                                else if(e.keyCode != 9){
                                                                                $(this).closest('form').hasClass('vipfieldstaff') > 0 ? $(this).closest('.formfield').find('.label').find(".max-length-error").removeClass("hide") : $(this).closest('.field-wrapper').find(".max-length-error").removeClass("hide");
                                                                                $(this).addClass('counterror');
                                                                                $(this).closest('.formfield').find('.label span').addClass('countlabelerror');
                                                                                return false;
                                                                }
                                                } else{
                                                                                $(this).removeClass('counterror');
                                                                                $('.max-length-error').remove();
                                                                                $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
                                                }
                                }else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                                                if($(this).hasClass("vipinsideremail")) {return true;}
                                                else
                                                                return false;
}
else {
$(this).closest('.formfield').find('.max-length-error').remove();
$(this).removeClass('counterror');
                $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
                selectText = false;
}

}).on('keyup', function(e){
                ctrl = false;
                var currObj = $(this);
    var maxchars = $(this).attr('maxlength');
    var tlength = $(this).val().length;
    if(tlength < maxchars) {
                $(this).removeClass('counterror');
                                $('.max-length-error').remove();
                                $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
                }
}).on('select', function(e){
                selectText = true;
                $(this).removeClass('counterror');
                $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
});
$('input[attributemaxlength],textarea[attributemaxlength]').on('focusout', function() {
                                $(this).removeClass('counterror');
                                $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
                                $(this).closest('.field-wrapper').find(".max-length-error").remove();
                                $(this).closest('.formfield').find(".max-length-error").remove();
                                //$(this).closest('.formfield').find('.label span').removeClass('inputlabel');
});
if($('.loginfailedclass:visible').length>0){
                $('.registration .formfield_email').find('.labeltext').removeClass('inputlabel');
                $('.registration .formfield_email').find('.requiredindicator').removeClass('inputlabel');
                $('.registration .formfield_email').find('.requiredindicator').removeClass('inputlabel');
                $('.registration .formfield_email').find('.existing_register').hide();
}


//$("body").on('change input',".accountemail , .guestemail, .emailCMrapala, .guestemailcon, .vipinsideremail, .emailfooter, .accountemailconf, .accountEmailConfirmation, .resetemail, .accemailcon, .loggedemail", function (e) {
//	//$(this).val(this.value.replace(/[\s]/g, ''));
//
//});
$(".accountemail , .guestemail, .emailCMrapala, .guestemailcon, .vipinsideremail, .emailfooter, .accountemailconf, .accountEmailConfirmation, .resetemail, .accemailcon, .loggedemail").on({
	  keydown: function(e) {
	    if (e.which === 32)
	      return false;
	  },
	  change: function() {
	    this.value = this.value.replace(/\s/g, "");
	  }
});
//override default required field message
$.validator.messages.required = function ($1, ele, $3) {
	 var requiredText = $(ele).closest('.form-row').attr(
        'data-required-text');
    return requiredText || "";
};

/**
 * Add phone validation method to $ validation plugin. Text
 * fields must have 'phone' css class to be validated as phone
 * phoneUS is copied from
 * http://docs.$.com/Plugins/Validation/CustomMethods/phoneUS
 */
$.validator
    .addMethod(
        "phone",
        function (phone_number, element) {
        	if($(element).hasClass('stopKeypress')){
				return true;
			} else {
            // find out the country code
            var data = $(element).data("data");
            var country = (data && data.country && data.country != "") ? data.country : "US"; // default to US phone
            // validation

            // preserve this instance
            var that = this;

            // country specific phone validation handlers
            var phoneCA, phoneUS;

            phoneCA = function () {
                phone_number = phone_number.replace(/\s+/g,
                    "");

                return that.optional(element) || phone_number.length > 9 && phone_number
                    .match(/^(\d{10}|\d{3}(-\d{3})(-\d{4})$|^\d{3}(\s\d{3})?(\s\d{4})?)$/);
            };
            phoneUS = phoneCA;
            window["eval"]
            ("var phoneHandler = (typeof phone" + country + " != 'undefined') ? phone" + country + ": null;");

            // call the country specific phone validation
            // handler
            return (phoneHandler && typeof phoneHandler == "function" ? phoneHandler() : true);
			}
        }, Resources.INVALID_PHONE);

$.validator.addMethod("phoneCDUS",function (phone_number, element) {
    	if($(element).hasClass('stopKeypress')){
			return true;
		} else {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 && phone_number
                .match(/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/);
			}
        }, "Please specify a valid phone number");

$.validator .addMethod("phone",function (phone_number, element) {
    	if($(element).hasClass('stopKeypress')){
			return true;
		} else {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 && phone_number
                .match(/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/);
		}
        }, "Please specify a valid phone number");

$.validator.addMethod('phoneUK',function (phone_number, element) {
    	if($(element).hasClass('stopKeypress')){
			return true;
		} else {
            return this.optional(element) || phone_number.length > 9 && phone_number
                .match(/^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/);
		}
        }, "Please specify a valid phone number");

$.validator.addMethod("postal", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else  {
       if(value == ''){
        	 return true;
        }
        return /^\d{5}((-\d{4})|(\d{4}))?$/.test(value);
	}
    }, "Please enter your 5 or 9 digit Zip Code with or without a hyphen");

$.validator.addMethod("zipCodeCustom", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else {
        if(value == ''){
         	 return true;
         }
         return /^\d{5}((-\d{4})|(\d{4}))?$/.test(value);
	}
 }, "- Please enter a valid ZipCode");

$.validator.addMethod("phoneCustom",function (phone_number, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 && phone_number
        .match(/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/);
	}
}, "- Please specify a valid phone number");


$.validator.addMethod("emailCM", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else {
       if(value == ''){return true;}
        return /^[\w-\.]{1,}\@([\da-zA-Z-]{1,}\.){1,}[\da-zA-Z-]{2,4}$/.test(value);
	}
}, "Please specify a valid Email Id");

var customErrormsg = "";
var customError = function () {
    return customErrormsg;
};

$.validator.addMethod("emailCMrapala", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
         var vIndex = value.length;
         var fchar = value.substring(0, 1);
         var lchar = value.substring(vIndex - 1);
        if(value.indexOf('@') != -1) {
             var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
         }
         var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
         var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        if((fchar_s == false) || (lchar_s == false)) {customErrormsg = "-Something doesn't look right, please try again.";
             return false;
         }else if(email_check == false) {customErrormsg = "Oops - the email entered is not in a valid format.";
             return false;
         } else {  return true; }
		}
}, customError);

$.validator.addMethod("creditcard_name", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else {
       if(value == ''){return true;}
        return /^[a-zA-Z ]+$/.test(value);
	}
}, "Only letters are valid for this field");

$.validator.addMethod("creditcard_cvn", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else {

		var cardtype = $(".select-creditCard-type").val();
    	var cvv_length = 3;
       if(value == ''){return true;}
        if(cardtype == 'Amex'){	cvv_length = 4; }
        if((value.length != cvv_length)){ $('.errorKeypress').remove(); return false;}else{return true;}
	}
}, "Please enter a valid Security Code for the Credit Card entered");

$.validator.addMethod("guestemailcon", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	} else if(!$('.checkoutasguestbutton').is(':visible')) {
                var vIndex = value.length;
                var fchar = value.substring(0, 1);
                var lchar = value.substring(vIndex - 1);
               if(value.indexOf('@') != -1) {
                    var splitval = value.split('@'); fchar = splitval[0].substring(0, 1); lchar = splitval[0].substring(splitval[0].length - 1);
                }
                var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);
                var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
                var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
                var email_val = $(element).closest('.formfield').prev('.formfield').find('.guestemail').val();
               if((fchar_s == false) || (lchar_s == false)) { customErrormsg = "Something doesn't look right, please try again.";
                    return false;
                }  else if(email_check == false) {
                    customErrormsg = "Oops - the email entered is not in a valid format.";
                    return false;
                }else if(email_val != value) {
                    customErrormsg = "Please make sure emails match.";
                    return false;
                }else {
                    return true;
                }

            }
        }, customError);

$.validator.addMethod("guestemail",function (value, element) {
			if($(element).hasClass('stopKeypress')){
				return true;
			}else if(!$('.checkoutasguestbutton').is(':visible')) {
                var vIndex = value.length;
                var fchar = value.substring(0, 1);
                var lchar = value.substring(vIndex - 1);
               if(value.indexOf('@') != -1) {
                    var splitval = value.split('@');
                    fchar = splitval[0].substring(0, 1);
                    lchar = splitval[0].substring(splitval[0].length - 1);
                }

                var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);
                var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
                var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
               if((fchar_s == false) || (lchar_s == false)) {
                    customErrormsg = "Something doesn't look right, please try again.";
                    return false;
                }else if(email_check == false) {
                    customErrormsg = "Oops - the email entered is not in a valid format.";
                    return false;
                }else {
                    return true;
                }

            }
        }, customError);

$.validator.addMethod("loggedemail", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if(!$('.signintomyaccountbutton').is(':visible')) {
            var vIndex = value.length;
            var fchar = value.substring(0, 1);
            var lchar = value.substring(vIndex - 1);
           if(value.indexOf('@') != -1) {
                var splitval = value.split('@');
                fchar = splitval[0].substring(0, 1);
                lchar = splitval[0].substring(splitval[0].length - 1);
            }
            var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);
            var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
            var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            var email_val = $(element).closest('.formfield').prev('.formfield').find('.guestemail').val();
           if((fchar_s == false) || (lchar_s == false)) {
                customErrormsg = "Something doesn't look right, please try again.";
                return false;
            }
           else if(email_check == false) {
                customErrormsg = "Oops - the email entered is not in a valid format.";
                return false;
            }
            else {
                return true;
            }

        }
    }, customError);

$.validator.addMethod("accemailcon", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if(!$('.createanaccountbutton').is(':visible')) {
                var vIndex = value.length;
                var fchar = value.substring(0, 1);
                var lchar = value.substring(vIndex - 1);
               if(value.indexOf('@') != -1) {
                    var splitval = value.split('@');
                    fchar = splitval[0].substring(0, 1);
                    lchar = splitval[0].substring(splitval[0].length - 1);
                }
                var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);
                var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
                var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
                var email_val = $(element).closest('.formfield').prev('.formfield').find('.accemail').val();
               if((fchar_s == false) || (lchar_s == false)) { customErrormsg = "Something doesn't look right, please try again.";
                    return false;
                }else if(email_check == false) { customErrormsg = "Oops - the email entered is not in a valid format.";
                    return false;
                }else if(email_val != value) {customErrormsg = "Please make sure emails match.";
                    return false;
                }else {  return true; }
            }
}, customError);

$.validator.addMethod("a-zA-Z0-9", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if(!$('.createanaccountbutton').is(':visible')) {
                var vIndex = value.length;
                var fchar = value.substring(0, 1);
                var lchar = value.substring(vIndex - 1);
               if(value.indexOf('@') != -1) {
                    var splitval = value.split('@');
                    fchar = splitval[0].substring(0, 1);
                    lchar = splitval[0].substring(splitval[0].length - 1);
                }

                var fchar_s = /^[a-zA-Z]$/.test(fchar);
                var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
                var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
                var email_val = $(element).closest('.formfield').prev('.formfield').find('.email').val();

               if((fchar_s == false) || (lchar_s == false)) {customErrormsg = "Something doesn't look right, please try again.";
                    return false;
                }else if(email_check == false) {
                		customErrormsg = "Oops - the email entered is not in a valid format.";
                    return false;
                } else {  return true; }
            }
}, customError);



$.validator.addMethod("cm_password", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if(!$('.createanaccountbutton').is(':visible') && $(element).hasClass('required')) {
    	var password_val = $('.c_password').val();
    	if($(element).closest('form').length > 0 && $(element).closest('form').attr('id') == "RegistrationForm"){
    		password_val = $(element).closest('form').find('.c_password').val();
        }

        if(value.length < 5){
        	customErrormsg = "Passwords must contain a minimum of 5 characters and are CaSe SeNsItIvE.";
        	return false;
        }else if(password_val != value) {
        	customErrormsg = "Oops - your passwords do not match.";
            return false;
        }else{
        	return true;
        }
    }else {
        return true;
    }
}, customError);

$.validator.addMethod("confirm_password", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if($(element).hasClass('required')) {
        var password_val = $(element).closest('form').find('.c_password').val();
        if(value.length < 5){
        	customErrormsg = "Passwords must contain a minimum of 5 characters and are CaSe SeNsItIvE.";
        	return false;
        }else if(password_val != value) {
        	customErrormsg = "Oops - your passwords do not match.";
            return false;
        }else{
        	return true;
        }
    }else {
        return true;
    }
}, customError);

$.validator.addMethod("c_password", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if($(element).hasClass('required') && (value.length < 5)) {
        	customErrormsg = "Passwords must contain a minimum of 5 characters and are CaSe SeNsItIvE.";
        	return false;
    }else {
        return true;
    }
}, customError);

$.validator.addMethod("login_password", function (value, element) {
	if($(element).hasClass('stopKeypress')){
		return true;
	}else if($(element).hasClass('required') && (value.length < 5)) {
        	customErrormsg = "Passwords must contain a minimum of 5 characters and are CaSe SeNsItIvE.";
        	return false;
    }else {
        return true;
    }
}, customError);

$.validator.addMethod("resetemail", function (value, element) {
	var vIndex = value.length;
    var fchar = value.substring(0, 1);
    var lchar = value.substring(vIndex - 1);

    if($(element).hasClass('stopKeypress')){
		return true;
	}else{
		 if(value.indexOf('@') != -1) {
                var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
            }
            var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
            var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
           if((fchar_s == false) || (lchar_s == false)) {customErrormsg = "Something doesn't look right, please try again.";
                return false;
            }else if(email_check == false) {customErrormsg = "Oops - the email entered is not in a valid format.";

                return false;
            } else {  return true; }
	}
}, customError);


$.validator.addMethod("accountemail", function (value, element) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if($(element).hasClass('stopKeypress')){
			return true;
		}else{
			if(value.indexOf('@') != -1) {
                var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
            }
            var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
            var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
           if((fchar_s == false) || (lchar_s == false)) {customErrormsg = "Something doesn't look right, please try again.";
                return false;
            }else if(email_check == false) {customErrormsg = "Oops - the email entered is not in a valid format.";
                return false;
            } else {  return true; }
		}

	}, customError);

//email validation for vipinsider

$.validator.addMethod("vipinsideremail", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
       if(value.indexOf('@') != -1) {
            var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
        var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
       if((fchar_s == false) || (lchar_s == false)) {customErrormsg = "-Something doesn't look right, please try again.";
            return false;
        }else if(email_check == false) {customErrormsg = "Oops - the email entered is not in a valid format.";
            return false;
        } else {  return true; }
		}
}, customError);

$.validator.addMethod("emailfooter", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
        var vIndex = value.length;
        if(vIndex>0){
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
        var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        if ((fchar_s == false) || (lchar_s == false)) {customErrormsg = "Something doesn't look right, please try again.";
            return false;
        } else if (email_check == false) {customErrormsg = "Oops - the email entered is not in a valid format.";
            return false;
        } else {  return true; }
        }
        else{customErrormsg ="Please enter your email address.";

        }
		}
}, customError);

$.validator.addMethod("accountemailconf", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
       if(value.indexOf('@') != -1) {
            var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
        var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        var email_val = $('.accountemail').val();
        if($(element).closest('form').length > 0 && $(element).closest('form').attr('id') == "RegistrationForm"){
        	email_val = $(element).closest('form').find('.accountemail').val();
        }
       if((fchar_s == false) || (lchar_s == false)) { customErrormsg = "Something doesn't look right, please try again.";
            return false;
        }else if(email_check == false) { customErrormsg = "Oops - the email entered is not in a valid format.";
            return false;
        }else if(email_val != value) {customErrormsg = "Please make sure emails match.";
            return false;
        }else {  return true; }
		}
}, customError);

$.validator.addMethod("accountEmailConfirmation", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
       if(value.indexOf('@') != -1) {
            var splitval = value.split('@'); fchar = splitval[0].substring(0, 1);  lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fchar_s = /^[a-zA-Z0-9]$/.test(fchar);  var lchar_s = /^[a-zA-Z0-9]$/.test(lchar);
        var email_check = /^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        var email_val = $(element).closest('form').find('.accountemail').val();
       if((fchar_s == false) || (lchar_s == false)) { customErrormsg = "Something doesn't look right, please try again.";
            return false;
        }else if(email_check == false) { customErrormsg = "Oops - the email entered is not in a valid format.";
            return false;
        }else if(email_val != value) {customErrormsg = "Please make sure emails match.";
            return false;
        }else {  return true; }
		}
}, customError);
/**
 * Add positive number validation method to $ validation
 * plugin. Text fields must have 'positivenumber' css class to be
 * validated as positivenumber it validates a number and throws
 * error if it is below 0 or if it is not a number.
 */
$.validator.addMethod("positivenumber", function (value,
    element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
   if(value == '')
        return true;
    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value) && Number(value) >= 0;
		}
}, ""); // "" should be replaced with error message if needed


$.validator.addMethod("monthselect", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
    	var d = new Date(),
        mth = d.getMonth() + 1,
        yy = d.getFullYear();
    	var selectedMth = $(".custom-select select[id$='_expiration_month']").val();

        var selectedyear = $(".custom-select select[id$='_expiration_year']").val();


			if(selectedyear){
				selectedyear = selectedyear.replace(',','');
				if((selectedyear <= yy) && (selectedMth < mth)){
					  return false;
				}else{
					return true;
				}
			}
		}
    }, "");

$.validator.addMethod("yearselect", function (value, element) {
	 if($(element).hasClass('stopKeypress')){
			return true;
		}else{
    	var d = new Date(),
        mth = d.getMonth() + 1,
        yy = d.getFullYear();
    	var selectedMth = $(".custom-select select[id$='_expiration_month']").val();

        var selectedyear = $(".custom-select select[id$='_expiration_year']").val();


			if(selectedyear){
				selectedyear = selectedyear.replace(',','');
				if((selectedyear <= yy) && (selectedMth < mth)){
					return false;
				}else{
					return true;
				}
			}
		}
    }, "");

// register form validator for form elements
// except for those which are marked "suppress"
$.each($("form:not(.suppress)"), function () {
    $(this).validate(settings);
});
/**
 * @function
 * @description Validates a given phone number against the countries phone regex
 * @param {String} value The phone number which will be validated
 * @param {String} el The input field
 */
/*var validatePhone = function (value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.phone[country.val().toLowerCase()]) {
        return true;
    }

    var rgx = regex.phone[country.val().toLowerCase()];
    var isOptional = this.optional(el);
    var isValid = rgx.test($.trim(value));

    return isOptional || isValid;
};*/

/**
 * @function
 * @description Validates that a credit card owner is not a Credit card number
 * @param {String} value The owner field which will be validated
 * @param {String} el The input field
 */
/*var validateOwner = function (value) {
    var isValid = regex.notCC.test($.trim(value));
    return isValid;
};
*/
/**
 * Add phone validation method to $ validation plugin.
 * Text fields must have 'phone' css class to be validated as phone
 */
/*$.validator.addMethod('phone', validatePhone, Resources.INVALID_PHONE);*/

/**
 * Add CCOwner validation method to $ validation plugin.
 * Text fields must have 'owner' css class to be validated as not a credit card
 */
/*$.validator.addMethod('owner', validateOwner, Resources.INVALID_OWNER);*/

/**
 * Add gift cert amount validation method to $ validation plugin.
 * Text fields must have 'gift-cert-amont' css class to be validated
 */
$.validator.addMethod('gift-cert-amount', function (value, el) {
    var isOptional = this.optional(el);
    var isValid = (!isNaN(value)) && (parseFloat(value) >= 5) && (parseFloat(value) <= 5000);
    return isOptional || isValid;
}, Resources.GIFT_CERT_AMOUNT_INVALID);

/**
 * Add positive number validation method to $ validation plugin.
 * Text fields must have 'positivenumber' css class to be validated as positivenumber
 */
/*$.validator.addMethod('positivenumber', function (value) {
    if ($.trim(value).length === 0) { return true; }
    return (!isNaN(value) && Number(value) >= 0);
}, ''); // '' should be replaced with error message if needed
*/
/*Start JIRA PREV-77 : Zip code validation is not happening with respect to the State/Country.*/
/*function validateZip(value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.postal[country.val().toLowerCase()]) {
        return true;
    }
    var isOptional = this.optional(el);
    var isValid = regex.postal[country.val().toLowerCase()].test($.trim(value));
    return isOptional || isValid;
}
$.validator.addMethod('postal', validateZip, Resources.INVALID_ZIP);*/
/*End JIRA PREV-77*/

$.extend($.validator.messages, {
    //required: Resources.VALIDATE_REQUIRED,
    remote: Resources.VALIDATE_REMOTE,
    email: Resources.VALIDATE_EMAIL,
    url: Resources.VALIDATE_URL,
    date: Resources.VALIDATE_DATE,
    dateISO: Resources.VALIDATE_DATEISO,
    number: Resources.VALIDATE_NUMBER,
    digits: Resources.VALIDATE_DIGITS,
    creditcard: Resources.VALIDATE_CREDITCARD,
    equalTo: Resources.VALIDATE_EQUALTO,
    maxlength: $.validator.format(Resources.VALIDATE_MAXLENGTH),
    minlength: $.validator.format(Resources.VALIDATE_MINLENGTH),
    rangelength: $.validator.format(Resources.VALIDATE_RANGELENGTH),
    range: $.validator.format(Resources.VALIDATE_RANGE),
    max: $.validator.format(Resources.VALIDATE_MAX),
    min: $.validator.format(Resources.VALIDATE_MIN)
});

var validator = {
    regex: regex,
    settings: settings,
    init: function () {
        var self = this;
        $('form:not(.suppress)').each(function () {
            $(this).validate(self.settings);
        });
        validator.phoneValidation();
        validator.zipFormatter();
    },
    initForm: function (f) {
        $(f).validate(this.settings);
    },
    phoneValidation: function() {
        // phone validation
    	var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    	var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
		if (is_firefox || is_explorer) {
			$("input[name$='phone']").bind('keyup keydown', function (e) {
	    		if (e.shiftKey || e.ctrlKey || e.altKey) {
	    			e.preventDefault();
	    		} else {
	    			var key = e.keyCode;
	    			if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
	    				e.preventDefault();
	    			}
	    		}
	    		var curchr = $(this).val().length;
	    		var curval = $(this).val();

	    		 var curval1 = curval.replace(/[A-Za-z` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	    		 var str1 = curval1.substring(0, 3);
	    		 var str2 = curval1.substring(3, 6);
	    		 var str3 = curval1.substring(6, 10);

	    		 if(curval.indexOf('(') == -1 && curval.indexOf(')') == -1 && curval1.length == 3){
	    			 $(this).val( "(" + str1 + ") ");
	    		 }else if(curval.indexOf('(') != -1 && curval.indexOf(')') == -1  && curval1.length == 4){
	    			 $(this).val( "(" + str1 + ") "+str2);
	    		}else if(curval.indexOf('(') != -1 && curval.indexOf(')') != -1  && curval.indexOf(' ') == -1 && curval1.length == 6){
	    			 $(this).val( "(" + str1 + ") " + str2);
	    		 }else if(curval.indexOf('(') != -1 && curval.indexOf(')') != -1  && curval.indexOf(' ') != -1 && curval.indexOf('-') == -1 && curval1.length > 6){
	    			 $(this).val( "(" + str1 + ") " + str2 + "-" + str3);
	    		 }
	    		 if(curval.length == 0){
	    			  $(this).val('');
	    		 }
	    	});
		}
		else {
			$("body").on('change input keyup',"input[name$='phone']", function (e) {
	    		var curchr = $(this).val().length;
	    		$(this).val(this.value.replace(/[^\d]/g, ''));
	    		var curval = $(this).val();

	    		 var curval1 = curval;
	    		 var str1 = curval1.substring(0, 3);
	    		 var str2 = curval1.substring(3, 6);
	    		 var str3 = curval1.substring(6, 10);
				var key = event.which || event.keyCode || event.charCode;

				 if(key == 8 || e.shiftKey || e.ctrlKey || e.altKey) {
					e.preventDefault();
					if(curval1.length == 4 || curval1.length == 5 || curval1.length == 6){
						 $(this).val( "(" + str1 + ") "+str2);
					}
					else if(curval1.length > 6){
			   			 $(this).val( "(" + str1 + ") " + str2 + "-" + str3);
			   		 }
				 }
				 else {
					 if(curval1.length == 3){
						 $(this).val( "(" + str1 + ") ");
					 }else if(curval1.length == 4 || curval1.length == 5 || curval1.length == 6){
						 $(this).val( "(" + str1 + ") "+str2);
					}else if(curval1.length > 6){
						 $(this).val( "(" + str1 + ") " + str2 + "-" + str3);
					 }
					 if(curval.length == 0){
						  $(this).val('');
					 }
				 }
	    	});
		}


       /* $("input[name$='phone']").blur(function (e) {
        	$(this).val(this.value.replace(/[A-Za-z` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
        		var curval = $(this).val();
        		var str1 = curval.substring(0, 3);
        		var str2 = curval.substring(3, 6);
        		var str3 = curval.substring(6, 10);
        		if(curval.length <= 3 && curval.length > 0){
        			$(this).val( "(" + str1 + ") ");
    			}
        		else  if(curval.length <= 6 && curval.length > 3){
        			$(this).val( "(" + str1 + ") " + str2 );
        		}
    			else  if(curval.length <= 10 && curval.length > 6){
    				$(this).val( "(" + str1 + ") " + str2 + "-" + str3);
    			}
        });*/

    },
    zipFormatter: function() {
    	$("body").on('change input',"input[name$='postal'], input[name$='zip']", function (e) {
        		$(this).val(this.value.replace(/[^\d]/g, ''));
        		var curval = $(this).val();
    			if(curval.length > 5){
    				 $(this).val(curval.substring(0, 5) + '-' + curval.substring(5, 9));
        		 }
    	});
    }
};
module.exports = validator;

},{}],50:[function(require,module,exports){
/*!
 * imagesLoaded v3.2.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) == '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options, onAlways );
    }
    // use elem as selector string
    if ( typeof elem == 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options == 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0; i < this.elements.length; i++ ) {
      var elem = this.elements[i];
      this.addElementImages( elem );
    }
  };

  /**
   * @param {Node} element
   */
  ImagesLoaded.prototype.addElementImages = function( elem ) {
    // filter siblings
    if ( elem.nodeName == 'IMG' ) {
      this.addImage( elem );
    }
    // get background image on element
    if ( this.options.background === true ) {
      this.addElementBackgroundImages( elem );
    }

    // find children
    // no non-element nodes, #143
    var nodeType = elem.nodeType;
    if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
      return;
    }
    var childImgs = elem.querySelectorAll('img');
    // concat childElems to filterFound array
    for ( var i=0; i < childImgs.length; i++ ) {
      var img = childImgs[i];
      this.addImage( img );
    }

    // get child background images
    if ( typeof this.options.background == 'string' ) {
      var children = elem.querySelectorAll( this.options.background );
      for ( i=0; i < children.length; i++ ) {
        var child = children[i];
        this.addElementBackgroundImages( child );
      }
    }
  };

  var elementNodeTypes = {
    1: true,
    9: true,
    11: true
  };

  ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
    var style = getStyle( elem );
    // get url inside url("...")
    var reURL = /url\(['"]*([^'"\)]+)['"]*\)/gi;
    var matches = reURL.exec( style.backgroundImage );
    while ( matches !== null ) {
      var url = matches && matches[1];
      if ( url ) {
        this.addBackground( url, elem );
      }
      matches = reURL.exec( style.backgroundImage );
    }
  };

  // IE8
  var getStyle = window.getComputedStyle || function( elem ) {
    return elem.currentStyle;
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.addBackground = function( url, elem ) {
    var background = new Background( url, elem );
    this.images.push( background );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    this.progressedCount = 0;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !this.images.length ) {
      this.complete();
      return;
    }

    function onProgress( image, elem, message ) {
      // HACK - Chrome triggers event before object properties have changed. #83
      setTimeout( function() {
        _this.progress( image, elem, message );
      });
    }

    for ( var i=0; i < this.images.length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.once( 'progress', onProgress );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image, elem, message ) {
    this.progressedCount++;
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // progress event
    this.emit( 'progress', this, image, elem );
    if ( this.jqDeferred && this.jqDeferred.notify ) {
      this.jqDeferred.notify( this, image );
    }
    // check if completed
    if ( this.progressedCount == this.images.length ) {
      this.complete();
    }

    if ( this.options.debug && console ) {
      console.log( 'progress: ' + message, image, elem );
    }
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    this.emit( eventName, this );
    this.emit( 'always', this );
    if ( this.jqDeferred ) {
      var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
      this.jqDeferred[ jqMethod ]( this );
    }
  };

  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    var isComplete = this.getIsImageComplete();
    if ( isComplete ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    this.proxyImage = new Image();
    eventie.bind( this.proxyImage, 'load', this );
    eventie.bind( this.proxyImage, 'error', this );
    // bind to image as well for Firefox. #191
    eventie.bind( this.img, 'load', this );
    eventie.bind( this.img, 'error', this );
    this.proxyImage.src = this.img.src;
  };

  LoadingImage.prototype.getIsImageComplete = function() {
    return this.img.complete && this.img.naturalWidth !== undefined;
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'progress', this, this.img, message );
  };

  // ----- events ----- //

  // trigger specified handler for event type
  LoadingImage.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  LoadingImage.prototype.onload = function() {
    this.confirm( true, 'onload' );
    this.unbindEvents();
  };

  LoadingImage.prototype.onerror = function() {
    this.confirm( false, 'onerror' );
    this.unbindEvents();
  };

  LoadingImage.prototype.unbindEvents = function() {
    eventie.unbind( this.proxyImage, 'load', this );
    eventie.unbind( this.proxyImage, 'error', this );
    eventie.unbind( this.img, 'load', this );
    eventie.unbind( this.img, 'error', this );
  };

  // -------------------------- Background -------------------------- //

  function Background( url, element ) {
    this.url = url;
    this.element = element;
    this.img = new Image();
  }

  // inherit LoadingImage prototype
  Background.prototype = new LoadingImage();

  Background.prototype.check = function() {
    eventie.bind( this.img, 'load', this );
    eventie.bind( this.img, 'error', this );
    this.img.src = this.url;
    // check if image is already complete
    var isComplete = this.getIsImageComplete();
    if ( isComplete ) {
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      this.unbindEvents();
    }
  };

  Background.prototype.unbindEvents = function() {
    eventie.unbind( this.img, 'load', this );
    eventie.unbind( this.img, 'error', this );
  };

  Background.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'progress', this, this.element, message );
  };

  // -------------------------- jQuery -------------------------- //

  ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
    jQuery = jQuery || window.jQuery;
    if ( !jQuery ) {
      return;
    }
    // set local variable
    $ = jQuery;
    // $().imagesLoaded()
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  };
  // try making plugin
  ImagesLoaded.makeJQueryPlugin();

  // --------------------------  -------------------------- //

  return ImagesLoaded;

});

},{"eventie":51,"wolfy87-eventemitter":52}],51:[function(require,module,exports){
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

},{}],52:[function(require,module,exports){
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);
                i = listeners.length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

},{}],53:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the `lodash` wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],54:[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":59}],55:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._45 = 0;
  this._81 = 0;
  this._65 = null;
  this._54 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._10 = null;
Promise._97 = null;
Promise._61 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._81 === 3) {
    self = self._65;
  }
  if (Promise._10) {
    Promise._10(self);
  }
  if (self._81 === 0) {
    if (self._45 === 0) {
      self._45 = 1;
      self._54 = deferred;
      return;
    }
    if (self._45 === 1) {
      self._45 = 2;
      self._54 = [self._54, deferred];
      return;
    }
    self._54.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._81 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._81 === 1) {
        resolve(deferred.promise, self._65);
      } else {
        reject(deferred.promise, self._65);
      }
      return;
    }
    var ret = tryCallOne(cb, self._65);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._81 = 3;
      self._65 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._81 = 1;
  self._65 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._81 = 2;
  self._65 = newValue;
  if (Promise._97) {
    Promise._97(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._45 === 1) {
    handle(self, self._54);
    self._54 = null;
  }
  if (self._45 === 2) {
    for (var i = 0; i < self._54.length; i++) {
      handle(self, self._54[i]);
    }
    self._54 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":63}],56:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":55}],57:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._81 = 1;
  p._65 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._81 === 3) {
            val = val._65;
          }
          if (val._81 === 1) return res(i, val._65);
          if (val._81 === 2) reject(val._65);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":55}],58:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":55}],59:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":55,"./done.js":56,"./es6-extensions.js":57,"./finally.js":58,"./node-extensions.js":60,"./synchronous.js":61}],60:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
}

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',

    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
}

},{"./core.js":55,"asap":62}],61:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._81 === 3) {
      return this._65.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._65;
  };

  Promise.prototype.getReason = function () {
    if (this._81 === 3) {
      return this._65.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._65;
  };

  Promise.prototype.getState = function () {
    if (this._81 === 3) {
      return this._65.getState();
    }
    if (this._81 === -1 || this._81 === -2) {
      return 0;
    }

    return this._81;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};

},{"./core.js":55}],62:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":63}],63:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3]);
