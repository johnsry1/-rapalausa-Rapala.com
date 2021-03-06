'use strict';

/**
 * Requirement : Home and Work addresses for the test user should be available before test starts
 */
import {assert} from 'chai';
import * as addressPage from '../pageObjects/addressBook';
import * as testData from '../pageObjects/testData/main';
import * as loginForm from '../pageObjects/helpers/forms/login';
import * as navHeader from '../pageObjects/navHeader';
import {config} from '../webdriver/wdio.conf';
import * as customers from '../pageObjects/testData/customers';


describe('Address', () => {
    let login = 'testuser1@demandware.com';
    let locale = config.locale;

    let testAddressEditedTextTitle = 'Test Address Edited';
    let testAddressTitle = 'ZZZZZ Test Address';

    let addressFormData = {};
    let editAddressFormData = {};

    before(() => testData.load()
        .then(() => {
            const customer = testData.getCustomerByLogin(login);
            const address = customer.getPreferredAddress();

            customer.addresses[0].postalCode = customers.globalPostalCode[locale];
            customer.addresses[0].countryCode = customers.globalCountryCode[locale];
            customer.addresses[0].phone = customers.globalPhone[locale];

            addressFormData = {
                addressid: 'ZZZZZ Test Address',
                firstname: 'The Muffin',
                lastname: 'Mann',
                address1: '211 Drury Lane',
                city: 'Far Far Away',
                postal: address.postalCode,
                country: address.countryCode,
                phone: address.phone
            };
            if (locale && locale === 'x_default') {
                addressFormData.states_state = address.stateCode;
            }

            editAddressFormData = {
                addressid: 'Test Address Edited',
                firstname: 'The Muffin',
                lastname: 'Mann',
                address1: '211 Drury Lane',
                city: 'Far Far Away',
                postal: address.postalCode,
                country: address.countryCode,
                phone: address.phone
            };
            if (locale && locale === 'x_default') {
                editAddressFormData.states_state = address.stateCode;
            }
        })
        .then(() => addressPage.navigateTo())
        .then(() => loginForm.loginAsDefaultCustomer())
        .then(() => browser.waitForVisible(addressPage.LINK_CREATE_ADDRESS))
        .then(() => addressPage.removeAddresses())

    );

    // We have deleted all of the address except for 'Home' and 'Work'.
    // When all other address are deleted there is no default address.
    // Clicking MAKE_DEFAULT_ADDRESS selects the last address and maske that the defualt.
    // This sets the addressBook back to the original import set up.
    // This is becasue the addresses are displayed in alphabetical order. When the other address
    // are deleted Home is displayed before Work everytime.
    // This allows for 'Home' to be set as the default.

    after(() => browser.refresh()
        .then(() => browser.click(addressPage.MAKE_DEFAULT_ADDRESS))
        .then(() => navHeader.logout())
    );

    it('should bring up the address form', () =>
        browser.click(addressPage.LINK_CREATE_ADDRESS)
            .then(() => browser.waitForVisible(addressPage.FORM_ADDRESS))
            .then(() => browser.isVisible(addressPage.FORM_ADDRESS))
            .then(visible => assert.isTrue(visible))
    );

    it('should fill out the form to add test address', () =>
        addressPage.fillAddressForm(addressFormData)
            .then(() => browser.click(addressPage.BTN_FORM_CREATE))
            .then(() => browser.waitUntil(() =>
                browser.getText(addressPage.LAST_ADDRESS_TITLE)
                    .then(
                        text => text === testAddressTitle,
                        () => false
                    )
                ))
            .then(() => browser.getText(addressPage.LAST_ADDRESS_TITLE))
            .then(displayText => assert.equal(displayText, testAddressTitle))
    );

    it('should edit Test Address', () =>
        addressPage.editAddress(testAddressTitle, editAddressFormData)
            .then(() => browser.waitUntil(() =>
                addressPage.getAddressTitles()
                    .then(
                        titles => titles.indexOf(editAddressFormData.addressid) > -1,
                        () => false
                    )
            ))
            .then(() => browser.getText(addressPage.TITLE_ADDRESS_SELECTOR))
            .then(addressTexts =>
                assert.isAbove(addressTexts.indexOf(testAddressEditedTextTitle), -1,
                    testAddressEditedTextTitle + 'is found in the address')
            )
    );

    it('should make the Last Address (test address) the default address', () => {
        let targetTitle;
        return browser.getText(addressPage.LAST_ADDRESS_TITLE)
            .then(title => targetTitle = title)
            .then(() => browser.click(addressPage.MAKE_LAST_DEFAULT_ADDRESS)
                .getText(addressPage.FIRST_ADDRESS_TITLE)
            )
            .then(defaultTitle => assert.equal(defaultTitle, targetTitle));
    });

    it('should delete unused addresses', () =>
        addressPage.removeAddresses()
            .then(() => addressPage.getAddressCount())
            .then(() => browser.getText(addressPage.TITLE_ADDRESS_SELECTOR))
            .then(titlesLeft => assert.deepEqual(titlesLeft.sort(), ['Home', 'Work']))
    );

});
