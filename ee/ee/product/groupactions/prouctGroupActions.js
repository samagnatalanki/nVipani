
'use strict';

var config = browser.params;

describe('Group Actions', function () {

    var data = require('./groupactiondata');
    var sign = require('../../account/common/sign.common');


    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
    });

    beforeEach(function () {
        element(by.id('nav-products')).click();
    });

    afterEach(function () {
        browser.sleep(1000);
    });

    afterAll(function () {
        sign.logout();
    });

    function selectProductFunction(productDetails,done){

        if(productDetails) {
            productDetails.forEach(function (product) {
                var selectProduct = element(by.xpath('//*[@ng-model=\'inventory.selected\' and ../..//h5[text()=\'' + product.productName + ' - ' + product.productUOM + '\'] and ../..//h6[text()=\'' + product.productBrand + '\']]'));
                if (product.productName && product.productBrand && product.productUOM) {
                    selectProduct.isPresent().then(function (res) {
                        if (res) {
                            selectProduct.click();
                        }
                        else
                            done(new Error("Invalid details for Product-" + productDetails.indexOf(product)));
                    });
                }
                else
                    done(new Error("Missing details for Product-" + productDetails.indexOf(product)));
            });
            done(null);
        }
        else
            done("Missing ProductDetails",null);
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

            selectProductFunction(data.Products,function (error,ele) {
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
