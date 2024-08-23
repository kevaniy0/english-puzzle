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
        const inputLastName = FormCreater.createInput(LOGIN.INPUT_LAST_NAME, true);

        const loginBtn = new ElementCreater(LOGIN.BTN).getElement();
        loginBtn.setAttribute('disabled', 'true');

        form.append(labelName, inputName, labelLastName, inputLastName, loginBtn);
        return form;
    }
}

export default LoginPage;
