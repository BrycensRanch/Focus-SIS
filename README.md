  <p align="center">
      <img src="https://i.imgur.com/ZUonCKF.png" width="240" />
      <h1 align="center" >Focus SIS Grade Scrapper </h1>
  </p>
  <p align="center">
    <b> Automatically fetch your grades, copy your data elsewhere to be used freely in other applications, since they don't have a REST API for Students.</b>
  </p>
</div>

> ⚠️ I take no responsibility if you get punished for using this, if we go down, we go down together! ⚠️

Logins into SIS and scrapes grades and quarter for current classes, not to mention every class you've had in SIS, thanks to the "Grades" page.

## How this was made possible?

Usually, it's VERY easy to scrape a website for data, especially one as simple as Focus SIS, where it lacks any type of captchas and is VERY organized. However, they implemented a anti inspect element script that prevents you from opening Inspect Element. Thanks to the fact that the script isn't inlined, it isn't always loaded first, so you can cancel loading Focus SIS when you have the dashboard loaded, but not other non-critical scripts. 

## Things to be aware of

This scrapper was designed around Palm Beach County's District portal. I am aware that the Focus SIS software can be utilized by other districts, however, their implementation may be older or newer than the one tested. Support is only provided for Palm Beach County's District Portal. If you'd like to test if it works on your district's version of Focus SIS, you can easily edit the `SISFocusBaseURL` variable in `index.js`.

## Features

- Quarter detection; outputted to console
- Can get ALL your classes from SIS.
- Session saved (we legit just save cookies, it's that easy)
- Saves your active classes grades to a JSON file.
- Evasion measures + tries to act like a human
- Assignment parsing

## Tips

If you can, you should try to run this project LOCALLY. Not behind any VPN or anything like that, so the scrapper doesn't get flagged as a possible robot. This project SHOULD be able to be hosted on a Raspberry Pi.

## Coming Soon

- Webhook/POST to another service?
- Repeated scrapping
- SQLite integration?
- Types
- Not Graded assignment parsing 😭

## Getting Started

- [Install Node.js](https://nodejs.org/en/download/)
- Run `npm install`
- Rename `example.creds.json` to `creds.json`
- Populate the JSON file with your credentials
- Profit

### Warning, again

Do not share your username and password with others. If done, you could have A HUGE amount of your personal information leaked. That's something you don't want. I made this project just to simply check my grades. If you feel this code may be insecure or malicious, review it. It's very simple, to be honest.

## Technologies

- [Puppeteer](https://pptr.dev/)

## Contributing

Of course, contributions are welcome! I know right now the scrapper is limited in what it actually does with data, so I'd love to hear other people's ideas.

Found any bugs/ the project is broken? [Leave an issue](https://github.com/BrycensRanch/Focus-SIS/issues)