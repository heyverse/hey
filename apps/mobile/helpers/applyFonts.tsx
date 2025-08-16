import { Text } from "react-native";

const applyFonts = () => {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = { fontFamily: "SofiaProSoftRegular" };
};

export default applyFonts;
