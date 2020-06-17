import { IDownloadRequestParameters } from './download-request-parameters';
import { IDownloadMetadata } from './download-metadata';

function formatApiResponse(json: any): IDownloadMetadata {
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
    links: { content: downloadUrl }
  } = json;

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
}

export async function fetchDownload(
  params: IDownloadRequestParameters
): Promise<IDownloadMetadata> {
  const {
    host,
    datasetId,
    spatialRefId,
    spatialRefWkt,
    format,
    filters
  } = params;
  const url: string = `${host}/api/v3/${datasetId}/downloads?spatialRefId=${spatialRefId}&spatialRefWkt=${spatialRefWkt || ''}&formats=${format}&filters=${filters || ''}`;
  const resp = await fetch(url)
  
  const { ok, status, statusText } = resp;
  if (!ok) {
    throw new RemoteServerError(statusText, url, status)
  }

  const { data } = await resp.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response; not an array.');
  }

  if (data.length > 1) {
    throw new Error('Unexpected API response; more than one download returned.')
  }

  return formatApiResponse(data);
}

class RemoteServerError extends Error {
  status: number;
  url: string;

  constructor (message: string, url: string, status: number = 500) {
    super(message)
    this.status = status
    this.url = url

    Error.captureStackTrace(this, RemoteServerError)
  }
}