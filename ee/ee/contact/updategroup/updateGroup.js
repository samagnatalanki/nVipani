

'use strict';
var config = browser.params;

describe('Update a Group',function () {

    var data = require('./updategroupdata');
    var sign = require('../../account/common/sign.common');
    var editButton=element(by.xpath('//button[@aria-label=\'edit button\']'));
    var updateButton=element(by.xpath('//button[@aria-label=\'Update\']'));

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        element(by.id('nav-contacts')).click();
    });

    beforeEach(function () {
        element(by.xpath('//md-tab-item[text()=\'Groups\']')).click();
    });

    afterEach(function () {
        browser.sleep(1000);
        browser.refresh();
    });

    function groupInfoFunction(type,name,description,done) {

        if(name){
            var groupname=element(by.id('name'));
            groupname.clear().then(function () {
                groupname.sendKeys(name);
            });
        }

        if(description){
            var groupdescription=element(by.id('description'));
            groupdescription.clear().then(function () {
                groupdescription.sendKeys(description);
            });
        }

        if(type){
            var grouptype=element(by.xpath('//md-select[@ng-model=\'group.groupType\']'));
            grouptype.click();
            if(grouptype.isPresent() && grouptype.isDisplayed()){
                var selectgrouptype=element(by.xpath('//md-option[./div[text()=\''+type+'\'] and ../../../@aria-hidden=\'false\']'));
                sign.isClickable(selectgrouptype,function (error,ele) {
                    if(ele) {
                        ele.click();
                        done(null);
                    }
                    else
                        done(new Error('Invalid Group Type'));
                });
            }
        }
        else
            done(null);
    }

    function addContactsFunction(contacts){
        if(contacts){
            var search=element(by.xpath('//input[@aria-label=\'Search for Contacts to add to Group\']'));
            contacts.forEach(function (contact) {
                search.sendKeys(contact);
                var selectContact=element(by.xpath('//li[.//text()=\''+contact+'\']'));
                sign.isClickable(selectContact,function (error,ele) {
                    if(ele){
                        ele.click();
                    }
                    else
                        search.clear().then(function () {
                            search.sendKeys('');
                        });
                });
            });
        }
    }

    data.forEach(function (group) {

        it('should update a group',function () {

            if(group.groupName) {
                var Name = element(by.xpath('//*[@id=\'contact_Groups\']//td[contains(text(),\'' + group.groupName + '\')]'));
                sign.isClickable(Name,function (error,ele) {
                   if(ele) {
                       ele.click();

                       editButton.click();

                       groupInfoFunction(group.groupType,group.groupName,group.groupDescription,function (error) {
                          if(error) {
                              console.log(error);
                              return;
                          }

                          addContactsFunction(group.contacts);

                          updateButton.click();
                       });
                   }
                   else
                       console.log(error);
                });
            }
            else
                console.log('Missing Group Name');
        });
    });
});
