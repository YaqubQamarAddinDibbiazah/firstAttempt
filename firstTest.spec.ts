import {expect, test} from '@playwright/test'

test.beforeEach(async({page})=> {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('user facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the grid').click()
    await page.getByTitle('IoT Dashboard').click()
    //await page.getByTestId('SignIn').click()
}) 

test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click() //least preferable method
})

test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).first().click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).first().click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).first().click()
})

test('reusing the locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.first().fill('test@email.com')
    await basicForm.getByRole('textbox', {name: "Password"}).first().fill('welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button', {name: "SUBMIT"}).first().click()

    await expect(emailField).toHaveValue('test@email.com')
})


test('extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents() //creates an array with all the values form the element
    expect(allRadioButtonsLabels).toContain("Option 2")  // ensures that the value indicated is present within the array above

    //value of the input field

    const emailField = basicForm.getByRole('textbox', {name : "Email"})
    await emailField.fill('test@email.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@email.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions', async({page}) => {

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    //locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})

/*test('my first test without guidance', async({page}) => {
let basicForm = page.locator('nb-card', {hasText: "Basic form"})

    await basicForm.getByPlaceholder('Email').fill('137137@mail.com')
    await basicForm.getByPlaceholder('Password').fill('1321321321')
    await basicForm.locator('span.custom-checkbox').click()
    await basicForm.locator('button').click()
})
*/

