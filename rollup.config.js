import RollupPluginBabel from 'rollup-plugin-babel'
import RollupPluginVue from 'rollup-plugin-vue'
import RollupPluginCommonJs from 'rollup-plugin-commonjs'

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        external: [],
        plugins: [
            RollupPluginVue(),
            RollupPluginBabel(),
            RollupPluginCommonJs(),
        ],
    }
]
