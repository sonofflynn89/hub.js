import { IDownloadMetadataRequestParameters } from "./download-metadata-request-parameters";
import { RemoteServerError } from './remote-server-error';

interface IDownloadMetadata {
  downloadId: string,
  lastEditDate:string,
  contentLastModified: string,
  lastModified: string,
  status: string,
  downloadUrl: string,
  contentLength: number,
  cacheTime: number
}

/**
 * ```js
 * import { requestDownloadMetadata } from "@esri/hub-downloads";
 * const params = {
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'csv'
 * };
 * requestDownloadMetadata(params)
 *   .then(response => {
 *     // {
 *     //   downloadId: 'abcdef0123456789abcdef0123456789_0::csv',
 *     //   contentLastModified: '2020-06-17T01:16:01.933Z',
 *     //   lastEditDate: '2020-06-18T01:17:31.492Z',
 *     //   lastModified: '2020-06-17T13:04:28.000Z',
 *     //   status: 'stale',
 *     //   downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
 *     //   contentLength: 1391454,
 *     //   cacheTime: 13121
 *     // }
 *   });
 * ```
 * Fetch metadata for a Hub download.
 * @param params - parameters that define the download
 * @returns A Promise that will resolve with download metadata.
 */
export function requestDownloadMetadata(
  params: IDownloadMetadataRequestParameters
): Promise<IDownloadMetadata> {
  const {
    host,
    datasetId,
    spatialRefId,
    spatialRefWkt,
    format,
    geometry,
    where
  } = params;

  const queryParams = {
    spatialRefId,
    spatialRefWkt,
    formats: format,
    geometry: geometry ? JSON.stringify(geometry) : undefined,
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
        return reject(error);
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
        cacheTime,
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
    cacheTime
   };
};