// I am free 
// Every since thing I've done I've decided to do
// My actions are governed by but nothing my free will

const SISFocusBaseURL = "https://sis.palmbeachschools.org/focus"

let {
    getEdgePath,
} = require("edge-paths")
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const {createCursor } = require('ghost-cursor')
const {
    DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
} = require('puppeteer')
const { tableParser } = require('puppeteer-table-parser')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
// puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')()) We don't need A new device has been associated with your Focus account messages
const devtools = require('puppeteer-extra-plugin-devtools')()
puppeteer.use(devtools)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
    AdblockerPlugin({
        // Optionally enable Cooperative Mode for several request interceptors
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    })
)
const creds = require('./creds.json');
const fs = require('fs-extra')
var util = require("util");

const puppeterOptions = {
    headless: true,
    executablePath: getEdgePath(),
    args: []
};

async function runTheSexyCode() {
    const browser = await puppeteer.launch(puppeterOptions);
    const initPage = (await browser.pages())[0];
    const page = await browser.newPage();
    await initPage.close();

    try {
        const cookiesString = await fs.readFile('./cookies.json');
        const previousCookies = JSON.parse(cookiesString);
        await page.setCookie(...previousCookies);
    } catch (e) {
        console.error("Failed to load cookies, oh well..")
        console.error(e.message);
    }
    try {
        const localStorage = await fs.readFile('./localStorage.json');

        const deserializedStorage = JSON.parse(localStorage);
        await page.evaluate(deserializedStorage => {
            for (const key in deserializedStorage) {
                localStorage.setItem(key, deserializedStorage[key]);
            }
            localStorage.setItem("debug", "true")
        }, deserializedStorage);
    } catch (e) {}
    await page.goto(`${SISFocusBaseURL}/Modules.php?modname=misc%2FPortal.php`);
    
    await page.waitForNetworkIdle();
    const loginFormExists = await page.$eval('#main-login-form', () => true).catch(() => false)
    let loggedIn = (await page.url()) === `${SISFocusBaseURL}/Modules.php?modname=misc%2FPortal.php` && !loginFormExists
    if (loggedIn === false) {
        console.log(`So, it seems the scrapper is not logged in. Let's fix that.`)
         await LoginToSIS()
    }
    async function LoginToSIS() {
        const cursor = createCursor(page)
console.log(1)
        await cursor.click('.sso-login-button')
        console.log(2)
        // await page.waitForNavigation({
        //     waitUntil: 'networkidle2',
        // });
        console.log(3)
        await cursor.click('#button-enboardsso-sp')
        console.log(4)

        // await page.waitForNavigation({
        //     waitUntil: 'networkidle2',
        // });
        console.log(5)
        await page.type('#Username', creds.username, {
            delay: 20
        })
        console.log(6)
        await page.type('#Password', creds.password, {
            delay: 20
        })
        console.log(7)
        await cursor.click('#login-button');
        await page.waitForNavigation({
            waitUntil: 'networkidle2'
        });
        const loginFormExists = await page.$eval('#main-login-form', () => true).catch(() => false)
        if (loginFormExists) throw new Error("Failed to login, RIP!")
        console.log(5)

    }

    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
    const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
    await fs.writeFile('./localStorage.json', JSON.stringify(localStorage, null, 2));
    console.log("WE'RE IN!!1 HACKER MOMENT!!!");
    let quarter = await page.evaluate(() => {
        let quarterElement = document.getElementsByClassName("student-block-mp active")[0]
        return quarterElement ? quarterElement.innerText : "N/A"
      })
      console.log(quarter)
      const classes = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('.student-grades-table > tbody > tr'),
          row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
        ).map(c => {
            // hard coded from tables in sis... if this changes, problems lie ahead
            return {
                period: c[2],
                teacher: c[6],
                course: c[5],
                grade: c[12],
                courseId: c[4].replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, '').trim(),
                syear: c[0].replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, '').trim(),
            }
        })
      );
      await fs.writeFile('./grades.json', JSON.stringify(classes, null, 2));
    const userAgent = await browser.userAgent()
    // await page.waitForNavigation({
    //     waitUntil: 'networkidle2'
    // });
    // await browser.close()
    const cursor = createCursor(page)
    await page.waitForSelector("body > div.site-container.sis-package > div.site-middle > nav > div.parent-menu-options-container > div.parent-menu-icons > a:nth-child(7)")
    await cursor.click("body > div.site-container.sis-package > div.site-middle > nav > div.parent-menu-options-container > div.parent-menu-icons > a:nth-child(7)")
    await page.waitForNavigation()
    await cursor.click("body > div.site-container.sis-package > div.site-middle > div > main > div > div.student-grades-top > form > button")

    // const finalResponse = await page.waitForResponse("${SISFocusBaseURL}/classes/FocusModule.class.php?force_package=SIS&modname=Grades%2FStudentRCGrades.php")

    // let responseJson = await finalResponse.json();
    // var bodyFormData = new FormData();
    // const requestData = {

    // }
    // for ( var key in requestData ) {
    //     bodyFormData.append(key, requestData[key]);
    // }
    // const responseJson = await axios("${SISFocusBaseURL}/classes/FocusModule.class.php?force_package=SIS&modname=Grades%2FStudentRCGrades.php&details=false", {
    //     method: "POST",
    //     cookies: cookies,
    //     data: bodyFormData,
    //     headers: {
    //         "User-Agent": userAgent,
    //         "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
    //     }
    // })
    await page.setRequestInterception(true);

    // page.on('request', interceptedRequest => {
    //     if (interceptedRequest.isInterceptResolutionHandled()) return;
    //     console.log("INTERCEPTED REQUEST!!",interceptedRequest.url(), interceptedRequest.method(), interceptedRequest.headers());

    //      interceptedRequest.continue();
    //   });
    page.on('requestfinished', async (request) => {
        const response = await request.response();

        const responseHeaders = response.headers();
        let responseBody;
        if (request.redirectChain().length === 0) {
            // Because body can only be accessed for non-redirect responses.
            if (request.url().includes('StudentRCGrades.php')){
                responseBody = await response.buffer();
                responseBody = JSON.parse(await responseBody.toString());
                // const activeClassesRows = responseBody[0].result.rows.filter(r => r.school_name.includes("HIGH") && r.syear === (new Date().getFullYear() - 1) && Number(r.credits_earned) <= 1)
                await fs.writeFile('./all-grades.json', JSON.stringify(responseBody[0].result.rows, null, 2));
                const activeClassesRows = responseBody[0].result.rows.filter(r => classes.find(c => c.courseId === r.course_number))
                const responseJson = responseBody

                console.log(util.inspect(activeClassesRows, {showHidden: false, depth: null}));
                const firstrow = responseJson[0].result.rows[0]
                const grades = []
                await activeClassesRows.forEach(async(r) => {
                    const gradeForClass = {period: r.period_name, name: r.course_name, room: r.room,  teacher: r.teacher_name, grade: r[`${quarter.toLowerCase()}_mp_grade`] || "NG", school_name: r.school_name, school_year: r.syear, school_year_human: r.syear_display}
                    grades.push(gradeForClass)
                })
                const user = {fname: firstrow.student_first_name, lname: firstrow.student_last_name, number: Number(firstrow.student_id)};
                console.log(`Grades for ${user.fname} ${user.lname} (${user.number}) are:\n${grades.filter(g => g.school_name.includes("HIGH")).map(r => JSON.stringify(r)).join("\n")}`)

            }
        }
        // You now have a buffer of your response, you can then convert it to string :
    
    //    request.continue()

    });
    const [button] = await page.$x("//button[contains(., 'Update')]");
    if (button) {
        const cursor = createCursor(page)
        await cursor.click(button);
  }

};

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
async function handleError(e) {
    if (e.message === "Execution context was destroyed, most likely because of a navigation.") {
        try {
            await fs.unlink('./cookies.json')
        }
        catch(e) {
            console.error("Failed to delete cookies, oh well...")
            console.error(e.message)
        }
        console.error("Bad cookies? Deleting cookies and trying again.")
        puppeterOptions.headless = false;

        // puppeterOptions.slowMo = 250, // slow down by 250ms
        runTheSexyCode()

    }
    else {
        console.error("Unexpected error: " + e.message)
    }
}
runTheSexyCode().catch(handleError)