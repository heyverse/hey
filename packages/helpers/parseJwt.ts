import type { JwtPayload } from "@hey/types/jwt";

const decoded = (str: string): string => atob(str);

const parseJwt = (token: string): JwtPayload => {
  try {
    return JSON.parse(decoded(token.split(".")[1])) as JwtPayload;
  } catch {
    return {
      act: { sub: "" },
      exp: 0,
      sid: "",
      sub: ""
    };
  }
};

export default parseJwt;
