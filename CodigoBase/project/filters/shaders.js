import { THREE } from "../../framework/util/imports.js";

export const MonochromaticShaderOptions = {
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

export const DotScreenShaderOptions = {
    name: 'DotScreenShader',
    uniforms: [
        {tipo: "vec2", nome:"center", valor: new THREE.Vector2(0.5,0.5)},
        {tipo: "float", nome:"angle", valor: 1.57},
        {tipo: "float", nome:"scale", valor: 0.8}
    ],
    aux: `
        float pattern() {
			float s = sin( angle ), c = cos( angle );
			vec2 tex = vUv * resolution* (1.25/2.0) - center;
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