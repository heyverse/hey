export interface JwtActClaim {
  sub: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  sid: string;
  act: JwtActClaim;
}
