import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import './hints.scss';
import { component, iconsWrapper, translate, translateButton, translateHoverTitle, translateSpan } from './hints-data';

class Hints extends View {
    translationSentence: ElementCreator<'p'>;
    translationIcon: ElementCreator<'button'>;
    constructor() {
        super(component);
        this.translationSentence = this.createTranslate();
        this.translationIcon = this.createTranslateIcon();
        this.configureView();
    }

    private createTranslate(): ElementCreator<'p'> {
        const sentence = new ElementCreator<'p'>(translate);
        return sentence;
    }

    private createHintIcons(): ElementCreator<'div'> {
        const wrapper = new ElementCreator<'div'>(iconsWrapper);
        return wrapper;
    }

    private createTranslateIcon(): ElementCreator<'button'> {
        const button = new ElementCreator<'button'>(translateButton);
        const span = new ElementCreator<'span'>(translateSpan);
        button.getElement().append(span.getElement());
        button.getElement().title = translateHoverTitle;
        return button;
    }

    configureView(): void {
        const hintWrapper = this.createHintIcons();
        hintWrapper.getElement().append(this.translationIcon.getElement());

        this.view.getElement().append(hintWrapper.getElement(), this.translationSentence.getElement());
    }
}

export default Hints;
