
'use strict';

var config = browser.params;

describe('Sign in',function () {

    var data=require('./signindata');
    var signin=require('../common/sign.common');

    beforeEach(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
    });

    afterEach(function () {
        browser.sleep(1000);
    });

    data.forEach(function (data) {
        it('Should Login',function () {

            if(signin.validateUserRegisteredData(data.username,data.password)) {

                var username = element(by.model('credentials.username'));
                var password = element(by.model('credentials.password'));
                var button = element(by.xpath('//form[@name=\'signup\']/button[@aria-label=\'Login\']'));

                username.sendKeys(data.username);
                password.sendKeys(data.password);

                username.getAttribute('aria-invalid').then(function (attr) {
                    if(attr === 'false'){
                        var unknown=element(by.xpath('//p[@data-ng-bind=\'error\' and ../../@name=\'signup\']'));
                        button.click();
                        unknown.isPresent().then(function (res) {
                            if(res){
                                unknown.getText().then(function (txt) {
                                    var text = txt;
                                    if (text)
                                        console.log(text);
                                });
                            }
                            else {
                                signin.logout();
                            }
                        });
                    }
                    else
                        console.log('Invalid Username');
                });
            }
            else
                console.log('Missing Username/ Password');
        });
    });
});
