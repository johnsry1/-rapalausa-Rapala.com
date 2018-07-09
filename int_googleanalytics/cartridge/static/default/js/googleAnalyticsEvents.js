(function(app) {
	var chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var safari = navigator.userAgent.indexOf("Safari") > -1;
	if ((chrome)&&(safari)) {safari=false;}
	
    googleAnalyticsEvents = {


        // Event tracking for AddProduct to Cart
        addProduct: function(productId) {
            var isQV = $('.add-to-cart').attr('data-isquickview');
            var isQVS = $('.add-all-to-cart').attr('data-isquickview');
            ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_ADDPRODUCT, productId, 1);
            if (isQV == 'true' || isQVS == 'true')
                ga('send', 'event', 'CART', 'ADD ITEM', productId, 1);
            else
                ga('send', 'event', 'CART', 'ADD ITEM', productId, 1);
            
            //RPS-268
            console.log(Urls.isLoggedInCustomer)
            var dialog = window.dialog;
            $.ajax({
            	url: Urls.isLoggedInCustomer,
            	success: function(data){
            		if(data.isAuthenciated){
            			//set timer if the customer is authenticated
        				setTimeout(function(){
        					$.ajax({
        						url: Urls.isLoggedInCustomer,
        						success: function(data){
        							if(!data.isAuthenciated){
        								//open dialog if the customer is logged out
        								dialog.open({
        	        						html: Resources.SESSION_EXPIRED_POPUP,
        	        						options: {
        	        							width: 280,
        	        							height: 250
        	        						},
        	        						callback: function(){
        	        							$('.session-timeout-login-redirect').on('click', function(){
        	        								window.location.replace(Urls.accountShow);
        	        							})
        	        						}
        	        					})
        							}
        						}
        					});
        				}, window.Scripts.sessionExpireThreshold);
            		}
            	}
            })

        },
        //Event tracking for Brand Switch
        brandSwitch: function(brand){
        	 ga('send', 'event', Resources.GA_CATEGORY_BRAND, 'Click', brand, 1);
        },
        // Event tracking for AddProductSet to Cart
        addProductSet: function() {

            var isQV = $('.add-all-to-cart').attr('data-isquickview');
            var productSetId = $('.product-number').children('span').text();
            ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_ADDALLPRODUCT, productSetId, 1);
            if (isQV == 'true')
                ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_ADDALLPRODUCTQV, productSetId, 1);
            else
                ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_ADDALLPRODUCTPV, productSetId, 1);
        },

        // Event tracking for Update Cart
        updateCart: function() {
            $('#update-cart').on("click", function(e) {
                if (safari) {
                    e.preventDefault();
                    var formelement = $(this).closest('form');
                    ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_UPDATEPRODUCT, '', 1);
                    setTimeout(function() {
                        formelement.submit();
                    }, 500);
                } else
                    ga('send', 'event', Resources.GA_CATEGORY_CART, Resources.GA_ACTION_UPDATEPRODUCT, '', 1);
            });
        },

        //Event tracking for Remove Product from Cart
        removeProduct: function() {
            $('.button-text[value="Remove"]').bind("mousedown", function(e) {
                var productId = $(this).parent().find("input.gaproductid").val();
                var quantity = $(this).parents('.item-user-actions').parent().find('input').val();
                ga('send', 'event', 'CART', 'DELETE ITEM', productId, quantity);
            });
        },
        deleteProduct: function(productId, quantity) {
            $('.button-text[value="Remove"]').bind("mousedown", function(e) {
               // var productId = $(this).parents(".item-quantity-details").prevAll(".item-details").find(".sku span.value").text()
                //var quantity = $(this).parents('.item-quantity-details').prev().children("input").val();
                ga('send', 'event', 'CART', 'DELETE ITEM', productId, quantity);
            });
        },

        // Event tracking for quickView of Product
        quickView: function() {
            var productId = $('.product-number span').text();
            ga('send', 'event', Resources.GA_ACTION_QUICKVIEW, Resources.GA_CATEGORY_QUICKVIEW, productId, 1);

        },

        // Event tracking for open of MiniCart
        miniCart: function() {
            ga('send', 'event', Resources.GA_CATEGORY_MINICART, Resources.GA_ACTION_MINICART, '', 1);
        },

        //Event Tracking for Pagination
        pagination: function(category, action, page) {
            ga('send', 'event', category, action, page, 1);
        },

        //Event Tracking for Login
        login: function(category, login, userid) {
            ga('send', 'event', category, login, userid, 1);
        },
      //Event Tracking for Login
        loginCustomer: function() {
            ga('send', 'event', 'USER', 'SIGN IN', 'LOGIN', 1);
        },

        //Event Tracking for Search
        logout: function() {
            $(".logout").on("click", function(e) {
                email = $(this).attr('user');
                if (safari) {
                    e.preventDefault();
                    $(".logout").unbind("click");
                    ga('send', 'event', Resources.GA_CATEGORY_USER, Resources.GA_ACTION_LOGOUT, email, 1);
                    setTimeout(function() {
                        $(".logout").click();
                    }, 500);
                } else
                    ga('send', 'event', Resources.GA_CATEGORY_USER, Resources.GA_ACTION_LOGOUT, email, 1);
            });
        },

        //Event Tracking for PDP VIEW
        pdpView: function(pid) {
            ga('send', 'event', 'PDP VIEW', 'PRODUCT', pid, 1);
        },

        //Event Tracking for Add Promotion
        addPromotion: function(coupon, data, page) {
            if (page == "BILLING") {
                if (data.status == 'OK') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'VALID COUPON-BILLING', data.promotionId);
                    if (data.qualified == true)
                        ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'QUALIFIED COUPON-BILLING', data.promotionId);
                    else
                        ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'NON-QUALIFIED COUPON-BILLING', data.promotionId);
                } else if (data.status == 'COUPON_CODE_UNKNOWN') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'INVALID COUPON-BILLING', coupon);
                } else if (data.status == 'NO_ACTIVE_PROMOTION') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'EXPIRED COUPON-BILLING', coupon);
                }
            } else {
                if (data.status == 'OK') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'VALID COUPON-CART', data.promotionId);
                    if (data.qualified == true)
                        ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'QUALIFIED COUPON-CART', data.promotionId);
                    else
                        ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'NON-QUALIFIED COUPON-CART', data.promotionId);
                    if (safari) {
                        setTimeout(function() {
                            location.reload();
                        }, 200);
                    } else
                        location.reload();
                } else if (data.status == 'COUPON_CODE_UNKNOWN') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'INVALID COUPON-CART', coupon);
                } else if (data.status == 'NO_ACTIVE_PROMOTION') {
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, 'EXPIRED COUPON-CART', coupon);
                }
            }
        },

        //Event Tracking for Remove Promotion
        removePromotion: function() {
            $(".rowcoupons .textbutton").on("click", function(e) {
                var couponId = $(this).parent().prevAll('.item-details').find('.cartcoupon .value').text();
                if (safari) {
                    e.preventDefault();
                    $(".rowcoupons .textbutton").unbind("click");
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, Resources.GA_ACTION_REMOVEPROMOTION, couponId, 1);
                    setTimeout(function() {
                        $(".rowcoupons .textbutton").click();
                    }, 500);
                } else
                    ga('send', 'event', Resources.GA_CATEGORY_PROMOTION, Resources.GA_ACTION_REMOVEPROMOTION, couponId, 1);
            });
        },

        //Event Tracking for searchHits
        searchHits: function(result, searchterm, term) {
            var test = window.location;
            if (term != "Enter Keyword or Item #" && test.toString().search("&") < 0)
                ga('send', 'event', 'SEARCH RESULTS', result, searchterm, 1);
        },

        // Event tracking for open of MiniCart
        navigation: function() {
            $(".menu-category > li > a").on("click", function(e) {
                var c_name = $(this).text();
                if (safari) {
                    e.preventDefault();
                    c_href = $(this).attr('href');
                    ga('send', 'event', Resources.GA_CATEGORY_NAVIGATION, Resources.GA_ACTION_CATEGORY, c_name, 1);
                    setTimeout(function() {
                        document.location.href = c_href;
                    }, 500);
                } else
                    ga('send', 'event', Resources.GA_CATEGORY_NAVIGATION, Resources.GA_ACTION_CATEGORY, c_name, 1);
            });

        },

        // Add Coupon Ajax Call In Cart page
        cartCouponAjax: function() {
            var addCoupon = $(".cart-coupon-code #add-coupon");
            var couponcode = $("form input[name$='_couponCode']");
            addCoupon.on("click", function(e) {
                e.preventDefault();
                var cartform = $("form#cart-items-form");
                couponcode = couponcode || cartform.find("input[name$='_couponCode']");
                var redemption = redemption || cartform.find("div.redemption.coupon");
                var val = couponcode.val();
                if (val.length === 0) {
                	redemption.html('');
                    var error = redemption.find("span.error");
                    if (error.length === 0) {
                        error = $("<span>").addClass("error").appendTo(redemption);
                    }
                    error.html(Resources.COUPON_CODE_MISSING);
                    return;
                }
                redemption.find("span.error").html('');
                var url = Urls.addCoupon+'?couponCode='+val+'&format=ajax';
                $.getJSON(url, function(data) {
                    var fail = false;
                    var msg = "";
                    googleAnalyticsEvents.addPromotion(val, data, 'CART');
                    if (!data) {
                        msg = Resources.BAD_RESPONSE;
                        fail = true;
                    } else if (!data.success) {
                        msg = data.message;
                        msg = msg.split('<').join('&lt;');
                        msg = msg.split('>').join('&gt;');
                        fail = true;
                    }
                    if (fail) {
                        var error = redemption.find("span.error");
                        if (error.length === 0) {
                            $("<span>").addClass("error").appendTo(redemption);
                        }
                        redemption.html(msg);
                        return;
                    }

                    redemption.html(data.message);
                });
            });
        },
        productDetails: function(category, tabvalue, productid){
        	ga('send', 'event', category, tabvalue, productid, 1);
        },
        filterSelect: function(refinement){
        	ga('send', 'event', 'PRODUCT', 'FILTER', refinement, 1);
        },
        cjValuesToGa: function(cjVar, cjVal){
        	ga('send', 'event', cjVar, cjVal,'', 1,{
        		nonInteraction: true
        	});
        },
        orderConfirm: function(confirmid){
        	 ga('send', 'event', 'ORDER CONFIRMATION', 'ORDER', confirmid, 1);
        }
    }

    $(document).ready(function() {
        googleAnalyticsEvents.removeProduct();
        googleAnalyticsEvents.navigation();
        googleAnalyticsEvents.removePromotion();
        googleAnalyticsEvents.updateCart();
        googleAnalyticsEvents.logout();
        //googleAnalyticsEvents.cartCouponAjax();

    });
}(window.app = window.app || {}, jQuery));