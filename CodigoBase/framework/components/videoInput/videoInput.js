import Component from '../../base/component.js';
export default class VideoInput extends Component {
    //Componente que contém o menu de escolha de vídeo, e emite eventos para a escolha de arquivo ou webcam
    init(){
        super.init();
        this.fileButton = this.element.querySelector("#file-button");
        this.webcamButton = this.element.querySelector("#webcam-button");
    }

    getHTML() {
        return `
            <div class="card">
                <h3>Escolha o vídeo a ser utilizado como base</h3>
                <div class="card-body">
                    <button id="file-button" class="button-17" role="button">Submeta um Arquivo</button>
                    <p>ou</p>
                    <button id="webcam-button" class="button-17" role="button">Use a Webcam</button>
                </div>
            </div>
        `;
    }

    onSubmitFile(callback){
        this.fileButton.onclick = callback;
    }

    onSelectWebcam(callback){
        this.webcamButton.onclick = callback;
    }

}