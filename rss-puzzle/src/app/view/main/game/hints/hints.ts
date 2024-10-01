import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import './hints.scss';
import { audioUrl } from '../game-data';
import {
    component,
    iconsWrapper,
    pronounceHoverTitle,
    pronounceSpan,
    pronuounceButton,
    translate,
    translateButton,
    translateHoverTitle,
    translateSpan,
    wrapper,
} from './hints-data';
import { Collection } from '../game-data';

class Hints extends View {
    translationSentence: ElementCreator<'p'>;
    translationIcon: ElementCreator<'button'>;

    pronounceSetntence: ElementCreator<'button'>;

    audioFile: HTMLAudioElement | null;
    constructor() {
        super(component);
        this.translationSentence = this.createTranslate();
        this.translationIcon = this.createTranslateIcon();
        this.pronounceSetntence = this.createPronounceButton();
        this.audioFile = null;
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

    private createPronounceButton(): ElementCreator<'button'> {
        const button = new ElementCreator<'button'>(pronuounceButton);
        const span = new ElementCreator<'span'>(pronounceSpan);
        button.getElement().append(span.getElement());
        button.getElement().title = pronounceHoverTitle;
        return button;
    }

    public getAudio(collection: Collection, round: number, currentSentence: number): HTMLAudioElement {
        const item = collection.rounds[round].words[currentSentence - 1].audioExample;
        const url = `${audioUrl}${item}`;
        const audio = new Audio(url);
        return audio;
    }

    configureView(): void {
        const hintWrapper = this.createHintIcons();
        hintWrapper.getElement().append(this.translationIcon.getElement());

        const sentenceWrapper = new ElementCreator<'div'>(wrapper);
        sentenceWrapper
            .getElement()
            .append(this.pronounceSetntence.getElement(), this.translationSentence.getElement());

        this.view.getElement().append(hintWrapper.getElement(), sentenceWrapper.getElement());
    }
}

export default Hints;
