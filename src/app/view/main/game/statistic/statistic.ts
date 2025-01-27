import View from '../../../view';
import './statistic.scss';
// import storage from '../../../../services/storage-service';
import {
    art,
    audioIcon,
    audioLoader,
    continueButton,
    info,
    knownField,
    knownTitle,
    sentenceItem,
    sentencesWrapper,
    statisticComponent,
    statisticWrapper,
    unknownField,
    unknownTitle,
} from './statistic-data';
import ElementCreator, { ElementParams } from '../../../../utils/elementCreator/elementCreator';
import storage from '../../../../services/storage-service';

type Callback = (event: Event) => void;

class StatisticView extends View {
    info: HTMLParagraphElement;
    image: HTMLImageElement;
    audioAndLabel: [HTMLAudioElement, HTMLSpanElement][] = [];
    knownField: ElementCreator<'div'>;
    unknownField: ElementCreator<'div'>;
    continueButton: ElementCreator<'button'>;
    statsWrapper: ElementCreator<'div'>;
    constructor(onClickContinue: Callback) {
        super(statisticComponent);
        this.continueButton = this.createContinueButton(onClickContinue);
        this.knownField = this.createSentencesField(knownField);
        this.unknownField = this.createSentencesField(unknownField);
        this.image = this.createImage();
        this.info = this.createInfo();
        this.statsWrapper = this.createWrapper();
        this.configureView();
    }

    private createContinueButton(callback: Callback): ElementCreator<'button'> {
        const button = new ElementCreator(continueButton);
        button.getElement().addEventListener('click', callback);
        return button;
    }

    private createSentencesField(params: ElementParams<'div'>) {
        const field = new ElementCreator(params);
        return field;
    }
    private createWrapper(): ElementCreator<'div'> {
        const wrapper = new ElementCreator(sentencesWrapper);
        return wrapper;
    }

    private createImage(): HTMLImageElement {
        const image = new ElementCreator(art);
        return image.getElement();
    }

    private createInfo(): HTMLParagraphElement {
        const artInfo = new ElementCreator(info);
        return artInfo.getElement();
    }

    private onClickHideView(): void {
        this.view.getElement().addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('statistic-view')) {
                this.view.getElement().style.display = 'none';
            }
        });
    }

    public clearFields(): void {
        while (this.knownField.getElement().firstElementChild) {
            this.knownField.getElement().firstElementChild?.remove();
        }
        while (this.unknownField.getElement().firstElementChild) {
            this.unknownField.getElement().firstElementChild?.remove();
        }
    }

    private createAudioIcon(audio: HTMLAudioElement): ElementCreator<'span'> {
        const span = new ElementCreator(audioIcon);
        const loader = new ElementCreator(audioLoader);
        span.getElement().append(loader.getElement());
        this.audioAndLabel.push([audio, loader.getElement()]);
        span.getElement().addEventListener('click', () => {
            this.audioAndLabel.forEach((item) => {
                item[0].pause();
                item[0].currentTime = 0;
                item[1].classList.remove('audio-loader-on');
            });
            audio.play();
            loader.getElement().classList.add('audio-loader-on');
            audio.addEventListener('ended', () => {
                loader.getElement().classList.remove('audio-loader-on');
            });
        });
        return span;
    }

    public fillFields(): void {
        const data = storage.USER_DATA?.statistic.gameStats;
        if (!data) return;
        this.clearFields();
        data.knownSentences.forEach((item) => {
            const sentence = new ElementCreator(sentenceItem);
            sentence.setTextContent(item[0]);
            const audioIcon = this.createAudioIcon(item[1]);
            sentence.getElement().prepend(audioIcon.getElement());

            this.knownField.getElement().append(sentence.getElement());
        });
        data.unknownSentences.forEach((item) => {
            const sentence = new ElementCreator(sentenceItem);
            sentence.setTextContent(item[0]);
            const audioIcon = this.createAudioIcon(item[1]);
            sentence.getElement().prepend(audioIcon.getElement());

            this.unknownField.getElement().append(sentence.getElement());
        });
        this.image.src = storage.USER_DATA!.statistic.gameStats.currentPuctire;
        this.info.textContent = `${storage.USER_DATA!.statistic.gameStats.autor}  -  "${storage.USER_DATA!.statistic.gameStats.pictureName}",  ${storage.USER_DATA!.statistic.gameStats.year}`;
    }

    public configureView(): void {
        const wrapper = new ElementCreator(statisticWrapper);
        const titleKnown = new ElementCreator(knownTitle);
        const titleUnknown = new ElementCreator(unknownTitle);
        this.statsWrapper
            .getElement()
            .append(
                this.image,
                this.info,
                titleKnown.getElement(),
                this.knownField.getElement(),
                titleUnknown.getElement(),
                this.unknownField.getElement()
            );

        wrapper.getElement().append(this.statsWrapper.getElement(), this.continueButton.getElement());
        this.view.getElement().append(wrapper.getElement());
        this.onClickHideView();
    }
}

export default StatisticView;
