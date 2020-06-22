import { RemoteServerError } from './remote-server-error';

interface IExportRequestParameters {
  host: string;
  datasetId: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  format?: string;
  geometry?: string;
  where?: string;
}

export function requestDatasetExport (params: IExportRequestParameters) {
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