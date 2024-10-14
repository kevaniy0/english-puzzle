import ElementCreator from '../utils/elementCreator/elementCreator';
import { ElementParams } from '../utils/elementCreator/elementCreator';

abstract class View {
    view: ElementCreator<keyof HTMLElementTagNameMap>;
    constructor(params: ElementParams<keyof HTMLElementTagNameMap>) {
        this.view = this.createView(params);
    }

    private createView<T extends keyof HTMLElementTagNameMap>(params: ElementParams<T>): ElementCreator<T> {
        return new ElementCreator(params);
    }

    abstract configureView(view?: View): void;

    public getViewHtml(): HTMLElement {
        return this.view.getElement();
    }
}

export default View;
