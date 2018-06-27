

'use strict';
var config = browser.params;

describe('Update a Contact',function () {

    var data = require('./updatecontactdata');
    var sign = require('../../account/common/sign.common');
    var editButton=element(by.xpath('//button[@aria-label=\'edit button\']'));
    var form=element(by.name('editContactForm'));
    var updateButton=element(by.xpath('//button[@aria-label=\'Update\']'));

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        element(by.id('nav-contacts')).click();
    });

    beforeEach(function () {

    });

    afterEach(function () {
        browser.sleep(1000);
        browser.refresh();
    });

    function typeFunction(type,updatetype,name,done) {

        if(type) {
            if (type === 'Customer' || type === 'Supplier') {
                if (type === 'Customer') {
                    element(by.xpath('//md-tab-item[text()=\'Customers\']')).click();
                }
                else if (type === 'Supplier') {
                    element(by.xpath('//md-tab-item[text()=\'Suppliers\']')).click();
                }

                if (name) {
                    var Name;
                    if (type === 'Customer')
                        Name = element(by.xpath('//*[@id=\'contact_Customers\']//td[contains(text(),\'' + name + '\')]'));
                    else if (type === 'Supplier')
                        Name = element(by.xpath('//*[@id=\'contact_Suppliers\']//td[contains(text(),\'' + name + '\')]'));
                    sign.isClickable(Name, function (error, ele) {
                        if (ele) {
                            ele.click();
                            editButton.click();
                            if (updatetype) {
                                var Type = form.element(by.model('contact.customerType'));
                                Type.click();
                                if (Type.isPresent() && Type.isDisplayed()) {
                                    var selecttype = form.element(by.xpath('//md-option[@value=\'' + updatetype + '\' and ../../../@aria-hidden=\'false\']'));
                                    selecttype.isPresent().then(function (res) {
                                        if (res)
                                            selecttype.click();
                                    });
                                }
                            }
                            done(null);
                        }
                        else
                            done(new Error(error));
                    });
                }
                else
                    done(new Error('Missing Name'));
            }
            else
                done(new Error('Invalid Type'));
        }
        else
            done(new Error('Missing Type'));
    }

    function basicinfoFunction(basicinfo){

        if(basicinfo){

            form.element(by.xpath('//md-tab-item[text()=\'Basic Info\']')).click();
            if (basicinfo.fName) {
                var fname = form.element(by.id('firstName'));
                fname.clear().then(function () {
                    fname.sendKeys(basicinfo.fName);
                });
            }
            if (basicinfo.mName) {
                var mname = form.element(by.id('middleName'));
                mname.clear().then(function () {
                    mname.sendKeys(basicinfo.mName);
                });
            }
            if(basicinfo.lName){
                var lname = form.element(by.id('lastName'));
                lname.clear().then(function () {
                    lname.sendKeys(basicinfo.lName);
                });
            }
            if(basicinfo.companyName){
                var companyname=form.element(by.id('companyName'));
                companyname.clear().then(function () {
                    companyname.sendKeys(basicinfo.companyName);
                });
            }
            if(basicinfo.payment){
                var payment=form.element(by.model('paymentTerm'));
                payment.click();
                if(payment.isPresent() && payment.isDisplayed()){
                    var selectpayment=form.element(by.xpath('//div[text()=\''+basicinfo.payment+'\']'));
                    sign.isClickable(selectpayment,function (error,ele) {
                        if(ele)
                            ele.click();
                    });
                }
            }
            if(basicinfo.gstinNo){
                var gstin=form.element(by.model('contact.gstinNumber'));
                gstin.clear().then(function () {
                    gstin.sendKeys(basicinfo.gstinNo);
                });
                gstin.getAttribute('aria-invalid').then(function (attr) {
                    if(attr === 'true'){
                        gstin.clear().then(function () {
                            gstin.sendKeys('');
                        });
                    }
                });
            }
        }
    }

    function phoneNoFunction(phoneNumber){

        var ele = element.all(by.xpath('//*[@id=\'contact_phone\']/div'));
        var addPhone = form.element(by.xpath('//*[@id=\'contact_phone\']//span[@aria-label=\'favourite\']'));
            if (phoneNumber) {
                var phonesTab = form.element(by.xpath('//md-tab-item[contains(text(),\'Phone\')]'));
                phonesTab.click();
                addPhone.click();
                phoneNumber.forEach(function (mobile) {
                    if(mobile.number) {
                        ele.count().then(function (count) {
                            var phone = form.element(by.id('mobile-' + (count-2)));
                            var type;
                            if (mobile.phoneType) {
                                type=mobile.phoneType;
                                if(type !== 'Mobile' && type !== 'Home' && type !== 'Work')
                                    type = 'Other';
                            }
                            else
                                type = 'Mobile';
                            var phonetype = phone.element(by.model('phone.phoneType'));
                            phonetype.click();
                            if(phonetype.isDisplayed()) {
                                var selectphonetype = form.element(by.xpath('//md-option[./div[text()=\''+type+'\'] and ../../../@aria-hidden=\'false\']'));
                                selectphonetype.click();
                            }
                            var phoneno = phone.element(by.id('phoneNumber'));
                            phoneno.sendKeys(mobile.number);
                            phoneno.getAttribute('aria-invalid').then(function (attr) {
                                if (attr === 'true') {
                                    phoneno.clear().then(function () {
                                        phoneno.sendKeys('');
                                    });
                                }
                                else{
                                    addPhone.click();
                                }
                            });
                        });
                    }
                });
            }
            ele.count().then(function (res) {
                var minusButton=form.element(by.id('mobile-'+(res-2))).element(by.xpath('.//md-icon[@aria-label=\'favourite\']'));
                if(res !== 2) {
                    minusButton.click();
                }
            });
    }

    function emailFunction(Email){

        var ele = element.all(by.xpath('//*[@id=\'contact_email\']/div'));
        var addEmail = form.element(by.xpath('//*[@id=\'contact_email\']//span[@aria-label=\'favourite\']'));
            if (Email) {
                var emailTab = form.element(by.xpath('//md-tab-item[contains(text(),\'Email\')]'));
                emailTab.click();
                addEmail.click();
                Email.forEach(function (mail) {
                    if(mail.mailid) {
                        ele.count().then(function (count) {
                            var email = form.element(by.id('email-' + (count-2)));
                            var type;
                            if (mail.emailType) {
                                type=mail.emailType;
                                if(type !== 'Work' && type !== 'Personal')
                                    type = 'Other';
                            }
                            else
                                type='Work';
                            var emailtype = email.element(by.model('email.emailType'));
                            emailtype.click();
                            if(emailtype.isDisplayed()) {
                                var selectemailtype = form.element(by.xpath('//md-option[./div[text()=\''+type+'\'] and ../../../@aria-hidden=\'false\']'));
                                selectemailtype.click();
                            }
                            var emailid = email.element(by.id('email'));
                            emailid.sendKeys(mail.mailid);
                            emailid.getAttribute('aria-invalid').then(function (attr) {
                                if (attr === 'true')
                                    emailid.clear().then(function () {
                                        emailid.sendKeys('');
                                    });
                                else {
                                    addEmail.click();
                                }
                            });
                        });
                    }
                });
            }
            ele.count().then(function (res) {
                var minusButton=form.element(by.id('email-'+(res-2))).element(by.xpath('.//md-icon[@aria-label=\'favourite\']'));
                if(res !== 2) {
                    minusButton.click();
                }
            });
    }

    function AddressType(type){
        if(type === 'Billing')
            return 0;
        else if(type === 'Shipping')
            return 1;
        else if(type === 'Receiving')
            return 2;
        else if(type === 'Invoice')
            return 3;
    }

    function addressFunction(address){

        if(address) {
            address.forEach(function (addr) {
                if (addr.addressLine || addr.city || addr.state || addr.country || addr.pinCode) {
                    var type;
                    if (addr.addressType) {
                        type = addr.addressType;
                    }
                    else {
                        type = "Billing";
                    }
                    var addressType = element(by.xpath('//form[@name=\'editContactForm\']//md-tab-item[text()=\'' + type + '\']'));
                    browser.driver.executeScript("arguments[0].scrollIntoView();", addressType.getWebElement());
                    //browser.driver.executeScript(form+'.scrollTo(0,0);');
                    addressType.click();
                    var ele = element.all(by.xpath('//form[@name=\'editContactForm\']//md-content[@id=\'' + type + '\']/div'));
                    ele.count().then(function (count) {
                        var addButton = form.element(by.id("companyAddAddresses-" + AddressType(type)));
                        addButton.click();
                        var addressElement = form.element(by.id(type + "-" + (count - 1)));
                        if (addr.addressLine) {
                            var addressline = addressElement.element(by.model('address.addressLine'));
                            addressline.sendKeys(addr.addressLine);
                        }
                        if (addr.city) {
                            var addresscity = addressElement.element(by.model('address.city'));
                            addresscity.sendKeys(addr.city);
                        }
                        if (addr.state) {
                            var addressState = addressElement.element(by.model('address.state'));
                            addressState.sendKeys(addr.state);
                        }
                        if (addr.country) {
                            var addresscountry = addressElement.element(by.model('address.country'));
                            addresscountry.sendKeys(addr.country);
                        }
                        if (addr.pinCode && (addr.pinCode.length === 6)) {
                            var addresspinCode = addressElement.element(by.model('address.pinCode'));
                            addresspinCode.sendKeys(addr.pinCode);
                        }
                    });
                }
            });
        }
    }

    data.forEach(function (contact) {
        it('should update a contact',function () {

            typeFunction(contact.type,contact.updatetype,contact.name,function (error) {
                if(error) {
                    console.log(error);
                    return;
                }

                var contactName=form.element(by.xpath('//*[@id=\'displayName\' and @aria-invalid=\'false\']'));
                if(contact.updatename) {
                    contactName.clear().then(function () {
                        contactName.sendKeys(contact.updatename);
                    });
                }

                basicinfoFunction(contact.basicInfo);

                phoneNoFunction(contact.phoneNumber);

                emailFunction(contact.email);

                addressFunction(contact.address);

                updateButton.click();
            });
        });
    });
});
