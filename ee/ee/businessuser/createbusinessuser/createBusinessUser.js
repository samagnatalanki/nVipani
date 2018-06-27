

'use strict';

var config = browser.params;

describe('Add Business User',function () {

    var data=require('./createbusinessuserdata');
    var sign=require('../../account/common/sign.common');

    var tab=element(by.xpath('//md-tab-item[text()=\'Business Users\']'));
    var addBusinessUser=element(by.id('add-business-user'));
    var userGroup=element(by.xpath('//md-select[@ng-model=\'businessUser.userGroup\']'));
    var emailId=element(by.model('businessUser.username'));
    var createBusinessUser=element(by.id('create-business-user'));
    var verifyBusinessUser=element(by.xpath('//div[@data-ng-show=\'success\' and ../../../@name=\'addBusinessUserForm\']'));
    var closeButton=element(by.id('close-add-business-user'));

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        sign.companyProfile();
    });

    beforeEach(function () {
        tab.click();
    });

    afterEach(function () {
        browser.refresh();
    });

    afterAll(function () {
        sign.logout();
    });

    function userGroupFunction(usergroup,done){
        userGroup.click();
        if(userGroup.isDisplayed()){
            var selectusergroup=element(by.id(''+usergroup));
            sign.isClickable(selectusergroup,function (error,ele) {
                if(ele) {
                    selectusergroup.click();
                    done(null,null);
                }
                else
                    done(error,ele);
            });
        }
    }

    function emailFunction(email,done){
        if(email){
            emailId.sendKeys(email);
            emailId.getAttribute('aria-invalid').then(function (attr) {
                if(attr === 'true')
                    emailId.clear().then(function () {
                        emailId.sendKeys('');
                        done("Invalid Email",emailId);
                    });
                else
                    done(null,null);
            });
        }
        else
            done("Missing Email",email);
    }

    function VerifyBusinessUser(password){

        //var EC = protractor.ExpectedConditions;
        //browser.wait(EC.visibilityOf(verifyBusinessUser), 5000);

        verifyBusinessUser.getText().then(function (txt) {
            console.log('hi');
            var text = txt.split(". ");
            text.then(function (slices) {
                console.log('hey');
                var verify=slices[1].split(" is");
                console.log(verify[0]);
                closeButton.click();
                sign.logout();
                browser.getCurrentUrl().then(function () {
                    browser.set(verify[0]);
                    var passWord = element(by.id('businessuserpassword'));
                    browser.wait(EC.visibilityOf(passWord), 5000);
                    passWord.sendKeys(password);
                    var activateButton=element(by.id('activate'));
                    activateButton.click();
                    sign.logout();
                });
            });
        });
    }

    data.forEach(function (data) {
        it('should add a Business User', function () {
            addBusinessUser.click();

            userGroupFunction(data.usergroup,function (error,ele) {
                if(error){
                    console.log(error);
                    return;
                }

                emailFunction(data.email,function (error,ele) {
                    if(error){
                        console.log(error);
                        return;
                    }

                    sign.isClickable(createBusinessUser,function (error,ele) {
                        if(ele){
                            createBusinessUser.click();

                            var alreadyUsedUser=element(by.xpath('//md-toast[.//span[contains(text(),\'User is already used for some other company\')]]'));
                            alreadyUsedUser.isPresent().then(function (res) {
                                if(res){
                                    console.log("User is already used for some other company");
                                }
                                else {
                                    if (data.password && (data.password.length > 7)) {
                                        browser.sleep(5000);
                                        VerifyBusinessUser(data.password);
                                        sign.login(data[0]);
                                        sign.companyProfile();
                                    }
                                }
                            });
                        }
                        else {
                            console.log(error);
                            return;
                        }
                    });
                });
            });
        });
    });
});
