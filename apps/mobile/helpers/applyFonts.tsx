import type React from "react";
import { Text, type TextProps } from "react-native";

const applyFonts = () => {
  const typedText = Text as unknown as React.ComponentType<TextProps> & {
    defaultProps?: TextProps;
  };
  typedText.defaultProps = typedText.defaultProps ?? {};
  typedText.defaultProps.style = { fontFamily: "SofiaProSoftRegular" };
};

export default applyFonts;
