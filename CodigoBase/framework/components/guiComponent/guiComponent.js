import Component from '../../base/component.js';
// Importa o css do componente para o documento (utiliza o arquivo no mesmo diretório com o mesmo nome do arquivo js)
const styleSheetUrl = import.meta.url.replace('.js', '.css');
const styleSheet = new URL(styleSheetUrl).href;
document.head.innerHTML += `<link rel="stylesheet" href="${styleSheet}">`;

export default class GuiComponent extends Component {
    init() {
        super.init();
        this.element.classList.add("lil-gui");
        this.element.classList.add("autoPlace");
        this.element.classList.add("root");
        return this
    }

    //Ajusta a posição do GUI: se a tela for grande o suficiente, o GUI fica à direita do vídeo
    //Caso contrário, o GUI fica o mais a direita possível
    //Para funcionar, o GUI deve estar visível
    fixPosition(canvasDimensions){
        if(window.innerWidth - canvasDimensions.x >= this.element.clientWidth){
            this.element.style.left = canvasDimensions.x + "px";
            this.element.style.right = "";
        } else {
            this.element.style.left = "";
            this.element.style.right = "0";
        }
    }
}