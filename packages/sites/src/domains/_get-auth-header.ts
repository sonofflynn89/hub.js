import { IHubRequestOptions, getProp } from "@esri/hub-common";

interface IHeaders {
  Authorization?: string;
  [key: string]: string;
}

/**
 * Construct the auth header from a hub request options
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _getAuthHeader(
  hubRequestOptions: IHubRequestOptions
): IHeaders {
  const result: IHeaders = {};
  const token = getProp(hubRequestOptions, "authentication.token");
  if (token) {
    result.Authorization = token;
  }
  return result;
}