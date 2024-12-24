import GuiManager from "./GuiManager";
export default class Filtro {
    constructor(guiManager, title) {
        this.title = title;
        this.gui = guiManager.getGui();
        this.parentManager = guiManager;
        this.parameters = {};
        this.shader = makeShader();
        this.init();
    }

    init(){
        this.parentManager.addTab(title, this.makeControls());
    }

    //Deve gerar os controles do filtro e retornar a lista de itens do gui que foram criados
    //De forma opcional, pode criar guiManagers próprios para organizar os controles internos
    makeControls() {
        throw new Error("makeControls não foi implementado");
    }

    //Deve retornar o shader do filtro
    getShader(){
        throw new Error("getShader não foi implementado");
    }
}