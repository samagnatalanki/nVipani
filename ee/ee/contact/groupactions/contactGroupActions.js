
'use strict';

var config = browser.params;

describe('Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');


    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
    });

    afterEach(function () {
        //browser.refresh();
        browser.sleep(1000);
    });

    afterAll(function () {
        sign.logout();
    });

    function selectContactFunction(type,contacts,done) {

        if (type) {
            var ele=element(by.xpath('//md-tab-item[text()=\''+type+'\']'));
            ele.isPresent().then(function (res) {
                if(res){
                    ele.click();
                    if (contacts) {
                        contacts.forEach(function (contact) {
                            var selectcontact = element(by.xpath('//*[@id=\'contact_' + type + '\']//md-checkbox[@ng-model=\'contact.selected\' and ../..//td[contains(text(),\'' + contact + '\')]]'));
                            if (contact) {
                                selectcontact.isPresent().then(function (res) {
                                    if (res) {
                                        selectcontact.click();
                                    }
                                    else
                                        done(new Error("Invalid details for Contact-" + contacts.indexOf(contact)));
                                });
                            }
                            else
                                done(new Error("Missing details for Contact-" + contacts.indexOf(contact)));
                        });
                        done(null);
                    }
                    else
                        done(new Error("Missing Contact Details"));
                }
                else
                    done(new Error('Invalid Type'));
            });
        }
        else
            done(new Error('Missing Type'));
    }

    function groupActionFunction(type,action,done){
        if(action){
            var groupactionButton=element(by.xpath('//*[@id=\'contact_' + type +'\']//button[@aria-label=\'Group Actions\']'));
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


    data.forEach(function (obj) {

        it('should do a group action', function () {

            sign.login(obj);
            element(by.id('nav-contacts')).click();
            selectContactFunction(obj.type,obj.Contacts,function (error,ele) {
                if(error){
                    console.log(error);
                    return;
                }
                
                groupActionFunction(data.type,data.action,function (error) {
                    if(error){
                        console.log(error);
                        return;
                    }
                });
            });
        });
    });
});
