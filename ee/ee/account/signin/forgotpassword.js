

'use strict';

var config = browser.params;


describe('Forgot Password', function () {

    var data=require('./forgotpassworddata');
    var forgotpassword=require('../common/sign.common');
    var otp = element(by.model('passwordcredentials.forgotPasswordOtp'));
    var submit = element(by.xpath('//button[@aria-label=\'Submit\']'));
    var forgot = element(by.xpath('//a[text()=\'Forgot Password\']'));
    var username = element(by.model('passwordcredentials.username'));

    beforeEach(function () {
        browser.get('http://localhost:3000/#!/signin');
        forgot.click();
    });

    afterEach(function () {
        browser.sleep(2000);
    });

    function validateUserData(data){
        if(data.username && data.newpassword && data.confirmpassword && data.username.length>0)
            return true;
        return false;
    }

    function extractOTP(){
        var string = element(by.xpath('//p[contains(text(),\'An OTP has been sent\') and ../../@name=\'password\']')).getText().then(function (sp) {
            return sp.split(". ");
        });
        var onetimepassword=string.then(function (slices) {
            var otp1 = slices[1].split(" ");
            otp.sendKeys(otp1[0]);
            return otp1[0];
        });
        return onetimepassword;
    }

    function generateOTPFunction(Username,done){
        username.sendKeys(Username);

        username.getAttribute('aria-invalid').then(function (attr) {
            if (attr === 'false') {
                submit.click();
                var noaccount = element(by.xpath('//p[../@data-ng-show=\'error\']'));
                noaccount.getText().then(function (txt) {
                    var text = txt;
                    if (text)
                        done(text,noaccount);
                    else
                        done(null,null);
                });
            }
            else
                done("Invalid Username",username);
        });
    }

    function verifyOTPFunction(Username,done){

        var otp1=extractOTP();
        browser.refresh().then(function () {
            forgot.click();
            username.sendKeys(Username);
            submit.click();
            otp.sendKeys(otp1);
        });
        submit.click();
        done(null,null);
    }

    function updatePasswordFunction(NewPassword,ConfirmPassword,done){

        var newpassword = element(by.model('passwordcredentials.newPassword'));
        var confirmpassword = element(by.model('passwordcredentials.verifyPassword'));

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(newpassword), 5000);
        newpassword.sendKeys(NewPassword);
        confirmpassword.sendKeys(ConfirmPassword);

        if(NewPassword.length < 8 || ConfirmPassword.length < 8) {
            done("Invalid Password");
            return;
        }

        submit.click();

        var noaccount = element(by.xpath('//p[../@data-ng-show=\'error\']'));
        noaccount.isPresent().then(function (res) {
            if(res){
                noaccount.getText().then(function (txt) {
                    var text = txt;
                    if(text)
                        done(text,submit);
                });
            }
            else{
                forgotpassword.logout();
                done(null,null);
            }
        });
    }

    data.forEach(function (data) {
        it('should create new password', function () {

            if(validateUserData(data)) {

                generateOTPFunction(data.username,function (error,ele) {
                    if(error){
                        console.log(error);
                        return;
                    }

                    verifyOTPFunction(data.username,function (error,ele) {
                        if(error){
                            console.log(error);
                            return;
                        }

                        updatePasswordFunction(data.newpassword,data.confirmpassword,function (error,ele) {
                            if(error){
                                console.log(error);
                                return;
                            }
                        });
                    });
                });
            }
            else
                console.log("Missing Username / Password");
        });
    });
});
