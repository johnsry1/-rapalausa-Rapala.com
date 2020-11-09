'use strict';

/**
 * Controller handling search, category, and suggestion pages.
 *
 * @module controllers/Search
 */

/* API Includes */
var PagingModel = require('dw/web/PagingModel');
var URLUtils = require('dw/web/URLUtils');
var SearchModel = require('dw/catalog/SearchModel');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var meta = require('*/cartridge/scripts/meta');

/**
 * Renders a full-featured product search result page.
 * If the httpParameterMap format parameter is set to "ajax" only the product grid is rendered instead of the full page.
 *
 * Checks for search redirects configured in Business Manager based on the query parameters in the
 * httpParameterMap. If a search redirect is found, renders the redirect (util/redirect template).
 * Constructs the search based on the HTTP params and sets the categoryID. Executes the product search and then the
 * content asset search.
 *
 * If no search term, search parameter or refinement was specified for the search and redirects
 * to the Home controller Show function. If there are any product search results
 * for a simple category search, it dynamically renders the category page for the category searched.
 *
 * If the search query included category refinements, or is a keyword search it renders a product hits page for the category
 * (rendering/category/categoryproducthits template).
 * If only one product is found, renders the product detail page for that product.
 * If there are no product results found, renders the nohits page (search/nohits template).
 * @see {@link module:controllers/Search~showProductGrid|showProductGrid} function}.
 */
function show() {
    var params = request.httpParameterMap;
    // RPS-441 copied part "if" from the Search.js in app_rapala_controllers
    if((params.cgid.value!=null) && (params.cgid.value.equals("rapala-home") || params.cgid.value.equals("vmc-home") || params.cgid.value.equals("sufix-home") || params.cgid.value.equals("triggerx-home") || params.cgid.value.equals("storm-home") || params.cgid.value.equals("luhrjensen-home") || params.cgid.value.equals("terminator-home") || params.cgid.value.equals("bluefox-home") || params.cgid.value.equals("williamson-home") || params.cgid.value.equals("marcum-home") || params.cgid.value.equals("strikemaster-home") || params.cgid.value.equals("otter-home") || params.cgid.value.equals("iceforce-home") || params.cgid.value.equals("13fishing-home"))){
    	var category : Category = dw.catalog.CatalogMgr.getCategory(params.cgid.value);
    	if (category) {
	        require('*/cartridge/scripts/meta').update(category);
	    }
    	app.getView().render('content/home/homepage');
    } else {
	    var redirectUrl = SearchModel.getSearchRedirect(params.q.value);

	    if (redirectUrl) {
	        module.superModule.Show();
	    }

	    // Constructs the search based on the HTTP params and sets the categoryID.
	    var Search = app.getModel('Search');
	    var productSearchModel = Search.initializeProductSearchModel(params);
	    var contentSearchModel = Search.initializeContentSearchModel(params);

	    // execute the product search
	    productSearchModel.search();
	    contentSearchModel.search();

	    if (productSearchModel.emptyQuery && contentSearchModel.emptyQuery) {
	        response.redirect(URLUtils.abs('Home-Show'));
	    } else if (productSearchModel.count > 0) {
	        module.superModule.Show();
	    } else {
	        app.getView({
	            ProductSearchResult : productSearchModel,
	            ContentSearchResult : contentSearchModel
	        }).render('search/nohits');
	    }
    }
}


/**
 * Renders a full-featured content search result page.
 *
 * Constructs the search based on the httpParameterMap params and executes the product search and then the
 * content asset search.
 *
 * If no search term, search parameter or refinement was specified for the search, it redirects
 * to the Home controller Show function. If there are any content search results
 * for a simple folder search, it dynamically renders the content asset page for the folder searched.
 * If the search included folder refinements, it renders a folder hits page for the folder
 * (rendering/folder/foldercontenthits template).
 *
 * If there are no product results found, renders the nohits page (search/nohits template).
 */
// RPS-441 Copied showContent logic from the Search.js in app_rapala_controllers
// and updated it by inserting meta.update, meta.update updatePageMetaTags from app_pagedesigner
function showContent() {
	var params = request.httpParameterMap;
    var blogAssets = null;
    var Search = app.getModel('Search');
    var productSearchModel = Search.initializeProductSearchModel(params);
    var contentSearchModel = Search.initializeContentSearchModel(params);

    var searchedFolderId = params.fdid.submitted ? dw.content.ContentMgr.getFolder(params.fdid.value) : '';
    var renderBlogPages = false;
    if (searchedFolderId != null && !empty(searchedFolderId)) {
        var blogRootFolder = dw.system.Site.getCurrent().getCustomPreferenceValue('blogRootFolder');
        if (blogRootFolder === searchedFolderId.ID ||
                (!empty(searchedFolderId.parent) && blogRootFolder === searchedFolderId.parent.ID) ||
                (!empty(searchedFolderId.parent.parent) && blogRootFolder === searchedFolderId.parent.parent.ID)) {
            contentSearchModel.setSortingCondition('weight', dw.catalog.SearchModel.SORT_DIRECTION_DESCENDING);
            contentSearchModel.setSortingCondition('creationDate', dw.catalog.SearchModel.SORT_DIRECTION_DESCENDING);
            renderBlogPages = true;

            if (searchedFolderId.custom.content_search_term != null && !empty(searchedFolderId.custom.content_search_term)) {
                contentSearchModel.setSearchPhrase(searchedFolderId.custom.content_search_term);
            }
        }
    }


    // Executes the product search.
    productSearchModel.search();
    contentSearchModel.search();

    if (productSearchModel.emptyQuery && contentSearchModel.emptyQuery) {
        response.redirect(URLUtils.abs('Home-Show'));
    } else if (contentSearchModel.count > 0 || renderBlogPages) {

    	// RPS-441
    	if (contentSearchModel.folder) {
    	    meta.update(contentSearchModel.folder);
    	}
    	meta.updatePageMetaData();

        var contentPagingModel = new PagingModel(contentSearchModel.content, contentSearchModel.count);
        contentPagingModel.setPageSize(16);
        var blogAssets = contentSearchModel.getContent().asList();
        if (renderBlogPages) {
            blogAssets.sort(function(a,b){return new Date(a.creationDate).getTime() < new Date(b.creationDate).getTime() ? 1 : -1;});
        }
        if (params.start.submitted) {
            contentPagingModel.setStart(params.start.intValue);
        }

        if ((renderBlogPages && contentSearchModel.folder.template) || contentSearchModel.folderSearch && !contentSearchModel.refinedFolderSearch && contentSearchModel.folder.template) {
            // Renders a dynamic template
            app.getView({
                ProductSearchResult: productSearchModel,
                ContentSearchResult: contentSearchModel,
                ContentPagingModel: contentPagingModel,
                ContentSearchResultSorted: blogAssets
            }).render(contentSearchModel.folder.template);
        } else {
            app.getView({
                ProductSearchResult: productSearchModel,
                ContentSearchResult: contentSearchModel,
                ContentPagingModel: contentPagingModel
            }).render('rendering/folder/foldercontenthits');
        }
    } else {
        app.getView({
            ProductSearchResult: productSearchModel,
            ContentSearchResult: contentSearchModel
        }).render('search/nohits');
    }
}

/*
 * Web exposed methods
 */
/** Renders a full featured product search result page.
 * @see module:controllers/Search~show
 * */
exports.Show = guard.ensure(['get'], show);

/** Renders a full featured content search result page.
 * @see module:controllers/Search~showContent
 * */
exports.ShowContent = guard.ensure(['get'], showContent);

/** Determines search suggestions based on a given input and renders the JSON response for the list of suggestions.
 * @see module:controllers/Search~getSuggestions */
exports.GetSuggestions = module.superModule.GetSuggestions;
exports.ShowInLocale = module.superModule.ShowInLocale;
