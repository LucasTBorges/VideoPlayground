import Component from '../../base/component.js';

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