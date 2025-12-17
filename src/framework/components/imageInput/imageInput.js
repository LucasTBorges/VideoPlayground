import Component from '../../base/component.js';

export default class ImageInput extends Component {
    //Componente que contém o menu de escolha de imagem, e emite eventos para a escolha de arquivo ou imagem padrão
    init(){
        super.init();
        this.fileButton = this.element.querySelector("#file-button");
        this.dafaultButton = this.element.querySelector("#default-button");
        return this;
    }

    getHTML() {
        return `
            <div class="image-input-card">
                <h3 class="text-center">Choose the image to be used as mask</h3>
                <div class="image-input-card-body">
                    <button id="file-button" class="image-input-button-17" role="button">Submit a File</button>
                    <button id="default-button" class="image-input-button-17 bottom-button" role="button"><img src="./assets/mascara.png" class="image-input-default-image" alt="Digital art of venetian mask in emoji style">Use default image</button>
                </div>
            </div>
        `;
    }

    onSubmitFile(callback){
        this.fileButton.onclick = callback;
    }

    onSelectDefault(callback){
        this.dafaultButton.onclick = callback;
    }

}