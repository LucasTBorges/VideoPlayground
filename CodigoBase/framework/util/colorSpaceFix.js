import Filtro from "../base/filtro.js";
import Shader from "../base/shader.js";
//Utilizar o LinearSRGBColorSpace causa problemas de cor no vídeo quando não é aplicado um filtro
//O filtro a seguir é um filtro vazio que não altera a imagem, mas corrige o espaço de cor do vídeo
export default class ColorSpaceFix extends Filtro {
    makeControls() {
        return[];
    }
    makeShader() {
        this.shaderBase = new Shader();
        const shader = this.shaderBase.getShader();
        return shader;
    }
    getTitle() {
        return "Color Space Fix";
    }
}