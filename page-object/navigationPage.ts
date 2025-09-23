import { Locator, Page } from "@playwright/test";

export class NavigationPage{

    readonly page: Page
    readonly forLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrPageMenuItem: Locator
    readonly tooltipPageMenuItem: Locator

    constructor(page: Page){
        this.page = page
        this.forLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrPageMenuItem = page.getByText('Toastr')
        this.tooltipPageMenuItem = page.getByText('Tooltip')
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.forLayoutsMenuItem.click()
    }

    async datePickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        await this.datePickerMenuItem.click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrPageMenuItem.click() 
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipPageMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        let groupMenuItem = this.page.getByTitle(groupItemTitle)
        let expanededState = await groupMenuItem.getAttribute('aria-expanded')
        if(expanededState == 'false'){
            await groupMenuItem.click()
        }
    }
}