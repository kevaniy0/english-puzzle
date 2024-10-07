import './main.scss';
import { ElementParams } from '../../utils/elementCreator/elementCreator';
import View from '../view';
import LoginView from './login/login';
import eventEmitter from '../../utils/eventEmitter/eventEmitter';

class MainView extends View {
    constructor(view: View) {
        const params: ElementParams<'main'> = {
            tag: 'main',
            className: ['main'],
        };
        super(params);
        this.configureView(view);
    }

    configureView(view: View): void {
        if (!(view instanceof LoginView)) {
            eventEmitter.emit('showLogoutButton');
        } else {
            eventEmitter.emit('hideLogoutButton');
        }
        const element = view.getViewHtml();
        const main = this.view.getElement();
        while (main.firstElementChild) {
            main.firstElementChild.remove();
        }

        main.append(element);
        main.classList.add('smooth-transition');
        setTimeout(() => {
            main.classList.remove('smooth-transition');
        }, 501);
    }
}

export default MainView;
