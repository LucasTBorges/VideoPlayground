import Filtro from "../framework/base/filtro.js";
import Shader from "../framework/base/shader.js";
//Múltiplica a imagem atual com a imagem original. Se greyscale for verdadeiro, a imagem original é convertida para escala de cinza antes da multiplicação
//A ideia é que seja aplicado sobre outros filtros para utilizar a imagem anterior como máscara para a imagem original
const MultiplyShaderOptions = {
    name: 'MultiplyShader',
    uniforms: [
        {tipo: "sampler2D", nome:"textura"},
        {tipo:"bool", nome:"greyscale", valor: false},
    ],
    declarations: "#include <common>",
    main: `
            vec4 texel = texture2D( tDiffuse, vUv );
            vec4 multiplicador = greyscale?vec4(vec3(luminance(texel.rgb)), texel.w):vec4(texel.rgb, texel.w);
            return multiplicador * texture2D( textura, vUv );
    `
};
//Usa o vídeo carregado na aplicação como uniform
export default class MultiplyFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remove Filter": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Multiply";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Multiply")
        pasta.add(this.parameters, "Remove Filter")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filter On")
        pasta.add(this.shaderPass.uniforms.greyscale, "value").name("Luminance Only")
        return [pasta]
    }

    makeShader() {
        MultiplyShaderOptions.uniforms.forEach((uniform) => {
            if (uniform.nome === "textura") {
                uniform.valor = this.app.video.getTexture();
            }
        });
        this.shaderBase = new Shader(MultiplyShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}