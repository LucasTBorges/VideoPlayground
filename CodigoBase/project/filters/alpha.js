import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
//Utiliza a imagem atual como máscara alpha aplicada sobre a imagem original
const AlphaShaderOptions = {
    name: 'AlphaShader',
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
export default class AlphaFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Alpha";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Alpha")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        pasta.add(this.shaderPass.uniforms.greyscale, "value").name("Apenas luminância")
        return [pasta]
    }

    makeShader() {
        AlphaShaderOptions.uniforms.forEach((uniform) => {
            if (uniform.nome === "textura") {
                uniform.valor = this.app.video.getTexture();
            }
        });
        this.shaderBase = new Shader(AlphaShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}