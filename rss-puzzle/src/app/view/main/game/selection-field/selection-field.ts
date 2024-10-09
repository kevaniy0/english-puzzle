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
import storage from '../../../../services/storage-service';

type Callback = (event: Event) => void;

class SelectionField extends View {
    levelSelection: ElementCreator<'div'>;
    roundSelection: ElementCreator<'div'>;

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
            if (
                storage.USER_DATA?.statistic.roundsCompleted[
                    `level ${storage.USER_DATA?.statistic.gameStats.level + 1}` as keyof typeof storage.USER_DATA.statistic.roundsCompleted
                ].find((item) => item === i + 1)
            ) {
                option.getElement().style.backgroundColor = 'green';
            }
        }
        select.value =
            String(storage.USER_DATA?.statistic.gameStats.round) === '0'
                ? '1'
                : String(storage.USER_DATA!.statistic.gameStats.round + 1);
    }

    public updateLevel(value: number, totalRounds: number) {
        const select = this.levelSelection.getElement().lastElementChild as HTMLSelectElement;
        const options = Array.from(select.children) as HTMLElement[];
        for (let i = 0; i < options.length; i += 1) {
            if (
                storage.USER_DATA?.statistic.roundsCompleted[
                    `level ${i + 1}` as keyof typeof storage.USER_DATA.statistic.roundsCompleted
                ].length === totalRounds
            ) {
                options[i].style.backgroundColor = 'green';
            }
        }
        select.value = String(value);
    }

    configureView(): void {
        this.view.getElement().append(this.levelSelection.getElement(), this.roundSelection.getElement());
    }
}

export default SelectionField;
