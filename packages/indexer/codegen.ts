import type { CodegenConfig } from "@graphql-codegen/cli";
import { LENS_ENDPOINT } from "@hey/data/lens-endpoints";

const config: CodegenConfig = {
  config: {
    inlineFragmentTypes: "combine",
    noGraphQLTag: true
  },
  documents: "./documents/**/*.graphql",
  generates: {
    "possible-types.ts": {
      plugins: ["fragment-matcher"]
    },
    "generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        withMutationFn: false,
        disableDescriptions: true,
        useTypeImports: true,
        withResultType: false,
        withMutationOptionsType: false,
        addDocBlocks: false
      }
    }
  },
  hooks: { afterAllFileWrite: ["biome format --write ."] },
  overwrite: true,
  schema: LENS_ENDPOINT.Mainnet
};

export default config;
