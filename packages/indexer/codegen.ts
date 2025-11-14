import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  config: {
    inlineFragmentTypes: "combine",
    noGraphQLTag: true
  },
  documents: "./documents/**/*.graphql",
  generates: {
    "generated.ts": {
      config: {
        addDocBlocks: false,
        disableDescriptions: true,
        useTypeImports: true,
        withMutationFn: false,
        withMutationOptionsType: false,
        withResultType: false
      },
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ]
    },
    "possible-types.ts": {
      plugins: ["fragment-matcher"]
    }
  },
  hooks: { afterAllFileWrite: ["biome format --write ."] },
  overwrite: true,
  schema: "https://api.lens.xyz/graphql"
};

export default config;
