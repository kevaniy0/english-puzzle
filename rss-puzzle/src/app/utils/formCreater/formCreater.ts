import ElementCreater from '../elementCreater/elementCreater';
import { ElementParams } from '../elementCreater/elementCreater';

class FormCreater {
    form: HTMLFormElement;
    constructor(params: ElementParams<'form'>) {
        this.form = this.createForm(params);
    }

    private createForm(params: ElementParams<'form'>): HTMLFormElement {
        const form = new ElementCreater(params);
        return form.getElement();
    }

    public static createInput(params: ElementParams<'input'>, required = false): HTMLInputElement {
        const input = new ElementCreater(params);
        required && (input.getElement().required = true);
        return input.getElement();
    }

    public static createLabel(params: ElementParams<'label'>): HTMLLabelElement {
        const label = new ElementCreater(params);
        return label.getElement();
    }

    // public static createBtn(params: ElementParams<'input'>): HTMLInputElement {
    //     const btn = new ElementCreater(params);
    //     btn.getElement().type = 'button';
    //     return btn.getElement();
    // }
    public getElement() {
        return this.form;
    }
}

export default FormCreater;
