import { updateComponents } from "../script.js";

class PaginationController {
    constructor() {
        this.PageSize = 10
        this.CurrentPage = 1
    }
    setPaginationData({Iterate,LastPage,CurrentPage}){
        this.Iterate = Iterate || this.Iterate
        this.LastPage = LastPage || this.LastPage
        this.CurrentPage = CurrentPage || this.CurrentPage
        updateComponents()
    }
}
export const PAGINATION_CONTROLLER = new PaginationController()