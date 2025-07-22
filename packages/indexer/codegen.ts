import type { CodegenConfig } from "@graphql-codegen/cli";
import { LENS_ENDPOINT } from "@hey/data/lens-endpoints";

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
  schema: LENS_ENDPOINT.Mainnet
};

export default config;
