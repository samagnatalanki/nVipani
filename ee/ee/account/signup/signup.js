
'use strict';

var config = browser.params;
var subs = require('../common/subSegment');


describe('Sign up', function () {

    var data, signup;

    data = require('./signupdata');
    signup = require('../common/sign.common');
    var generateOTP = element(by.xpath('//button[@aria-label=\'Generate OTP\']'));
    var otp = element(by.model('otp'));
    var nxt = element(by.xpath('//button[@aria-label=\'Next\' and @aria-hidden=\'false\']'));
    var start = element(by.xpath('//button[@aria-label=\'Start your 45 days free trial\']'));
    var username = element(by.xpath('//input[@aria-label=\'Email/Mobile No.\']'));
    var password = element(by.model('password'));

    beforeEach(function () {
        browser.get('http://localhost:3000/#!/register');
    });

    afterEach(function () {
        browser.sleep(1000);
    });


    function getsubSegment(seg) {
        if (seg === 'Cereals')
            return subs.Cereals;
        else if (seg === 'Coffee')
            return subs.Coffee;
        else if (seg === 'Vegetables')
            return subs.Vegetables;
        else if (seg === 'Yarn')
            return subs.Yarn;
        else if (seg === 'Fabric')
            return subs.Fabric;
        else if (seg === 'Apparel')
            return subs.Apparel;
    }


    function getsubSegmentData(seg, subseg) {
        if (seg === 'Cereals' && subseg.Cereals)
            return subseg.Cereals;
        else if (seg === 'Coffee' && subseg.Coffee)
            return subseg.Coffee;
        else if (seg === 'Vegetables' && subseg.Vegetables)
            return subseg.Vegetables;
        else if (seg === 'Yarn' && subseg.Yarn)
            return subseg.Yarn;
        else if (seg === 'Fabric' && subseg.Fabric)
            return subseg.Fabric;
        else if (seg === 'Apparel' && subseg.Apparel)
            return subseg.Apparel;
        return 0;
    }

    function exploreMore(seg, subseg) {
        var segs = ['Cereals', 'Coffee', 'Vegetables', 'Yarn', 'Fabric', 'Apparel'];
        for (var k = 0; k < seg.length; k++) {
            var flag = 0;
            for (var i = 0; i < segs.length; i++) {
                if (seg[k] === segs[i]) {
                    flag = 1;
                    if (subseg) {
                        var sub = getsubSegment(seg[k]);
                        var subsegdata = getsubSegmentData(seg[k], subseg);
                        if (subsegdata === 0)
                            return false;
                        for (var j = 0; j < subsegdata.length; j++) {
                            var flag1 = 0;
                            for (var z = 0; z < sub.length; z++) {
                                if (subsegdata[j] === sub[z]) {
                                    flag1 = 1;
                                }
                            }
                            if (flag1 === 0)
                                return false;
                        }
                    }
                }
            }
            if (flag === 0)
                return false;
        }
        return true;
    }


    function validateSegment(trad, seg, subseg) {
        if (seg) {
            var segs = ['Rice', 'Coffee', 'Textiles', 'Fruits and Vegetables'];

            if (trad === 'Manufacturer') {
                for (var j = 0; j < seg.length; j++) {
                    var flag = 0;
                    for (var i = 0; i < segs.length; i++) {
                        if (seg[j] === segs[i]) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag === 0)
                        return false;
                }
                return true;
            }
            else if (trad === 'Distributor') {
                for (var j = 0; j < seg.length; j++) {
                    var flag = 0;
                    for (var i = 0; i < segs.length; i++) {
                        if (seg[j] === segs[i] && !subseg) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag === 0)
                        return exploreMore(seg, subseg);
                }
                return true;
            }
            else if (trad === 'Retailer') {
                return exploreMore(seg, subseg);
            }
            else
                return false;
        }
        return false;
    }



    function selectSegment(trad, seg, subseg) {
        if (trad === 'Manufacturer') {
            seg.forEach(function (seg) {
                var segment = element(by.xpath('//md-radio-button[.//label[text()=\'' + seg + '\']]'));
                segment.click();
            });
            return;
        }
        else if (trad === 'Distributor') {
            var flag = 1;
            seg.forEach(function (seg) {
                if (seg !== 'Rice' && seg !== 'Coffee' && seg !== 'Textiles' && seg !== 'Fruits and Vegetables') {
                    var showMore = element(by.xpath('//button[@aria-label=\'Switch1\']'));
                    if (flag)
                        showMore.click();
                    flag = 0;
                    if (subseg) {
                        var showDetails = element(by.xpath('//label[text()=\'Show Details\' and ..//label[text()=\'' + seg + '\']]'));
                        showDet


                        ails.click();
                        var subsegData = getsubSegmentData(seg, subseg);
                        for (var i = 0; i < subsegData.length; i++) {
                            var subSegment = element(by.xpath('//md-checkbox[@ng-model=\'node.isChecked\' and .//label[text()=\'' + subsegData[i] + '\']]'));
                            subSegment.click();
                        }
                        browser.sleep(2000);
                    }
                    else {
                        var segment = element(by.xpath('//md-checkbox[@ng-model=\'node.isChecked\' and .//label[text()=\'' + seg + '\']]'));
                        segment.click();
                    }
                }
                else {
                    var segment = element(by.xpath('//md-checkbox[@ng-model=\'segment.selected\' and .//label[text()=\'' + seg + '\']]'));
                    segment.click();
                }
            });
            return;
        }
        else if (trad === 'Retailer') {
            seg.forEach(function (seg) {
                if (subseg) {
                    var showDetails = element(by.xpath('//label[text()=\'Show Details\' and ..//label[text()=\'' + seg + '\']]'));
                    showDetails.click();
                    var subsegData = getsubSegmentData(seg, subseg);
                    for (var i = 0; i < subsegData.length; i++) {
                        var subSegment = element(by.xpath('//md-checkbox[@ng-model=\'node.isChecked\' and .//label[text()=\'' + subsegData[i] + '\']]'));
                        subSegment.click();
                    }
                }
                else {
                    var segment = element(by.xpath('//md-checkbox[@ng-model=\'node.isChecked\' and .//label[text()=\'' + seg + '\']]'));
                    segment.click();
                }
            });
            return;
        }
    }

    function generateOTPFunction(Username, Password, done) {

        if (signup.validateUserRegisteredData(Username, Password)) {

            username.sendKeys(Username);
            password.sendKeys(Password);

            username.getAttribute('aria-invalid').then(function (attr) {
                if (attr === 'false') {
                    generateOTP.click();
                    var already = browser.findElement(by.xpath('//p[@data-ng-bind=\'registererror\' and ../../../../../@aria-hidden=\'false\']'));
                    already.getText().then(function (text) {
                        var txt = text;
                        if (txt === 'User is already Registered' || txt === 'Not allow to register. Please contact customer care.')
                            done(txt, generateOTP);
                        else if (txt === 'User is already verified :' + Username)
                            done(txt, null);
                        else
                            done(null, null);
                    });
                }
                else
                    done("Invalid Username", username);
            });

        }
        else
            done("Missing Username / Password", null);
    }

    function verifyOTPFunction() {
        var text = element(by.xpath('//p[contains(text(),\'An OTP has been sent\')]')).getText().then(function (sp) {
            return sp.split(". ");
        });
        text.then(function (slices) {
            var otp1 = slices[1];
            otp.sendKeys(otp1);
        });
        generateOTP.click();
    }

    function tradingFunction(Trading, done) {
        var trading = element(by.xpath('//md-radio-button[.//h4[text()=\'' + Trading + '\']]'));
        if (Trading) {
            signup.isClickable(trading, function (error, ele) {
                if (ele) {
                    trading.click();
                    nxt.click();
                    done(null, null);
                }
                else
                    done("Invalid Trading", trading);
            });
        }
        else
            done("Missing Trading", trading);
    }

    function segmentFunction(Trading, Segment, SubSegment, done) {
        if (validateSegment(Trading, Segment, SubSegment) === false) {
            done("Invalid Segment Details", null);
            return;
        }

        selectSegment(Trading, Segment, SubSegment);
        start.click();
        done(null, null);
    }

    data.forEach(function (data) {
        it('should register user', function () {

            generateOTPFunction(data.username, data.password, function (error, ele) {
                if (error === 'User is already verified :' + data.username);
                else if (error) {
                    console.log(error);
                    return;
                }
                else
                    verifyOTPFunction();

                tradingFunction(data.trading, function (error, ele) {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    segmentFunction(data.trading, data.segment, data.subSegment, function (error, ele) {
                        if (error) {
                            console.log(error);
                            return;
                        }

                        signup.logout();
                    });
                });
            });
        });
    });
});
