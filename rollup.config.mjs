import MODULE from './module.json' assert { type: 'json' };

//
import { terser } from "rollup-terser";

export default {
	input: `./scripts/init.mjs`,
	output: {
		file: `.${MODULE.esmodules[0]}`,
		format: 'es',
		compact: true
	},
	plugins: [
        //terser()
    ]
  };