import{expect, test} from '@playwright/test'

test.beforeEach(async({page}, testInfo)=> {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto-wait', async({page}) => {

    let successButton = page.locator('.bg-success') // это класс если что
    //await successButton.click()

    //let text = await successButton.textContent()
    //await successButton.waitFor({state: 'attached'})
    //let text = await successButton.allTextContents()
    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) =>{
    let successButton = page.locator('.bg-success')

    // ___wait for element
    //await page.waitForSelector('.bg-success')

    // ___ wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //___ wait for network calls to be completed(not recommended)
    await page.waitForLoadState('networkidle')

    ///await page.waitForURL

    let text = await successButton.textContent()
    expect(text).toContain('Data loaded with AJAX get request.')
})


test('timeouts', async({page}) => {
    test.setTimeout(120000)
    test.slow()
    let successButton = page.locator('.bg-success') // это класс если что
    await successButton.click({timeout: 16000})
    //await page.getByRole()
})