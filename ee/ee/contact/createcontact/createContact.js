
'use strict';
var config = browser.params;

describe('Create a Contact',function () {

    var data = require('./createcontactdata');
    var sign=require('../../account/common/sign.common');
    var form=element(by.name('addContactsForm'));

    beforeAll(function () {
        browser.get('http://localhost:3000/#!/signin');
        sign.login(data[0]);
        element(by.id('nav-contacts')).click();
    });

    beforeEach(function () {

    });

    afterEach(function () {
        browser.sleep(1000);
        browser.refresh();
    });

    function typeFunction(type,done) {

        var addContact,newContact,contactAdd;
        if(type) {
            if (type === 'Customer' || type === 'Supplier') {
                if (type === 'Customer') {
                    element(by.xpath('//md-tab-item[text()=\'Customers\']')).click();
                    addContact = element(by.id('contact_Customers')).element(by.id('create-customer'));
                    newContact = element(by.id('contact_Customers')).element(by.id('menu'));
                    contactAdd = element(by.xpath('//button[@aria-label=\'New Contact\' and ../../../@aria-hidden=\'false\']'));
                }
                else if (type === 'Supplier') {
                    element(by.xpath('//md-tab-item[text()=\'Suppliers\']')).click();
                    addContact = element(by.id('contact_Suppliers')).element(by.id('create-supplier'));
                    newContact = element(by.id('contact_Suppliers')).element(by.id('menu'));
                    contactAdd = element(by.xpath('//button[@aria-label=\'New Contact\' and ../../../@aria-hidden=\'false\']'));

                }
                sign.isClickable(addContact, function (error, ele) {
                    if (ele) {
                        ele.click();
                    }
                    else {
                        sign.isClickable(newContact, function (error, ele) {
                            if (ele) {
                                ele.click();
                                sign.isClickable(contactAdd, function (error, ele) {
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
                done(null);
            }
            else
                done(new Error('Invalid Type'));
        }
        else
            done(new Error('Missing Type'));
    }

    function basicinfoFunction(basicinfo,done){

        if(basicinfo){
            var contactName=form.element(by.id('displayName'));
            if(basicinfo.name){
                contactName.sendKeys(basicinfo.name);
                var showMore=form.element(by.xpath('//div[@aria-label=\'Show More Or Less Link\']'));
                if(basicinfo.fName || basicinfo.mName || basicinfo.lName || basicinfo.companyName || basicinfo.gstinNo || basicinfo.aadharNo || basicinfo.payment) {
                    showMore.click();
                    if (basicinfo.fName) {
                        var fname = form.element(by.model('firstName'));
                        fname.sendKeys(basicinfo.fName);
                    }
                    if (basicinfo.mName) {
                        var mname = form.element(by.model('middleName'));
                        mname.sendKeys(basicinfo.mName);
                    }
                    if(basicinfo.lName){
                        var lname = form.element(by.model('lastName'));
                        lname.sendKeys(basicinfo.lName);
                    }
                    if(basicinfo.companyName){
                        var companyname=form.element(by.id('companyName'));
                        companyname.sendKeys(basicinfo.companyName);
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
                        var gstin=form.element(by.model('gstinNumber'));
                        gstin.sendKeys(basicinfo.gstinNo);
                        gstin.getAttribute('aria-invalid').then(function (attr) {
                            if(attr === 'true'){
                                gstin.clear().then(function () {
                                    gstin.sendKeys('');
                                });
                            }
                        });
                    }
                    if(basicinfo.aadharNo){
                        var aadhar=form.element(by.model('contact.aadharNumber'));
                        aadhar.sendKeys(basicinfo.aadharNo);
                        aadhar.getAttribute('aria-invalid').then(function (attr) {
                            if(attr === 'true'){
                                aadhar.clear().then(function () {
                                    aadhar.sendKeys('');
                                });
                            }
                        });
                    }
                    done(null);
                }
            }
            else
                done(new Error("Missing Name"));
        }
        else
            done(new Error("Missing Basic Info"));
    }

    function phoneNoFunction(phoneNumber){

        var ele = element.all(by.xpath('//div[./div[@id=\'mobile-0\']]/div'));
        ele.count().then(function (val) {
            if (phoneNumber) {
                phoneNumber.forEach(function (mobile) {
                    if(mobile.number) {
                        ele.count().then(function (count) {
                            var phone = form.element(by.id('mobile-' + (count-val)));
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
                                    var addPhone = form.element(by.xpath('//*[@id=\'mobile-0\']//md-icon[@aria-label=\'favourite\']'));
                                    addPhone.click();
                                }
                            });
                        });
                    }
                });
            }
            ele.count().then(function (res) {
                var minusButton=form.element(by.id('mobile-'+(res-val))).element(by.xpath('.//md-icon[@aria-label=\'favourite\']'));
                if(res !== val) {
                    minusButton.click();
                }
            });
        });
    }

    function emailFunction(Email){

        var ele = element.all(by.xpath('//div[./div[@id=\'mobile-0\']]/div'));
        ele.count().then(function (val) {
            if (Email) {
                Email.forEach(function (mail) {
                    if(mail.mailid) {
                        ele.count().then(function (count) {
                            var email = form.element(by.id('email-' + (count-val)));
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
                                    var addEmail = form.element(by.xpath('//*[@id=\'email-0\']//md-icon[@aria-label=\'favourite\']'));
                                    addEmail.click();
                                }
                            });
                        });
                    }
                });
            }
            ele.count().then(function (res) {
                var minusButton=form.element(by.id('email-'+(res-val))).element(by.xpath('.//md-icon[@aria-label=\'favourite\']'));
                if(res !== val) {
                    minusButton.click();
                }
            });
        });
    }

    function validatephonemailFunction(phoneNumber,emailId,done){

        phoneNoFunction(phoneNumber);
        emailFunction(emailId);
        form.element(by.id('mobile-0')).element(by.id('phoneNumber')).getAttribute('aria-invalid').then(function (attr) {
            if(attr === 'true'){
                form.element(by.id('email-0')).element(by.id('email')).getAttribute('aria-invalid').then(function (atr) {
                    if(atr === 'true'){
                        done(new Error('Atleast 1 phone number or email-id should be present'));
                    }
                    else
                        done(null);
                });
            }
            else
                done(null);
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

        form.element(by.id('step-3')).click();
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
                    form.element(by.xpath('//md-tab-item[text()=\'' + type + '\']')).click();
                    var ele = element.all(by.xpath('//form[@name=\'addContactsForm\']//md-content[@id=\'' + type + '\']/div'));
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
        it('should create a contact',function () {

            typeFunction(contact.type,function (error) {
               if(error){
                   console.log(error);
                   return;
               }

                basicinfoFunction(contact.basicInfo,function (error) {
                    if(error){
                        console.log(error);
                        return;
                    }

                    validatephonemailFunction(contact.phoneNumber,contact.email,function (error) {
                        if(error){
                            console.log(error);
                            return;
                        }

                        addressFunction(contact.address);

                        var createButton=element(by.xpath('//button[@aria-label=\'Create Contact\']'));
                        createButton.click();
                    });
                });
            });
        });
    });
});
