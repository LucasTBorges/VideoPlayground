import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
import { THREE } from "../../framework/util/imports.js";
const NegativoShaderOptions = {
    name: 'NegativoShader',
    declarations: "#include <common>",
    main: `
            vec4 texel = texture2D( tDiffuse, vUv );
            return vec4(1.0 - texel.rgb, texel.w);
    `
};

export default class NegativoFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Negativo";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Negativo")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(NegativoShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}