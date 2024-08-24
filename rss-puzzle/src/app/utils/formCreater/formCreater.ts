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

    public static validateInput(input: HTMLInputElement, span: HTMLSpanElement): void {
        input.addEventListener(
            'input',
            function () {
                const exp = /^[A-Za-z-]*$/;
                const isValid = exp.test(input.value);

                if (!isValid) {
                    FormCreater.createErrorField(input);
                    span.textContent = 'Only English alphabet and symbol(-) ';
                } else if (input.classList.contains('login_input_last-name') && input.value.length < 4) {
                    FormCreater.createErrorField(input);
                    span.textContent = 'At least 4 letters in the second name';
                } else if (input.value.length < 3) {
                    FormCreater.createErrorField(input);
                    span.textContent = 'At least 3 letters in the name';
                } else if (input.value[0] !== input.value[0].toUpperCase()) {
                    FormCreater.createErrorField(input);
                    span.textContent = 'The first letter must be in a upper case';
                } else {
                    FormCreater.removeErrorField(input);
                    span.textContent = '\u00A0';
                }
            }.bind(this)
        );
    }

    public static createValidateError(params: ElementParams<'span'>): HTMLSpanElement {
        const span = new ElementCreater(params);
        return span.getElement();
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

    public static createErrorField(input: HTMLInputElement): void {
        input.style.cssText = 'border: 1px solid red';
        input.classList.remove('login_input-valid');
        input.classList.add('login_input-invalid');
    }

    public static removeErrorField(input: HTMLInputElement): void {
        input.style.cssText = '';
        input.classList.remove('login_input-invalid');
        input.classList.add('login_input-valid');
        input.style.cssText = 'border: 1px solid green';
    }

    public static checkButtonStatement(
        inputName: HTMLInputElement,
        inputLastName: HTMLInputElement,
        btn: HTMLButtonElement
    ) {
        function changeStatement() {
            if (
                inputName.classList.contains('login_input-valid') &&
                inputLastName.classList.contains('login_input-valid')
            ) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }

        inputName.addEventListener('input', changeStatement);
        inputLastName.addEventListener('input', changeStatement);
    }

    public getElement() {
        return this.form;
    }
}

export default FormCreater;
