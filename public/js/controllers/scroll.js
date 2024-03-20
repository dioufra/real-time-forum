class ScrollController {
    constructor() {
        this.elements = {}
    }
    setScroll(name,element){
        this.elements[name]= {scrollTop:element.scrollTop,scrollLeft:element.scrollLeft}
    }
}
export const SCROLL_CONTROLLER = new ScrollController()