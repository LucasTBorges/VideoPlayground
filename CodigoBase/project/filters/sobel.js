import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
// Baseado no shader SobelOperatorShader do Three.js
const SobelShaderOptions = {
    name: 'SobelShader',
    uniforms: [
        {tipo: "bool", nome:"RGB", valor: false},
    ],
    declarations: `
        #include <common>
    `,
    aux: `
        float getChannel(vec4 color, int channel){
            switch (channel) {
                case 0:
                    return color.r;
                case 1:
                    return color.g;
                case 2:
                    return color.b;
                case 4:
                    return luminance(color.rgb);
            }
        }
        float getGradientMagnitude(int channel){
            vec2 texel = texelSize();

            // kernel definition (in glsl matrices are filled in column-major order)

            const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
            const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel

            // fetch the 3x3 neighbourhood of a fragment

            // first column

            float tx0y0 = getChannel(texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ), channel);
            float tx0y1 = getChannel(texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ), channel);
            float tx0y2 = getChannel(texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ), channel);

            // second column

            float tx1y0 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ), channel);
            float tx1y1 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ), channel);
            float tx1y2 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ), channel);

            // third column

            float tx2y0 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ), channel);
            float tx2y1 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ), channel);
            float tx2y2 = getChannel(texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ), channel);

            // gradient value in x direction

            float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
                Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
                Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

            // gradient value in y direction

            float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
                Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
                Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

            // magnitude of the total gradient
            return sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );
        }
    `,
    main: `
        if (RGB) {
            vec3 outputColor = vec3(0.0);
            for (int i = 0; i < 3; i++) {
                outputColor[i] = getGradientMagnitude(i);
            }
            return clamp(vec4(outputColor, 1.0),0.,1.);
        }
        return clamp(vec4(vec3(getGradientMagnitude(4)), 1.0),0.,1.);
    `
};

export default class SobelFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Sobel";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Sobel")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado")
        pasta.add(this.shaderPass.uniforms.RGB, "value").name("Colorido")
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(SobelShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}