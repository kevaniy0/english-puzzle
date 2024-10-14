import storage from '../services/storage-service';
import { pages } from './pages';

export type Route = {
    path: string;
    callback: () => void;
};

export type UserRequest = string;
class Router {
    routes: Route[];
    constructor(routes: Route[]) {
        this.routes = routes;
        window.addEventListener('DOMContentLoaded', () => {
            const path = this.getCorrectPath();
            if ((path === pages.GREETING || path === pages.GAME) && !storage.USER_DATA) {
                this.navigate(pages.LOGIN);
            } else if (path === pages.GAME && storage.USER_DATA) {
                this.navigate(pages.GREETING);
            } else if (path === pages.LOGIN && storage.USER_DATA) {
                this.navigate(pages.GREETING);
            } else {
                this.navigate(path);
            }
        });
        window.addEventListener('popstate', this.browserChangeHandler.bind(this));
        window.addEventListener('hashchange', this.browserChangeHandler.bind(this));
    }

    public navigate(url: UserRequest) {
        const view = this.routes.find((item) => item.path === url);
        if (view) {
            view.callback();
            if (window.location.pathname.slice(1) !== url) {
                history.pushState(null, '', `/kevaniy0-JSFE2023Q4/rss-puzzle/${url}`);
            }
        }
    }

    private getCorrectPath(): UserRequest {
        if (window.location.hash) {
            return window.location.hash.slice(1);
        } else {
            return window.location.pathname.slice(1);
        }
    }

    private browserChangeHandler(): void {
        const path = this.getCorrectPath();
        this.navigate(path);
    }
}

export default Router;
