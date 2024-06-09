export type ElementParams<T extends keyof HTMLElementTagNameMap> = {
    tag: T;
    className: string[];
    textContent?: string;
};

class ElementCreater<T extends keyof HTMLElementTagNameMap> {
    private element: HTMLElementTagNameMap[T];
    constructor(params: ElementParams<T>) {
        this.element = this.createElement(params);
    }
    private createElement(params: ElementParams<T>): HTMLElementTagNameMap[T] {
        const elem = document.createElement(params.tag);
        params.className.forEach((item) => elem.classList.add(item));
        params.textContent && (elem.textContent = params.textContent);
        return elem as HTMLElementTagNameMap[T];
    }

    public getElement(): HTMLElementTagNameMap[T] {
        return this.element;
    }
}

export default ElementCreater;
