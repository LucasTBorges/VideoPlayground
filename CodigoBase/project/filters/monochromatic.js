import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
import { THREE } from "../../framework/util/imports.js";
const MonochromaticShaderOptions = {
    name: 'MonochromaticShader',
    uniforms: [
        {tipo: "vec3", nome:"Cor", valor: new THREE.Color(1,1,1)}
    ],
    declarations: "#include <common>",
    main: `
            vec4 texel = texture2D( tDiffuse, vUv );
            vec3 l = vec3(luminance( texel.rgb ));
            return vec4( Cor*l, texel.w );
    `
};

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
        return [pasta]
    }

    makeShader() {
        const shader = new Shader(MonochromaticShaderOptions).getShader();
        return shader;
    }
}