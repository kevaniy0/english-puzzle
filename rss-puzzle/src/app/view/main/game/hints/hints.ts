import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import './hints.scss';
import { component, translate } from './hints-data';

class Hints extends View {
    translationSentence: ElementCreator<'p'>;
    constructor() {
        super(component);
        this.translationSentence = this.createTranslate();
        this.configureView();
    }

    private createTranslate() {
        const sentence = new ElementCreator<'p'>(translate);
        return sentence;
    }

    configureView(): void {
        this.view.getElement().append(this.translationSentence.getElement());
    }
}

export default Hints;
