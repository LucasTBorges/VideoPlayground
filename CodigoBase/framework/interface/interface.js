export default class Interface {
    constructor(){
        this.root = document.createElement("div");
        document.body.appendChild(this.root);
        this.children = {};
    }

    //Adiciona um filho ao objeto Interface
    //name: string - nome do filho
    //child: Component - componente filho
    appendChild(name, child){
        this.children[name] = child;
        child.getElement().innerHTML = child.getHTML();
        child.init();
        this.root.appendChild(child.getElement());
        child.show();
        return child;
    }

    //Retorna o filho passado como parâmetro
    getChild(name){
        return this.children[name];
    }

    //Mostra o filho passado como parâmetro
    showChild(name){
        this.children[name].show();
    }

    //Esconde o filho passado como parâmetro
    hideChild(name){
        this.children[name].hide();
    }

    //Esconde todos os filhos exceto o que foi passado como parâmetro
    switchTo(name){
        for(let key in this.children){
            this.children[key].hide();
        }
        this.children[name].show();
    }

}