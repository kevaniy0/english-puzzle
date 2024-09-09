// import { pages } from './pages';

export type Route = {
    path: string;
    callback: () => void;
};

export type UserRequest = {
    path: string;
};

class Router {
    routes: Route[];
    constructor(routes: Route[]) {
        this.routes = routes;
    }

    public navigate(url: string) {
        const view = this.routes.find((item) => item.path === url);
        if (view) view.callback();
    }
}

export default Router;
