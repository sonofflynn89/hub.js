import { RemoteServerError } from './remote-server-error';
import { IDatasetExportRequestParameters } from './dataset-export-request-parameters';

/**
 * ```js
 * import { requestDatasetExport } from "@esri/hub-downloads";
 * 
 * const params = {
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'csv'
 * };
 * fetchDownload(params)
 *   .then(response => {
 *     // {
 *     //   downloadId: 'abcdef0123456789abcdef0123456789_0::csv',
 *     // }
 *   });
 * ```
 * Request an export of a dataset to a particular file format.
 * @param params - parameters defining a dataset export job
 */
export function requestDatasetExport (params: IDatasetExportRequestParameters) {
  const {
    host,
    datasetId,
    spatialRefId,
    spatialRefWkt,
    format,
    geometry,
    where
  } = params;

  const body = {
    spatialRefId,
    spatialRefWkt,
    format,
    geometry,
    where
  };

  const url = requestBuilder(host, `/api/v3/${datasetId}/downloads`)
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(resp => {
      const { ok, status, statusText } = resp;
      if (!ok) {
        throw new RemoteServerError(statusText, url, status);
      }
      return resp.json();
    }).then(json => {
      return resolve(json);
    })
    .catch(error => {
      return reject(error);
    });
  });
}

function requestBuilder (host: string, route: string): string {
  const baseUrl = host.endsWith('/') ? host : `${host}/`
  const url = new URL(route, baseUrl)
  return url.toString()
}