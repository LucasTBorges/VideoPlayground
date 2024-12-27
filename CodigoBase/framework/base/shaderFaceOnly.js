import Shader from "./shader.js";
export default class ShaderFaceOnly extends Shader {
    constructor(){
        super();
        this.isFaceOnly = true;
    }
    getUniforms() {
        let uniforms = super.getUniforms();
        uniforms.push({ tipo:"bool", nome:"faceOnly" });
        uniforms.push({ tipo:"vec2", nome:"facePos" });
        uniforms.push({ tipo:"vec2", nome:"faceDim" });
    }

    common(){
        const newCommons = `
            bool isWithinBoundingBox(vec2 uv, vec2 faceBox, vec2 faceBoxSize){
                return uv.x >= faceBox.x && uv.x <= faceBox.x + faceBoxSize.x && uv.y >= faceBox.y && uv.y <= faceBox.y + faceBoxSize.y;
            }
        `
        return super.common() + newCommons;
    }

    _getTrueMain(){
        return `
            vec2 texel = texelSize();
            vec2 faceBox = facePos * texel;
            vec2 faceBoxSize = faceDim * texel;
            if (filterOn&&(!faceOnly||isWithinBoundingBox(vUv, faceBox, faceBoxSize))){
                gl_FragColor = mainOriginal();
                return;
            }
            gl_FragColor = texture2D( tDiffuse, vUv );
            return;
        `;
    }
}