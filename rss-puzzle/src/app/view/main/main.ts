import './main.scss';
import { ElementParams } from '../../utils/elementCreator/elementCreator';
import View from '../view';

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
        const element = view.getViewHtml();
        const main = this.view.getElement();
        main.innerHTML = '';
        main.classList.add('smooth-transition');
        setTimeout(() => {
            main.classList.remove('smooth-transition');
        }, 500);
        main.append(element);
    }
}

export default MainView;
