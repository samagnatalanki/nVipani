'use strict';

// Protractor configuration
var config = {
    troubleshoot: true,
    baseUrl: 'http://staging.nvipani.com/#!/',
    onPrepare: function () {
        browser.driver.manage().window().maximize();
    },
    suites: {
        registration: ['ee/ee/account/signup/*.js',
            'ee/ee/account/signin/*.js'],
        contacts: ['e2e/contacts/createcontact/*.js*',
            'e2e/contacts/editcontact/*.js*',
            'e2e/contacts/creategroup/*.js*'],
        products: ['e2e/products/createproduct/*.js',
            'e2e/products/editproduct/*.js',
            'e2e/products/importproducts/*.js'],
        all: ['e2e/account/signup/*.js',
            'e2e/account/signin/*.js',
            'e2e/products/createproduct/*.js',
            'e2e/products/editproduct/*.js',
            'e2e/products/importproducts/*.js',
            'e2e/contacts/createcontact/*.js*',
            'e2e/contacts/editcontact/*.js*',
            'e2e/contacts/creategroup/*.js*',
            'e2e/businessuser/createbusinessuser/*.js*',
            'e2e/businessuser/editbusinessuser/*.js*',
            'e2e/businessunit/createbusinessunit/*.js*',
            'e2e/businessunit/editbusinessunit/*.js*',
            'e2e/updatecompanyinfo/*.js*']
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        defaultTimeoutInterval: 360000
    }
};

config.multiCapabilities = [
    { browserName: 'chrome' }
];
exports.config = config;