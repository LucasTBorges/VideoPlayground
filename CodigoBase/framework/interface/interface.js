export default class Interface {
    constructor(){
        this.root = document.createElement("div");
        document.body.appendChild(this.root);
        this.children = {};
    }

    appendChild(name, child){
        this.children[name] = child;
        child.init();
        this.root.appendChild(child.getElement());
        return child;
    }

    getChild(name){
        return this.children[name];
    }

    showChild(name){
        this.children[name].show();
    }

    hideChild(name){
        this.children[name].hide();
    }

    showSingleChild(name){
        for(let key in this.children){
            this.children[key].hide();
        }
        this.children[name].show();
    }

}