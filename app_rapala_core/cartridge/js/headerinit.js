'use strict';

var //uievents = require('./uievents'),
    dialog = require('./dialog'),
    progress = require('./progress');

//var $con = $('body');
var appGlobal = {
    globalTimer: 0
};
var headerEvents = {
    initializeEvent: function () {
        $('body').find('input, select.input-select').focusin(function () {
            $(this).closest('.formfield').removeClass('inputlabel');
            $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
            $(this).removeClass('errorclient');
            $(this).closest('.formfield').find('.logerror , .existing_register').css('display', 'none');
        });
        if ($('.logincustomers').length > 0) {
            var crrobj = $(this).find('.formfield  .logerror');
            $(crrobj).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
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
        if ($('.account-logs').length > 0 || $('.new-register').length > 0 || $('.wish-logs').length > 0 || $('.createan-account').length > 0 || $('.headercustomerinfo').length > 0 || $('.ui-login').length > 0 || $('.passwordreset').length > 0) {
            $('.formactions button').click(function () {
                $('span.existing_register').hide();
                var crrobj = $(this).closest('form').find('.field-wrapper .required');
                $(crrobj).each(function () {
                    if ($(this).hasClass('errorclient')) {
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
        if ($('.account-logs').length > 0 || $('.new-register').length > 0 || $('.wish-logs').length > 0 || $('.createan-account').length > 0 || $('.headercustomerinfo').length > 0 || $('.ui-login').length > 0) {
            $('a.clearbutton').click(function () {
                $(this).closest('.formfield').find('input').val('');
                $(this).closest('.formfield').find('textarea').val('');
                $(this).closest('.field-wrapper').find('span').remove();
                $(this).closest('.field-wrapper').find('.required').removeClass('errorclient');
                $(this).closest('.formfield').find('a.clearbutton').hide();
                $(this).closest('.formfield ').find('.form-row').removeClass('inputlabel');
                $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
                $(this).closest('.formfield').find('span.logerror , .existing_register').hide();

            });
        }
        $('.ui-login .sign-up-blk > a').on('mouseenter click', function (e) {
            if ($(window).width() < 960) {
                return true;

            } else {
                if (e.type == 'click' && $('.accountcontent').is(':visible')) {
                    clearTimeout(appGlobal.globalTimer);
                    //appGlobal.globalTimer == 0;
                    $('.accountcontent').hide();
                    $('.headermask').hide();
                    $('.confirmationcontainer').hide();
                    return false;
                }
                if ($('.header-create').is(':visible')) {
                    return false;
                }
                $('.accountcontent').removeClass('js-entered');
                $('.accountcontent').hide();
                $('.sign-up-blk').addClass('js-active');
                if (!$(this).closest('.ui-login').find('.header-sign-in').is(':visible')) {
                    headerEvents.accountContPos($('.ui-login .sign-up-blk > a'), $(this).closest('.ui-login').find('.header-sign-in'));
                    $(this).closest('.ui-login').find('.header-sign-in').show();
                }
                $('.headermask').show();
                /*if(appGlobal.util.readCookie("emailId")){
                    $('.header-sign-in.accountcontent .guestemail').val(appGlobal.util.readCookie("emailId"));
                    $('.header-sign-in.accountcontent .login_password').removeAttr('placeholder').val('');
                }*/
                clearTimeout(appGlobal.globalTimer);
                //appGlobal.globalTimer == 0;
                appGlobal.globalTimer = setTimeout(function () {
                    $('.accountcontent').hide();
                    $('.headermask').hide();
                    $('.headercustomerinfo').find('.js-active').removeClass('js-active');
                }, 5000);
                $('.confirmationcontainer').hide();
            }

        });
        $('.signingin').click(function (e) {
            e.preventDefault();
            $('.accountcontent').hide();
            var validator = $(this).closest('form').validate();
            if (validator.element($(this).closest('form').find('.guestemail'))) {
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

        $('.sign-message a, .ExistedUser-error .createaccount').click(function (e) {
            e.preventDefault();
            $('.accountcontent').hide();
            $(this).closest('.ui-login').find('.header-create').show();
            var validator = $(this).closest('form').validate();
            if (validator.element($(this).closest('form').find('.guestemail'))) {
                $('.accountcontent .guestemail').val($(this).closest('.accountcontent').find('.guestemail').val());
                $('.accountcontent .guestemail').removeClass('error');
                $('.accountcontent .guestemail').next('span.error').remove();
                $('.accountcontent .guestemail').addClass('click-mark valid');
            }
            headerEvents.accountContPos($('.ui-login .sign-up-blk > a'), $(this).closest('.ui-login').find('.header-create'));
            $('.headermask').show();
            $('.PasswordFormat-error').hide();
            $('.ExistedUser-error').hide();
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
            appGlobal.globalTimer = setTimeout(function () {
                $('.accountcontent').hide();
                $('.headermask').hide();
                $('.headercustomerinfo').find('.js-active').removeClass('js-active');
            }, 5000);
        });

        $('.forgot-password a').click(function (e) {
            e.preventDefault();
            $('.accountcontent').hide();
            $('.header-forgot-pwd span.reset_email_error').hide();
            $(this).closest('.ui-login').find('.header-forgot-pwd').show();
            headerEvents.accountContPos($('.ui-login .sign-up-blk > a'), $(this).closest('.ui-login').find('.header-forgot-pwd'));
            $('.headermask').show();
            var validator = $(this).closest('form').validate({
                onkeyup: false
            });
            if (validator.element($(this).closest('form').find('.guestemail'))) {
                $('.accountcontent .guestemail').val($(this).closest('.accountcontent').find('.guestemail').val());
                $('.accountcontent .guestemail').removeClass('error');
                $('.accountcontent .guestemail').next('span.error').remove();
                $('.accountcontent .guestemail').addClass('click-mark valid');
            }
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
            appGlobal.globalTimer = setTimeout(function () {
                $('.accountcontent').hide();
                $('.headermask').hide();
                $('.headercustomerinfo').find('.js-active').removeClass('js-active');
            }, 5000);
        });

        $('.accountcontent').mouseenter(function () {
            $('.headermask').removeClass('no-hide');
            $('.headermask').show();
            $('.confirmationcontainer').hide();
            $('.sign-up-blk').addClass('js-active');
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
        });

        $('.headermask').click(function (e) {
            headerEvents.maskEvent(e);
        });

        $('.headermask').mouseenter(function (e) {
            headerEvents.maskEvent(e);
        });
        $('.accountcontent').mouseenter(function () {
            $('.headermask').removeClass('no-hide');
            $('.headermask').show();
            $('.confirmationcontainer').hide();
            $('.sign-up-blk').addClass('js-active');
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
        });
        $('.user-account').on('click', function (e) {
            e.preventDefault();
            $(this).parent('.user-info').toggleClass('active');
        });
        $('.change-regionnew').mouseenter(function () {
            $('.domainswitch-header').show();
            $('.headermask').show();
        });
        $('.change-region').mouseenter(function () {
            jQuery('.domainswitch').show();
            $('.region_overlay').show();
        });
        $('.region_overlay').mouseenter(function () {
            jQuery('.domainswitch').hide();
            $(this).hide();
        });
        $('button').on('click', function () {
            if ($('.resetpassword').is(':Visible')) {
                $('.resetpassword').closest('div.dialog-content').addClass('confirmationcontainer');
            }
        });
        $('.sample-section').click(function () {
            if (!$(this).find('.sample_mail_main').is(':visible')) {
                $(this).find('.sample_mail_main').slideDown(500);
            }
        });
        $('.signupfor-email .seesamples').click(function () {
            $(this).closest('.signupfor-email').find('.sample_mail_main').slideToggle(500);
        });

        $('body').click(function (event) {
            if (!$(event.target).is('.signupfor-email .seesamples') && (!$(event.target).is('.create_email_checkbox .seesamples'))) {
                $('.sample_mail_main').slideUp(500);
            }
        });
        /**This is used to get the tick mark for create account when the field is valid*/
        $('.ui-login input.required').blur(function () {
            if ($(this).hasClass('valid')) {
                $(this).addClass('click-mark');
            } else {
                $(this).removeClass('click-mark');
            }
        });

        $('.back-link, .signingin').click(function () {
            $('.accountcontent').hide();
            $(this).closest('.ui-login').find('.header-sign-in').show();
            $('.header-sign-in .signin_main .loginfail.errormessage').hide();
        });

        $('.forgot_create').click(function () {
            $('.header-forgot-pwd').hide();
            $('.header-create').show();
            $('.header-create .errormessage').hide();
        });

        $('.loggeduser a, .headercustomerinfo .second_name').on('mouseenter', function (e) {
            e.preventDefault();
            if ($('.rapala_device').length == 0) {
                $('.accountcontent').hide();
                headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'), $('.user-info'));
                $('.user-info').show();
            }
        });

        $('.rapala_device .loggeduser a,.headercustomerinfo .second_name').on('click', function (e) {
            e.preventDefault();
            $('.accountcontent').hide();
            headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'), $('.user-info'));
            $('.user-info').show();
            $('.headermask').show();
        });
        jQuery(window).bind('message', function (e) {
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
            if (str.process !== 'sign-in') {
                return;
            }

            if (str.status === 'success') {
                if (typeof str.email === 'string') {
                    headerEvents.userCookie(str.email);
                }
                document.location.reload(true);
            } else {
                $('.ExistedUser-error').hide();
                $('.PasswordFormat-error').hide();
                $('.custom_signin').find('.loading').remove();
                progress.hide();
                $('.custom_signin input[type="text"], .custom_signin input[type="password"]').addClass('errorclient');
                $('.loginfail').show();
                $('.accountcontent .loading').remove();
            }
        });
        jQuery('.signin-button').click(function (e) {
            e.preventDefault();
            var realForm = $(this).closest('form');
            if (!realForm.valid()) {
                return false;
            }
            $('.loginfail').hide();
            progress.show('.header-sign-in.accountcontent');
            var iframeId = 'js-header-signin-iframe';
            var formId = 'js-header-signin-form';
            $('#' + iframeId).remove();
            $('#' + formId).remove();
            var $form = $('<form></form>');
            $form.attr('id', formId);
            $form.attr('action', realForm.attr('action'));
            $form.attr('target', iframeId);
            $form.attr('method', 'POST');

            $('<iframe name="' + iframeId + '" id="' + iframeId + '" />').appendTo('body');
            $('#' + iframeId).attr('style', 'display: none;');

            realForm.find('input, select, textarea').each(function () {
                var $input = $(this).clone();
                $form.append($input);
            });

            $('body').append($form);
            $form.hide();
            $form.submit();
        });
        /*$(".PasswordResetForm").on("keyup",".guestemail",function(e){
                if(e.keyCode == 13) {
                    $('.lost_btn .send').trigger("click");
                }
            });*/
        $('.PasswordResetForm').unbind('submit').on('submit', function (e) {
            $('.header-forgot-pwd span.reset_email_error').hide();
            $('.lost_btn .send').addClass('clickedButton');
            e.preventDefault();
            var $form = $(this);
            if (!$form.valid()) {
                return false;
            }
            progress.show('.header-forgot-pwd.accountcontent');
            $.ajax({
                dataType: 'html',
                url: $form.attr('action'),
                data: $form.serialize(),
                success: function (data) {
                    if ($(data).find('div#messages.error').length > 0) {
                        progress.hide();
                        $('.header-forgot-pwd').show();
                        $('.header-forgot-pwd span.reset_email_error').show();
                        $('.accountcontent .loading').remove();

                    } else {
                        progress.hide();
                        $('.header-forgot-pwd').hide();
                        $('.confirmationcontainer').fadeIn(400);
                        //to display the messeage
                        headerEvents.initializeEvent();
                        headerEvents.accountContPos($('.ui-login .sign-up-blk > a'), $('.confirmationcontainer'));
                        $('.accountcontent .loading').remove();
                        $('.confirmationcontainer').find('.headermask').hide();
                        $('.confirmationcontainer').delay(4000).fadeOut();
                    }
                }
            });
            return false;
        });
        jQuery(window).bind('message', function (e) {
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
            if (str.process !== 'create-account') {
                return;
            }

            if (str.status === 'success') {
                if (typeof str.email === 'string') {
                    headerEvents.userCookie(str.email);
                }
                $.ajax({
                    dataType: 'html',
                    url: document.location.toString(),
                    success: function (data) {
                        progress.hide();
                        $('.headermask').removeClass('no-hide').hide();
                        $('.header-sign-in.accountcontent').remove();
                        $('.headercustomerinfo #user').html($(data).find('#user').html());
                        $('#userinfo').html($(data).find('#userinfo').html());
                        headerEvents.accountContPos($('.headercustomerinfo .loggeduser a'), $('.congrats-message.accountcontent'));
                        $('.congrats-message').fadeIn(400).show().delay(3000).fadeOut(400);
                        headerEvents.initializeEvent();
                    }
                });
            } else {
                $('.accountcontent').hide();
                progress.hide();
                if (str.passwordinvalidformat) {
                    $('.PasswordFormat-error').show();
                } else {
                    $('.ExistedUser-error').show();
                }
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

        jQuery('.create-account').unbind('click').click(function (e) {
            e.preventDefault();
            var realForm = $(this).closest('form');
            if (!realForm.valid()) {
                return false;
            }
            progress.show('.header-create.accountcontent');
            var iframeId = 'js-header-create-account-iframe';
            var formId = 'js-header-create-account-form';
            $('#' + iframeId).remove();
            $('#' + formId).remove();
            var $form = $('<form></form>');
            $form.attr('id', formId);
            $form.attr('action', realForm.attr('action'));
            $form.attr('target', iframeId);
            $form.attr('method', 'POST');

            $('<iframe name="' + iframeId + '" id="' + iframeId + '" />').appendTo('body');
            $('#' + iframeId).attr('style', 'display: none;');

            realForm.find('input, select, textarea').each(function () {
                var $input = $(this).clone();
                $form.append($input);
            });

            $('body').append($form);
            $form.hide();
            $form.submit();
        });

        if ($('#user').length > 0) {
            firstnamesplit();
        }

        function firstnamesplit() {
            var firstname = $('.loggeduser > a span.username').text();
            var firstnameWords = firstname.split(' ');
            var textlength = 0;
            var limit = 19;
            var nameLength = $('.loggeduser > a span.username').text() + ' ' + $.trim($('.loggeduser > a .prostaff-header.badge-header').text());
            if (nameLength.length <= 19) {
                $('.loggeduser > a span.username').text($('.loggeduser > a span.username').text() + ' ' + $.trim($('.loggeduser > a .prostaff-header.badge-header').text()));
                $('.loggeduser > a .prostaff-header.badge-header').remove();
            } else if (firstnameWords.length > 0) {
                $('.loggeduser > a span.username').text('');
                if ($('.loggeduser > a span.username .first_name').length == 0) {
                    $('.loggeduser > a span.username').html('<span class="first_name"></span>');
                }
                if ($('.headercustomerinfo .second_name').length == 0) {
                    $('.headercustomerinfo').append('<span class="second_name"></span>');
                }

                var fName = $('.loggeduser > a span.username span.first_name').eq(0);
                var Lname = $('.headercustomerinfo > .second_name');

                jQuery.each(firstnameWords, function (i, v) {
                    textlength = textlength == 0 ? textlength + v.length : textlength + v.length + 1;
                    if (i == 0 && v.length > limit) {
                        fName.text(v.substr(0, 16) + '...');
                    } else if (textlength < 20) {
                        if (fName.text().length == 0) {
                            fName.text(v);
                        } else {
                            fName.text(fName.text() + ' ' + v);
                        }
                    } else {
                        if (Lname.text().length == 0) {
                            Lname.text(v);
                        } else {
                            Lname.text(Lname.text() + ' ' + v);
                        }
                    }

                });
                Lname.text(Lname.text() + ' ' + $.trim($('.loggeduser > a .badge-mini').text()));
                if ($('#user .loggeduser').width() > Lname.width()) {
                    $('.loggeduser').append(Lname.clone());
                    Lname.remove();
                }
                $('.loggeduser > a .prostaff-header.badge-header').remove();
                $('.loggeduser > a .badge-mini').remove();
            } else {
                $('.loggeduser > a span.username span').hide();
            }
        }

        $('.accountcontent input[type="text"], .accountcontent input[type="password"]').bind('keyup', function (e) {
            var keycode = e.keyCode ? e.keyCode : e.which;
            if (!$(this).closest('.accountcontent').hasClass('js-entered')) {
                $(this).closest('.accountcontent').addClass('js-entered');
            }

            if (keycode == 13) {
                $(this).closest('form').find('.formactions button').trigger('click');
            }
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
        });

        $('.rapala_device .user-profile a').on('hover', function () {
            window.location.href = $(this).attr('href');
        });
    },
    /** ON HOVER */
    accountContPos: function ($source, $destiny) {
        var leftPos = $source.offset().left + $source.width() - $('.headercustomerinfo').offset().left - $destiny.width() / 2;
        var arrowPos = ($destiny.width() - $destiny.find('.top_arrow').width()) / 2 - 4;
        $('.accountcontent .loading').remove();
        if ($destiny.length != 0) {
            $destiny.css('left', leftPos);
            $destiny.find('.top_arrow').css('left', arrowPos);
        }
        $('.accountcontent .formfield .label .errorlabel').addClass('labeltext').removeClass('errorlabel');
    },
    userCookie: function () {
        var dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (365 * 24 * 60 * 60 * 1000));
        //document.cookie="emailId="+$val+"; expires="+dateObj.toUTCString()+"; path=/";
    },
    maskEvent: function (ele) {
        $('.domainswitch-header').hide();
        $('.domainswitch').hide();
        if (!$('.headermask').hasClass('no-hide')) {
            clearTimeout(appGlobal.globalTimer);
            //appGlobal.globalTimer == 0;
            if (ele.type != 'click' && $('.rapala_device').length == 0 && ele.pageY > 60 && ele.pageY < 100) {
                $('.headermask').hide();
            }
            if (ele.type == 'click') {
                $('.headermask').hide();
                $('.accountcontent').hide();
                $('.headercustomerinfo').find('.js-active').removeClass('js-active');
            } else {
                clearTimeout(appGlobal.globalTimer);
                //appGlobal.globalTimer == 0;
                if ($('.accountcontent:visible').hasClass('js-entered')) {
                    appGlobal.globalTimer = setTimeout(function () {
                        $('.accountcontent').hide();
                        $('.headermask').hide();
                    }, 5000);
                } else {
                    $('.accountcontent').hide();
                    $('.headermask').hide();
                }
            }
        }
    },
    userTimeout: function() {
        if ($('.loggeduser').length) {
            var timeOutObj;
            $(document).click(function(){
                if (typeof timeOutObj != undefined) {
                    clearTimeout(timeOutObj);
                    timeOutObj = setTimeout(function(){ 
                        sessionStorage.setItem('time', timeOutObj);
                        dialog.open({
                            url : Urls.sessionWarning,
                            options: {
                                width: 280,
                                height: 250
                            }
                        });
                    }, 1200000);
                    
                    timeOutObj = setTimeout(function(){ 
                        sessionStorage.setItem('time', timeOutObj);
                        dialog.open({
                            url : Urls.sessionExpired,
                            options: {
                                width: 280,
                                height: 250
                            }
                        });
                    }, 1800000);
                }
            });
        }
    }
};
var headerinit = {
    init: function () {
        headerEvents.initializeEvent();
        headerEvents.userTimeout();
    }
};

module.exports = headerinit;
