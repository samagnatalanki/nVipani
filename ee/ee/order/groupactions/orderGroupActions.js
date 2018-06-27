
'use strict';

var config = browser.params;

describe('Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');


    beforeAll(function () {
        browser.get('http://localhost:3000/#!/signin');
        sign.login(data[0]);
    });

    beforeEach(function () {
        element(by.id('nav-orders')).click();
    });

    afterEach(function () {
        browser.sleep(1000);
    });

    afterAll(function () {
        sign.logout();
    });

    function selectOrderFunction(orders,done){

        if(orders) {
            orders.forEach(function (order) {
                var selectorder=element(by.xpath('//md-checkbox[../following-sibling::td[./h5[text()=\''+order+'\']]]'));
                if (order) {
                    selectorder.isPresent().then(function (res) {
                        if (res) {
                            selectorder.click();
                        }
                        else
                            done(new Error("Invalid details for Order-" + orders.indexOf(order)));
                    });
                }
                else
                    done(new Error("Missing details for Order-" + orders.indexOf(order)));
            });
            done(null);
        }
        else
            done("Missing Orders",null);
    }

    function groupActionFunction(action,done){
        if(action){
            var groupactionButton=element(by.xpath('//button[@aria-label=\'Group Actions\']'));
            groupactionButton.click();
            if(groupactionButton.isPresent() && groupactionButton.isDisplayed()) {
                var selectgroupaction=element(by.xpath('//button[@aria-label=\''+action+'\' and ../../../@aria-hidden=\'false\']'));
                sign.isClickable(selectgroupaction,function (error,ele) {
                    if(ele)
                        selectgroupaction.click();
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


    data.forEach(function (data) {

        it('should do a group action', function () {

            selectOrderFunction(data.Orders,function (error,ele) {
                if(error){
                    console.log(error);
                    return;
                }

                groupActionFunction(data.action,function (error) {
                    if(error){
                        console.log(error);
                        return;
                    }
                });
            });
        });
    });
});
