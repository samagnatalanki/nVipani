
'use strict';

var config = browser.params;

describe('Create Business User', function () {

    var data=require('./updatebusinessunitdata');
    var sign=require('../../account/common/sign.common');

    var tab=element(by.xpath('//md-tab-item[text()=\'Business Units\']'));
    var editBunit=element(by.id('business-unit-edit-icon'));
    var BunitName=element(by.model('businessUnit.name'));
    var gstin=element(by.model('businessUnit.gstinNumber'));
    var pan=element(by.model('businessUnit.panNumber'));
    var updateButton=element(by.xpath('//button[@aria-label=\'Update\' and @aria-hidden=\'false\']'));

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

    function gstinpanFunction(gstinNo,panNo){
        if (gstinNo) {
            gstin.getText().then(function (txt) {
                var text = txt;
                gstin.clear().then(function () {
                    gstin.sendKeys(gstinNo);
                });
                gstin.getAttribute('aria-invalid').then(function (attr) {
                    if(attr === 'true')
                        gstin.clear().then(function () {
                            gstin.sendKeys(text);
                        });
                });
            });
        }

        if (panNo) {
            pan.getText().then(function (txt) {
                var text = txt;
                pan.clear().then(function () {
                    pan.sendKeys(panNo);
                });
                pan.getAttribute('aria-invalid').then(function (attr) {
                    if(attr === 'true')
                        pan.clear().then(function () {
                            pan.sendKeys(text);
                        });
                });
            });
        }
    }

    function phoneFunction(phoneNumber){
        if (phoneNumber) {
            var phonesTab = element(by.xpath('//md-tab-item[contains(text(),\'Phone\')]'));
            phonesTab.click();
            var ele = element.all(by.xpath('//md-content[./div/*[@id=\'editBunitAddPhones\']]/div'));
            ele.count().then(function(i) {
                phoneNumber.forEach(function (mobile) {
                    if (mobile.number) {
                        var addPhone = element(by.id('editBunitAddPhones'));
                        addPhone.click();
                        var id = phoneNumber.indexOf(mobile) + i - 1;
                        if (mobile.phoneType) {
                            var phonetype = element(by.id('editBunitPhoneType-' + id));
                            phonetype.click();
                            if (phonetype.isDisplayed()) {
                                if (mobile.phoneType !== 'Mobile' && mobile.phoneType !== 'Office' && mobile.phoneType !== 'Work')
                                    mobile.phoneType = 'Other';
                                var selectphonetype = element(by.xpath('//md-option[@id=\'editBunitPhone-' + mobile.phoneType + '\' and ../../../@aria-hidden=\'false\']'));
                                selectphonetype.click();
                            }
                        }
                        var phoneno = element(by.id('editBunitPhoneNumber-' + id));
                        phoneno.sendKeys(mobile.number);
                        phoneno.getAttribute('aria-invalid').then(function (attr) {
                            if (attr === 'true')
                                phoneno.clear().then(function () {
                                    phoneno.sendKeys('');
                                });
                        });
                    }
                });
            });
        }
    }

    function emailFunction(emailId){
        if (emailId) {
            var emailsTab = element(by.xpath('//md-tab-item[contains(text(),\'E-mail\')]'));
            emailsTab.click();
            var ele = element.all(by.xpath('//md-content[./div/*[@id=\'editBunitAddEmails\']]/div'));
            ele.count().then(function(i) {
                emailId.forEach(function (mail) {
                    if (mail.mailid) {
                        var addEmail = element(by.id('editBunitAddEmails'));
                        addEmail.click();
                        var id = emailId.indexOf(mail) + i - 1;
                        if (mail.emailType) {
                            var emailtype = element(by.id('editBunitEmailType-' + id));
                            emailtype.click();
                            if (emailtype.isDisplayed()) {
                                if (mail.emailType !== 'Work' && mail.emailType !== 'Personal')
                                    mail.emailType = 'Other';
                                var selectemailtype = element(by.xpath('//md-option[@id=\'editBunitEmail-' + mail.emailType + '\' and ../../../@aria-hidden=\'false\']'));
                                selectemailtype.click();
                            }
                        }
                        var emailid = element(by.id('editBunitEmail-' + id));
                        emailid.sendKeys(mail.mailid);
                        emailid.getAttribute('aria-invalid').then(function (attr) {
                            if (attr === 'true')
                                emailid.clear().then(function () {
                                    emailid.sendKeys('');
                                });
                        });
                    }
                });
            });
        }
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
                    element(by.xpath('//md-tab-item[text()=\'' + type + '\']')).click();
                    var ele = element.all(by.xpath('//md-content[@id=\'' + type + '\']/div'));
                    ele.count().then(function (count) {
                        var addButton = element(by.id("companyAddAddresses-" + AddressType(type)));
                        addButton.click();
                        var addressElement = element(by.id(type + "-" + (count - 1)));
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

    function accountFunction(account){
        if(account) {
            if (account.accountNo && account.bankName && account.ifscCode) {
                var bankdetailsTab = element(by.xpath('//md-tab-item[text()=\'Bank Account Info\']'));
                browser.driver.executeScript("arguments[0].scrollIntoView(true);", bankdetailsTab);
                bankdetailsTab.click();
                var accountnumber = element(by.id('editBunitAccountNo'));
                var accounttype = element(by.id('editBunitAccountType'));
                var bankname = element(by.id('editBunitBankName'));
                var ifsccode = element(by.id('editBunitIfscCode'));

                accountnumber.sendKeys(account.accountNo);
                accounttype.click();
                if (account.accountType)
                    element(by.id('editBunit' + account.accountType)).click();
                else
                    element(by.id('addBunitCurrent')).click();
                bankname.sendKeys(account.bankName);
                ifsccode.sendKeys(account.ifscCode);
                ifsccode.getAttribute('aria-invalid').then(function (attr) {
                    if (attr === 'true')
                        ifsccode.clear().then(function () {
                            ifsccode.sendKeys('');
                        });
                });
            }
        }
    }

    function deleteordisableFunction(type,done){

        if(type){
            if(type === 'delete') {
                var deleteButton = element(by.xpath('//button[@aria-label=\'delete business unit\']'));
                deleteButton.click();
                done("Business Unit deleted", null);
            }
            else if(type === 'disable/enable'){
                var toggle=element(by.model('businessUnit.toggle'));
                toggle.click();
                done('Business Unit disabled/enabled',null);
            }
            else
                done(null,null);
        }
        else
            done(null,null);
    }

    data.forEach(function (data) {
        it('should create a business user', function () {

            if (data.businessUnitName) {

                var unitname=element(by.xpath('//td[./span[text()=\''+data.businessUnitName+'\']]'));
                sign.isClickable(unitname,function (error,ele) {
                    if(ele){
                        unitname.click();
                        editBunit.click();

                        deleteordisableFunction(data.type,function (error,ele) {
                            if(error){
                                console.log(error);
                                return;
                            }

                            if(data.updateBunitName) {
                                BunitName.clear().then(function () {
                                    BunitName.sendKeys(data.updateBunitName);
                                });
                            }

                            gstinpanFunction(data.gstinNo,data.panNo);

                            phoneFunction(data.phoneNumber);

                            emailFunction(data.email);

                            addressFunction(data.address);

                            accountFunction(data.account);

                            updateButton.click();
                        });
                    }
                    else {
                        console.log(error);
                    }
                });
            }
            else {
                console.log("Missing Business Unit Name");
            }
        });
    });
});
