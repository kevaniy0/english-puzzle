import { ElementParams } from '../../utils/elementCreater/elementCreater';

const FORM_PARAMS: ElementParams<'form'> = {
    tag: 'form',
    className: ['login_form'],
};

const PAGE: ElementParams<'section'> = { tag: 'section', className: ['login_section'] };
const TITLE: ElementParams<'h2'> = { tag: 'h2', className: ['login_title'], textContent: 'Sign In' };
const LABEL_NAME: ElementParams<'label'> = {
    tag: 'label',
    className: ['login_label', 'login_label_name'],
    textContent: 'First Name',
};
const LABEL_LAST_NAME: ElementParams<'label'> = {
    tag: 'label',
    className: ['login_label', 'login_label_last-name'],
    textContent: 'Last Name',
};
const INPUT_NAME: ElementParams<'input'> = {
    tag: 'input',
    className: ['login_input', 'login_input_name'],
};
const INPUT_LAST_NAME: ElementParams<'input'> = {
    tag: 'input',
    className: ['login_input', 'login_input_last-name'],
};

const BTN: ElementParams<'button'> = { tag: 'button', className: ['login_btn', 'btn'], textContent: 'Login' };

export { FORM_PARAMS, PAGE, TITLE, LABEL_NAME, LABEL_LAST_NAME, INPUT_NAME, INPUT_LAST_NAME, BTN };
