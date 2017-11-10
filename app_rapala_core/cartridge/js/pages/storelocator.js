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
$('.customersubmit').on('click', function () {
    if ($('.floatleft.state.custom-select select').valid() == 0) {
        if (!$('.floatleft.state.custom-select').hasClass('blured')) {
            $('.floatleft.state.custom-select').addClass('customselect-error');
        }
    } else {
        $('.floatleft.state.custom-select').removeClass('customselect-error');
    }
});
var storeLocator = {
    init: function () {
        validator.init();
        $('.googlemap').on('click', function () {
            window.open(this.name);
        });
        $('body').find('form.locatorForm').submit(function (e) {
            e.preventDefault();
            var $form = jQuery(this);
            if ($('#locatorForm button').prop('disabled')) {
                return false;
            }
            $('#noresultserror').hide();
            $('#message.success').hide();
            $('#results').hide();
            $('#locatorForm button').prop('disabled', true);
            var param = {
                    countryCode: 'US',
                    distanceUnit: 'mi',
                    postalCode: $('.postalCheck').val(),
                    maxdistance: $('.mxdistanceCheck').val(),
                    rapala: $('.rapalaCheck').prop('checked'),
                    vmc: $('.vmcCheck').prop('checked'),
                    storm: $('.stormCheck').prop('checked'),
                    luhrjensen: $('.luhrCheck').prop('checked'),
                    bluefox: $('.bluefoxCheck').prop('checked'),
                    terminator: $('.terminatorCheck').prop('checked'),
                    williamson: $('.williamCheck').prop('checked'),
                    triggerx: $('.triggerCheck').prop('checked'),
                    sufix: $('.sufixCheck').prop('checked'),
                    marcum: $('.marcumCheck').prop('checked'),
                    strikemaster: $('.strikeCheck').prop('checked')
                },
                serviceParam = {
                    countryCode: 'US',
                    distanceUnit: 'mi',
                    postalCode: $('.postalCheck').val(),
                    maxdistance: $('.mxdistanceCheck').val()
                };
            var url = util.appendParamsToUrl(Urls.storeJson, param),
                serviceUrl = util.appendParamsToUrl(Urls.serviceStoreJson, serviceParam);
            if ($('.store-Locator-page').length > 0) {
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: $form.serialize(),
                    success: function (data) {
                        // alert(data);
                        $('#locatorForm button').removeProp('disabled');
                        if (data.storeCount > 0) {
                            $('#storeCount').html(data.storeCount);
                            $('#message.success').show();
                            var store = {};
                            var html = [];
                            var allStoreHtml = '';
                            for (var i = 0; i < data.stores.length; i++) {
                                store = data.stores[i];
                                html = [];
                                html.push('<div class="storeresult"><div class="storeinformation">');
                                html.push('<h2 class="input-style">' + store.name + '</h2>');
                                html.push('<div>' + store.address1 + '<br/>');
                                html.push(store.city);
                                if (store.city != '' && store.state != '') {
                                    html.push(',');
                                }
                                html.push(store.state + ' ' + store.postalCode + '<br />');
                                if (store.phone != '') {
                                    html.push('<div class="storephone">' + store.phone + '</div>');
                                }
                                if (store.storeHours != '') {
                                    html.push('<div class="storeHours">' + store.storeHours + '</div>');
                                }
                                if (store.storeEvents != '') {
                                    html.push('<div class="storeEvents">' + store.storeEvents + '</div>');
                                }
                                html.push('</div></div><div class="storebrands">');
                                html.push('<span class="brandlabel">' + Resources.BRAND_CATEGORY1 + '</span><hr></hr>');
                                if (store.custom.brands.rapala) {
                                    html.push('<img alt=' + Resources.STORELOCATER_RAPALA + ' class="logo medium" src=' + Urls.rapalalogo + '></img>');
                                }
                                if (store.custom.brands.vmc) {
                                    html.push('<img alt=' + Resources.STORELOCATER_VMC + ' class="logo medium" src=' + Urls.vmclogo + '></img>');
                                }
                                if (store.custom.brands.sufix) {
                                    html.push('<img alt=' + Resources.STORELOCATER_SUFIX + ' class="logo medium" src=' + Urls.sufixlogo + '></img>');
                                }
                                if (store.custom.brands.storm) {
                                    html.push('<img alt=' + Resources.STORELOCATER_STORM + ' class="logo medium" src=' + Urls.stormlogo + '></img>');
                                }
                                if (store.custom.brands.triggerx) {
                                    html.push('<img alt=' + Resources.STORELOCATER_TRIGGERX + ' class="logo medium" src=' + Urls.triggerxlogo + '></img>');
                                }
                                if (store.custom.brands.luhrjensen) {
                                    html.push('<img alt=' + Resources.STORELOCATER_LUHRJONSON + ' class="logo medium" src=' + Urls.luhrjonsonlogo + '></img>');
                                }
                                if (store.custom.brands.terminator) {
                                    html.push('<img alt=' + Resources.STORELOCATER_TERMINATOR + ' class="logo medium" src=' + Urls.terminatorlogo + '></img>');
                                }
                                if (store.custom.brands.bluefox) {
                                    html.push('<img alt=' + Resources.STORELOCATER_BLUEFOX + ' class="logo medium" src=' + Urls.bluefoxlogo + '></img>');
                                }
                                if (store.custom.brands.williamson) {
                                    html.push('<img alt=' + Resources.STORELOCATER_WILLIAMSON + ' class="logo medium" src=' + Urls.williamsonlogo + '></img>');
                                }
                                if (store.custom.brands.marcum) {
                                    html.push('<img alt=' + Resources.STORELOCATER_MARCUM + ' class="logo medium" src=' + Urls.marcumlogo + '></img>');
                                }
                                if (store.custom.brands.strikemaster) {
                                    html.push('<img alt=' + Resources.STORELOCATER_STRIKEMASTER + ' class="logo medium" src=' + Urls.strikemasterlogo + '></img>');
                                }
                                /* if(store.custom.brands.otter) {
                                    html.push('<img alt="${Resource.msg('storelocator.otter','forms',null)}" class="logo medium" src="${URLUtils.staticURL('/images/logo-otter.jpg')}"></img>');
                                } */
                                html.push('</div>');
                                html.push('<div class="storemap"><a class="button googlemap" name="' + store.map + '">' + Resources.STORELOCATER_MAP + '</a>');
                                if (store.website != '') {
                                    html.push('<br /><a target="_blank" class="button" href="' + store.website + '">' + Resources.STORELOCATER_WEBSITE + '</a>');

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
                            $('.email-form #message').removeClass('error-alert').addClass('success-email').html('You have successfully subscribed to the Rapala Email Newsletter.').show();
                            $('.email-form input, .email-form select').val('');
                        }
                        $('.googlemap').on('click', function () {
                            window.open(this.name);
                        });
                    }
                });
            } else if ($('.service-locator-form').length > 0) {
                $.ajax({
                    type: 'POST',
                    url: serviceUrl,
                    data: $form.serialize(),
                    success: function (data) {
                        // alert(data);
                        $('#locatorForm button').removeProp('disabled');
                        if (data.storeCount > 0) {
                            $('#storeCount').html(data.storeCount);
                            $('#message.success').show();
                            var store = {};
                            var html = [];
                            var allStoreHtml = '';
                            for (var i = 0; i < data.stores.length; i++) {
                                store = data.stores[i];
                                html = [];
                                html.push('<div class="storeresult"><div class="storeinformation">');
                                html.push('<h2 class="input-style">' + store.name + '</h2>');
                                html.push('<div>' + store.address1 + '<br/>');
                                html.push(store.city);
                                if (store.city != '' && store.state != '') {
                                    html.push(',');
                                }
                                html.push(store.state + ' ' + store.postalCode + '<br />');
                                if (store.phone != '') {
                                    html.push('<div class="storephone">' + store.phone + '</div>');
                                }
                                if (store.storeHours != '') {
                                    html.push('<div class="storeHours">' + store.storeHours + '</div>');
                                }
                                if (store.storeEvents != '') {
                                    html.push('<div class="storeEvents">' + store.storeEvents + '</div>');
                                }
                                html.push('</div></div>');
                                html.push('<div class="storemap"><div class="storedistance">' + store.distance + '</div><a class="button googlemap" name="' + store.map + '">' + Resources.STORELOCATER_MAP + '</a>');
                                if (store.website != '') {
                                    html.push('<br /><a target="_blank" class="button" href="' + store.website + '">' + Resources.STORELOCATER_WEBSITE + '</a>');

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
                        $('.googlemap').on('click', function () {
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
