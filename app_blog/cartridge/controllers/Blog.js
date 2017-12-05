'use strict';

/**
 * Controller for the blog logic
 *
 * @module controllers/Blog
 */

/* API Includes */
var Resource = require('dw/web/Resource');

/* Script Modules */
var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

function morePosts () {
    var aseetID = request.httpParameterMap.postID.stringValue;
    var post = dw.content.ContentMgr.getContent(aseetID); 
    var morePosts = post.custom.additional_posts.split(',');
    
    var postsCollection = new dw.util.ArrayList();
    for each (var post in morePosts) {
        var aditionalPost = dw.content.ContentMgr.getContent(dw.util.StringUtils.trim(post));
        if (aditionalPost != null) {
            postsCollection.add(aditionalPost);
        }
    }
    app.getView({
        MorePosts: postsCollection
    }).render('blog/components/moreposts');
}

/*
 * Web exposed methods
 */

/** Get more posts.
 * @see module:controllers/Blog~morePosts */
exports.MorePosts = guard.ensure(['get'], morePosts);
