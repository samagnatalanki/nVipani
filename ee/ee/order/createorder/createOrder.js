
'use strict';

var config = browser.params;

describe('Create an Order',function () {

    var data = require('./createorderdata');
    var sign=require('../../account/common/sign.common');
    var fs = require('fs');
    var selectedData=require('./selectedProducts');

    beforeAll(function () {
        browser.get('http://localhost:3000/#!/signin');
        sign.login(data[0]);
    });

    beforeEach(function () {
        element(by.id('nav-products')).click();

    });

    afterEach(function () {
        browser.sleep(1000);
    });

    function selectProductFunction(productDetails,done){

        if(productDetails) {
            selectedData = [];
            productDetails.forEach(function (product) {
                var selectProduct = element(by.xpath('//*[@ng-model=\'inventory.selected\' and ../..//h5[text()=\'' + product.productName + ' - ' + product.productUOM + '\'] and ../..//h6[text()=\'' + product.productBrand + '\']]'));
                if (product.productName && product.productBrand && product.productUOM && product.productQuantity > 0) {
                    selectProduct.isPresent().then(function (res) {
                        if (res) {
                            selectProduct.click();

                            selectedData.push({
                                productName: product.productName,
                                productBrand: product.productBrand,
                                productUOM: product.productUOM,
                                productQuantity: product.productQuantity
                            });
                            fs.writeFile('./selectedProducts.json', JSON.stringify(selectedData), 'utf-8', function (err) {
                                if (err) throw err;
                            });
                        }
                        else
                            done("Invalid details for Product-" + productDetails.indexOf(product), selectProduct);
                    });
                }
                else
                    done("Missing details for Product-" + productDetails.indexOf(product), selectProduct);
            });
            done(null, null);
        }
        else
            done("Missing ProductDetails",null);
    }

    function selectQuantityFunction(type,done) {

        if(type && (type === 'Intra Stock')) {
            var intrastock=element(by.xpath('//md-checkbox[@aria-label=\'Intra Stock\']'));
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.visibilityOf(intrastock), 5000);
            intrastock.click();
        }
        var continueButton = element(by.xpath('//button[@aria-label=\'Continue\' and @aria-hidden=\'false\']'));
        sign.isClickable(continueButton, function (error, ele) {
            if (ele) {
                continueButton.click();
                var validproduct=element(by.xpath('//md-toast[.//span[contains(text(),\'Please select valid products\')]]'));
                validproduct.isPresent().then(function (res) {
                    if(res){
                        done('Please select valid products',null);
                    }
                    else {
                        selectedData.forEach(function (product) {
                            var productquantity = element(by.xpath('//input[@ng-model=\'singleproduct.numberOfUnits\' and ../../..//h5[text()=\'' + product.productName + ' - ' + product.productUOM + '\'] and ../../..//h6[text()=\'' + product.productBrand + '\']]'));
                            var EC = protractor.ExpectedConditions;
                            browser.wait(EC.visibilityOf(productquantity), 5000);
                            productquantity.clear().then(function () {
                                productquantity.sendKeys(product.productQuantity);
                            });
                        });
                        done(null, null);
                    }
                });
            }
        });
    }

    function selectBuyerandAgentFunction(buyerdata,mediatordata,type,address,done){

        var buyer;

        if(type) {
            buyer = element(by.xpath('//md-select[@ng-model=\'selOrder.buyer.businessUnit\' and @aria-hidden=\'false\']'));
        }
        else {
            buyer = element(by.model('selOrder.buyer.contact'));
        }

        buyer.click();
        if(buyerdata) {
            var selectBuyer = element(by.xpath('//md-option[.//*[text()=\'' + buyerdata + '\'] and ../../../@aria-hidden=\'false\']'));
            sign.isClickable(selectBuyer, function (error, ele) {
                if (ele) {
                    selectBuyer.click();
                    if(mediatordata) {
                        var mediator = element(by.model('selOrder.mediator.contact'));
                        mediator.click();
                        var selectmediator = element(by.xpath('//md-option[./div[text()=\'' + mediatordata + '\'] and ../../../@aria-hidden=\'false\']'));
                        sign.isClickable(selectmediator, function (error, ele) {
                            if (ele) {
                                selectmediator.click();
                            }
                        });
                    }
                    if(address) {
                        var addressLine = element(by.model('address.addressLine'));
                        var addressCity = element(by.model('address.city'));
                        var addressState = element(by.model('address.state'));
                        var addressCountry = element(by.model('address.country'));
                        var addresspinCode = element(by.model('address.pinCode'));
                        var addShippingAddress=element(by.xpath('//button[@aria-label=\'add shipping address\' and ../../../@aria-hidden=\'false\']'));

                        addShippingAddress.click();

                        if (address.addressLine) {
                            addressLine.sendKeys(address.addressLine);
                        }
                        if (address.city) {
                            addressCity.sendKeys(address.city);
                        }
                        if (address.state) {
                            addressState.sendKeys(address.state);
                        }
                        if (address.country) {
                            addressCountry.sendKeys(address.country);
                        }
                        if (address.pinCode && (address.pinCode.length === 6)) {
                            addresspinCode.sendKeys(address.pinCode);
                        }

                        var sameForBilling=element(by.model('address.billing'));
                        sameForBilling.click();
                        var addAddress=element(by.xpath('//button[@aria-label=\'Save\']'));
                        addAddress.click();

                        var continueButton=element(by.xpath('//button[@aria-label=\'Continue\' and ../../../@aria-hidden=\'false\']'));
                        continueButton.click();

                        done(null,null);
                    }
                    else
                        done("Missing Address",null);
                }
                else
                    done("No such Buyer", selectBuyer);
            });
        }
        else
            done("Missing Buyer data",null);
    }

    function selectPaymentMethodFunction(paymentMethod,done){
        var paymentmethod=element(by.model('selOrder.applicablePaymentTerm.paymentTerm'));
        paymentmethod.click();
        if(paymentMethod) {
            if (paymentmethod.isDisplayed()) {
                var selectPaymentMethod = element(by.xpath('//md-option[./div[text()=\'' + paymentMethod + '\']]'));
                sign.isClickable(selectPaymentMethod, function (error, ele) {
                    if (ele) {
                        selectPaymentMethod.click();
                        var continueButton=element(by.xpath('//button[@aria-label=\'Continue\' and ../../../@aria-hidden=\'false\']'));
                        continueButton.click();

                        done(null,null);
                    }
                    else{
                        done("No such Payment Method",selectPaymentMethod);
                    }
                });
            }
        }
        else
            done("Missing Payment Method",paymentMethod);
    }

    function confirmFunction(done){
        var confirmButton=element(by.xpath('//button[@aria-label=\'Confirm\']'));
        confirmButton.click();

        var submitButton=element(by.xpath('//button[@aria-label=\'Submit\']'));
        submitButton.click();

        var outOfStock=element(by.xpath('//md-toast[.//span[contains(text(),\'No Sufficient stock for product\')]]'));
        outOfStock.isPresent().then(function (res) {
            if(res){
                done("Product out of Stock",submitButton);
            }
            else
                done(null,null);
        });
    }

    data.forEach(function (data) {
        it('should create an order', function () {

                selectProductFunction(data.productDetails, function (error, ele) {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    var createOrder = element(by.xpath('//button[@aria-label=\'Create order\']'));
                    sign.isClickable(createOrder, function (error, ele) {
                        if (ele) {

                            createOrder.click();

                            selectQuantityFunction(data.type,function (error,ele) {
                                if(error){
                                    console.log(error);
                                    return;
                                }

                                selectBuyerandAgentFunction(data.buyer,data.mediator,data.type,data.address,function (error,ele) {
                                    if(error){
                                        console.log(error);
                                        return;
                                    }

                                    selectPaymentMethodFunction(data.paymentMethod,function (error,ele) {
                                        if(error){
                                            console.log(error);
                                            return;
                                        }

                                        confirmFunction(function (error,ele) {
                                            if(error){
                                                console.log(error);
                                                return;
                                            }
                                        });

                                        var closeButton=element(by.xpath('//button[@aria-label=\'close dialog\' and ../../../../@aria-hidden=\'false\']'));
                                        closeButton.click();
                                    });
                                });
                            });
                        }
                        else
                            console.log("Select atleast one Product");
                    });
                });
        });
    });
});
