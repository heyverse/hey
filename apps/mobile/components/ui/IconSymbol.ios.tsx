import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight
} from "expo-symbols";
import type { StyleProp, ViewStyle } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular"
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      name={name}
      resizeMode="scaleAspectFit"
      style={[
        {
          height: size,
          width: size
        },
        style
      ]}
      tintColor={color}
      weight={weight}
    />
  );
}
