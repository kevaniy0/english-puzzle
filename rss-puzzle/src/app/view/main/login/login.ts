import './login.scss';
import ElementCreator, { ElementParams } from '../../../utils/elementCreator/elementCreator';
import FormCreator from '../../../utils/formCreator/formCreator';
import View from '../../view';
import * as LOGIN from './data';
import Router from '../../../router/router';
import storage from '../../../services/storage-service';
import eventEmitter from '../../../utils/eventEmitter/eventEmitter';

class LoginView extends View {
    router: Router;
    constructor(router: Router) {
        super(LOGIN.PAGE);
        this.router = router;
        this.configureView();
    }

    private createTitle(titleParams: ElementParams<'h2'>) {
        const title = new ElementCreator(titleParams);
        return title;
    }

    createLoginForm() {
        const form = new FormCreator(LOGIN.FORM_PARAMS);

        const inputName = form.createInputField(LOGIN.LABEL_NAME, LOGIN.INPUT_NAME, LOGIN.SPAN_INPUT_NAME);
        const inputLastName = form.createInputField(
            LOGIN.LABEL_LAST_NAME,
            LOGIN.INPUT_LAST_NAME,
            LOGIN.SPAN_INPUT_LAST_NAME
        );

        const loginBtn = form.createLoginButton(LOGIN.BTN);
        loginBtn.getElement().addEventListener('click', (event) => {
            event.preventDefault();

            const name = inputName.getElement().value;
            const lastName = inputLastName.getElement().value;
            storage.createUser({ firstName: name, lastName: lastName });
            eventEmitter.emit('removeMarginForLoginPage');
            this.router.navigate('greeting');
        });
        form.checkButtonStatus(inputName.getElement(), inputLastName.getElement(), loginBtn.getElement());
        this.view.getElement().append(form.getElement());
    }
    configureView(): void {
        const title = this.createTitle(LOGIN.TITLE);
        this.view.getElement().append(title.getElement());
        this.createLoginForm();
        eventEmitter.emit('addMarginForLoginPage');
    }
}

export default LoginView;
