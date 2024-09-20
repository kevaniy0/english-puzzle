import './game.scss';
import * as GAME from './game-data';
import View from '../../view';
import Router from '../../../router/router';
import ElementCreator, { ElementParams } from '../../../utils/elementCreator/elementCreator';
import shuffleCards from '../../../utils/helpers/shuffleCards';
import getJson from '../../../utils/helpers/getJson';
import calculateBlockWidth from '../../../utils/helpers/calculateWidth';
import swapElements from '../../../utils/helpers/swapElements';
import eventEmitter from '../../../utils/eventEmitter/eventEmitter';
import { checkCorrectnessSentence, disableButton, enableButton } from './game-events';

class GameView extends View {
    router: Router;
    collection: Promise<GAME.Collection>;
    level: number = 0;
    round: number = 0;
    currentRow: number = 1;
    gameField: HTMLDivElement;
    rowField: HTMLDivElement;
    sourceBlock: HTMLDivElement;
    sourceSentence: string = '';
    currentAnswerSentence: string = '';
    onClickCard?: (event: Event) => void;
    constructor(router: Router) {
        super(GAME.page);
        this.router = router;
        this.gameField = this.createGameField();
        this.rowField = this.createRowsField();
        this.sourceBlock = this.createSourceBlock();
        this.collection = getJson('./data/wordCollectionLevel1.json');
        this.configureView();
    }

    private createGameField() {
        const gameField = new ElementCreator(GAME.field).getElement();
        return gameField;
    }

    private createRowsField(): HTMLDivElement {
        const rowsField = new ElementCreator(GAME.rowsFild);
        return rowsField.getElement();
    }
    private createCard(cardParams: ElementParams<'div'>): HTMLDivElement {
        const card = new ElementCreator(cardParams);
        return card.getElement();
    }

    private createSourceBlock(): HTMLDivElement {
        const sourceBlock = new ElementCreator(GAME.sourceWords).getElement();
        return sourceBlock;
    }

    private createCurrentSourceWords(arrayWords: string[]) {
        arrayWords.forEach((word, index) => {
            const card = this.createCard({ tag: 'div', className: [`source-word`, `source-word-${index + 1}`] });
            card.textContent = word;
            card.id = `w${index}`;
            this.sourceBlock.append(card);
        });
        this.onClickCard = this.createCallbackCard.bind(this);
        this.gameField.addEventListener('click', this.onClickCard);
    }

    private configureAsnwerRow() {
        const quantityClearBlocks = Array.from(this.sourceBlock.children).length;
        for (let i = 0; i < quantityClearBlocks; i += 1) {
            const clearCard = this.createCard({ tag: 'div', className: ['clear-card'] });
            this.rowField.children[this.currentRow - 1].append(clearCard);
        }
    }

    private configureGame() {
        this.updateSourceBlock();

        this.collection.then((item) => {
            const wordsArray: string[] = item.rounds[this.round].words[this.currentRow - 1].textExample.split(' ');
            this.sourceSentence = wordsArray.join(' ');
            shuffleCards(wordsArray);
            this.createCurrentSourceWords(wordsArray);
            const arrayWords = Array.from(this.sourceBlock.children) as HTMLElement[];

            this.configureAsnwerRow();
            calculateBlockWidth(this.rowField, arrayWords);
            window.addEventListener('resize', () => {
                calculateBlockWidth(this.rowField, arrayWords);
            });
            eventEmitter.emit('disableContinueButton');
            eventEmitter.emit('disableCheckButton');
        });
    }

    private updateRowField() {
        while (this.rowField.firstElementChild) {
            this.rowField.firstElementChild.remove();
        }
        for (let i = 0; i < 10; i += 1) {
            const row = new ElementCreator(GAME.row);
            row.getElement().classList.add(`row-${i + 1}`);
            this.rowField.append(row.getElement());
        }
    }

    private updateSourceBlock() {
        while (this.sourceBlock.firstElementChild) {
            this.sourceBlock.firstElementChild.remove();
        }
    }

    private createCallbackCard(event: Event) {
        const target = event.target! as HTMLElement;
        if (!target.classList.contains('source-word')) return;
        const currentRow = Array.from(this.rowField.children)[this.currentRow - 1] as HTMLElement;
        swapElements(target, currentRow, this.sourceBlock);
        this.checkFullFilledRow(currentRow);
        this.updateAnswerSentence(currentRow);
    }

    private createContinueButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.continueButton);
        btn.getElement().disabled = true;
        btn.getElement().addEventListener('click', () => {
            if (this.onClickCard) this.gameField.removeEventListener('click', this.onClickCard);
            const cards = Array.from(this.rowField.children[this.currentRow - 1].children) as HTMLDivElement[];
            cards.forEach((item) => {
                console.log(item);
            });
            this.currentRow += 1;
            if (this.currentRow === 11) {
                this.round += 1;
                this.currentRow = 1;
                this.updateRowField();
            }

            if (this.gameField) this.configureGame();
        });
        eventEmitter.subscribe('enableContinueButton', enableButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('disableContinueButton', disableButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createCheckButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.checkButton);
        btn.getElement().disabled = true;
        const timer: GAME.Timer = { removeClasses: null };
        btn.getElement().addEventListener('click', () => {
            if (checkCorrectnessSentence(this.sourceSentence, this.currentAnswerSentence)) {
                eventEmitter.emit('enableContinueButton');
            } else {
                eventEmitter.emit('disableContinueButton');
            }

            this.paintCheckBlocks(this.sourceSentence, this.currentAnswerSentence, timer);
        });

        eventEmitter.subscribe('enableCheckButton', enableButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('disableCheckButton', disableButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createButtonField(): HTMLDivElement {
        const buttonWrapper = new ElementCreator(GAME.buttonWrapper);
        const checkButton = this.createCheckButton();
        const continueBtn = this.createContinueButton();
        buttonWrapper.getElement().append(checkButton, continueBtn);
        return buttonWrapper.getElement();
    }

    private paintCheckBlocks(correctSentence: string, currentSentence: string, timer: GAME.Timer) {
        const currentBlocks = Array.from(this.rowField.children[this.currentRow - 1].children) as HTMLElement[];
        const correctWords = correctSentence.split(' ');
        const currentWords = currentSentence.split(' ');
        if (timer.removeClasses) {
            clearTimeout(timer.removeClasses);
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }
        for (let i = 0; i < correctWords.length; i += 1) {
            currentBlocks[i].classList.remove('paint-wrong', 'paint-true');
            if (correctWords[i] === currentWords[i]) {
                currentBlocks[i].classList.add('paint-true');
            } else {
                currentBlocks[i].classList.add('paint-wrong');
            }
        }
        timer.removeClasses = setTimeout(() => {
            currentBlocks.forEach((item) => item.classList.remove('paint-wrong', 'paint-true'));
        }, 3000);
    }

    private checkFullFilledRow(answerRow: HTMLElement): void {
        const arrayFromRow = Array.from(answerRow.children);
        const result = arrayFromRow.every((item) => !item.classList.contains('clear-card'));
        if (result) {
            eventEmitter.emit('enableCheckButton');
        } else {
            eventEmitter.emit('disableCheckButton');
            eventEmitter.emit('disableContinueButton');
        }
    }

    private updateAnswerSentence(row: HTMLElement) {
        const arrayFromRow = Array.from(row.children).map((item) => item.textContent);
        this.currentAnswerSentence = arrayFromRow.join(' ');
    }

    configureView(): void {
        this.configureGame();
        this.updateRowField();
        const buttonField = this.createButtonField();

        this.gameField.append(this.rowField, this.sourceBlock, buttonField);

        this.getViewHtml().append(this.gameField);
    }
}

export default GameView;
