import { Dimensions } from "react-native";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const COLORS = {
  primary: "#333333",

  neutral400: "#808080",
  neutral300: "#C4C4C4",
  neutral280: "#FFF2E4",
  neutral250: "#EEDCAE",
  neutral200: "#FEDADA",
  neutral100: "#FFFFFF",

  accent800: "#FE8729",
  accent600: "#E2445C",
  accent500: "#FF7575",
  accent400: "#FFADAD",
};

const FONT = {
  medium: "Medium",
  semiBold: "SBold",
  bold: "Bold",
};

const SIZES = {
  xSmall: 10,
  small: 13,
  medium: 15,
  xmedium: 17,
  large: 20,
  xLarge: 24,
  xxLarge: 34,
  height: height,
  width: width,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
