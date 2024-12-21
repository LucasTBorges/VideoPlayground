export default class Component {
    constructor() {
        this.visible = true;
        this.element = document.createElement('div');
        this.element.style.display = 'block';
        this.element.innerHTML = this.getHTML();
    }
    init() {
        return this;
    }

    getHTML() {
        throw new Error("Método abstrato getHTML não implementado");
    }

    getElement() {
        return this.element;
    }

    show() {
        this.visible = true;
        this.element.style.display = 'block';
        return this;
    }

    hide() {
        this.visible = false;
        this.element.style.display = 'none';
        return this;
    }
}