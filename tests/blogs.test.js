const Page = require('./helpers/page'); // Custom Page Alias to Page here
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});
/*
describe('When Logged In', async () =>{
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating.btn-large.red');
  });

  test('Can see Blog Creation Form', async () =>{
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title')
  });

  describe('When submitting Invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('The form shows an Invalid Error message', async () => {
      const text = await page.getContentsOf('.title .red-text');
      expect(text).toEqual('You must provide a value');
      const textC = await page.getContentsOf('.content .red-text');
      expect(textC).toEqual('You must provide a value');
    });
  });

  describe('And using Valid Inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });
    test('Submitting takes user to Review Screen', async () => {
      const textH5 = await page.getContentsOf('form h5');
      expect(textH5).toEqual('Please confirm your entries');
      // const btnLabel = await page.getContentsOf('.green.btn-flat.right.white-text');
      // expect(btnLabel).toEqual('Save Blog');
    });
    test('Submitting and Saving adds blog to the Blog Page', async () => {
      await page.click('.green.btn-flat.right.white-text');
      // Need timeout for page to reload
      await page.waitFor('.card');
      const cardTitle = await page.getContentsOf('.card-title');
      const cardContent = await page.getContentsOf('.card-content p');
      expect(cardTitle).toEqual('My Title');
      expect(cardContent).toEqual('My Content');
    });
  });
});
*/

describe('User is not logged In', async () => {
  test('User can not create Blog Post', async () => {
    const result = await page.evaluate( () => {
      return fetch('/api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'My Title From Test', content: 'My Content from Test'})
      }).then(res => res.json());
    });
    // console.log('Result:', result);
    expect(result).toEqual({ error: 'You must log in!' });
  });
  test('User Can not view Blog', async () => {
    const result = await page.evaluate( () => {
      return fetch('/api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    });
    // console.log('Result:', result);
    expect(result).toEqual({ error: 'You must log in!' });
  });
});