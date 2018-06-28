
'use strict';

var config = browser.params;

describe('Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');

    var tab = element(by.xpath('//md-tab-item[text()=\'Business Users\']'));

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        sign.companyProfile();
    });

    beforeEach(function () {
        tab.click();
    });

    afterEach(function () {
        //browser.refresh();
        browser.sleep(1000);
    });

    afterAll(function () {
        sign.logout();
    });

    function selectBusersFunction(BusinessUsers, done) {
        if (BusinessUsers) {
            BusinessUsers.forEach(function (user) {
                var selectbuser = element(by.xpath('//md-checkbox[../..//td[text()=\'' + user + '\']]'));
                if (user) {
                    selectbuser.isPresent().then(function (res) {
                        if (res) {
                            selectbuser.click();
                        }
                        else
                            done(new Error("Invalid details for BusinessUser-" + BusinessUsers.indexOf(user)));
                    });
                }
                else
                    done(new Error("Missing details for BusinessUser-" + BusinessUsers.indexOf(user)));
            });
            done(null);
        }
        else
            done(new Error("Missing BusinessUser Details"));
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
                        var toast = element(by.xpath('//md-toast'));
                        toast.isPresent().then(function (res) {
                            if (res)
                                done(new Error('user needs to be registered'));
                        });
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

            selectBusersFunction(obj.BusinessUsers, function (error, ele) {
                if (error) {
                    console.log(error);
                    return;
                }

                /*groupActionFunction(obj.action, function (error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                });*/
            });
        });
    });
});