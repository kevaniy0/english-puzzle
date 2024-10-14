import ElementCreator from '../elementCreator/elementCreator';
import { ElementParams } from '../elementCreator/elementCreator';

class FormCreator {
    form: ElementCreator<'form'>;

    constructor(params: ElementParams<'form'>) {
        this.form = this.createForm(params);
    }

    private createForm(params: ElementParams<'form'>) {
        const form = new ElementCreator(params);
        return form;
    }

    private validateField(input: HTMLInputElement, span: HTMLSpanElement) {
        input.addEventListener('input', () => {
            const exp = /^[A-Za-z-]*$/;
            const isValid = exp.test(input.value);

            if (!isValid) {
                this.createErrorField(input);
                span.textContent = 'Only English alphabet and symbol(-) ';
            } else if (input.classList.contains('login_input_last-name') && input.value.length < 4) {
                this.createErrorField(input);
                span.textContent = 'At least 4 letters in the second name';
            } else if (input.value.length < 3) {
                this.createErrorField(input);
                span.textContent = 'At least 3 letters in the name';
            } else if (input.value[0] !== input.value[0].toUpperCase()) {
                this.createErrorField(input);
                span.textContent = 'The first letter must be in a upper case';
            } else {
                this.removeErrorField(input);
                span.textContent = '\u00A0';
            }
        });
    }

    public createInputField(
        labelParams: ElementParams<'label'>,
        inputParams: ElementParams<'input'>,
        spanParams: ElementParams<'span'>
    ) {
        const label = new ElementCreator(labelParams);
        const input = new ElementCreator(inputParams);
        const span = new ElementCreator(spanParams);

        this.validateField(input.getElement(), span.getElement());
        this.form.getElement().append(label.getElement(), input.getElement(), span.getElement());

        return input;
    }

    private createErrorField(input: HTMLInputElement): void {
        input.style.cssText = 'border: 1px solid red';
        input.classList.remove('login_input-valid');
        input.classList.add('login_input-invalid');
    }

    private removeErrorField(input: HTMLInputElement): void {
        input.style.cssText = '';
        input.classList.remove('login_input-invalid');
        input.classList.add('login_input-valid');
        input.style.cssText = 'border: 1px solid green';
    }

    public createLoginButton(btnParams: ElementParams<'button'>) {
        const btn = new ElementCreator(btnParams);

        btn.getElement().disabled = true;
        this.form.getElement().append(btn.getElement());

        return btn;
    }

    public checkButtonStatus(inputName: HTMLInputElement, inputLastName: HTMLInputElement, btn: HTMLButtonElement) {
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
        return this.form.getElement();
    }
}

export default FormCreator;
