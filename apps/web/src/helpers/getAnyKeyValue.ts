import type { AnyKeyValueFragment } from "@hey/indexer";
import type { Address } from "viem";

interface AddressKeyValue {
  __typename: "AddressKeyValue";
  key: string;
  address: string;
}

interface BigDecimalKeyValue {
  __typename: "BigDecimalKeyValue";
  key: string;
  bigDecimal: string;
}

interface StringKeyValue {
  __typename: "StringKeyValue";
  key: string;
  string: string;
}

type ValidKeyValue = AddressKeyValue | BigDecimalKeyValue | StringKeyValue;

const isValidKeyValue = (kv: AnyKeyValueFragment): kv is ValidKeyValue =>
  kv.__typename === "AddressKeyValue" ||
  kv.__typename === "BigDecimalKeyValue" ||
  kv.__typename === "StringKeyValue";

const getAnyKeyValue = (
  anyKeyValue: AnyKeyValueFragment[],
  key: string
): { address?: Address; bigDecimal?: string; string?: string } | null => {
  const item = anyKeyValue.find(
    (kv): kv is ValidKeyValue => isValidKeyValue(kv) && kv.key === key
  );

  if (!item) return null;

  switch (item.__typename) {
    case "AddressKeyValue":
      return { address: item.address as Address };
    case "BigDecimalKeyValue":
      return { bigDecimal: item.bigDecimal };
    case "StringKeyValue":
      return { string: item.string };
    default:
      return null;
  }
};

export default getAnyKeyValue;
