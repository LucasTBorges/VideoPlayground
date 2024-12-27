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