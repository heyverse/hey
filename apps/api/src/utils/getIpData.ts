import type { Context } from "hono";

interface IpData {
  city: string;
  countryCode: string;
  region: string;
}

const getIpData = (ctx: Context): IpData => {
  const h = (name: string) => ctx.req.header(name) ?? "";
  return {
    city: h("cf-ipcity"),
    countryCode: h("cf-ipcountry"),
    region: h("cf-region")
  };
};

export default getIpData;
