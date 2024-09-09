import Header from './view/header/header';
import ElementCreator from './utils/elementCreator/elementCreator';
import MainView from './view/main/main';
import Router from './router/router';
import { Route } from './router/router';
import { pages } from './router/pages';
import View from './view/view';
import LoginView from './view/main/login/login';

class App {
    private container: ElementCreator<'div'>;
    public router: Router;
    public header: Header | null;
    public main: MainView | null;
    constructor() {
        this.container = new ElementCreator({ tag: 'div', className: ['container'] });

        this.header = null;
        this.main = null;
        const routes: Route[] = this.createRoutes();
        this.router = new Router(routes);

        this.run();
    }

    private run() {
        const container = this.container.getElement();
        document.body.append(container);

        this.header = new Header(this.router);
        container.append(this.header.getViewHtml());

        if (this.checkUserExistence()) {
            this.main = new MainView(new LoginView(this.router));
        } else {
            // this.main = new MainView(new GreetingView());
        }
        this.main = new MainView(new LoginView(this.router)); // TODO Убрать после создания GreetingView
        container.append(this.main.getViewHtml());
    }

    public createRoutes(): Route[] {
        return [
            {
                path: pages.LOGIN,
                callback: () => {
                    this.setContentPages(new LoginView(this.router));
                },
            },
            {
                path: pages.GREETING,
                callback: () => {
                    // this.setContentPages(new GreetingView());
                },
            },
            {
                path: pages.GAME,
                callback: () => {
                    // this.setContentPages(new GameView());
                },
            },
            {
                path: pages.ERROR,
                callback: () => {
                    // this.setContentPages(new ErrorView());
                },
            },
        ];
    }
    public setContentPages(view: View) {
        if (localStorage.getItem('name') && localStorage.getItem('lastName')) {
            this.header!.logout!.getElement().style.display = '';
        } else {
            this.header!.logout!.getElement().style.display = 'none';
        }

        if (this.main) {
            this.main.configureView(view);
        }
    }
    public checkUserExistence(): boolean {
        const name = localStorage.getItem('name');
        const lastName = localStorage.getItem('lastName');
        if (name && lastName) return true;
        return false;
    }
}

export default App;
