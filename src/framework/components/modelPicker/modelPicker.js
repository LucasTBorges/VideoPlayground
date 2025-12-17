import Component from '../../base/component.js';

export default class ModelPicker extends Component {
    //Componente que contém o menu de escolha de modelo de reconhecimento facial, e aplica umm callback para cada botão
    init(){
        super.init();
        this.tinyfaceButton = this.element.querySelector("#tinyface-button");
        this.mobilenetButton = this.element.querySelector("#mobilenet-button");
        return this;
    }

    getHTML() {
        return `
            <div class="model-picker-card">
                <h3>Choose facial detection model</h3>
                <div class="model-picker-card-body">
                    <button id="tinyface-button" class="model-picker-button-17" role="button">Tiny Face Detector (Better Performance)</button>
                    <button id="mobilenet-button" class="model-picker-button-17" role="button">SSD Mobilenet V1 (Better Accuracy)</button>
                </div>
            </div>
        `;
    }

    onTinyface(callback){
        this.tinyfaceButton.onclick = callback;
    }

    onMobilenet(callback){
        this.mobilenetButton.onclick = callback;
    }

}