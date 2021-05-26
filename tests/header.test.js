// const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page'); // Custom Page Alias to Page here

// let browser, page;
let page;

beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false
  // });
  // page = await browser.newPage();
  // await page.goto('http://localhost:3000');
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  // await browser.close();
  await page.close();
});

test('The Header has the correct Logo Text', async () => {
  // const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  // $('a.brand-logo').innerHTML
  const text = await page.getContentsOf('a.brand-logo'); // Helper Wrapper
  expect(text).toEqual('Blogster');
});

test('Clicking Login starts Auth Flow', async() => {
   await page.click('.right a');
   const url = page.url();
   expect(url).toMatch(/accounts\.google\.com/);
});

test('When Logged in Logout Button is visible', async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => {
    return el && el.innerHTML ? el.innerHTML : 'EMPTY'
  });
  expect(text).toEqual('Logout');
});

/*
test('Add Two Numbers', () =>{
  const sum = 1 + 2;

  expect(sum).toEqual(3);
});
*/