
'use strict';
var config = browser.params;

describe('Create Product', function () {
    
    var data = require('./createproductdata');
    var sign=require('../../account/common/sign.common');
    
    beforeAll(function () {
        browser.get('http://staging.nvipani.com/#!/signin');
        sign.login(data[0]);
        element(by.id('nav-products')).click();
    });
    
    beforeEach(function () {
        var addProduct=element(by.id('newproducthome'));
            sign.isClickable(addProduct,function (error,ele){
                if(ele){
                    ele.click();
                }
                else{
                    var newProduct=element(by.xpath('//button[@aria-label=\'New\']'));
                    sign.isClickable(newProduct,function (error,ele) {
                        if(ele){
                            ele.click();
                            var productAdd=element(by.xpath('//button[@aria-label=\'New Product\']'));
                            sign.isClickable(productAdd,function (error,ele) {
                                if(ele)
                                    ele.click();
                                else
                                    console.log(error);
                            });
                        }
                        else{
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

    function categoryFunction(productCategory,done){
        var category = element(by.xpath('//md-select[contains(@aria-label,\'Category\')]'));
        category.click();
        if(category.isDisplayed() && productCategory) {
            var selectCategory = element(by.xpath('//md-option[./div[text()=\'' + productCategory + '\']]'));
            selectCategory.isPresent().then(function (result) {
                if(result){
                    selectCategory.click();
                    return done(null,null);
                }
                else{
                    return done("No such Category",selectCategory);
                }
            });
        }
        else {
            return done("Missing Category",category);
        }
    }

    function productFunction(productProduct,done){
        var product=element(by.xpath('//md-select[contains(@aria-label,\'Product\')]'));
        product.click();
        var selectProduct = element(by.xpath('//md-option[./div[text()=\'' + productProduct.productName + '\']]'));
        if(productProduct && product.isPresent() && product.isDisplayed() && productProduct.productName) {
            selectProduct.isPresent().then(function (result) {
                if(result){
                    selectProduct.click();
                    return done(null,null);
                }
                else {
                    var addProduct=element(by.xpath('//md-option[.//em[text()=\'Add New Product\']]'));
                    sign.isClickable(addProduct,function (error,ele) {
                        if(ele) {
                            ele.click();
                            var productName = element(by.xpath('//input[@aria-label=\'Product Name\']'));
                            productName.sendKeys(productProduct.productName);
                            if (productProduct.productDescription) {
                                var description = element(by.xpath('//textarea[@ng-model=\'description\' and preceding-sibling::label[text()=\'Description\']]'));
                                description.sendKeys(productProduct.productDescription);
                            }
                            var next = element(by.xpath('//button[@aria-label=\'Next\']'));
                            next.click();

                            var hsnCode = element(by.xpath('//input[@aria-label=\'Search Keywords\']'));
                            if(productProduct.productHsnCode) {
                                productProduct.productHsnCode.forEach(function (hsncode) {
                                    if(hsncode.hsnSearch && hsncode.hsnCode) {
                                        hsnCode.clear().then(function () {
                                            hsnCode.sendKeys(hsncode.hsnSearch);
                                            hsncode.hsnCode.forEach(function (code) {
                                                var selecthsnCode=element(by.xpath('//div[following-sibling::div[./label[text()=\''+code+'\']]]'));
                                                sign.isClickable(selecthsnCode,function (error,ele) {
                                                    if(ele)
                                                        ele.click();
                                                });
                                            });
                                        });
                                    }
                                });
                                next.click();
                                var nohsnCodesSelected=element(by.xpath('//md-toast[.//span[contains(text(),\'Select at least one HSN Code\')]]'));
                                nohsnCodesSelected.isPresent().then(function (res) {
                                    if(res)
                                        return done("Select at least one HSN Code",hsnCode);
                                    else{
                                        var taxGroup=element(by.xpath('//input[@aria-label=\'Search Tax Keyword\']'));
                                        if(productProduct.productTaxGroup) {
                                            productProduct.productTaxGroup.forEach(function (taxgroup) {
                                                if(taxgroup.taxSearch && taxgroup.taxCode){
                                                    taxGroup.clear().then(function () {
                                                        taxGroup.sendKeys(taxgroup.taxSearch);
                                                        taxgroup.taxCode.forEach(function (code) {
                                                            var selecttaxGroup=element(by.xpath('//div[./md-checkbox and following-sibling::div[./label[text()=\''+code+'\']]]'));
                                                            sign.isClickable(selecttaxGroup,function (error,ele) {
                                                                if(ele)
                                                                    ele.click();
                                                            });
                                                        });
                                                    });
                                                }
                                            });
                                            next.click();
                                            var notaxGroupsSelected=element(by.xpath('//md-toast[.//span[contains(text(),\'Select at least one Tax Group\')]]'));
                                            notaxGroupsSelected.isPresent().then(function (res) {
                                                if(res)
                                                    return done("Select at least one Tax Group",taxGroup);
                                                else{
                                                    var UOM=element(by.xpath('//input[@aria-label=\'Search For UOM\']'));
                                                    if(productProduct.productUOM) {
                                                        productProduct.productUOM.forEach(function (uom) {
                                                            if(uom.uomSearch && uom.uomCode){
                                                                UOM.clear().then(function () {
                                                                    UOM.sendKeys(uom.uomSearch);
                                                                    uom.uomCode.forEach(function (code) {
                                                                        var selectUOM=element(by.xpath('//div[following-sibling::div[./label[text()=\''+code+'\']]]'));
                                                                        sign.isClickable(selectUOM,function (error,ele) {
                                                                            if(ele)
                                                                                ele.click();
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        });
                                                        var submitButton=element(by.xpath('//button[@aria-label=\'Submit\']'));
                                                        submitButton.click();
                                                        var noUOMsSelected=element(by.xpath('//md-toast[.//span[contains(text(),\'Select at least one UOM\')]]'));
                                                        noUOMsSelected.isPresent().then(function (res) {
                                                            if(res)
                                                                return done("Select at least one UOM",UOM);
                                                            else{
                                                                return done(null,null);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        return done("Missing Product UOM",UOM);
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            return done("Missing Product Tax Group",taxGroup);
                                        }
                                    }
                                });
                            }
                            else {
                                return done("Missing Product hsnCode",hsnCode);
                            }
                        }
                        else {
                            return done("Element Not Clickable",addProduct);
                        }
                    });
                }
            });
        }
        else {
            return done("Missing Product",selectProduct);
        }
    }

    function brandFunction(productBrand,done){
        var brand=element(by.xpath('//md-select[contains(@aria-label,\'Brand\')]'));
        brand.click();
        var selectBrand=element(by.xpath('//md-option[./div[text()=\''+productBrand.brandName+'\']]'));
        if(productBrand && brand.isPresent() && brand.isDisplayed() && productBrand.brandName){
            selectBrand.isPresent().then(function (result) {
                if(result){
                    selectBrand.click();
                    return done(null,null);
                }
                else{
                    var addBrand=element(by.xpath('//md-option[./div[text()=\'Add New Brand\']]'));
                    sign.isClickable(addBrand,function (error,ele) {
                        if(ele){
                            ele.click();
                            var brandName=element(by.xpath('//input[@aria-label=\'Brand Name\']'));
                            brandName.sendKeys(productBrand.brandName);
                            if(productBrand.brandDescription) {
                                var description = element(by.xpath('//textarea[@ng-model=\'description\' and preceding-sibling::label[text()=\'Brand Description\']]'));
                                description.sendKeys(productBrand.brandDescription);
                            }
                            var hsnCode=element(by.model('createProducts.brand.hsncode'));
                            hsnCode.click();
                            var selectHsnCode = element(by.xpath('//span[text()=\'' + productBrand.brandHsnCode + '\']'));
                            if(productBrand.brandHsnCode && !isNaN(productBrand.brandHsnCode)) {
                                selectHsnCode.isPresent().then(function (result) {
                                    if (result) {
                                        selectHsnCode.click();
                                        var taxGroup=element(by.model('createProducts.brand.taxGroup'));
                                        taxGroup.click();
                                        var selectTaxGroup = element(by.xpath('//span[text()=\'' + productBrand.brandTaxGroup + '\']'));
                                        if(productBrand.brandTaxGroup) {
                                            selectTaxGroup.isPresent().then(function (result) {
                                                if (result) {
                                                    selectTaxGroup.click();
                                                    var next=element(by.xpath('//button[@aria-label=\'Next\']'));
                                                    next.click();
                                                    if(productBrand.brandUOMs){
                                                        productBrand.brandUOMs.forEach(function (brandUOM) {
                                                            var uom=element(by.xpath('//md-checkbox[@ng-model=\'uom.selected\' and ../..//label[text()=\''+brandUOM+'\']]'));
                                                            uom.isPresent().then(function (res) {
                                                                if(res)
                                                                    uom.click();
                                                            });
                                                        });
                                                    }
                                                    var submit=element(by.xpath('//button[@aria-label=\'Submit\']'));
                                                    submit.click();
                                                    return done(null,null);
                                                }
                                                else
                                                    return done("No such BrandTaxGroup",selectTaxGroup);
                                            });
                                        }
                                        else{
                                            return done("Missing BrandTaxGroup",selectTaxGroup);
                                        }
                                    }
                                    else
                                        return done("No such BrandHsnCode",selectHsnCode);
                                });
                            }
                            else{
                                return done("Missing BrandHsnCode",selectHsnCode);
                            }
                        }
                        else {
                            return done("Element Not Clickable",addBrand);
                        }
                    });
                }
            });
        }
        else {
            return done("Missing Brand",selectBrand);
        }
    }

    function showMore(inventory,inventories) {


        if(inventory.alternateNoofUnits && inventory.alternateMRP && !isNaN(inventory.alternateNoofUnits) && !isNaN(inventory.alternateMRP)){

            var showmore=inventories.element(by.xpath('.//span[text()=\'+ Show More\']'));
            showmore.click();
            if(inventory.alternateUOM) {
                var alternateuom = inventories.element(by.xpath('.//md-select[@ng-model=\'objectkey\' and ../../@objectkey=\'inventory.altUnitOfMeasure\']'));
                alternateuom.click();
                if (alternateuom.isPresent() && alternateuom.isDisplayed()) {
                    var selectalternateuom = element(by.xpath('//md-option[.//span[text()=\'' + inventory.alternateUOM + '\'] and ../../../@aria-hidden=\'false\']'));
                    sign.isClickable(selectalternateuom, function (error, ele) {
                        if (ele)
                            ele.click();
                    });
                }
            }

            var alternatenoofunits=inventories.element(by.model('inventory.altNumberOfUnits'));
            alternatenoofunits.clear().then(function () {
                alternatenoofunits.sendKeys(inventory.alternateNoofUnits);
            });

            var alternatemrp=inventories.element(by.model('inventory.altMRP'));
            alternatemrp.clear().then(function () {
                alternatemrp.sendKeys(inventory.alternateMRP);
            });

            if(inventory.gradingLoss){
                var gradingloss=inventories.element(by.model('inventory.gradingLoss'));
                gradingloss.clear().then(function () {
                    gradingloss.sendKeys(inventory.gradingLoss);
                });
            }

            if(inventory.weightLoss){
                var weightloss=inventories.element(by.model('inventory.weightLoss.percentage'));
                weightloss.clear().then(function () {
                    weightloss.sendKeys(inventory.weightLoss);
                });
            }

            if(inventory.duration){
                var duration=inventories.element(by.model('inventory.weightLoss.duration'));
                duration.clear().then(function () {
                    duration.sendKeys(inventory.duration);
                });
            }

            if(inventory.batchNo) {
                var batchno = inventories.element(by.model('inventory.batchNumber'));
                batchno.clear().then(function () {
                    batchno.sendKeys(inventory.batchNo);
                });
            }

            if(inventory.mfgDate){
                var mfg=inventories.element(by.xpath('.//input[@placeholder=\'Mfg Date\']'));
                mfg.clear().then(function () {
                    mfg.sendKeys(inventory.mfgDate);
                });
            }

            if(inventory.pkgDate){
                var pkg=inventories.element(by.xpath('.//input[@placeholder=\'Pkg Date\']'));
                pkg.clear().then(function () {
                    pkg.sendKeys(inventory.pkgDate);
                });
            }
        }
    }

    function addCompound(inventory,inventories,done) {

        var addinventory=element(by.xpath('//md-icon[@aria-label=\'favourite\' and ../../../@id=\'inventory-0\']'));
        var selectfirstUOM=element(by.xpath('//div[@aria-hidden=\'false\']/md-select-menu//span[text()=\''+inventory.UOM.firstUOM+'\']'));
        if(inventory.UOM.firstUOM) {
            var firstuom = inventories.element(by.xpath('.//md-select[@ng-model=\'objectkey\' and ../../@objectkey=\'inventory.uom.firstUnitOfMeasure\']'));
            firstuom.click();
            if(firstuom.isDisplayed()){
                selectfirstUOM.isPresent().then(function (res) {
                    if(res){
                        selectfirstUOM.click();

                        var sizeuom = inventories.element(by.xpath('.//input[@name=\'conversion\']'));
                        if(inventory.UOM.size && !isNaN(inventory.UOM.size)) {

                            sizeuom.sendKeys(inventory.UOM.size);

                            if(inventory.UOM.secondUOM) {
                                var seconduom = inventories.element(by.xpath('.//md-select[@ng-model=\'objectkey\' and ../../@objectkey=\'inventory.uom.secondUnitOfMeasure\']'));
                                seconduom.click();
                                var selectsecondUOM = element(by.xpath('//div[@aria-hidden=\'false\']/md-select-menu//span[text()=\'' + inventory.UOM.secondUOM + '\']'));
                                if (seconduom.isDisplayed()) {
                                    selectsecondUOM.isPresent().then(function (res) {
                                        if(res){
                                            selectsecondUOM.click();
                                            showMore(inventory,inventories);
                                            addinventory.click();
                                        }
                                        else {
                                            done("No such Second UOM",selectsecondUOM);
                                        }
                                    });
                                }
                                else{
                                    done("Missing Second UOM",selectsecondUOM);
                                }
                            }
                        }
                        else {
                            done("Missing Size",sizeuom);
                        }
                    }
                    else{
                        done("No such First UOM",selectfirstUOM);
                    }
                });
            }
        }
        else {
            done("Missing First UOM",selectfirstUOM);
        }
    }

    function addUOM(inventory,inventories,i,done) {

        var addinventory=element(by.xpath('//md-icon[@aria-label=\'favourite\' and ../../../@id=\'inventory-0\']'));
        var uom=inventories.element(by.xpath('//md-select[@ng-model=\'inventory.uom.firstUnitOfMeasure\']'));
        uom.click();
        if(inventory.UOM.UOMName && uom.isPresent() && uom.isDisplayed()){
            var selectuom=element(by.xpath('//md-option[.//span[text()=\''+inventory.UOM.UOMName+'\']]'));
            selectuom.isPresent().then(function (res) {
                if(res){
                    selectuom.click();

                    if(inventory.container) {
                        if (inventory.alternateNoofUnits && inventory.alternateMRP) {

                            showMore(inventory, inventories);

                            inventory.container.forEach(function (container) {

                                var ele = element.all(by.xpath('//*[@id=\'inventory-'+i+'\']//div[./div[./div/h6[text()=\'Container - 1\']]]/div'));
                                ele.count().then(function (count) {
                                    if (container.containerName || (container.containerValue && !isNaN(container.containerValue)) || container.containerUOM) {
                                        if (container.containerName) {
                                            var containername = inventories.element(by.xpath('.//input[@ng-model=\'container.name\' and ../../../..//h6[text()=\'Container - ' + count + '\']]'));
                                            containername.sendKeys(container.containerName);
                                        }

                                        if (container.containerValue && !isNaN(container.containerValue)) {
                                            var containervalue = inventories.element(by.xpath('.//input[@ng-model=\'container.numberOfUnits\' and ../../../..//h6[text()=\'Container - ' + count + '\']]'));
                                            containervalue.sendKeys(container.containerValue);
                                        }

                                        if (container.containerUOM) {
                                            var containeruom = inventories.element(by.xpath('.//md-select[@ng-model=\'objectkey\' and ../../@objectkey=\'container.unitOfMeasure\' and ../../../../..//h6[text()=\'Container - ' + count + '\']]'));
                                            containeruom.click();
                                            if (containeruom.isPresent() && containeruom.isDisplayed()) {
                                                var selectcontaineruom = element(by.xpath('//md-option[.//span[text()=\'' + container.containerUOM + '\'] and  ../../../@aria-hidden=\'false\']'));
                                                selectcontaineruom.isPresent().then(function (res) {
                                                    if (res)
                                                        selectcontaineruom.click();
                                                });
                                            }
                                        }

                                        var addContainer = inventories.element(by.xpath('.//md-icon[@aria-label=\'favourite\' and following-sibling::h6[text()=\'Container - 1\']]'));
                                        addContainer.click();
                                    }
                                });
                            });

                            addinventory.click();
                        }
                        else
                            done("Missing Alternate Units/MRP");
                    }
                    else
                        addinventory.click();
                }
                else
                    done('Invalid UOM',selectuom);
            });
        }
        else
            done('Missing UOM',uom);
    }

    function inventoryFunction(prodInventory,done){

        var ele=element.all(by.xpath('//div[./div[@id=\'inventory-0\']]/div'));
        prodInventory.forEach(function (inventory) {
            ele.count().then(function (val) {
                var addinventory=element(by.xpath('//md-icon[@aria-label=\'favourite\' and ../../../@id=\'inventory-0\']'));
                var inventories=element(by.id('inventory-'+ (val-1)));
                var noofunits=inventories.element(by.model('inventory.numberOfUnits'));
                var mrp=inventories.element(by.model('inventory.MRP'));

                browser.driver.executeScript("arguments[0].scrollIntoView(true);",inventories.getWebElement());

                if(inventory.UOM.UOMName && inventory.NoofUnits && inventory.mrp && !isNaN(inventory.NoofUnits) && !isNaN(inventory.mrp)){

                    var chooseUOM=inventories.element(by.xpath('.//md-select[@ng-model=\'objectkey\' and ../../@objectkey=\'inventory.unitOfMeasure\']'));
                    chooseUOM.click();
                    var selectUOM = element(by.xpath('//md-option[.//span[text()=\'' + inventory.UOM.UOMName + '\'] and ../../../@aria-hidden=\'false\']'));
                    selectUOM.isPresent().then(function (res) {
                        if(res){
                            selectUOM.click();

                            noofunits.clear().then(function () {
                                noofunits.sendKeys(inventory.NoofUnits);
                            });
                            mrp.clear().then(function () {
                                mrp.sendKeys(inventory.mrp);
                            });

                            showMore(inventory,inventories);

                            addinventory.click();
                        }
                        else {
                            if(inventory.type === 'Add Compound') {

                                var addcompound=element(by.xpath('//md-option[./div[text()=\'Add Compound\'] and @aria-hidden=\'false\']'));
                                addcompound.click();

                                noofunits.clear().then(function () {
                                    noofunits.sendKeys(inventory.NoofUnits);
                                });
                                mrp.clear().then(function () {
                                    mrp.sendKeys(inventory.mrp);
                                });

                                addCompound(inventory,inventories,function (error, ele) {
                                    done(error, ele);
                                });
                            }
                            else if(inventory.type === 'Add UOM'){
                                var adduom=element(by.xpath('//md-option[./div[text()=\'Add UOM\'] and @aria-hidden=\'false\']'));
                                adduom.click();

                                noofunits.clear().then(function () {
                                    noofunits.sendKeys(inventory.NoofUnits);
                                });
                                mrp.clear().then(function () {
                                    mrp.sendKeys(inventory.mrp);
                                });

                                addUOM(inventory,inventories,val-1,function (error,ele) {
                                    done(error,ele);
                                });
                            }
                        }
                    });
                }
                else{
                    done("Missing or Invalid UOM / No.of Units / MRP",null);
                }
            });
        });

        ele.count().then(function (val) {
            if(val !== 1) {
                var minusButton = element(by.id('inventory-' + (val - 1))).element(by.xpath('.//md-icon[@aria-label=\'favourite\']'));
                minusButton.click();
                done(null,null);
            }
            else{
                element(by.id('inventory-0')).element(by.model('inventory.numberOfUnits')).getAttribute('aria-invalid').then(function (attr) {
                    if(attr === 'true')
                        done('Enter atleast one valid Inventory',null);
                    else
                        done(null,null);
                });
            }
        });
    }


    data.forEach(function (prod) {
        it('should create a product', function () {

            categoryFunction(prod.category,function (error,ele) {
                if(error){
                    console.log(error);
                    return ;
                }

                productFunction(prod.product,function(error,ele){
                    if(error){
                        console.log(error);
                        return ;
                    }

                    brandFunction(prod.brand,function (error,ele) {
                        if(error){
                            console.log(error);
                            return ;
                        }

                        inventoryFunction(prod.inventory,function (error,ele) {
                            if(error){
                                console.log(error);
                                return ;
                            }

                            var createProduct=element(by.xpath('//button[@aria-label=\'Create Product\']'));
                            createProduct.click();
                        });
                    });
                });
            });
        }); 
    });
});
