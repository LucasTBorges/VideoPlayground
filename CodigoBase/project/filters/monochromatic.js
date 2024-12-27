import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
import { MonochromaticShaderOptions } from "./shaders.js";
export default class MonochromaticFilter extends Filtro {    
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Monocromático";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Monocromático")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        pasta.addColor(this.shaderPass.uniforms.Cor, "value").name("Cor")
        return [
            pasta
        ]
    }

    makeShader() {
        const shader = new Shader(MonochromaticShaderOptions).getShader();
        return shader;
    }
}