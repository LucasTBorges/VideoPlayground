import Component from '../../base/component.js';
// Importa o css do componente para o documento (utiliza o arquivo no mesmo diretório com o mesmo nome do arquivo js)
const styleSheetUrl = import.meta.url.replace('.js', '.css');
const styleSheet = new URL(styleSheetUrl).href;
document.head.innerHTML += `<link rel="stylesheet" href="${styleSheet}">`;

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
                <h3>Escolha o modelo de detecção facial</h3>
                <div class="model-picker-card-body">
                    <button id="tinyface-button" class="model-picker-button-17" role="button">Tiny Face Detector (Mais Desempenho)</button>
                    <button id="mobilenet-button" class="model-picker-button-17" role="button">SSD Mobilenet V1 (Mais Acurácia)</button>
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