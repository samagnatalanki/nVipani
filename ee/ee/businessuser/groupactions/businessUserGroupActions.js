'use strict';

var config = browser.params;

describe('Business User Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');
    var tab = element(by.xpath('//md-tab-item[text()=\'Business Users\']'));
    var selectbuser=[];

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
    });

    afterEach(function () {
        browser.sleep(1000);
        sign.logout();
    });

    function selectBusersFunction(BusinessUsers, done) {
        if (BusinessUsers) {
            BusinessUsers.forEach(function (user) {
                selectbuser.push(element(by.xpath('//md-checkbox[../..//td[text()=\'' + user + '\']]')));
            });
            for(var ele in selectbuser){
                ele = element(ele);
                ele.click();
            }
                /*selectbuser.getAttribute('class').then(function(text){
                    console.log("A"+text);
                })
                selectbuser.isPresent().then(function (res) {
                    if (res) {
                        selectbuser.click();
                    }
                    else {
                        done(new Error("Invalid details for BusinessUser-" + user));
                    }
                });*/
        }
        else
            done(new Error("Missing BusinessUser Details in Data Set"));
    }

    function groupActionFunction(action, done) {
        if (action) {
            var groupactionButton = element(by.xpath('//button[@aria-label=\'Group Actions\']'));
            groupactionButton.click();
            if (groupactionButton.isPresent() && groupactionButton.isDisplayed()) {
                var selectgroupaction = element(by.xpath('//button[@aria-label=\'' + action + '\']'));
                sign.isClickable(selectgroupaction, function (error, ele) {
                    if (ele) {
                        selectgroupaction.click();
                        if (action == "Enable" || action == "Disable") {
                            tab.click(); var toast = element(by.xpath('//md-toast'));
                            toast.isPresent().then(function (res) {
                                if (res)
                                    done(new Error('user needs to be registered'));
                            });
                        }
                        else if (action == "Delete") {
                            done('Delete User Successful');
                        }
                    }
                    else
                        done(new Error(error));
                });
            }
            else
                done(new Error('Group Action Button not present'));
        }
        else
            done(new Error('Missing Action'));
    }


    data.forEach(function (obj) {
        it('should do a group action', function () {

            sign.login(obj);
            sign.companyProfile();
            tab.click();

            selectBusersFunction(obj.BusinessUsers, function (error, ele) {
                if (error) {
                    console.log(error);
                    return;
                }
            });
            /*groupActionFunction(obj.action, function (error) {
                if (error) {
                    console.log(error);
                    return;
                }
            });*/
        });
    });
});