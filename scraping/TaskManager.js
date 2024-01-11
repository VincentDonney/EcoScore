const puppeteer = require("puppeteer");

class TaskResponse {
    constructor(promiseIndex, value) {
        this.promiseIndex = promiseIndex;
        this.value = value;
    }
}

async function executeTasksSequentially(tasksValue, executeTask, maxConcurrentTasks) {
    const results = {};
    const promises = [];
    let index = maxConcurrentTasks;

    for (let i = 0; i < Math.min(tasksValue.length, maxConcurrentTasks); i++)
        promises.push(executeTask(puppeteer, i, tasksValue[i]));

    while (index < tasksValue.length) {
        const result = await Promise.race(promises);
        results[result.value.name] = result.value.data;
        promises[result.promiseIndex] = executeTask(puppeteer, result.promiseIndex, tasksValue[index])
        index++;
    }

    await Promise.all(promises).then((r) => r.forEach((r) => results[r.value.name] = r.value.data));

    return results;
}

module.exports = { TaskResponse, executeTasksSequentially };