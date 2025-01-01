import { ShaderPass } from "../util/imports.js";
import { THREE } from "../../framework/util/imports.js";
import Observable from "../util/observable.js";
import ShaderFaceOnly from "./shaderFaceOnly.js";
export default class Filtro {
    static nextId = 0;
    constructor(app) {
        const guiManager = app.guiManager;
        const composer = app.composer;
        this.title = this.getTitle().replace(/\s/g, '-') + Filtro.nextId++;
        this.gui = guiManager.getGui();
        this.parentManager = guiManager;
        this.parameters = this.makeParameters();
        this.shader = this.makeShader();
        this.shaderPass = new ShaderPass(this.shader);
        this.composer = composer;
        this.app = app;
        this.resizeEvent = app.onResizeEvent.subscribe(this.onResize.bind(this));
        this.renderEvent = app.onRender.subscribe(this.onRender.bind(this));
        this.time = 0;
        if(this.app.faceApiService&&this.shaderPass instanceof ShaderFaceOnly) 
            this.app.faceApiService.detectFaceEvent.subscribe(this.onDetectFace.bind(this));
        this.onResize(this.app.getDimensions());
        this.onRender(0);
        this.init();
    }

    //Deve retornar o título do filtro
    getTitle(){
        throw new Error("getTitle não foi implementado");
    }

    init(){
        this.parentManager.addTab(this.title, this.makeControls());
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

    makeParameters(){
        return {};
    }

    onResize(dimensions){
        this.shaderPass.uniforms.resolution.value = new THREE.Vector2(dimensions.x, dimensions.y);
    }

    onRender(timeDelta){
        if(this.parameters.Pause){
            return;
        } else{
            this.time += timeDelta;
            this.shaderPass.uniforms.time.value = this.time;
        }

    }

    onDetectFace(detectionPromise){
        if (!this.app.faceApiService||!(this.shaderPass instanceof ShaderFaceOnly)) return;
        detectionPromise.then((detection)=>{
        this.shaderPass.uniforms.faceDetected.value = detection.faceDetected;
        const uvBounds = this.app.faceApiService.getUVBounds(detection);
        this.shaderPass.uniforms.boxUBounds.value = uvBounds.u;
        this.shaderPass.uniforms.boxVBounds.value = uvBounds.v;
        });
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