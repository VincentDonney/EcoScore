const { TaskResponse } = require("./TaskManager");

async function scrollPage(page, scrollContainer, bar, scrollsNumber, intervalBetweenScroll) {
    const scrollNumberMax = scrollsNumber;
    let lastHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
    while (scrollsNumber-- > 0) {
        bar.tick();
        await page.evaluate(`document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`);
        await page.waitForTimeout(intervalBetweenScroll);
        let newHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
        if (newHeight === lastHeight)
            break;
        lastHeight = newHeight;
    }
    bar.tick(scrollNumberMax);
    bar.terminate();
}

async function getReviewsFromPage(page) {
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".jftiEf")).map((e) => {
            if(e.hasAttribute("data-review-id") && e.querySelector("span.wiI7pd") !== null)
                return e.querySelector("span.wiI7pd").textContent.trim().replace(/[\n\r]+/g, '');
        }).filter(e => e !== undefined);
    });
}

async function getLocalPlaceReviews(puppeteer, promiseIndex, taskValue) {
    const placeUrl = taskValue.url;
    const restaurantName = taskValue.restaurantName;

    const browser = await taskValue.puppeteer.launch(taskValue.config.puppeteer);

    const page = await browser.newPage();
    if(taskValue.config.enableConsole)
        page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(placeUrl);

    await page.waitForSelector(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.Nc7WLe");
    await page.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.LQeN7.Nc7WLe");

    await page.waitForSelector("button[data-tab-index=\"0\"].hh2c6");

    await page.evaluate(() => {
        const element = Array.from(document.querySelectorAll('div')).find(el => el.textContent === 'Avis');
        element.closest('button.hh2c6').click();
    })

    await page.waitForTimeout(1000);

    await scrollPage(page,'.DxyBCb', taskValue.bar, taskValue.config.scrolling.maxScroll, taskValue.config.scrolling.intervalBetweenScroll);

    const reviews = await getReviewsFromPage(page);

    await browser.close();

    return new TaskResponse(promiseIndex,  { "name" : restaurantName, "data" :{  placeUrl, reviews }});
}

module.exports = { getLocalPlaceReviews };