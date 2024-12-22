export default class Component {
    constructor() {
        this.visible = false;
        this.element = document.createElement('div');
        this.element.style.display = 'none';
    }

    //Executado após a criação do elemento e o conteúdo HTML ser adicionado
    init() {
        return this;
    }

    //Retorna o HTML do componente
    getHTML() {
        return "";
    }

    //Retorna o elemento do componente
    getElement() {
        return this.element;
    }

    //Mostra o componente
    show() {
        this.visible = true;
        this.element.style.display = 'block';
        return this;
    }

    //Esconde o componente
    hide() {
        this.visible = false;
        this.element.style.display = 'none';
        return this;
    }

    //Destrói o componente
    destroy() {
        this.element.remove();
        this.Interface.removeChild(this.name);
    }
}