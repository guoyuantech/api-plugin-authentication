import envalid from "envalid";

const { str } = envalid;

export default envalid.cleanEnv(process.env, {
  HYDRA_OAUTH2_INTROSPECT_URL: str({ devDefault: "http://hydra:4445/oauth2/introspect" }),
  MOCK_TLS_TERMINATION: envalid.bool({ default: false }),
  USE_JWT_LOCAL_TOKEN: envalid.bool({ default: true }),
  JWT_SECRET: str({ devDefault: "wrong secret" })
}, {
  dotEnvPath: null
});
