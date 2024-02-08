import { updateComponents } from "../script.js";

class CategoryController {
    constructor() {
        this.currentCategoryId = 0
        this.categories = []
    }
    setCategories(newCategories){
        this.categories = newCategories;
        // updateComponents()
    }
    setCurrentCategoryId(id){
        this.currentCategoryId = id
        // updateComponents()
    }
}
export const CATEGORY_CONTROLLER = new CategoryController()