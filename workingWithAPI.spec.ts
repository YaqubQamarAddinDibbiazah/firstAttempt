import { test, expect, request } from '@playwright/test';
import tags from './tags.json'
test.beforeEach(async({page}) => {

  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
    
  await route.fulfill({
    body: JSON.stringify(tags)
  })
  })

 
  await page.goto('https://conduit.bondaracademy.com/')
  await page.getByText('Sign In').click()
  await page.getByRole('textbox', {name: "Email"}).fill('qamar-yaqub@gmail.com')
  await page.getByRole('textbox', {name: "Password"}).fill('12312312')
  await page.getByRole('button').click()
})
test('has title', async ({ page }) => {
   await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => {
    let response = await route.fetch()
    let responseBody = await response.json()
    responseBody.articles[0].title="no no niggers MOCK"
    responseBody.articles[0].description="yes ive said that MOCK"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })
  
  
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('.sidebar .tag-list')).toContainText('AQA')
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list h1').first()).toContainText('no no niggers MOCK')
  await expect(page.locator('app-article-list p').first()).toContainText('yes ive said that MOCK')
});

test('delete article', async({page, request}) => {
  let response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
      "user":{"email":"qamar-yaqub@gmail.com","password":"12312312"}
    }
  })
  let responseBody = await response.json()
  let accessToken = responseBody.user.token

  let articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
    data: {
      "article":{"title":"originalTitle","description":"1234","body":"123","tagList":[]}
    }, headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  expect( articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('originalTitle').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list h1').first()).not.toContainText('originalTitle')
})

test('create article', async({page, request}) =>{
  let title = "nigga121232133"
  await page.getByText('New Article').click()
  await page.getByPlaceholder('Article Title').fill(`${title}`)
  await page.getByRole('textbox', {name: "What's this article about?"}).fill('african american community representatives')
  await page.getByRole('textbox', {name: "Write your article (in markdown)"}).fill('shiii maaan daaawg')
  await page.getByRole('button', {name: "Publish Article"}).click()
  


  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug
  
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list h1').first()).toContainText(`${title}`)

  let response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
      "user":{"email":"qamar-yaqub@gmail.com","password":"12312312"}
    }
  })
  let responseBody = await response.json()
  let accessToken = responseBody.user.token

  let deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  expect( deleteArticleResponse.status()).toEqual(204)
})