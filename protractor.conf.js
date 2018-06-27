'use strict';

// Protractor configuration
var config = {
    troubleshoot: true,
    baseUrl: 'http://staging.nvipani.com/#!/',
    onPrepare: function () {
        browser.driver.manage().window().maximize();
        /* browser.get('#!/register');*/
        /* browser.get('!#/register');*/
    },
    suites: {
        registration: ['ee/ee/account/signup/*.js',
            'e2e/account/signin/*.spec.js'],
        contacts: ['e2e/contacts/createcontact/*.spec.js*',
            'e2e/contacts/editcontact/*.spec.js*',
            'e2e/contacts/creategroup/*.spec.js*'],
        products: ['e2e/products/createproduct/*.spec.js',
            'e2e/products/editproduct/*.spec.js',
            'e2e/products/importproducts/*.spec.js'],
        all: ['e2e/account/signup/*.spec.js',
            'e2e/account/signin/*.spec.js',
            'e2e/products/createproduct/*.spec.js',
            'e2e/products/editproduct/*.spec.js',
            'e2e/products/importproducts/*.spec.js',
            'e2e/contacts/createcontact/*.spec.js*',
            'e2e/contacts/editcontact/*.spec.js*',
            'e2e/contacts/creategroup/*.spec.js*',
            'e2e/businessuser/createbusinessuser/*.spec.js*',
            'e2e/businessuser/editbusinessuser/*.spec.js*',
            'e2e/businessunit/createbusinessunit/*.spec.js*',
            'e2e/businessunit/editbusinessunit/*.spec.js*',
            'e2e/updatecompanyinfo/*.spec.js*']
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        defaultTimeoutInterval: 360000
    }
};
/*config.capabilities = {
    //browserName: 'chrome',
    browserName: 'chrome',
        /!*
         * Can be used to specify the phantomjs binary path.
         * This can generally be ommitted if you installed phantomjs globally.
         *!/
        'phantomjs.binary.path': require('phantomjs-prebuilt').path,

        /!*
         * Command line args to pass to ghostdriver, phantomjs's browser driver.
         * See https://github.com/detro/ghostdriver#faq
         *!/
        'phantomjs.ghostdriver.cli.args': ['--loglevel=Error']
};*/



config.multiCapabilities = [
    { browserName: 'chrome' }
];
exports.config = config;
