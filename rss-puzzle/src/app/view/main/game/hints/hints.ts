import ElementCreator, { ElementParams } from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import './hints.scss';
import { audioUrl } from '../game-data';
import * as Hint from './hints-data';
import { Collection } from '../game-data';
import eventEmitter from '../../../../utils/eventEmitter/eventEmitter';

class Hints extends View {
    translationSentence: ElementCreator<'p'>;
    translationIcon: ElementCreator<'button'>;
    pronounceSentence: ElementCreator<'button'>;
    audioFile: HTMLAudioElement | null;
    pronounceHintIcon: ElementCreator<'button'>;
    backgroundHintIcon: ElementCreator<'button'>;
    constructor() {
        super(Hint.component);
        this.translationSentence = this.createTranslate();
        this.translationIcon = this.createIcon(Hint.translateButton, Hint.translateSpan, Hint.translateHoverTitle);
        this.pronounceSentence = this.createPronounceButton();
        this.pronounceHintIcon = this.createIcon(
            Hint.pronounceHintButton,
            Hint.pronounceHintSpan,
            Hint.pronounceHintHoverTitle
        );
        this.backgroundHintIcon = this.createIcon(
            Hint.backgroundHintIcon,
            Hint.backgroundHintSpan,
            Hint.backgroundHintHoverTitle
        );
        this.audioFile = null;
        this.configureView();
    }

    private createTranslate(): ElementCreator<'p'> {
        const sentence = new ElementCreator<'p'>(Hint.translate);
        return sentence;
    }

    private createHintIcons(): ElementCreator<'div'> {
        const wrapper = new ElementCreator<'div'>(Hint.iconsWrapper);
        return wrapper;
    }

    private createPronounceButton(): ElementCreator<'button'> {
        const button = this.createIcon(Hint.pronuounceButton, Hint.pronounceSpan, Hint.pronounceHoverTitle);
        const icon = button.getElement().firstElementChild!;
        const loader = new ElementCreator<'span'>(Hint.loaderAudio);
        eventEmitter.subscribe('showLoader', () => loader.getElement().classList.add('loader-on'));
        eventEmitter.subscribe('hideLoader', () => loader.getElement().classList.remove('loader-on'));
        icon.append(loader.getElement());
        button.getElement().title = Hint.pronounceHoverTitle;
        return button;
    }

    private createIcon(
        buttonParams: ElementParams<'button'>,
        iconParams: ElementParams<'span'>,
        hoverTitle: string
    ): ElementCreator<'button'> {
        const button = new ElementCreator<'button'>(buttonParams);
        const span = new ElementCreator<'span'>(iconParams);
        button.getElement().append(span.getElement());
        button.getElement().title = hoverTitle;
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
        hintWrapper
            .getElement()
            .append(
                this.translationIcon.getElement(),
                this.pronounceHintIcon.getElement(),
                this.backgroundHintIcon.getElement()
            );

        const sentenceWrapper = new ElementCreator<'div'>(Hint.wrapper);
        sentenceWrapper.getElement().append(this.pronounceSentence.getElement(), this.translationSentence.getElement());
        this.view.getElement().append(hintWrapper.getElement(), sentenceWrapper.getElement());
    }
}

export default Hints;
