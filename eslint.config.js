import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['node_modules/**','.tools/**','.output/**','.tanstack/**','.nitro/**','dist/**','src/routeTree.gen.ts','playwright-report/**','test-results/**'] }, ...tseslint.configs.recommended);
