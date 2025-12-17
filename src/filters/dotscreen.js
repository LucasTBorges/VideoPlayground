import Filtro from "../framework/base/filtro.js";
import Shader from "../framework/base/shader.js";
import { THREE } from "../framework/util/imports.js";
const DotScreenShaderOptions = {
    //Baseado no DotScreen shader nativo do Three.js
    name: 'DotScreenShader',
    uniforms: [
        {tipo: "vec2", nome:"center", valor: new THREE.Vector2(0.5,0.5)},
        {tipo: "float", nome:"angle", valor: 1.57},
        {tipo: "float", nome:"scale", valor: 0.8}
    ],
    aux: `
        float pattern() {
			float s = sin( angle ), c = cos( angle );
			vec2 tex = vUv * resolution * (1.25/2.0) - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
		}
    `,
    main:`
        	vec4 color = texture2D( tDiffuse, vUv );
			float average = ( color.r + color.g + color.b ) / 3.0;
			return clamp(vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a ),0.0,1.0);
    `
}

export default class DotScreenFilter extends Filtro {
    makeParameters() {
        const filter =this;
        return {
            "Remove Filter": function(){ filter.destroy() },
        }
    }

    getTitle() {
        return "Dot Screen";
    }

    makeControls() {
        const pasta = this.gui.addFolder("Dot Screen")
        pasta.add(this.parameters, "Remove Filter")
        pasta.add(this.shaderPass.uniforms.filterOn, "value").name("Filter On")
        pasta.add(this.shaderPass.uniforms.angle, "value").name("Angle").min(0).max(Math.PI/2).step(0.1)
        pasta.add(this.shaderPass.uniforms.scale, "value").name("Scale").min(.30).max(1).step(0.025)
        //Offset não faz muita diferença no resultado final, optei por não adicionar para deixar a GUI mais limpa
        /* pasta.add(this.shaderPass.uniforms.center.value, "x").name("Offset (X)").min(0).max(10).step(0.5)
        pasta.add(this.shaderPass.uniforms.center.value, "y").name("Offset (Y)").min(0).max(10).step(0.5) */
        return [pasta]
    }

    makeShader() {
        this.shaderBase = new Shader(DotScreenShaderOptions);
        const shader = this.shaderBase.getShader();
        return shader;
    }
}