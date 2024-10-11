import View from '../../../view';
import './statistic.scss';
// import storage from '../../../../services/storage-service';
import { continueButton, statisticComponent, statisticWrapper } from './statistic-data';
import ElementCreator from '../../../../utils/elementCreator/elementCreator';

type Callback = (event: Event) => void;

class StatisticView extends View {
    continueButton: ElementCreator<'button'>;
    constructor(onClickContinue: Callback) {
        super(statisticComponent);
        this.continueButton = this.createContinueButton(onClickContinue);
        this.configureView();
    }

    private createContinueButton(callback: Callback): ElementCreator<'button'> {
        const button = new ElementCreator(continueButton);
        button.getElement().addEventListener('click', callback);
        return button;
    }

    private onClickHideView(): void {
        this.view.getElement().addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('statistic-view')) {
                this.view.getElement().style.display = 'none';
            }
        });
    }

    public configureView(): void {
        const wrapper = new ElementCreator(statisticWrapper);
        wrapper.getElement().append(this.continueButton.getElement());
        this.onClickHideView();
        this.view.getElement().append(wrapper.getElement());
    }
}

export default StatisticView;
