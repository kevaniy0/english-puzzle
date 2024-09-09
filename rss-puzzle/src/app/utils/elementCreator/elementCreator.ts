export type ElementParams<T extends keyof HTMLElementTagNameMap> = {
    tag: T;
    className: string[];
    textContent?: string;
    callback?: (event?: Event) => void;
};

class ElementCreator<T extends keyof HTMLElementTagNameMap> {
    element: HTMLElement | null;
    constructor(params: ElementParams<T>) {
        this.element = null;
        this.createElement(params);
    }
    createElement(params: ElementParams<T>): void {
        this.element = document.createElement(params.tag);
        this.setCssClasses(params.className);
        params.textContent && this.setTextContent(params.textContent);
        params.callback && this.setCallback(params.callback);
    }

    setCssClasses(classes: string[]): void {
        classes.forEach((item) => this.element?.classList.add(item));
    }

    setTextContent(text: string): void {
        this.element && (this.element.textContent = text);
    }

    setCallback(callback: (event?: Event) => void) {
        this.element?.addEventListener('click', (event) => callback(event));
    }

    getElement(): HTMLElementTagNameMap[T] {
        return this.element as HTMLElementTagNameMap[T];
    }
}

export default ElementCreator;
