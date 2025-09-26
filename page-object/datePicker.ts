import { Page, expect } from "@playwright/test";

export class datePickerPage{
    private readonly  page: Page
        constructor(page: Page){
            this.page = page
        }

        async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number){
            let calendarInputField = this.page.getByPlaceholder('Form Picker')
            await calendarInputField.click()
            let dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
            await expect(calendarInputField).toHaveValue(dateToAssert)    
        }

        async datePickerWithDateRangeFromToday(startDateFromToday : number, endDayFromToday : number){
            let calendarInputField = this.page.locator('nb-card-body').getByPlaceholder('Range Picker')
            await calendarInputField.click()
            let dateToAssertStart = await this.selectDateInTheCalendar(startDateFromToday)
            let dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
            let dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
            await expect(calendarInputField).toHaveValue(dateToAssert) 
        }

        private async selectDateInTheCalendar(numberOfDaysFromToday: number){
            let date = new Date()
            date.setDate(date.getDate() + numberOfDaysFromToday)
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
        
            await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact : true}).click()
            return dateToAssert
        }
}