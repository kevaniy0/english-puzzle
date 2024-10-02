import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import './hints.scss';
import { audioUrl } from '../game-data';
import {
    component,
    iconsWrapper,
    loaderAudio,
    pronounceHintButton,
    pronounceHintHoverTitle,
    pronounceHintSpan,
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
import eventEmitter from '../../../../utils/eventEmitter/eventEmitter';

class Hints extends View {
    translationSentence: ElementCreator<'p'>;
    translationIcon: ElementCreator<'button'>;

    pronounceSentence: ElementCreator<'button'>;

    audioFile: HTMLAudioElement | null;

    pronounceHintIcon: ElementCreator<'button'>;
    constructor() {
        super(component);
        this.translationSentence = this.createTranslate();
        this.translationIcon = this.createTranslateIcon();
        this.pronounceSentence = this.createPronounceButton();
        this.pronounceHintIcon = this.createPronounceIcon();
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
        const loader = new ElementCreator<'span'>(loaderAudio);
        const span = new ElementCreator<'span'>(pronounceSpan);
        eventEmitter.subscribe('showLoader', () => loader.getElement().classList.add('loader-on'));
        eventEmitter.subscribe('hideLoader', () => loader.getElement().classList.remove('loader-on'));
        span.getElement().append(loader.getElement());
        button.getElement().append(span.getElement());

        button.getElement().title = pronounceHoverTitle;
        return button;
    }

    private createPronounceIcon(): ElementCreator<'button'> {
        const button = new ElementCreator<'button'>(pronounceHintButton);
        const span = new ElementCreator<'span'>(pronounceHintSpan);
        button.getElement().append(span.getElement());
        button.getElement().title = pronounceHintHoverTitle;
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
        hintWrapper.getElement().append(this.translationIcon.getElement(), this.pronounceHintIcon.getElement());

        const sentenceWrapper = new ElementCreator<'div'>(wrapper);
        sentenceWrapper.getElement().append(this.pronounceSentence.getElement(), this.translationSentence.getElement());

        this.view.getElement().append(hintWrapper.getElement(), sentenceWrapper.getElement());
    }
}

export default Hints;
