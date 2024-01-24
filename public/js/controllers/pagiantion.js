import { updateComponents } from "../script.js";

class PaginationController {
    constructor() {
        this.Iterate = 1
        this.LastPage = 4
        this.CurrentPage = 2
    }
    setPaginationData({Iterate,LastPage,CurrentPage}){
        this.Iterate = Iterate || this.Iterate
        this.LastPage = LastPage || this.LastPage
        this.CurrentPage = CurrentPage || this.CurrentPage
        updateComponents()
    }
}
export const PAGINATION_CONTROLLER = new PaginationController()