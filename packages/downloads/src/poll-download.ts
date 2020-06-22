import { IDownloadFetchParameters } from "./download-fetch-parameters";
import { fetchDownload } from "./fetch-download";
import { EventEmitter } from 'events';

interface IDownloadPollParameters extends IDownloadFetchParameters {
  downloadId: string;
}

export function pollDownload (params:IDownloadPollParameters, eventEmitter: EventEmitter, pollingInterval: number) {
  const {
    downloadId
  } = params;

  fetchDownload(params)
    .then(metadata => {
      if (isUpToDate(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportComplete`, { detail: { metadata } });
      }
      if (exportDatasetFailed(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportError`, { detail: { metadata } });
      }
      return setTimeout(() => {
        pollDownload(params, eventEmitter, pollingInterval);
      }, pollingInterval);
    }).catch(error => {
      return eventEmitter.emit(`${downloadId}ExportError`, { detail: { metadata: { status: 'error', error } } });
    });
}

function isUpToDate (metadata: any) {
  return metadata && (metadata.status === 'ready');
}

function exportDatasetFailed (metadata: any) {
  return metadata && (metadata.status === 'error_updating' || metadata.status === 'error_creating');
}
