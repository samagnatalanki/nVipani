
'use strict';

var config = browser.params;

describe('Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');

    var tab = element(by.xpath('//md-tab-item[text()=\'Business Units\']'));

    beforeAll(function () {
        browser.get('http://localhost:3000/#!/signin');
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

    function selectBunitFunction(BusinessUnits,done){

        if(BusinessUnits) {
            BusinessUnits.forEach(function (unit) {
                    var selectbunit=element(by.xpath('//md-checkbox[../following-sibling::td[./span[text()=\''+unit+'\']]]'));
                if (unit) {
                    selectbunit.isPresent().then(function (res) {
                        if (res) {
                            selectbunit.click();
                        }
                        else
                            done(new Error("Invalid details for BusinessUnit-" + BusinessUnits.indexOf(unit)));
                    });
                }
                else
                    done(new Error("Missing details for BusinessUnit-" + BusinessUnits.indexOf(unit)));
            });
            done(null);
        }
        else
            done(new Error("Missing BusinessUnit Details"));
    }

    function groupActionFunction(action,done){
        if(action){
            var groupactionButton=element(by.xpath('//button[@aria-label=\'Group Actions\']'));
            groupactionButton.click();
            if(groupactionButton.isPresent() && groupactionButton.isDisplayed()) {
                var selectgroupaction=element(by.xpath('//button[@aria-label=\''+action+'\']'));
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

            selectBunitFunction(data.BusinessUnits,function (error,ele) {
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
