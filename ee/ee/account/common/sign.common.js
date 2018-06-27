'use strict';

var menu=element(by.id('profilemenu'));

exports.validateUserRegisteredData=function(username,password){
    if(username && username.length>0 && password && password.length>7)
        return true;
    return false;
};


function isElementPresent(element) {
    //var flag = false;
    return element.isPresent().then(function (result) {
      if(result)
          return true;
      else
          return false;
  });
}

function isElementDisplayed(element) {
    //var flag = false;
  var flag = element.isDisplayed().then(function (result) {
      if(result)
          return true;
      else
          return false;
  });
  return flag;
}

function isElementEnabled(element) {
    //var flag = false;
    var flag = element.isEnabled().then(function (result) {
        if(result)
            return true;
        else
            return false;
    });
    return flag;
}
exports.isClickable=function(element,done){

   isElementPresent(element).then(function (val) {
       if(val === false)
           return done('Not Present',null);
       isElementDisplayed(element).then(function (val) {
           if(val === false)
               return done('Not Displayed',null);
           isElementEnabled(element).then(function (val) {
               if(val === false)
                   return done('Not Clickable',null);
               return done(null,element);
           });
       });
   });
};

function logout() {
    var logout = element(by.id('logout'));
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(menu), 5000);
    if (menu.isPresent() && menu.isDisplayed()) {
        menu.click();
        browser.sleep(1000);
        logout.click();
    }
}

exports.logout=function(){
        logout();
};

exports.companyProfile=function(){
  var companyprofile=element(by.id('companyprofile'));
  if(menu.isPresent() && menu.isDisplayed()){
      menu.click();
      browser.sleep(1000);
      companyprofile.click();
  }
};

exports.login=function(data){
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var button = element(by.xpath('//form[@name=\'signup\']/button[@aria-label=\'Login\']'));

    username.sendKeys(data.username);
    password.sendKeys(data.password);
    button.click();
};

exports.register=function(data){
    var username=element(by.xpath('//input[@aria-label=\'Email/Mobile No.\']'));
    var password=element(by.model('password'));
    var generateOTP=element(by.xpath('//button[@aria-label=\'Generate OTP\']'));
    var otp=element(by.model('otp'));
    var nxt=element(by.xpath('//button[@aria-label=\'Next\' and @aria-hidden=\'false\']'));
    var start=element(by.xpath('//button[@aria-label=\'Start your 45 days free trial\']'));

    username.sendKeys(data.username);
    password.sendKeys(data.password);
    generateOTP.click();

    var text = element(by.xpath('//p[contains(text(),\'An OTP has been sent\')]')).getText().then(function (sp) {
        return sp.split(". ");
    });
    text.then(function (slices) {
        var otp1 = slices[1];
        otp.sendKeys(otp1);
    });
    generateOTP.click();

    var trading=element(by.xpath('//md-radio-button[.//h4[text()=\''+data.trading+'\']]'));
    trading.click();
    nxt.click();

    var segments=data.segment;
    segments.forEach(function (segments) {
        var segment = element(by.xpath('//md-checkbox[@ng-model=\'segment.selected\' and .//label[text()=\'' + segments + '\']]'));
        segment.click();
    });

    start.click();
    logout();
};
