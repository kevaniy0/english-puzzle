import './resume.scss';
import ElementCreator from '../../../../utils/elementCreator/elementCreator';
import { component, resumeTitle } from './resume-data';
import View from '../../../view';
class AutoResumeGame extends View {
    title: ElementCreator<'p'>;
    constructor() {
        super(component);
        this.title = this.createTitle();
        this.configureView();
    }

    private createTitle(): ElementCreator<'p'> {
        const title = new ElementCreator(resumeTitle);
        return title;
    }

    private hideComponent(): void {
        setTimeout(() => {
            this.view.getElement().hidden = true;
        }, 4000);
    }

    configureView(): void {
        this.view.getElement().append(this.title.getElement());
        this.hideComponent();
    }
}

export default AutoResumeGame;
