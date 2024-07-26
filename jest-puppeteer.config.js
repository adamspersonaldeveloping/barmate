module.exports = {
  launch: {
    headless: false, //Puppeteer will open window in desktop environment
    args: ["--window-size=1366,768"], //pass relevant args to browser instance
  },
  browser: "chromium",
};
