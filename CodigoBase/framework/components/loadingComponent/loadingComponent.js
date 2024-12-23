import Component from '../../base/component.js';
// Importa o css do componente
const styleSheetUrl = import.meta.url.replace('.js', '.css');
const styleSheet = new URL(styleSheetUrl).href;
document.head.innerHTML += `<link rel="stylesheet" href="${styleSheet}">`;

export default class LoadingComponent extends Component {
    //Componente que exibe um spinner de carregamento
    getHTML() {
        return `
            <div class="loading-overlay">
                <div class="spinner" role="status">
                </div>
                <h2>Carregando...</h2>
            </div>
        `;
    }
}