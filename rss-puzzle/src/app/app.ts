import LoginPage from './pages/login/login';
import ElementCreater from './utils/elementCreater/elementCreater';

class App {
    private container: HTMLDivElement;
    constructor() {
        this.container = new ElementCreater({ tag: 'div', className: ['container'] }).getElement();
    }

    run() {
        document.body.append(this.container);
        const loginForm = new LoginPage();
        this.container.append(loginForm.getElement());
    }
}

export default App;
