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
import { checkCorrectnessSentence, disableButton, enableButton, hideButton, showButton } from './game-events';

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
        const arrayCards: HTMLDivElement[] = [];
        arrayWords.forEach((word, index) => {
            const card = this.createCard({ tag: 'div', className: [`source-word`, `source-word-${index + 1}`] });
            card.textContent = word;
            card.id = `w${index}`;
            arrayCards.push(card);
            // this.sourceBlock.append(card);
        });
        shuffleCards(arrayCards);
        arrayCards.forEach((item) => this.sourceBlock.append(item));
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

            this.createCurrentSourceWords(wordsArray);

            const arrayWords = Array.from(this.sourceBlock.children) as HTMLElement[];

            this.configureAsnwerRow();
            calculateBlockWidth(this.rowField, arrayWords);
            window.addEventListener('resize', () => {
                calculateBlockWidth(this.rowField, arrayWords);
            });
            eventEmitter.emit('disableCheckButton');
            eventEmitter.emit('showAutoCompleteButton');
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
        target.classList.remove('paint-wrong', 'paint-true');
        const currentRow = Array.from(this.rowField.children)[this.currentRow - 1] as HTMLElement;
        swapElements(target, currentRow, this.sourceBlock);
        this.updateAnswerSentence(currentRow);
        this.checkFullFilledRow(currentRow);
    }

    private createContinueButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.continueButton);
        btn.getElement().addEventListener('click', () => {
            if (this.onClickCard) this.gameField.removeEventListener('click', this.onClickCard);
            eventEmitter.emit('hideContinueButton');
            eventEmitter.emit('showCheckButton');

            this.currentRow += 1;
            if (this.currentRow === 11) {
                this.round += 1;
                this.currentRow = 1;
                this.updateRowField();
            }

            if (this.gameField) this.configureGame();
        });

        eventEmitter.subscribe('showContinueButton', showButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('hideContinueButton', hideButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createCheckButton(): HTMLButtonElement {
        const btn = new ElementCreator(GAME.checkButton);
        btn.getElement().disabled = true;
        const timer: GAME.Timer = { removeClasses: null };
        btn.getElement().addEventListener('click', () => {
            if (!checkCorrectnessSentence(this.sourceSentence, this.currentAnswerSentence)) {
                this.paintCheckBlocks(this.sourceSentence, this.currentAnswerSentence, timer);
            }
        });

        eventEmitter.subscribe('showCheckButton', showButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('hideCheckButton', hideButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('enableCheckButton', enableButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('disableCheckButton', disableButton.bind(null, btn.getElement()));
        return btn.getElement();
    }

    private createAutoCompleteButton() {
        const btn = new ElementCreator(GAME.autoComplete);

        btn.getElement().addEventListener('click', this.onAutoComplete.bind(this));

        eventEmitter.subscribe('hideAutoCompleteButton', hideButton.bind(null, btn.getElement()));
        eventEmitter.subscribe('showAutoCompleteButton', showButton.bind(null, btn.getElement()));

        return btn.getElement();
    }

    private createButtonField(): HTMLDivElement {
        const buttonWrapper = new ElementCreator(GAME.buttonWrapper);
        const checkButton = this.createCheckButton();
        const autoCompleteButton = this.createAutoCompleteButton();
        const continueBtn = this.createContinueButton();
        buttonWrapper.getElement().append(checkButton, autoCompleteButton, continueBtn);
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

    private onAutoComplete(): void {
        const wordsFromSource = Array.from(this.sourceBlock.children).filter((item) =>
            item.classList.contains('source-word')
        );
        const wordsFromAnswerRow = Array.from(this.rowField.children[this.currentRow - 1].children).filter((item) =>
            item.classList.contains('source-word')
        );
        const neededBlock = [...wordsFromSource, ...wordsFromAnswerRow];
        const row = this.rowField.children[this.currentRow - 1] as HTMLElement;
        while (row.firstElementChild) {
            row.firstElementChild.remove();
        }

        neededBlock.sort((a, b) => {
            const first = Number(a.id.slice(1));
            const second = Number(b.id.slice(1));
            return first - second;
        });

        neededBlock.forEach((item) => {
            row.append(item);
            item.classList.remove('paint-wrong', 'paint-true');
        });
        this.updateAnswerSentence(row);
        this.checkFullFilledRow(row);
    }

    private checkFullFilledRow(answerRow: HTMLElement): void {
        const arrayFromRow = Array.from(answerRow.children);
        const result = arrayFromRow.every((item) => !item.classList.contains('clear-card'));
        if (!result) {
            eventEmitter.emit('disableCheckButton');
            return;
        }
        if (checkCorrectnessSentence(this.sourceSentence, this.currentAnswerSentence)) {
            eventEmitter.emit('showContinueButton');
            eventEmitter.emit('hideCheckButton');
            eventEmitter.emit('hideAutoCompleteButton');
            if (this.onClickCard && this.gameField) {
                this.gameField.removeEventListener('click', this.onClickCard);
            }
        } else {
            eventEmitter.emit('enableCheckButton');
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
