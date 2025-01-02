import Component from '../../base/component.js';
// Importa o css do componente para o documento (utiliza o arquivo no mesmo diretório com o mesmo nome do arquivo js)
const styleSheetUrl = import.meta.url.replace('.js', '.css');
const styleSheet = new URL(styleSheetUrl).href;
document.head.innerHTML += `<link rel="stylesheet" href="${styleSheet}">`;

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
                <h3 class="text-center">Escolha a imagem a ser usada como máscara</h3>
                <div class="image-input-card-body">
                    <button id="file-button" class="image-input-button-17" role="button">Submeta um Arquivo</button>
                    <button id="default-button" class="image-input-button-17 bottom-button" role="button"><img src="/CodigoBase/assets/mascara.png" class="image-input-default-image" alt="Arte digital de máscara veneziana em estilo de emoji">Use a imagem padrão</button>
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