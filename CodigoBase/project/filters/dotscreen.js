import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
import { DotScreenShaderOptions } from "./shaders.js";
export default class DotScreenFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Dot Screen";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Dot Screen")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        pasta.add(this.shaderPass.uniforms.angle, "value").name("Ângulo").min(0).max(Math.PI/2).step(0.1)
        pasta.add(this.shaderPass.uniforms.scale, "value").name("Escala").min(.30).max(1).step(0.025)
        //Offset não faz muita diferença no resultado final, optei por não adicionar para deixar a GUI mais limpa
        /* pasta.add(this.shaderPass.uniforms.center.value, "x").name("Offset (X)").min(0).max(10).step(0.5)
        pasta.add(this.shaderPass.uniforms.center.value, "y").name("Offset (Y)").min(0).max(10).step(0.5) */
        return [
            pasta
        ]
    }

    makeShader() {
        const shader = new Shader(DotScreenShaderOptions).getShader();
        return shader;
    }
}