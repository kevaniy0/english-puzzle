import ElementCreator from '../../utils/elementCreator/elementCreator';
import View from '../view';
import { footerComponent, github, info, link } from './footer-data';
import './footer.scss';

class FooterView extends View {
    constructor() {
        super(footerComponent);
        this.configureView();
    }

    configureView(): void {
        const data = new ElementCreator(info);
        const iconLink = new ElementCreator(link);
        iconLink.getElement().setAttribute('href', github);
        iconLink.getElement().setAttribute('target', '_blank');

        this.view.getElement().append(data.getElement(), iconLink.getElement());
    }
}

export default FooterView;
