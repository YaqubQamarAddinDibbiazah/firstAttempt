import{expect, test} from '@playwright/test'
import { listenerCount } from 'process'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('form layout page', () => {
    test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        let usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500})

        //generic assertion
        let inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') // toHaveText не сработает для поля ввода
    })

    test('radio buttons', async({page}) => {
        let usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true}) 

        // option 1

        const radioStatus = usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()
        expect(radioStatus).toBeTruthy()
        
        //option 2
        
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 2"})).toBeChecked()
        
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    
    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click() 

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    let allBoxes = page.getByRole('checkbox')

    for (let box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('dropdowns', async({page}) =>{
    let dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    //page.getByRole('list') - when the list has a UL tag
    //page.getByRole('listitem') - when the list has LI tag

    //let optionList = page.getByRole('list').locator('nb-option')

    let optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()

    let header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    let colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }
    await dropDownMenu.click()
    for(let color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color !="Corporate")
            await dropDownMenu.click()
    }
})

test('tooltips', async({page}) =>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    let toolipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolipCard.getByRole('button', {name: "Top"}).hover()

    //await page.getByRole('tooltip') - only if role tooltip created
    let tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
    
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('webtable', async({page})=> {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get the row by any text in the row

    /*let targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()*/

    //get the row based on the value in the specific column

    /*await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    let targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@niggapunk-fent')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@niggapunk-fent')*/

    //test filter of the table

    let ages = ["20", "30", "40", "200"]
    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        let ageRows = page.locator('tbody tr')
        for(let row of await ageRows.all()){
            let cellValue = await row.locator('td').last().textContent()

            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else{
            expect(cellValue).toEqual(age)
        }


        }

    }
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
    let calendarInputField = page.locator('nb-card-body').getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 28)
    let expectedDate = date.getDate().toString()
    let expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    let expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    let expectedYear = date.getFullYear()
    let dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    let expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact : true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page}) => {
    //update attribute
    // let tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '232.097')
    //     node.setAttribute('cy', '232.097' )
    // })
    // await tempGauge.click()

    //mouse movement

    let tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    let box = await tempBox.boundingBox()
    let x = box.x + box.width / 2
    let y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})

