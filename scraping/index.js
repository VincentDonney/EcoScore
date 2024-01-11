const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const fs = require("fs");

const MultiProgressBar = require("multi-progress");

const { executeTasksSequentially } = require("./TaskManager");
const {getLocalPlaceReviews} = require("./ScrapReviews");

const configPath = "./config.json";
const restaurantNameRegex = /\/place\/([^\/]+)\//;

puppeteer.use(StealthPlugin());

function readConfig(path) {
    try {
        const configFile = fs.readFileSync(path);
        return JSON.parse(configFile.toString());
    }
    catch (e) {
        console.error(e, "Error while reading config file");
        process.exit(1);
    }
}

function main() {
    const config = readConfig(configPath);
    const multiProgressBar = new MultiProgressBar(process.stderr);
    const tasksValue = [];

    for (const url of config.urls) {
        const restaurantName = restaurantNameRegex.exec(url)[1].replace(/\W+/g, '');
        const bar = multiProgressBar.newBar(`${restaurantName.slice(0, 30).padEnd(30, ' ')} [:bar] :percent :etas`, {
            complete: config.progressBar.complete,
            incomplete: config.progressBar.incomplete,
            width: config.progressBar.width,
            total: config.scrolling.maxScroll
        });
        bar.tick(0);
        tasksValue.push({ puppeteer, url, bar, config, restaurantName });
    }

    executeTasksSequentially(tasksValue, getLocalPlaceReviews, 10).then((result) => {

        multiProgressBar.terminate();

        fs.writeFile(config.outputFile, JSON.stringify(result), function (err) {
            if (err)
                return console.log(err);
            console.log("The file was saved!");
        });
    });
}

main();