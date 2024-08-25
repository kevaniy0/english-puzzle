import './login.scss';
import ElementCreater from '../../utils/elementCreater/elementCreater';
import FormCreater from '../../utils/formCreater/formCreater';
import Page from '../page';
import * as LOGIN from './data';

class LoginPage extends Page<'section'> {
    constructor() {
        super(LOGIN.PAGE);
        this.container.append(this.createTitle());
        this.container.append(this.createLoginPage());
    }

    private createTitle() {
        const title = new ElementCreater(LOGIN.TITLE);
        return title.getElement();
    }

    private createLoginPage() {
        const form = new FormCreater(LOGIN.FORM_PARAMS).getElement();

        const labelName = FormCreater.createLabel(LOGIN.LABEL_NAME);
        const labelLastName = FormCreater.createLabel(LOGIN.LABEL_LAST_NAME);

        const inputName = FormCreater.createInput(LOGIN.INPUT_NAME, true);
        const spanName = FormCreater.createValidateError(LOGIN.SPAN_INPUT_NAME);
        FormCreater.validateInput(inputName, spanName);

        const inputLastName = FormCreater.createInput(LOGIN.INPUT_LAST_NAME, true);
        const spanLastName = FormCreater.createValidateError(LOGIN.SPAN_INPUT_LAST_NAME);
        FormCreater.validateInput(inputLastName, spanLastName);

        const loginBtn = new ElementCreater(LOGIN.BTN).getElement();
        loginBtn.setAttribute('disabled', 'true');

        FormCreater.checkButtonStatement(inputName, inputLastName, loginBtn);
        FormCreater.sendForm(inputName, inputLastName, loginBtn);

        form.append(labelName, inputName, spanName, labelLastName, inputLastName, spanLastName, loginBtn);
        return form;
    }
}

export default LoginPage;
