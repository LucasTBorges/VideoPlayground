//Baseado no shader Hexagonal Pixelation Effect pelo usuário oneshade, disponível em https://www.shadertoy.com/view/WtyyRKimport Filtro from "../../framework/base/filtro.js";
import Filtro from "../../framework/base/filtro.js";
import Shader from "../../framework/base/shader.js";
const HexagonShaderOptions = {
    name: 'HexagonShader',
    uniforms: [
        {tipo: "float", nome:"tilings", valor: 30.0},
        {tipo: "int", nome:"intensidade", valor: 0} // Cálculo da intensidade: 0 - Média dos canais RGB, 1 - Luminância, 2 - Máximo dos canais RGB, 3 - Mínimo dos canais RGB 
    ],
    declarations: "#include <common>",
    aux: `
        float hexDist(in vec2 p) {
            p = abs(p);
            float edgeDist = dot(p, normalize(vec2(1.0, 1.73)));
            return max(edgeDist, p.x);
        }

        float calcIntensity(vec3 color) {
            switch (intensidade) {
                case 0: return dot(color, vec3(1.0 / 3.0));
                case 1: return luminance(color);
                case 2: return max(max(color.r, color.g), color.b);
                case 3: return min(min(color.r, color.g), color.b);
            }
        }
    `,
    main: `
        vec2 uv = ((vUv - 0.5) * resolution) / resolution.y * tilings;

        float unit = 2.0 * tilings / resolution.y;

        vec2 rep = vec2(1.0, 1.73); // 1.73 ~ sqrt(3)
        vec2 hrep = 0.5 * rep;
        vec2 a = mod(uv, rep) - hrep;
        vec2 b = mod(uv - hrep, rep) - hrep;
        vec2 hexUv = dot(a, a) < dot(b, b) ? a : b;
        vec2 cellId = uv - hexUv;

        vec2 sampleUv = cellId / tilings;
        sampleUv.x *= resolution.y / resolution.x;
        float brightness = calcIntensity(texture(tDiffuse, sampleUv + 0.5).rgb);
        return vec4(vec3(smoothstep(unit, 0.0, hexDist(hexUv) - brightness * 0.5)),1.0);
    `
};

export default class HexagonFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remover Filtro": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Hexágonos";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Hexágonos")
        pasta.add(this.parameters, "Remover Filtro")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filtro Ligado");
        pasta.add(this.shaderPass.uniforms.tilings, "value",10,50).name("Hexágonos");
        pasta.add(this.shaderPass.uniforms.intensidade, "value", {"Média":0, "Luminância":1, "Máximo":2, "Mínimo":3}).name("Cálculo da Intensidade");
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(HexagonShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}