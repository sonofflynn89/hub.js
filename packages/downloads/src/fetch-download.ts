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

export async function fetchDownload(
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
  const resp = await fetch(url);
  
  const { ok, status, statusText } = resp;
  if (!ok) {
    throw new RemoteServerError(statusText, url, status)
  }

  const json = await resp.json();

  validateApiResponse(json);

  return formatApiResponse(json);
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

  if (!metadata) return;

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

class RemoteServerError extends Error {
  status: number;
  url: string;
  
  // Istanbul erroneously treats extended class constructors as an uncovered branch: https://github.com/gotwarlost/istanbul/issues/690
  /* istanbul ignore next */
  constructor (message: string, url: string, status: number) {
    super(message)
    this.status = status
    this.url = url
    Error.captureStackTrace(this, RemoteServerError)
  }
}
