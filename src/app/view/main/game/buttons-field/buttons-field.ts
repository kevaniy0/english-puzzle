import './buttons-field.scss';
import ElementCreator, { ElementParams } from '../../../../utils/elementCreator/elementCreator';
import View from '../../../view';
import { autoComplete, buttonWrapper, checkButton, continueButton, resultsButton } from './buttons-field-data';

type Callback = (event?: Event) => void;
class ButtonsField extends View {
    checkButton: ElementCreator<'button'>;
    continueButton: ElementCreator<'button'>;
    resultsButton: ElementCreator<'button'>;
    autoCompleteButton: ElementCreator<'button'>;
    constructor(
        onClickCheck: Callback,
        onClickContinue: Callback,
        onClickResults: Callback,
        onClickAutoComplete: Callback
    ) {
        super(buttonWrapper);
        this.checkButton = this.createButton(checkButton, onClickCheck);
        this.continueButton = this.createButton(continueButton, onClickContinue);
        this.resultsButton = this.createButton(resultsButton, onClickResults);
        this.autoCompleteButton = this.createButton(autoComplete, onClickAutoComplete);
        this.configureView();
    }

    private createButton(params: ElementParams<'button'>, callback: Callback) {
        const button = new ElementCreator(params);
        button.setCallback(callback);
        return button;
    }

    public showButton(btn: HTMLButtonElement): void {
        btn.style.display = 'block';
        btn.classList.add('btn--active');
        if (btn.classList.contains('btn-continue') || btn.classList.contains('btn-results')) {
            btn.classList.add('btn-continue-animate');
        }
    }

    public hideButton(btn: HTMLButtonElement): void {
        btn.style.display = 'none';
        btn.classList.remove('btn--active');
        if (btn.classList.contains('btn-continue') || btn.classList.contains('btn-results')) {
            btn.classList.remove('btn-continue-animate');
        }
    }

    public enableButton(btn: HTMLButtonElement): void {
        btn.disabled = false;
        btn.classList.add('btn--active');
    }

    public disableButton(btn: HTMLButtonElement): void {
        btn.disabled = true;
        btn.classList.remove('btn--active');
    }

    configureView(): void {
        this.view
            .getElement()
            .append(
                this.checkButton.getElement(),
                this.autoCompleteButton.getElement(),
                this.continueButton.getElement(),
                this.resultsButton.getElement()
            );
    }
}

export default ButtonsField;
