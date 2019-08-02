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

    if ($('.pt_product-search-noresult .nohits .noresult-banner').length > 0) {
        $('.pt_product-search-noresult .nohits').css('height', 'auto');
    }
    /*End JIRA PREV-53,PREV-54 */
}

exports.init = initializeEvents;
