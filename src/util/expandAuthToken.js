import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import Logger from "@reactioncommerce/logger";
import config from "../config.js";

const { HYDRA_OAUTH2_INTROSPECT_URL, MOCK_TLS_TERMINATION, JWT_SECRET, USE_JWT_LOCAL_TOKEN } = config;

let mockTlsTermination = {};
if (MOCK_TLS_TERMINATION) {
  mockTlsTermination = {
    "X-Forwarded-Proto": "https"
  };
}

/**
 * @param {String} token  Auth token
 * @returns {Object} JSON object
 */
export function expandLocalAuthToken(token) {
  try {
    var tokenObj = jwt.verify(token, JWT_SECRET);
    tokenObj.active = true;
    tokenObj.token_type = 'access_token';
    return tokenObj;
  } catch (err) {
    Logger.Error(err);
    throw err;
  }
}

/**
 * Given an Authorization Bearer token it returns a JSON object with user
 * properties and claims found
 *
 * @name expandAuthToken
 * @method
 * @summary Expands an Auth token
 * @param {String} token Auth token
 * @returns {Object} JSON object
 */
export default async function expandAuthToken(token) {
  if (USE_JWT_LOCAL_TOKEN) {
    return expandLocalAuthToken(token);
  }

  const response = await fetch(HYDRA_OAUTH2_INTROSPECT_URL, {
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...mockTlsTermination },
    method: "POST",
    body: `token=${encodeURIComponent(token)}`
  });

  if (!response.ok) throw new Error("Error introspecting token");

  return response.json();
}
