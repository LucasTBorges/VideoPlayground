import Component from '../../framework/interface/component.js';
export default class ThreeJsCanvas extends Component {
    getHTML() {
        return `
            <h3 id="output-text">Visualização de Vídeo.</h3>
            <div id="threejs-canvas"></div>
        `;
    }
}

