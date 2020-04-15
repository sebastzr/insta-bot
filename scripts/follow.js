function sleep(ms) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function follow(user, pass, target, amnt) {
    const webdriver = require("selenium-webdriver");
    //Start Chrome
    let driver = await new webdriver.Builder().forBrowser('chrome').build();
    
    await driver.manage().window().setRect({
        width: 350,
        height: 400
    });

    const amount = parseInt(amnt);

    //Go to instagram login
    await driver.get('https://www.instagram.com/accounts/login/?hl=en-us');

    //login
    await driver.findElement(webdriver.By.name('username')).sendKeys(user);
    await driver.findElement(webdriver.By.name('password')).sendKeys(pass, webdriver.Key.ENTER);
    await sleep(10000);

    //Go to target instagram page - followers
    await driver.get('https://www.instagram.com/'+target+'/?hl=en-us');
    await driver.findElement(webdriver.By.partialLinkText('followers')).click();
    await sleep(400);

    //follow
    for (var i = 0; i < Math.trunc(amount/8); i++) {
        for (var j = 0; j < 8; j++) {
            var button = await driver.findElement(webdriver.By.xpath("//li//div//button[.//text()='Follow']"));
            //var buttons = await driver.findElements(webdriver.By.css("div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl"));
            driver.executeScript("arguments[0].scrollIntoView()", button);
            await sleep(300);
            try {
                await button.click();
            } catch (err) {
                console.log(err);
            }
            await sleep(5000);
        }
        await sleep(200000);
    }    
    return;
}

module.exports = follow;

