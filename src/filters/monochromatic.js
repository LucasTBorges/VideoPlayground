import Filtro from "../framework/base/filtro.js";
import Shader from "../framework/base/shader.js";
import { THREE } from "../framework/util/imports.js";
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
            "Remove Filter": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Monochromatic";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Monochromatic")
        pasta.add(this.parameters, "Remove Filter")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filter On")
        pasta.addColor(this.shaderPass.uniforms.Cor, "value").name("Color")
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(MonochromaticShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}