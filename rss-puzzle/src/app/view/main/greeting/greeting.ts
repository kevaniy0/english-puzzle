import './greeting.scss';
import View from '../../view';
import ElementCreator from '../../../utils/elementCreator/elementCreator';
import * as GREETING from './greeting-data';

import Router from '../../../router/router';
class GreetingView extends View {
    router: Router;
    constructor(router: Router) {
        super(GREETING.page);
        this.router = router;
        this.configureView();
    }

    private createTitle(): ElementCreator<'h2'> {
        const title = new ElementCreator(GREETING.title);
        return title;
    }
    private createDescription(): ElementCreator<'h3'> {
        const description = new ElementCreator(GREETING.description);
        return description;
    }

    private createInteractionBlock(): ElementCreator<'div'> {
        const wrapper = new ElementCreator(GREETING.wrapperBlock);
        const learnImg = new ElementCreator(GREETING.imgLearn);
        learnImg.getElement().src = './assets/img/learn-img.png';
        const puzzleImg = new ElementCreator(GREETING.imgPuzzle);
        puzzleImg.getElement().src = './assets/img/puzzle-alph.png';
        const startButton = this.createStartButton();
        const userBlock = this.displayUserGreeting();

        wrapper
            .getElement()
            .append(learnImg.getElement(), puzzleImg.getElement(), userBlock.getElement(), startButton.getElement());
        return wrapper;
    }

    private getUserInfo(): [string, string] {
        const name = localStorage.getItem('user_name_english_puzzle');
        const lastName = localStorage.getItem('user_last_name_english_puzzle');
        if (name && lastName) return [name, lastName];
        return ['undefined', 'undefined'];
    }

    private displayUserGreeting(): ElementCreator<'div'> {
        const userBlock = new ElementCreator(GREETING.user);
        const userTitle = new ElementCreator(GREETING.userTitle);

        const userFullName = this.getUserInfo().join(' ');

        userTitle
            .getElement()
            .insertAdjacentHTML(
                'afterbegin',
                `Hello!<br><span class="user-greeting__span">${userFullName}<br></span> Best of luck on your learning journey!`
            );
        userBlock.getElement().append(userTitle.getElement());
        return userBlock;
    }
    private createStartButton(): ElementCreator<'a'> {
        const btn = new ElementCreator(GREETING.startButton);
        btn.getElement().addEventListener('click', () => {
            this.router.navigate('game');
        });
        return btn;
    }

    configureView(): void {
        const title = this.createTitle();
        const description = this.createDescription();

        const interactionBlock = this.createInteractionBlock();
        this.view.getElement().append(title.getElement(), description.getElement(), interactionBlock.getElement());
    }
}

export default GreetingView;
