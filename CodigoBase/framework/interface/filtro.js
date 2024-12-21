export default class Filtro {
    constructor(guiManager, title) {
        this.title = title;
        this.gui = guiManager.getGui();
        this.guiManager = guiManager;
        this.parameters = {};
        this.shader = makeShader();
        this.init();
    }

    init(){
        this.guiManager.addTab(title, this.makeControls());
    }

    //Deve gerar os controles do filtro e retornar a lista de itens do gui que foram criados
    makeControls() {
        throw new Error("makeControls não foi implementado");
    }

    //Deve retornar o shader do filtro
    makeShader(){
        throw new Error("makeShader não foi implementado");
    }
}