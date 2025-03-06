import omitDeep from "omit-deep";

interface TypedData {
  domain: Record<string, any>;
  types: Record<string, any>;
  value: Record<string, any>;
}

/**
 * Retrieves the signature from a given typed data object.
 *
 * @param typedData The typed data object.
 * @returns An object containing the domain, message, primary type, and types.
 */
const getSignature = (
  typedData: TypedData
): {
  domain: Record<string, any>;
  message: Record<string, any>;
  primaryType: string;
  types: Record<string, any>;
} => {
  const { domain, types, value } = typedData;

  return {
    domain: omitDeep(domain, ["__typename"]),
    message: omitDeep(value, ["__typename"]),
    primaryType: Object.keys(omitDeep(types, ["__typename"]))[0],
    types: omitDeep(types, ["__typename"])
  };
};

export default getSignature;
