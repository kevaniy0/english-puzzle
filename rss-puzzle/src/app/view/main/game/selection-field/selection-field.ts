import './selection-field.scss';
import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import {
    field,
    levelSelect,
    levelTitle,
    roundSelect,
    roundTitle,
    wrapperLevel,
    wrapperRound,
} from './selection-field-data';
import { gameData } from '../../../../services/game-data';

type Callback = (event: Event) => void;

class SelectionField extends View {
    levelSelection: ElementCreator<'div'>;
    roundSelection: ElementCreator<'div'>;

    // collection
    constructor(onChangeLevel: Callback, onChangeRound: Callback) {
        super(field);
        this.levelSelection = this.createLevelSelection(onChangeLevel);
        this.roundSelection = this.createRoundSelection(onChangeRound);
        this.configureView();
    }

    private createLevelSelection(onChangeLevel: Callback): ElementCreator<'div'> {
        const wrapper = new ElementCreator(wrapperLevel);
        const title = new ElementCreator(levelTitle);
        const select = new ElementCreator(levelSelect);
        for (let i = 0; i < 6; i += 1) {
            const option = new ElementCreator({
                tag: 'option',
                className: ['option-level'],
                textContent: String(i + 1),
            });
            select.getElement().append(option.getElement());
        }
        select.getElement().addEventListener('change', onChangeLevel);
        wrapper.getElement().append(title.getElement(), select.getElement());
        return wrapper;
    }

    private createRoundSelection(onChangeRound: Callback): ElementCreator<'div'> {
        const wrapper = new ElementCreator(wrapperRound);
        const title = new ElementCreator(roundTitle);
        const select = new ElementCreator(roundSelect);
        select.getElement().addEventListener('change', onChangeRound);
        wrapper.getElement().append(title.getElement(), select.getElement());
        return wrapper;
    }

    public updateTotalRounds(totalRounds: number): void {
        const select = this.roundSelection.getElement().lastElementChild as HTMLSelectElement;
        while (select?.firstElementChild) {
            select.firstElementChild.remove();
        }
        for (let i = 0; i < totalRounds; i += 1) {
            const option = new ElementCreator({
                tag: 'option',
                className: [`option-round-${i + 1}`],
                textContent: String(i + 1),
            });
            select?.append(option.getElement());
        }
        select.value = String(gameData.round) === '0' ? '1' : String(gameData.round);
    }

    configureView(): void {
        this.view.getElement().append(this.levelSelection.getElement(), this.roundSelection.getElement());
    }
}

export default SelectionField;
