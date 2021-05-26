const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
const keys = require('../../config/keys');

class CustomPage {
  static async build() {
    const options = {
      headless: keys.headLess
    };
    if (['ci'].includes(process.env.NODE_ENV)) {
      options['args'] = [keys.args];
    }
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }
  constructor(page) {
    this.page = page;
  }
  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    // console.log('User: ', user);
    // console.log('sessionString:', session);
    // console.log('sessionSig: ', sig);
    
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs', { 'timeout': 1000, waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('a[href="/auth/logout"]', {timeout: 2000});
  }
  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}
module.exports = CustomPage;