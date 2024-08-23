import ElementCreater from '../utils/elementCreater/elementCreater';
import { ElementParams } from '../utils/elementCreater/elementCreater';

abstract class Page<T extends keyof HTMLElementTagNameMap> {
    container: HTMLElement;
    constructor(params: ElementParams<T>) {
        this.container = new ElementCreater(params).getElement();
    }

    public getElement() {
        return this.container;
    }
}

export default Page;
