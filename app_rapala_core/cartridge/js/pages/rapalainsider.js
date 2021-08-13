'use strict';
var progress = require('../progress'),
    uievents = require('../uievents'),
    tooltip = require('../tooltip'),
    validator = require('../validator'),
    ajax = require('../ajax'),
    util = require('../util');

var rapalainsider = {
    init: function () {
        tooltip.init();
        validator.init();
        uievents.init();
        if (jQuery('#dialogcontainer123').length == 0) {
            jQuery(document.body).append('<div id=\'dialogcontainer123\' class=\'vipinsider-container\'></div>');
        }
        jQuery.each(jQuery('form:not(.suppress)'), function () {
            jQuery(this).validate(validator.settings);
        });

        var $vipinsider = $('.vipinsider-container');
            //vipform = $('.VipinsiderForm');
        //var validatorinit = $(this).closest('form').validate();
        $('#PasswordReset123').on('click', function (e) {
            e.preventDefault();
            $vipinsider.load(Urls.vipInsider, function () {
                $vipinsider.dialog({
                    bgiframe: true,
                    autoOpen: false,
                    modal: true,
                    overlay: {
                        opacity: 0.5,
                        background: 'white'
                    },
                    width: 358,
                    dialogClass: 'vipInsider-dlg',
                    resizable: false,
                    open: function () {
                        tooltip.init();
                        validator.init();
                        uievents.init();
                        rapalainsider.dialogEvents();
                        rapalainsider.formPrepare({
                            formSelector: '#VipinsiderForm',
                            continueSelector: '#VIPInsider-form-sbmt-id',
                            type: 'opacity'
                        });
                        rapalainsider.vipinsiderevents();
                        if ($(window).width() > 1200) {
                            rapalainsider.customselecteventsb();
                        }
                        rapalainsider.textarearapala();
                        rapalainsider.clearbuttonfunct();
                        $('.remove').on('click', function (e) {
                            e.preventDefault();
                            var filename = $(this).attr('data-file');
                            var form = $(this).closest('form');
                            var url = form.attr('action');
                            var finalURL = util.appendParamToURL(url, 'filename', filename);
                            ajax.load({
                                url: finalURL,
                                callback: function () {
                                }
                            });
                        });
                    }
                });
                jQuery('#dialogcontainer123').dialog('open');
                $(window).scrollTop(0);
            });
        });
    },
    dialogEvents: function () {
        var $vipinsider = $('.vipinsider-container');
            //vipform = $('.VipinsiderForm');
        rapalainsider.clearbuttonfunct();
        $vipinsider.find('#VIPInsider-form-sbmt-id').on('click', function (e) {
            e.preventDefault();
            var prodid = $('.fieldstaff form .dyn-cat-select select').find(':selected').val();
            if ($('.trigger_singleupload').is(':visible') && prodid != 'donation') {
                if (!($('.vip-uploadform-holder .filelist').find('.updatetext').length != 0)) {
                    $('.vip-uploadform-holder').find('.empty-attachment-error').removeClass('hide');
                    if (!$(this).closest('form').valid()) {
                        return false;
                    }
                    return false;
                }
            }
            if (!$(this).closest('form').valid()) {
                return false;
            }
            $('.vip-uploadform-holder').find('.empty-attachment-error').addClass('hide');
            var vipURL = $(this).closest('form').attr('action');
            var vipData = $(this).closest('form').serialize();
            progress.show($('.fieldstaff form'));
            jQuery('#msgcontianer').remove();
            $('<div/>').attr('id', 'msgcontianer').html(' ').appendTo(document.body);
            ajax.load({
                url: vipURL,
                data: vipData,
                type: 'POST',
                callback: function (vipData) {
                    $('body').find('.vipInsider-dlg .ui-dialog-titlebar-close').trigger('click');
                    var present = $(vipData).find('.exiting_user').length,
                        width = present > 0 ? '316px' : '358px',
                        height = present > 0 ? 'auto' : '184',
                        dlgClass = present > 0 ? 'existinguserdlg' : 'newuserdlg';
                    $('#msgcontianer').find('.regcheck').remove();
                    jQuery('#msgcontianer').append(vipData);
                    jQuery('#msgcontianer').dialog({
                        bgiframe: true,
                        autoOpen: false,
                        modal: true,
                        overlay: {
                            opacity: 0.5,
                            background: 'white'
                        },
                        width: width,
                        height: height,
                        dialogClass: 'vipInsider-dlg ' + dlgClass,
                        resizable: false,
                        open: function () {
                        }
                    });
                    jQuery('#msgcontianer').dialog('open');
                    $('.vipInsider-dlg.ui-dialog.existinguserdlg button.close, .vipInsider-dlg.ui-dialog.newuserdlg button.close').on('click', function (e) {
                        e.preventDefault();
                        $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click');
                    });
                }
            });
        });
        $('.vipInsider-dlg.ui-dialog.existinguserdlg button.close, .vipInsider-dlg.ui-dialog.newuserdlg button.close').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click');
        });
        $vipinsider.find('.trigger_singleupload input[type="file"]').on('click', function () {
            if ($(this).closest('.vip-uploadform-holder').find('.empty-attachment-error').is(':visible')) {
                $(this).closest('.vip-uploadform-holder').find('.empty-attachment-error').addClass('hide');
            }
        });
        //VIP insider dropdown change
        $('.fieldstaff form').find('.dyn-cat-select select').off('change').on('change', function (e) {
            e.preventDefault();
            var $curObj = $(this);
            var prodid = '';
            if ($(this).closest('.dyn-cat-select').find('.sbHolder').length > 0) {
                var selectedText = $(this).closest('.dyn-cat-select').find('.sbSelector').text();
                prodid = $(this).find('option[label="' + selectedText + '"]').attr('value');
            } else {
                prodid = $(this).find(':selected').val();
            }
            //alert($(this).find(':selected').val());
            var url = Urls.vipInsiderDynamicForms;

            if (prodid == 'field' || prodid == 'sports' || prodid == 'industry' || prodid == 'donation') {
                if (prodid == 'sports') {
                    $('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Upload Business Card or Pay Stub</span>');
                    $('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload Business card or Pay Stub');
                }
                if (prodid == 'field') {
                    $('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Attach Resume</span>');
                    $('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload your Resume');
                }
                if (prodid == 'industry') {
                    $('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">*Upload Business Card</span>');
                    $('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload a Business Card');
                }
                if (prodid == 'donation') {
                    $('.vip-uploadform-holder').find('span.text-holder-upload').replaceWith('<span class="text-holder-upload">Upload Flyer</span>');
                    //$('.vip-uploadform-holder').find('.trigger_singleupload .empty-attachment-error').text('Please upload a Flyer');
                    //$('.vip-uploadform-holder').find('span.text-holder-upload').closest('form').removeClass('trigger_singleupload');
                }
                $('.vip-uploadform-holder').removeClass('hide');
            } else {
                $('.vip-uploadform-holder').addClass('hide');
            }

            if (prodid != undefined && prodid != null && prodid.length > 0) {
                url = url + '?prodid=' + prodid;
            } else {
                return false;
            }

            progress.show($('.fieldstaff form'));
            ajax.load({
                url: url,
                callback: function (data) {
                    if (($('.fieldstaff form .dynamic-content-holder-vip') != undefined && $('.fieldstaff form .dynamic-content-holder-vip').length > 0) && ($(data).filter('.vipinsider-onload-data-holder') != undefined && $(data).filter('.vipinsider-onload-data-holder').length > 0)) {
                        $('.fieldstaff form .dynamic-content-holder-vip').html($(data).filter('.vipinsider-onload-data-holder').html());
                        $('.trigger_singleupload .pro_id').val(prodid);
                        var dateObj = new Date();
                        dateObj.setTime(dateObj.getTime() + (60 * 60 * 1000));
                        document.cookie = 'progcookie=' + prodid + '; expires=' + dateObj.toUTCString() + '; path=/';
                        progress.hide();
                        if ($(window).width() > 1200) {
                            rapalainsider.customselecteventsb();
                        }
                        rapalainsider.textarearapala();
                        rapalainsider.clearbuttonfunct();
                        rapalainsider.formPrepare({
                            formSelector: '#VipinsiderForm',
                            continueSelector: '#VIPInsider-form-sbmt-id',
                            type: 'opacity'
                        });
                        if ($curObj.closest('.dyn-cat-select').find('.sbHolder').length > 0) {
                            var selectedText = $curObj.closest('.dyn-cat-select').find('.sbSelector').text();
                            prodid = $curObj.find('option[label="' + selectedText + '"]').attr('value');
                        } else {
                            prodid = $curObj.find(':selected').val();
                        }
                        if (prodid != 'Select A Program') {
                            $('.dyn-cat-select').find('.label').removeClass('erroroccured');
                            $('.dyn-cat-select').find('.label span.errorclient.inputlabel').remove();
                            $('.dyn-cat-select').find('.label span').removeClass('inputlabel');
                            $('.dyn-cat-select').find('select').removeClass('errorclient').addClass('valid');
                        }
                        if ($('.filelist').find('ul').length > 0) {
                            $('.filelist').find('ul').css({'display': 'none'});
                        }
                        
                        // Dynamicaly generating tabindex for VIP
                        if ($('.ui-dialog').hasClass('vipInsider-dlg')) {
                            $('.vipInsider-dlg .formfield').each(function (i) {
                                $(this).find(':input:not(:hidden)').attr('tabindex', i + 21);
                            });
                        }
                    }
                }
            });
        });
    },
    // sub namespace app.ajax.* contains application specific ajax
    // components
    ajax: {
        Success: 'success',
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
            if (!options.reqName || !this.currentRequests[options.reqName]) {
                this.currentRequests[options.reqName] = true;
                if (options.async == 'undefined') {
                    options.async = true;
                }
                // make the server call
                jQuery.ajax({
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    url: options.url,
                    cache: true,
                    async: options.async,
                    data: options.data,

                    success: function (response, textStatus) {
                        thisAjax.currentRequests[options.reqName] = false;

                        if (!response.Success) {
                            // handle failure
                        }

                        options.callback(response, textStatus);
                    },

                    error: function (request, textStatus) {
                        if (textStatus === 'parsererror') {
                            alert(Resources.BAD_RESPONSE);
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
            if (!options.reqName || !this.currentRequests[options.reqName]) {
                this.currentRequests[options.reqName] = true;
                // make the server call
                jQuery.ajax({
                    dataType: 'html',
                    url: options.url,
                    cache: true,
                    data: options.data,

                    success: function (response, textStatus) {
                        thisAjax.currentRequests[options.reqName] = false;

                        if (options.selector) {
                            jQuery(options.selector).html(response);
                        }

                        if (options.callback != undefined) {
                            options.callback(response, textStatus)
                        }

                    },

                    error: function (request, textStatus) {
                        if (textStatus === 'parsererror') {
                            alert(Resources.BAD_RESPONSE);
                        }

                        options.callback(null, textStatus);
                    }
                });
            }
        }
    },

    vipinsiderevents: function () {
        var $vipinsider = $('.vipinsider-container');
            //vipform = $('.VipinsiderForm');
        $vipinsider.find('.trigger_singleupload input[type="file"]').off('change').on('change', function () {

            var xhr = new XMLHttpRequest(),
                data = new FormData(),
                files = $('#fileid').get(0).files,
                form = $(this).closest('form');
            //if($(this).hasClass('errorclient')){ $(this).trigger('blur'); }
            var totalsize = 0;
            totalsize = $('.vip-uploadform-holder .remove_singleupload span.updatetext').eq(0).attr('value');

            if ((this.files[0].size / 1024 / 1024) > 2 || totalsize > 2) {
                $vipinsider.find('.vip-uploadform-holder .file-size-exceed-error').removeClass('hide');
                return false;
            }

            var extension = this.files[0].name.split('.')[1].toLowerCase();
            if ((extension != 'jpg') && (extension != 'png') && (extension != 'PNG') && (extension != 'jpeg') && (extension != 'pdf') && (extension != 'gif') && (extension != 'doc') && (extension != 'docx') && (extension != 'pages')) {
                $vipinsider.find('.vip-uploadform-holder .file-format-exceed-error').removeClass('hide');
                return false;
            }

            $vipinsider.find('.vip-uploadform-holder .file-format-exceed-error').addClass('hide');
            $vipinsider.find('.vip-uploadform-holder .file-size-exceed-error').addClass('hide');
            form.find('.progressbar').fadeIn(500);

            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    var progress = Math.round(evt.loaded * 100 / evt.total);
                    form.find('.progressbar .count').text(progress + '% Complete');
                    form.find('.progressbar .progressload').width(progress + '%');
                }
            }, false);
            xhr.open('POST', form.attr('action'));
            xhr.send(data);

            xhr.upload.addEventListener('loadend', function () {
                form.find('#fileid').val('');
                setTimeout(function () {
                    form.find('.progressbar').fadeOut(100, function () {
                        form.find('.progressbar .count').text('0%');
                        form.find('.progressbar .progressload').width('0');
                    });
                }, 500);
            });

            xhr.onload = function () {
                $('.vip-uploadform-holder .filelist').html(xhr.responseText);
                rapalainsider.vipinsiderevents();
            };
        });

        if ($(window).width() <= 767) {
            $('.insider_body.rapala_device [maxlength]').on('keypress keyup', function () {
                var $this = $(this);
                var val = $this.val();
                var valLength = val.length;
                var maxCount = $this.attr('maxlength');
                if (valLength > maxCount) {
                    $this.val($this.val().substring(0, maxCount));
                }
            });
        }

        $vipinsider.find('.remove').off('click').on('click', function (e) {
            e.preventDefault();
            var filename = $(this).attr('data-file');
            var form = $(this).closest('form');
            var url = form.attr('action');
            var finalURL = util.appendParamToURL(url, 'filename', filename);
            ajax.load({
                url: finalURL,
                type: 'POST',
                callback: function (data) {
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
            return $.inArray('', requiredValues) != -1;
        };

        var validateForm = function () {
            // only validate form when all required fields are filled to avoid
            // throwing errors on empty form
            if (!hasEmptyRequired() && validator.form()) {
                $continue.removeAttr('disabled').removeClass('button_invisible');
            } else {
                if (opts.type == 'disable') {
                    $continue.attr('disabled', 'disabled');
                } else {
                    $continue.addClass('button_invisible');
                }
            }
        };

        var validateEl = function () {
            if ($(this).val() === '') {
                if (opts.type == 'disable') {
                    $continue.attr('disabled', 'disabled');
                } else {
                    $continue.addClass('button_invisible');
                }
            } else {
                // enable continue button on last required field that is valid
                // only validate single field
                if (validator.element(this) && !hasEmptyRequired()) {
                    $continue.removeAttr('disabled').removeClass('button_invisible');
                } else {
                    if (opts.type == 'disable') {
                        $continue.attr('disabled', 'disabled');
                    } else {
                        $continue.addClass('button_invisible');
                    }
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

    customselecteventsb: function () {
        if (!$('body').hasClass('rapala_device')) {
            var $con = $('body');
            $con.find('.customized-select').find('select').each(function () {
                if ($(this).attr('disabled')) {
                    $(this).selectbox('disable');
                } else {
                    $(this).selectbox();
                }
                $('.sbOptions li:last').addClass('last');
            }).on('focus', function () {
                $(this).next('.sbHolder').trigger('focus');
            });

        }

    },

    textarearapala: function () {
        $('textarea[maxlength]').each(function () {
            charcount($(this));
            // trigger the keydown event so that any existing character data is calculated
        }).on('keyup keypress', function () {
            charcount($(this));
        });

        function charcount($this) {
            var characterLimit = '1200';
            var charRemains = characterLimit - $this.val().trim().length;
            //var charCountContainer = '';
            var charCountHtml = 'Characters Remaining ' + charRemains;
            if ($this.hasClass('vip-textarea')) {
                if ($this.next('div.char-count').length === 0) {
                    $('<div class="char-count"/>').insertAfter($this);
                }
                $this.next('div.char-count').html(charCountHtml);
            } else {
                if ($this.prev('div.char-count').length === 0) {
                    $('<div class="char-count"/>').insertBefore($this);
                }
                $this.prev('div.char-count').html(charCountHtml);
            }
        }

    },

    clearbuttonfunct: function () {
        if ($('#dialogcontainer123').length > 0) {
            $('#dialogcontainer123').find('.formfield').each(function () {
                if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0 || $(this).find('.field-wrapper textarea').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                }
            });
        }
        $('body').find('#dialogcontainer123 .field-wrapper input, textarea').on('keyup input blur', function () {
            if ($(this).val() != undefined) {
                if ($(this).val().length > 0) {
                    $(this).closest('.formfield').find('a.clearbutton').show();
                } else {
                    $(this).closest('.formfield').find('a.clearbutton').hide();
                }
            }
        });

        $('body').find('#dialogcontainer123 .field-wrapper a.clearbutton').on('click', function () {
            var characterLimit = 'Characters Remaining 1200';
            $(this).closest('.formfield').find('input').val('');
            $(this).closest('.formfield').find('textarea').val('');
            $(this).closest('.field-wrapper').find('span').remove();
            $(this).closest('.field-wrapper').find('.required').removeClass('errorclient');
            $(this).closest('.formfield').find('a.clearbutton').hide();
            $(this).closest('.formfield ').find('.form-row').removeClass('inputlabel');
            $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
            $(this).closest('.formfield').find('span.logerror , .existing_register').hide();
            $('div.char-count').html(characterLimit);
        });
    }

};
module.exports = rapalainsider;
