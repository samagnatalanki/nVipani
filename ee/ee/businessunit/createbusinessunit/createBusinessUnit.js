
'use strict';

var config = browser.params;

describe('Create Business User', function () {

    var data=require('./createbusinessunitdata');
    var sign=require('../../account/common/sign.common');

    var tab=element(by.xpath('//md-tab-item[text()=\'Business Units\']'));
    var BunitType=element(by.id('businessUnitType'));
    var addBunit=element(by.id('add-business-unit'));
    var incharge=element(by.id('addBunitIncharge'));
    var BunitName=element(by.model('businessUnit.name'));
    var gstin=element(by.model('businessUnit.gstinNumber'));
    var pan=element(by.model('businessUnit.panNumber'));
    var step2=element(by.id('createStep-2'));
    var step3=element(by.id('createStep-3'));
    var step4=element(by.id('createStep-4'));
    var createBunit=element(by.id('createBunit'));
    var closeaddBunit=element(by.id('closeAddBunit'));
    var refreshBunit=element(by.id('refreshAddBunit'));

    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        sign.companyProfile();
    });

    beforeEach(function () {
        browser.refresh();
        tab.click();
        addBunit.click();
    });

    afterEach(function () {
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

    function BunitNameFunction(bunitName,done){
        if(bunitName){
            BunitName.sendKeys(bunitName);
            done(null,null);
        }
        else
            done("Missing Business Unit Name",BunitName);
    }

    function BunitTypeFunction(bunitType,area,loading,unloading){
        if(bunitType) {
            BunitType.click();
            if (BunitType.isPresent() && BunitType.isDisplayed()) {
                var selectType = element(by.xpath('//md-option[./div[text()=\'' + bunitType + '\']]'));
                selectType.isPresent().then(function (res) {
                    if (res) {
                        selectType.click();
                        if (bunitType === 'Ware House') {
                            if(area) {
                                if (area.NoOfUnits && area.unitofMeasure && !isNaN(area.NoOfUnits)) {
                                    var areanoofUnits = element(by.model('businessUnit.warehouseDetails.capacity.numberOfUnits'));
                                    var areaunitofmeasure = element(by.xpath('//md-select[@ng-model=\'businessUnit.warehouseDetails.capacity.unitOfMeasure\']'));
                                    areanoofUnits.sendKeys(area.NoOfUnits);
                                    areaunitofmeasure.click();
                                    if (areaunitofmeasure.isDisplayed()) {
                                        var areaselectunitofmeasure = element(by.xpath('//md-option[.//span[text()=\'' + area.unitofMeasure + '\'] and ../../../@aria-hidden=\'false\']'));
                                        areaselectunitofmeasure.isPresent().then(function (res) {
                                            if (res)
                                                areaselectunitofmeasure.click();
                                        });
                                    }
                                }
                            }
                            if(loading) {
                                if (loading.loadingCapacityUnits && loading.loadingunitofMeasure && !isNaN(loading.loadingCapacityUnits)) {
                                    var loadingnoofUnits = element(by.model('businessUnit.warehouseDetails.loadingCapacity.numberOfUnits'));
                                    loadingnoofUnits.sendKeys(loading.loadingCapacityUnits);
                                    var loadingunitofmeasure = element(by.xpath('//md-select[@ng-model=\'businessUnit.warehouseDetails.loadingCapacity.unitOfMeasure\']'));
                                    loadingunitofmeasure.click();
                                    if (loadingunitofmeasure.isDisplayed()) {
                                        var loadingselectunitofmeasure = element(by.xpath('//md-option[.//span[text()=\'' + loading.loadingunitofMeasure + '\'] and ../../../@aria-hidden=\'false\']'));
                                        loadingselectunitofmeasure.isPresent().then(function (res) {
                                            if (res)
                                                loadingselectunitofmeasure.click();
                                        });
                                    }
                                    var loadingduration = element(by.model('businessUnit.warehouseDetails.loadingCapacity.durationInHours'));
                                    if (loading.loadingDuration && !isNaN(loading.loadingDuration))
                                        loadingduration.sendKeys(loading.loadingDuration);
                                }
                            }
                            if(unloading) {
                                if (unloading.unloadingCapacityUnits && unloading.unloadingunitofMeasure && !isNaN(unloading.unloadingCapacityUnits)) {
                                    var unloadingnoofUnits = element(by.model('businessUnit.warehouseDetails.unLoadingCapacity.numberOfUnits'));
                                    unloadingnoofUnits.sendKeys(unloading.unloadingCapacityUnits);
                                    var unloadingunitofmeasure = element(by.xpath('//md-select[@ng-model=\'businessUnit.warehouseDetails.unLoadingCapacity.unitOfMeasure\']'));
                                    unloadingunitofmeasure.click();
                                    if (unloadingunitofmeasure.isDisplayed()) {
                                        var unloadingselectunitofmeasure = element(by.xpath('//md-option[.//span[text()=\'' + unloading.unloadingunitofMeasure + '\'] and ../../../@aria-hidden=\'false\']'));
                                        unloadingselectunitofmeasure.isPresent().then(function (res) {
                                            if (res)
                                                unloadingselectunitofmeasure.click();
                                        });
                                    }
                                    var unloadingduration = element(by.model('businessUnit.warehouseDetails.unLoadingCapacity.durationInHours'));
                                    if (unloading.unloadingDuration && !isNaN(unloading.unloadingDuration))
                                        unloadingduration.sendKeys(unloading.unloadingDuration);
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    function inchargeFunction(Incharge,done){

        incharge.click();
        if(Incharge){
            var option = element(by.id(Incharge));
            option.isPresent().then(function (res) {
                if(res){
                    option.click();
                    done(null,null);
                }
                else
                    done("No such Incharge-"+Incharge,incharge);
            });
        }
        else{
            var option = element(by.id(data[0].username));
            option.click();
            done(null,null);
        }
    }

    function gstinpanFunction(gstinNo,panNo){
        if (gstinNo) {
            gstin.sendKeys(gstinNo);
            gstin.getAttribute('aria-invalid').then(function (attr) {
                if(attr === 'true')
                    gstin.clear().then(function () {
                        gstin.sendKeys('');
                    });
            });
        }

        if (panNo) {
            pan.sendKeys(panNo);
            pan.getAttribute('aria-invalid').then(function (attr) {
                if(attr === 'true')
                    pan.clear().then(function () {
                        pan.sendKeys('');
                    });
            });
        }
    }

   function phoneNoFunction(phoneNumber){
        if (phoneNumber) {
            var phonesTab = element(by.xpath('//md-tab-item[text()=\'Phones\']'));
            phonesTab.click();
            phoneNumber.forEach(function (mobile) {
                if(mobile.number) {
                    var phone = element(by.id('addBunitphone-' + phoneNumber.indexOf(mobile)));
                    if (mobile.phoneType) {
                        var phonetype = phone.element(by.id('addBunitPhoneType'));
                        phonetype.click();
                        if(phonetype.isDisplayed()) {
                            if(mobile.phoneType !== 'Mobile' && mobile.phoneType !== 'Office' && mobile.phoneType !== 'Work')
                                mobile.phoneType = 'Other';
                            var selectphonetype = element(by.xpath('//md-option[@id=\'addBunitPhone-' + mobile.phoneType + '\' and ../../../@aria-hidden=\'false\']'));
                            selectphonetype.click();
                        }
                    }
                    var phoneno = element(by.id('addBunitPhoneNumber-' + phoneNumber.indexOf(mobile)));
                    phoneno.sendKeys(mobile.number);
                    phoneno.getAttribute('aria-invalid').then(function (attr) {
                        if (attr === 'true')
                            phoneno.clear().then(function () {
                                phoneno.sendKeys('');
                            });
                    });
                }
                if ((phoneNumber.indexOf(mobile) + 1) !== phoneNumber.length) {
                    var addPhone = element(by.xpath('//div[@id=\'addBunitphone-0\']//md-icon[@aria-label=\'favourite\' and @aria-hidden=\'false\']'));
                    browser.sleep(1000);
                    addPhone.click();
                }
            });
        }
    }

    function emailFunction(Email){
        if (Email) {
            var emailsTab = element(by.xpath('//md-tab-item[text()=\'Emails\']'));
            emailsTab.click();
            Email.forEach(function (mail) {
                if(mail.mailid) {
                    var email = element(by.id('addBunitEmail-' + Email.indexOf(mail)));
                    if (mail.emailType) {
                        var emailtype = email.element(by.id('addBunitEmailType'));
                        emailtype.click();
                        if(emailtype.isDisplayed()) {
                            if(mail.emailType !== 'Work' && mail.emailType !== 'Personal')
                                mail.emailType = 'Other';
                            var selectemailtype = element(by.xpath('//md-option[@id=\'addBunitType-' + mail.emailType + '\' and ../../../@aria-hidden=\'false\']'));
                            selectemailtype.click();
                        }
                    }
                    var emailid = element(by.id('addBunitPhoneEmail-' + Email.indexOf(mail)));
                    emailid.sendKeys(mail.mailid);
                    emailid.getAttribute('aria-invalid').then(function (attr) {
                        if (attr === 'true')
                            emailid.clear().then(function () {
                                emailid.sendKeys('');
                            });
                    });
                }
                if ((Email.indexOf(mail) + 1) !== Email.length) {
                    var addEmail = element(by.xpath('//div[@id=\'addBunitEmail-0\']//md-icon[@aria-label=\'favourite\' and @aria-hidden=\'false\']'));
                    browser.sleep(1000);
                    addEmail.click();
                }
            });
        }
    }

    function addressFunction(address){

        address.forEach(function (addr) {
            if(addr.addressLine || addr.city || addr.state || addr.country || addr.pinCode) {
                var type;
                if (addr.addressType) {
                    type = addr.addressType;
                }
                else {
                    type = "Billing";
                }
                element(by.xpath('//md-tab-item[text()=\''+type+'\']')).click();
                var ele = element.all(by.xpath('//md-content[@id=\''+type+'\']/div'));
                ele.count().then(function(count) {
                    var addButton=element(by.id("companyAddAddresses-"+AddressType(type)));
                    addButton.click();
                    var addressElement = element(by.id(type+"-"+(count-1)));
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

    function accountFunction(account){
        if(account) {
            if (account.accountNo && account.bankName && account.ifscCode) {
                var accountnumber = element(by.model('businessUnit.bankAccountDetails.bankAccountNumber'));
                var accounttype = element(by.xpath('//md-select[@ng-model=\'businessUnit.bankAccountDetails.accountType\']'));
                var bankname = element(by.model('businessUnit.bankAccountDetails.bankName'));
                var ifsccode = element(by.model('businessUnit.bankAccountDetails.ifscCode'));

                accountnumber.sendKeys(account.accountNo);
                accounttype.click();
                if (account.accountType)
                    element(by.id('addBunit' + account.accountType)).click();
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

    data.forEach(function (data) {
        it('should create a business user', function () {

            BunitNameFunction(data.businessUnitName,function (error,ele) {
                if(error){
                    console.log(error);
                    return;
                }

                inchargeFunction(data.incharge,function (error,ele) {
                    if(error){
                        console.log(error);
                        return;
                    }

                    BunitTypeFunction(data.businessUnitType,data.area,data.loading,data.unloading);

                    gstinpanFunction(data.gstinNo,data.panNo);

                    step2.click();

                    phoneNoFunction(data.phoneNumber);

                    emailFunction(data.email);

                    step3.click();

                    addressFunction(data.address);

                    step4.click();

                    accountFunction(data.account);

                    createBunit.click();
                });
            });
        });
    });
});
