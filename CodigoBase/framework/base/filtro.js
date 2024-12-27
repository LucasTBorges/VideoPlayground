import { ShaderPass } from "../util/imports";
export default class Filtro {
    static nextId = 0;
    constructor(guiManager, composer) {
        this.title = this.getTitle().replace(/\s/g, '-') + Filtro.nextId++;
        this.gui = guiManager.getGui();
        this.parentManager = guiManager;
        this.parameters = {};
        this.shader = makeShader();
        this.shaderPass = new ShaderPass(this.shader);
        this.composer = composer;
        this.init();
    }

    //Deve retornar o título do filtro
    getTitle(){
        throw new Error("getTitle não foi implementado");
    }

    init(){
        this.parentManager.addTab(title, this.makeControls());
        this.composer.addPass(this.shaderPass);
    }

    hide(){
        this.parentManager.hideTab(this.title);
    }

    show(){
        this.parentManager.showTab(this.title);
    }

    destroy(){
        this.parentManager.removeTab(this.title);
        this.composer.removePass(this.shaderPass);
    }

    updateUniforms(values){
        for (const key in values) {
            this.shaderPass.uniforms[key].value = values[key];
        }
    }

    //Deve gerar os controles do filtro no this.gui e retornar a lista de itens do gui que foram criados
    //Deve controlar os parâmetros do filtro e atualizar o shader pass
    //De forma opcional, pode criar guiManagers próprios para organizar os controles internos
    //Idealmente cria um folder para o filtro, e dentro dele cria os controles
    //Considerar adicionar botão de remover filtro, que chama o this.destroy() e o checkbox filterOn
    makeControls() {
        throw new Error("makeControls não foi implementado");
    }

    //Deve criar e retornar o shader do filtro
    makeShader(){
        throw new Error("makeShader não foi implementado");
    }
}