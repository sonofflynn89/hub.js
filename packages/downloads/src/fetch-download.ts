import { RemoteServerError } from './remote-server-error';

interface IDownloadRequestParameters {
  host: string;
  datasetId: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  formats?: string;
  geometry?: string;
  where?: string;
}

interface IDownloadMetadata {
  downloadId: string,
  lastEditDate:string,
  contentLastModified: string,
  lastModified: string,
  status: string,
  downloadUrl: string,
  contentLength: number,
  exportDuration: number
}

export function fetchDownload(
  params: IDownloadRequestParameters
): Promise<IDownloadMetadata> {
  const {
    host,
    datasetId,
    spatialRefId,
    spatialRefWkt,
    formats,
    geometry,
    where
  } = params;

  const queryParams = {
    spatialRefId,
    spatialRefWkt,
    formats,
    geometry,
    where
  };
  const url = requestBuilder({ host, route: `/api/v3/${datasetId}/downloads`, params: queryParams })
  return new Promise((resolve, reject) => {
    fetch(url).then(resp => {
      const { ok, status, statusText } = resp;
      if (!ok) {
        throw new RemoteServerError(statusText, url, status);
      }
      return resp.json();
      })
      .then(json => {
        validateApiResponse(json);
        const metadata = formatApiResponse(json);
        resolve(metadata);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function requestBuilder ({ host, route, params }: any): string {
  const baseUrl = host.endsWith('/') ? host : `${host}/`
  const url = new URL(route, baseUrl)
  url.search = buildQueryString(params)
  return url.toString()
}

function buildQueryString (params: any): string {
  const queryParams = Object.keys(params).filter(key => {
    return params[key] !== undefined;
  }).reduce((acc:any, key:string) => {
    acc[key] = params[key];
    return acc;
  }, {})
  return (new URLSearchParams(queryParams)).toString()
}

function validateApiResponse ({ data }: any): void {
  if (!data) {
    throw new Error('Unexpected API response; no "data" property.');
  }

  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response; "data" is not an array.');
  }

  if (data.length > 1) {
    throw new Error('Unexpected API response; "data" contains more than one download.')
  }
}

function formatApiResponse(json: any): IDownloadMetadata {
  const { data: [ metadata ] } = json;

  if (!metadata) return undefined;

  const {
      attributes: {
        downloadId,
        contentLastModified,
        lastModified,
        status,
        contentLength,
        exportDuration,
        source: {
          lastEditDate,
        }
      },
      links: {
        content: downloadUrl
      }
    } = metadata;

  return {
    downloadId,
    contentLastModified,
    lastEditDate,
    lastModified,
    status,
    downloadUrl,
    contentLength,
    exportDuration
   };
};
