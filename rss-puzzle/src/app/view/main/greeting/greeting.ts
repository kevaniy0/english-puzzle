import './greeting.scss';
import View from '../../view';
import ElementCreator from '../../../utils/elementCreator/elementCreator';
import {
    greetingDescription,
    greetingImgLearn,
    greetingImgPuzzle,
    greetingPage,
    // greetingStartButton,
    greetingTitle,
    greetingWrapperBlock,
} from './greeting-data';
import Router from '../../../router/router';
class GreetingView extends View {
    router: Router;
    constructor(router: Router) {
        super(greetingPage);
        this.router = router;
        this.configureView();
    }

    private createTitle(): ElementCreator<'h2'> {
        const title = new ElementCreator(greetingTitle);
        return title;
    }
    private createDescription(): ElementCreator<'h3'> {
        const description = new ElementCreator(greetingDescription);
        return description;
    }

    private createInteractionBlock(): ElementCreator<'div'> {
        const wrapper = new ElementCreator(greetingWrapperBlock);
        const learnImg = new ElementCreator(greetingImgLearn);
        learnImg.getElement().src = './assets/img/learn-img.png';
        const puzzleImg = new ElementCreator(greetingImgPuzzle);
        puzzleImg.getElement().src = './assets/img/puzzle-alph.png';
        // const startButton = new ElementCreator(greetingStartButton);

        wrapper.getElement().append(learnImg.getElement(), puzzleImg.getElement());
        return wrapper;
    }

    configureView(): void {
        const title = this.createTitle();
        const description = this.createDescription();

        const interactionBlock = this.createInteractionBlock();
        this.view.getElement().append(title.getElement(), description.getElement(), interactionBlock.getElement());
    }
}

export default GreetingView;
