import Filtro from "../../framework/base/filtro.js";
import ShaderFaceOnly from "../../framework/base/shaderFaceOnly.js";
import { THREE } from "../../framework/util/imports.js";
//Esse shader deve ser usado com o ShaderFaceOnly, pois ele utiliza os uniforms boxVBounds e boxUBounds
const MaskShaderOptions = {
    name: 'MaskShader',
    uniforms: [
        {tipo: "sampler2D", nome:"imagem"},
        {tipo: "bool", nome:"keepRatio", valor: true},
        {tipo: "float", nome: "ratio", valor: 1.0},
    ],
    declarations: "#include <common>",
    aux:`
        bool isWithinImageBounds(vec2 uv) {
            return uv.x >=0. && uv.x <= 1. && uv.y >= 0. && uv.y <= 1.;
        }
    `,
    main: `
            float trueRatio = ratio*resolution.y/resolution.x;
            vec2 boxSize = vec2(boxUBounds.y - boxUBounds.x, boxVBounds.y - boxVBounds.x);
            vec2 uv = vUv;
            if (keepRatio) {
                float boxRatio = boxSize.x / boxSize.y;
                if (boxRatio > trueRatio) {
                    float newWidth = boxSize.y * trueRatio;
                    float offsetX = (boxSize.x - newWidth) * 0.5;
                    uv.x = (vUv.x - boxUBounds.x - offsetX) / newWidth;
                    uv.y = (vUv.y - boxVBounds.x) / boxSize.y;
                } else {
                    float newHeight = boxSize.x / trueRatio;
                    float offsetY = (boxSize.y - newHeight) * 0.5;
                    uv.x = (vUv.x - boxUBounds.x) / boxSize.x;
                    uv.y = (vUv.y - boxVBounds.x - offsetY) / newHeight;
                }
            } else {
                uv = vec2((vUv.x - boxUBounds.x) / boxSize.x, (vUv.y - boxVBounds.x) / boxSize.y);
            }
            vec4 videoTex = texture2D(tDiffuse, vUv);
            vec4 mascara = isWithinImageBounds(uv)?texture2D(imagem, uv):videoTex;
            if (mascara.w == 1.0){
                return mascara;
            }
            vec3 rgb = mix(videoTex.rgb, mascara.rgb, mascara.w);
            return vec4(rgb, videoTex.a);
    `
};

export default class MaskFilter extends Filtro {
    getTitle() {
        return "Mascara2D";
    }

    destroy() {
        super.destroy();
        this.imageTexture.dispose();
    }

    makeControls() {
        return [this.gui.add(this.shaderPass.uniforms.keepRatio, 'value').name('Manter Proporção'),]
    }

    makeShader() {
        const ShaderWithMask = {...MaskShaderOptions};
        this.imageTexture = this.app.imageTexture;
        ShaderWithMask.uniforms.forEach(element => {
            if (element.nome === "imagem"){
                element.valor = this.imageTexture;
            }
            else if (element.nome === "ratio"){
                element.valor = this.imageTexture.source.data.width / this.imageTexture.source.data.height;
            }
        });
        this.shaderBase = new ShaderFaceOnly(MaskShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }

    onDetectFace(detection){
        this.shaderPass.uniforms.faceDetected.value = detection.faceDetected;
        const uvBounds = this.app.faceApiService.getUVBounds(detection);
        const height = uvBounds.v.y - uvBounds.v.x;
        const width = uvBounds.u.y - uvBounds.u.x;
        if (this.shaderPass.uniforms.keepRatio.value){
            const ratio = this.shaderPass.uniforms.ratio.value;
            const boxRatio = width / height;
            if (boxRatio > ratio){
                const newHeight = width / ratio;
                const offsetY = (newHeight - height) * 0.5;
                uvBounds.v.x -= offsetY;
                uvBounds.v.y = uvBounds.v.x + newHeight;
            } else {
                const newWidth = height * ratio;
                const offsetX = (newWidth - width) * 0.5;
                uvBounds.u.x -= offsetX;
                uvBounds.u.y = uvBounds.u.x + newWidth;
            }
        }
        this.shaderPass.uniforms.boxUBounds.value = uvBounds.u;
        this.shaderPass.uniforms.boxVBounds.value = uvBounds.v;
    }
}