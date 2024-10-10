import './main.scss';
import { ElementParams } from '../../utils/elementCreator/elementCreator';
import View from '../view';
import LoginView from './login/login';
import eventEmitter from '../../utils/eventEmitter/eventEmitter';
import AutoResumeGame from './game/resume/resume';
import GameView from './game/game';
import storage from '../../services/storage-service';

class MainView extends View {
    constructor(view: View) {
        const params: ElementParams<'main'> = {
            tag: 'main',
            className: ['main'],
        };
        super(params);
        this.configureView(view);
    }

    configureView(view: View): void {
        if (!(view instanceof LoginView)) {
            eventEmitter.emit('showLogoutButton');
        } else {
            eventEmitter.emit('hideLogoutButton');
        }
        const element = view.getViewHtml();
        const main = this.view.getElement();
        while (main.firstElementChild) {
            main.firstElementChild.remove();
        }

        main.append(element);
        main.classList.add('smooth-transition');
        setTimeout(() => {
            main.classList.remove('smooth-transition');
            if (view instanceof GameView) {
                const data = storage.USER_DATA?.statistic.roundsCompleted;
                if (data) {
                    for (let i = 0; i < 6; i += 1) {
                        if (data[`level ${i + 1}` as keyof typeof data][0].length > 0) {
                            const resumeGame = new AutoResumeGame();
                            this.view.getElement().append(resumeGame.getViewHtml());
                            break;
                        }
                    }
                }
            }
        }, 501);
    }
}

export default MainView;
