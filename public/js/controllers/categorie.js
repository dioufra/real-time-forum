import { updateComponents } from "../script.js";

class CategoryController {
    constructor() {
        this.currentCategoryId = 0
        this.categories = [
            { //just an exemple
                Id:0,
                Name:"",
            },
            { //just an exemple
                Id:0,
                Name:"",
            },
        ]
    }
    setCategories(newCategories){
        this.categories = newCategories;
        updateComponents()
    }
    setCurrentCategoryId(id){
        this.currentCategoryId = id
        updateComponents()
    }
}
export const CATEGORY_CONTROLLER = new CategoryController()