'use strict';

import * as common from './helpers/common';
import * as productQuickView from './productQuickView';

export const BTN_SEARCH_FOR_STORE = '.ui-dialog-buttonset button[role*=button]';
export const BTN_SELECT_STORE = '.select-store-button';
export const BTN_SELECT_STORE_CONTINUE = '.ui-dialog-buttonset button:nth-of-type(2)';
export const CART_EMPTY = '.cart-empty';
export const CART_ITEMS = '.item-list tbody tr';
export const CHANGE_LOCATION = '.ui-dialog-buttonset button:nth-of-type(1)';
export const ORDER_SUBTOTAL = '.order-subtotal td:nth-child(2)';
export const BTN_UPDATE_CART = '.cart-footer button[name*="_updateCart"]';
export const BTN_CHECKOUT = 'button[name*="checkoutCart"]';
export const LINK_REMOVE = 'button[value="Remove"]';
export const ITEM_DETAILS = '.item-details';
export const ITEM_NAME = '.item-list .item-details .name';
export const ITEM_QUANTITY = '.item-quantity';
export const SELECT_STORE = '.set-preferred-store';
export const SELECTED_STORE_ADDRESS = '.selected-store-address';
export const STORE_ADDRESS_TEXT = '.store-list .store-tile:nth-of-type(1) .store-address';
export const STORE_LIST_CONTAINER = '.store-list-container';
export const ZIP_CODE_POP_UP = '#preferred-store-panel';

const basePath = '/cart';

// Pseudo private methods
function _createCssNthCartRow (idx) {
    return CART_ITEMS + ':nth-child(' + idx + ')';
}

// Public methods
export function navigateTo () {
    return browser.url(basePath);
}

export function removeItemByRow (rowNum) {
    var linkRemoveItem = _createCssNthCartRow(rowNum) + ' .item-user-actions button[value="Remove"]';
    return browser.click(linkRemoveItem)
        // TODO: Find a way to waitForVisible instead of this pause. When there
        // are more than one item in the cart, the page elements will be the same
        // after one item has been removed, so waitForVisible will resolve
        // immediately
        .pause(500);
}

export function verifyCartEmpty () {
    return browser.isExisting(CART_EMPTY);
}

export function getItemList () {
    return browser
        .waitForExist(CART_ITEMS, 5000)
        .elements(CART_ITEMS);
}

export function getItemNameByRow (rowNum) {
    let selector = _createCssNthCartRow(rowNum) + ' .name';
    return browser.waitForVisible(selector)
        .getText(selector);
}

export function getItemAttrByRow (rowNum, attr) {
    var itemAttr = _createCssNthCartRow(rowNum) + ' .attribute[data-attribute="' + attr + '"] .value';
    return browser.getText(itemAttr);
}
//get the quantity in Cart for a particular row
export function getQuantityByRow(rowNum) {
    var selector = [_createCssNthCartRow(rowNum), ITEM_QUANTITY, 'input'].join(' ');
    return browser.getValue(selector);
}

export function updateQuantityByRow (rowNum, value) {
    let selector = [_createCssNthCartRow(rowNum), ITEM_QUANTITY, 'input'].join(' ');
    return browser.waitForVisible(selector)
        .setValue(selector, value)
        .click(BTN_UPDATE_CART)
        // TODO: Replace with waitUntil to check for quantity change
        .pause(1000)
        .getValue(selector);
}

export function getPriceByRow (rowNum) {
    return browser.getText(_createCssNthCartRow(rowNum) + ' .item-total .price-total');
}

export function getSelectPriceByRow (rowNum, selection) {
    return browser.getText(_createCssNthCartRow(rowNum) + ' ' + selection);
}

export function getItemEditLinkByRow (rowNum) {
    return [_createCssNthCartRow(rowNum), ITEM_DETAILS, '.item-edit-details a'].join(' ');
}

export function updateAttributesByRow (rowNum, selection) {
    return browser
        .click(getItemEditLinkByRow(rowNum))
        .waitForVisible(productQuickView.CONTAINER)
        // We must deselect all attributes before selecting the new variant choice as the selectable attributes are
        // dependent on values that are currently selected.  By deselecting all attributes, we can be assured that the
        // sequence of selecting color, then size, then width will set the desired attributes as selectable.
        .then(() => productQuickView.deselectAllAttributes())
        .then(() => productQuickView.selectAttributesByVariant(selection));
}

/**
 * Retrieves the Cart's Sub-total value
 *
 */
export function getOrderSubTotal () {
    return browser.getText(ORDER_SUBTOTAL);
}

/**
 * Redirects the browser to the Cart page and empties the Cart.
 *
 */
export function emptyCart () {
    return navigateTo()
    .then(() => browser.elements('.item-quantity input'))
        .then(items => {
            if (items.value.length) {
                items.value.forEach(item =>
            browser.elementIdClear(item.ELEMENT)
                        .elementIdValue(item.ELEMENT, '0'));
                return browser.click(BTN_UPDATE_CART);
            }
        })
        // There are some products, like Gift Certificates, whose
        // quantities cannot be changed in the Cart. For these, we
        // must click the Remove link on each.
        .then(() => common.removeItems(LINK_REMOVE))
    .then(() => browser.waitForExist(CART_EMPTY));
}
