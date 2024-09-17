import './game.scss';
import * as GAME from './game-data';
import View from '../../view';
import Router from '../../../router/router';
import ElementCreator, { ElementParams } from '../../../utils/elementCreator/elementCreator';
import shuffleCards from '../../../utils/helpers/shuffleCards';
import getJson from '../../../utils/helpers/getJson';
import calculateBlockWidth from '../../../utils/helpers/calculateWidth';

class GameView extends View {
    router: Router;
    collection: Promise<GAME.Collection>;
    level: number = 0;
    round: number = 0;
    currentRow: number = 1;
    constructor(router: Router) {
        super(GAME.page);
        this.router = router;
        this.collection = getJson('./data/wordCollectionLevel1.json');
        this.configureView();
    }

    private createRowsField(): HTMLDivElement {
        const rowsField = new ElementCreator(GAME.rowsFild);
        for (let i = 0; i < 10; i += 1) {
            const row = new ElementCreator(GAME.row);
            row.getElement().classList.add(`row-${i + 1}`);
            rowsField.getElement().append(row.getElement());
        }

        return rowsField.getElement();
    }
    private createCard(cardParams: ElementParams<'div'>): HTMLDivElement {
        const card = new ElementCreator(cardParams);
        return card.getElement();
    }

    private createCurrentWords(rowsField: HTMLDivElement): HTMLDivElement {
        const currentWords = new ElementCreator(GAME.sourceWords);
        this.collection.then((item) => {
            const wordsArray: string[] = item.rounds[this.level].words[this.round].textExample.split(' ');
            shuffleCards(wordsArray);
            wordsArray.forEach((word, index) => {
                const card = this.createCard({ tag: 'div', className: [`source-word`, `source-word-${index + 1}`] });
                card.textContent = word;
                this.onMoveCardToAnswer(card, rowsField);
                currentWords.getElement().append(card);
            });
            const arrayWords = Array.from(currentWords.getElement().children) as HTMLElement[];
            calculateBlockWidth(rowsField, arrayWords);
            window.addEventListener('resize', () => {
                calculateBlockWidth(rowsField, arrayWords);
            });
        });
        return currentWords.getElement();
    }

    private onMoveCardToAnswer(card: HTMLDivElement, rowsField: HTMLDivElement): void {
        card.addEventListener('click', () => {
            rowsField.children[this.currentRow - 1].append(card);
        });
    }
    // private onMoveCardToSource(card: HTMLDivElement): void {}

    configureView(): void {
        const gameField = new ElementCreator(GAME.field);
        const rows = this.createRowsField();
        const words = this.createCurrentWords(rows);
        gameField.getElement().append(rows, words);

        this.getViewHtml().append(gameField.getElement());
    }
}

export default GameView;
