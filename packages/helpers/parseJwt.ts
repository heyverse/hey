const decoded = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

const parseJwt = (
  token: string
): {
  sub: string;
  exp: number;
  sid: string;
  act: { sub: string };
} => {
  try {
    return JSON.parse(decoded(token.split(".")[1]));
  } catch {
    return {
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "" }
    };
  }
};

export default parseJwt;
