import './selection-field.scss';
import ElementCreator, { ElementParams } from '../../../../utils/elementCreator/elementCreator';
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
    levelSelect: ElementCreator<'select'>;
    roundSelect: ElementCreator<'select'>;

    constructor(onChangeLevel: Callback, onChangeRound: Callback) {
        super(field);
        this.levelSelect = this.createSelect(levelSelect, onChangeLevel);
        this.roundSelect = this.createSelect(roundSelect, onChangeRound);
        this.configureView();
    }

    private createSelect(params: ElementParams<'select'>, callback: Callback): ElementCreator<'select'> {
        const select = new ElementCreator(params);
        if (select.getElement().classList.contains('level-select')) {
            this.createLevelOptions(select.getElement());
        }
        select.getElement().addEventListener('change', callback);
        select.getElement().addEventListener('click', () => {
            if (!select.getElement().parentElement?.classList.contains('select-open')) {
                select.getElement().parentElement?.classList.add('select-open');
            } else {
                select.getElement().parentElement?.classList.remove('select-open');
            }
        });
        select.getElement().addEventListener('blur', () => {
            select.getElement().parentElement?.classList.remove('select-open');
        });
        return select;
    }

    private createLevelOptions(select: HTMLSelectElement): void {
        for (let i = 0; i < 6; i += 1) {
            const option = new ElementCreator({
                tag: 'option',
                className: ['option-level'],
                textContent: String(i + 1),
            });
            if (
                storage.USER_DATA?.statistic.roundsCompleted[
                    `level ${i + 1}` as keyof typeof storage.USER_DATA.statistic.roundsCompleted
                ][1]
            ) {
                option.getElement().style.backgroundColor = 'green';
            }
            select.append(option.getElement());
        }
    }

    public updateRoundOptions(totalRounds: number): void {
        while (this.roundSelect.getElement().options.length > 0) {
            this.roundSelect.getElement().remove(0);
        }
        for (let i = 0; i < totalRounds; i += 1) {
            const option = new ElementCreator({
                tag: 'option',
                className: [`option-round-${i + 1}`],
                textContent: String(i + 1),
            });
            this.roundSelect.getElement().append(option.getElement());
            if (
                storage.USER_DATA?.statistic.roundsCompleted[
                    `level ${storage.USER_DATA?.statistic.gameStats.level + 1}` as keyof typeof storage.USER_DATA.statistic.roundsCompleted
                ][0].find((item) => item === i + 1)
            ) {
                option.getElement().style.backgroundColor = 'green';
            }
            if (i === storage.USER_DATA?.statistic.gameStats.round) {
                this.roundSelect.getElement().value = String(i + 1);
            }
        }
    }
    public updateLevel(value: number, totalRounds: number): void {
        const options = Array.from(this.levelSelect.getElement().options);
        for (let i = 0; i < options.length; i += 1) {
            if (
                storage.USER_DATA?.statistic.roundsCompleted[
                    `level ${i + 1}` as keyof typeof storage.USER_DATA.statistic.roundsCompleted
                ].length === totalRounds
            ) {
                options[i].style.backgroundColor = 'green';
            }
        }
        this.levelSelect.getElement().value = String(value);
    }

    configureView(): void {
        const levelWrapper = new ElementCreator(wrapperLevel);
        const titleLevel = new ElementCreator(levelTitle);
        levelWrapper.getElement().append(titleLevel.getElement(), this.levelSelect.getElement());

        const roundWrapper = new ElementCreator(wrapperRound);
        const titleRound = new ElementCreator(roundTitle);
        roundWrapper.getElement().append(titleRound.getElement(), this.roundSelect.getElement());

        this.view.getElement().append(levelWrapper.getElement(), roundWrapper.getElement());
    }
}

export default SelectionField;
