import { Page, expect } from "@playwright/test";

export class datePickerPage{
    private readonly  page: Page
        constructor(page: Page){
            this.page = page
        }

        async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number){
            let calendarInputField = this.page.locator('nb-card-body').getByPlaceholder('Form Picker')
            await calendarInputField.click()
            let date = new Date()
            date.setDate(date.getDate() + 28)
            let expectedDate = date.getDate().toString()
            let expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
            let expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
            let expectedYear = date.getFullYear()
            let dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        
            let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
            let expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
            while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
                calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        
            await this.page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact : true}).click()
            await expect(calendarInputField).toHaveValue(dateToAssert)    
        }
}