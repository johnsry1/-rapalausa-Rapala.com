'use strict';

/**
 * Controller that renders the home page.
 *
 * @module controllers/Home
 */

var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var URLUtils = require('dw/web/URLUtils');

/**
 * Renders the home page.
 */
function show() {
    var rootFolder = require('dw/content/ContentMgr').getSiteLibrary().root;
	var countryCode = request.geolocation.countryCode;
    require('~/cartridge/scripts/meta').update(rootFolder);
    var enableGeoRedirect = dw.system.Site.current.getCustomPreferenceValue('enableGeoIPRedirects') && !empty(dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirects'));
    if (request.httpParameterMap.isParameterSubmitted('countrySelect')) {
    	var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');
    	InterstitialHelper.setInterstitialSiteCookie(request);
    }
    if(session.custom.homeSplash){
        app.getController('Home').ChangeRegion();
    } else if (request.httpParameterMap.isParameterSubmitted('id') || !session.custom.showShopByBrand || session.custom.redirectGeolocation) {
    	if (countryCode != 'US' && session.custom.redirectGeolocation) {
    		if (enableGeoRedirect) {
    			let geolocation = request.geolocation;
    			let redirects = JSON.parse(dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirects'));
    			var GeoipRedirects = require('*/cartridge/controllers/GeoipRedirects.js');
    			app.getController('GeoipRedirects').geoIPRedirection(geolocation , redirects);
    		}
    	} else {
    		app.getView().render('content/home/homepageinclude');
    	}
    } else {
        session.custom.showShopByBrand = false;
		session.custom.redirectGeolocation = enableGeoRedirect;
        response.redirect(URLUtils.url('Page-Show','cid',"shop-by-brand"));
    }
}

/**
 * Remote include for the header.
 * This is designed as a remote include to achieve optimal caching results for the header.
 */
function includeHeader() {
    app.getView().render('components/header/header');
}

/**
 * Renders the category navigation and the menu to use as a remote include.
 * It is cached.
 *
 * @deprecated Converted into a template include.
 */
function includeHeaderMenu() {
    app.getView().render('components/header/headermenu');
}

/**
 * Renders customer information.
 *
 * This is designed as a remote include as it represents dynamic session information and must not be
 * cached.
 */
function includeHeaderCustomerInfo() {
	var basket = app.getModel('Cart').get();
	var basketTotal = 0;
	if (basket && basket.object.totalGrossPrice.available) {
		basketTotal = basket.object.adjustedMerchandizeTotalGrossPrice.value;
	}
    app.getView({
        BasketTotal: basketTotal,
    }).render('components/header/headercustomerinfo');
}

/**
 * Sets a 410 HTTP response code for the response and renders an error page (error/notfound template).
 */
function errorNotFound() {
    // @FIXME Correct would be to set a 404 status code but that breaks the page as it utilizes
    // remote includes which the WA won't resolve
    response.setStatus(410);
    app.getView().render('error/notfound');
}

/**
 * Used in the setlayout.isml and htmlhead.isml templates to control device-aware display.
 * Sets the session custom property 'device' to mobile. Renders the changelayout.isml template.
 * TODO As we want to have a responsive layout, do we really need the below?
 */
function mobileSite() {
    session.custom.device = 'mobile';
    app.getView().render('components/changelayout');
}

/**
 * Sets the session custom property 'device' to mobile.  Renders the setlayout.isml template.
 * @FIXME remove - not responsive - maybe replace with a CSS class forcing the layout.
 */
function fullSite() {
    session.custom.device = 'fullsite';
    app.getView().render('components/changelayout');
}

/**
 * Renders the setlayout.isml template.
 * @FIXME remove - not responsive
 */
function setLayout() {
    app.getView().render('components/setlayout');
}

/**
 * Renders the devicelayouts.isml template.
 * @FIXME remove - not responsive
 */
function deviceLayouts() {
    app.getView().render('util/devicelayouts');
}

/**
 * Used to Render international landing page
 */
function changeRegion(){
	app.getView().render('content/home/internationalinclude');
}

/**
 * Used to Render international landing page
 */
function changeRegionURL(){
	app.getView().render('content/home/changeregionurl');
}

/**
 * Renders the international region options for user
 */
function internationalOptions(){

  //retrieve intl link (should be one)
  var internationalBrandLink = dw.object.CustomObjectMgr.queryCustomObjects("BrandCountryLinks", "custom.brand = {0} AND custom.countryDisplayName ilike 'international*'", "custom.sequenceNumber asc", session.custom.currentSite);

  //retrieve all country distributor links
  var distributorCountries = dw.object.CustomObjectMgr.queryCustomObjects("BrandCountryLinks", "custom.brand = {0} AND NOT custom.countryDisplayName ilike 'international*'", "custom.sequenceNumber asc", session.custom.currentSite);


	app.getView({
		internationalBrandLink : internationalBrandLink,
		distributorCountries : distributorCountries
	}).render('content/home/international');
}

/**
 * Renders the homepage when the session is new
 */
function page(){
	if(session.custom.currentSite != null){
		var siteFolder = require('dw/content/ContentMgr').getFolder(session.custom.currentSite);
		var pageMeta = require('~/cartridge/scripts/meta');
		pageMeta.update(siteFolder);
	}

	app.getView().render('content/home/homepage');
}
/**
 * Renders the megamenu based on the hover of specific brand
 */
function megamenu(){
	app.getView().render('components/header/megamenu');
}

/**
 * Renders the megamenu based on the hover of specific brand
 */
function leftnav(){
	app.getView().render('components/header/leftnavmenu');
}


/**.
 * This is designed as a content asset include to achieve dynamic change region link from the footer.
 */
function footerChangeRegion() {
    app.getView().render('components/footer/footerchangeregion');
}

/**.
 * This is for displaying header for checkout.
 */
function includeCheckOutHeaderCustomerInfo() {
    app.getView().render('components/header/checkoutheadercustomerinfo');
}
/**.
 * This is for displaying megamenu login for nav menu.
 */
function includeMegamenuCustomerInfo() {
    app.getView().render('components/header/megamenu_account_show');
}

function countyPopUp() {
	var COBrand = dw.object.CustomObjectMgr.getCustomObject("BrandCountryLinks", request.httpParameterMap.coid.stringValue);
	app.getView({customObject: COBrand}).render('content/home/internationalpopup');
}

function sessionWarnPopUp() {
	app.getView().render('components/session_warn_popup');
}

function sessionExpiredPopUp() {
	app.getView().render('components/session_expired_popup');
}

function countrySelectorPopUp() {
	app.getView().render('components/country_selector_popup');
}

function setLocale() {
	session.custom.selectedCountry = request.httpParameterMap.locale;
	var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');
	InterstitialHelper.setInterstitialSiteCookie(request);

	if (session.custom.interstitialSiteId == 'rapala-') {
		response.redirect(URLUtils.url('Page-Show','cid', 'shop-by-brand'));
	} else {
		response.redirect(URLUtils.url('Home-Show'));
	}
	
}
/*
 * Export the publicly available controller methods
 */
/** Renders the home page.
 * @see module:controllers/Home~show */
exports.Show = guard.ensure(['get'], show);
/** Remote include for the header.
 * @see module:controllers/Home~includeHeader */
exports.IncludeHeader = guard.ensure(['include'], includeHeader);
/** Renders the category navigation and the menu to use as a remote include.
 * @see module:controllers/Home~includeHeaderMenu */
exports.IncludeHeaderMenu = guard.ensure(['include'],includeHeaderMenu);
/** This is designed as a remote include as it represents dynamic session information and must not be cached.
 * @see module:controllers/Home~includeHeaderCustomerInfo */
exports.IncludeHeaderCustomerInfo = guard.ensure(['get'], includeHeaderCustomerInfo); //PREVAIL - Changed include to 'get' for the sake of single page checkout.
/** Sets a 410 HTTP response code for the response and renders an error page
 * @see module:controllers/Home~errorNotFound */
exports.ErrorNotFound = guard.ensure(['get'], errorNotFound);
/** Used to control device-aware display.
 * @see module:controllers/Home~mobileSite */
exports.MobileSite = guard.ensure(['get'], mobileSite);
/** Sets the session custom property 'device' to mobile. Renders the setlayout.isml template.
 * @see module:controllers/Home~fullSite */
exports.FullSite = guard.ensure(['get'], fullSite);
/** Renders the setlayout.isml template.
 * @see module:controllers/Home~setLayout */
exports.SetLayout = guard.ensure(['get'], setLayout);
/** Renders the devicelayouts.isml template.
 * @see module:controllers/Home~deviceLayouts */
exports.DeviceLayouts = guard.ensure(['get'], deviceLayouts);
/** Renders the internationalinclude.isml template.
* @see module:controllers/Home~changeRegion */
exports.ChangeRegion = guard.ensure(['get'], changeRegion);
/** Renders the changeRegionURL template.
* @see module:controllers/Home~changeRegionURL */
exports.ChangeRegionURL = guard.ensure(['get'], changeRegionURL);
/** Remote include for internationalinclude.isml template.
* renders  international.isml with different regions available for the current site.
* @see module:controllers/Home~internationalOptions */
exports.International = guard.ensure(['get'], internationalOptions);
/** Renders homepage.isml when the session is new.
* @see module:controllers/Home~page */
exports.Page = guard.ensure(['get'], page);
/** Renders homepage.isml when the session is new.
* @see module:controllers/Home~megamenu */
exports.MegaMenu = guard.ensure(['get'], megamenu);
/** Renders leftnavmenu.isml.
* @see module:controllers/Home~leftnav */
exports.LeftNav = guard.ensure(['get'], leftnav);
/** Renders footerchangeregion.isml
* @see module:controllers/Home~footerChangeRegion */
exports.FooterChangeRegion = guard.ensure(['get'], footerChangeRegion);
/** Renders checkoutheadercustomerinfo.isml
* @see module:controllers/Home~includeCheckOutHeaderCustomerInfo */
exports.IncludeCheckOutHeaderCustomerInfo = guard.ensure(['get'], includeCheckOutHeaderCustomerInfo);
/** Renders login/logout
* @see module:controllers/Home~includeMegamenuCustomerInfo */
exports.IncludeMegamenuCustomerInfo = guard.ensure(['get'], includeMegamenuCustomerInfo);

exports.CountyPopUp = guard.ensure(['get'], countyPopUp);

exports.SessionWarnPopUp = guard.ensure(['get'], sessionWarnPopUp);

exports.SessionExpiredPopUp = guard.ensure(['get'], sessionExpiredPopUp);

exports.CountrySelectorPopUp = guard.ensure(['get'], countrySelectorPopUp);

exports.SetLocale = guard.ensure(['get'], setLocale);