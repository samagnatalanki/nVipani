

'use strict';
var config = browser.params;

describe('Create a Group',function () {
    var i=0;
    var data = require('./cg');
    var sign = require('../../account/common/sign.common');
    var form = element(by.name('addGroupForm'));

    beforeAll(function () {
        browser.get('');
        sign.login(data[0]);
        element(by.id('nav-contacts')).click();
    });

    beforeEach(function () {
        element(by.xpath('//md-tab-item[text()=\'Groups\']')).click();
        var addGroup = element(by.id('contact_Groups')).element(by.id('create-group'));
        var newGroup = element(by.id('contact_Groups')).element(by.id('menu'));
        var groupAdd = element(by.xpath('//button[@aria-label=\'New Group\' and ../../../@aria-hidden=\'false\']'));
        sign.isClickable(addGroup, function (error, ele) {
            if (ele) {
                ele.click();
            }
            else {
                sign.isClickable(newGroup, function (error, ele) {
                    if (ele) {
                        ele.click();
                        sign.isClickable(groupAdd, function (error, ele) {
                            if (ele)
                                ele.click();
                            else
                                console.log(error);
                        });
                    }
                    else {
                        console.log(error);
                    }
                });
            }
        });
    });

    afterEach(function () {
        browser.sleep(1000);
        browser.refresh();
    });

    function groupInfoFunction(type,name,description,done) {
        if(type){
            var grouptype=element(by.xpath('//md-select[@ng-model=\'groupType\']'));
            grouptype.click();
            if(grouptype.isPresent() && grouptype.isDisplayed()){
                var selectgrouptype=element(by.xpath('//md-option[./div[text()=\''+type+'\']]'));
                sign.isClickable(selectgrouptype,function (error,ele) {
                    if(ele){
                        ele.click();

                        if(name){
                            var groupname=element(by.id('name'));
                            groupname.sendKeys(name);

                            if(description){
                                var groupdescription=element(by.id('description'));
                                groupdescription.sendKeys(description);
                            }

                            done(null);
                        }
                        else{
                            console.log("Missing Group Name");
                        }
                            //console.log('Missing Group Name'));
                    }
                    else{
                        console.log("Invalid Group Type");
                    }
                        //console.log('Invalid Group Type'));
                });
            }
        }
        else{
            console.log("Missing type");       
            //console.log('Missing Group Type'));
    
        }
    }

    function customContactsGroup(contactName) {

        contactName.forEach(function (name) {
            var selectcontact = element(by.xpath('//md-checkbox[@aria-label=\'Contact Selection\' and ../../td[contains(text(),\'' + name + '\')]]'));
            sign.isClickable(selectcontact, function (error, ele) {
                if (ele) {
                    ele.click();
                }
                else
                console.log("No such Customer -"+name);
            });
        });
    }

    function locationCriteriaContactsGroup(address) {

        if(address.addressCity) {
            var addresscity = form.element(by.model('address.city'));
            addresscity.sendKeys(address.addressCity);
        }

        if(address.addressState){
            var addressstate=form.element(by.model('address.state'));
            addressstate.sendKeys(address.addressState);
        }

        if(address.addressCountry){
            var addresscountry=form.element(by.model('address.country'));
            addresscountry.sendKeys(address.addressCountry);
        }

        var addresspincode=form.element(by.model('address.pinCode'));
        addresspincode.sendKeys(address.pinCode);
    }

    function addContactsFunction(contacts,done){
        if(contacts) {
            if (contacts.type) {
                var contacttype = element(by.model('groupClassification.classificationType'));
                contacttype.click();
                if (contacttype.isPresent() && contacttype.isDisplayed()) {
                    var selectcontacttype = element(by.xpath('//md-option[./div[text()=\'' + contacts.type + '\']]'));
                    sign.isClickable(selectcontacttype, function (error, ele) {
                        if (ele) {
                            ele.click();

                            if (contacts.type === 'Custom') {
                                if (contacts.contactName) {
                                    customContactsGroup(contacts.contactName);
                                }
                                done(null);
                            }
                            else if (contacts.type === 'Location Criteria') {
                                //console.log("locc");
                                if (contacts.address) {
                                    if (contacts.address.pinCode && !isNaN(contacts.address.pinCode) && contacts.address.pinCode.length === 6) {
                                        locationCriteriaContactsGroup(contacts.address);
                                        done(null);
                                    }
                                    else
                                        console.log('Invalid PinCode');
                                }
                                else
                                    console.log("Missing PinCode");
                            }
                            else
                                done(null);
                        }
                        else
                            console.log('Invalid Contact Selection type');
                    });
                }
            }
            else {
                customContactsGroup();
                done(null);
            }
        }
        else
            done(null);
    }

    data.forEach(function (group) {
        it('should create a group',function () {
            console.log("Test -"+i);
            i++;
            groupInfoFunction(group.groupType,group.groupName,group.groupDescription,function (error) {
                if(error){
                    console.log(error);
                    return;
                }

                addContactsFunction(group.contacts,function (error) {
                    if(error){
                        console.log(error);
                        return;
                    }

                    var createButton=element(by.id('createGroup'));
                    createButton.click();

                    /*if(group.contacts.type === 'All')
                    {
                        console.log("ALL");
                        var createdGroup=element(by.xpath('//td[contains(text(),\''+group.groupName+'\')]'));
                        sign.isClickable(createdGroup, function (error, ele) {
                            if (ele) {
                                ele.click();
                            }
                            else
                            console.log("No such Customer -"+name);
                        });
                    }*/
                
                });
            });
        });
    });
});
