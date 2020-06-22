import { IDownloadRequestParameters } from "./download-request-parameters";
import { fetchDownload } from "./fetch-download";
import { EventEmitter } from 'events';

interface IDownloadPollParameters extends IDownloadRequestParameters {
  downloadId: string;
}

/**
 * ```js
 * import { pollDownload } from "@esri/hub-downloads";
 * 
 * const params = {
 *   downloadId: 'abcdef0123456789abcdef0123456789_0::csv'
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'csv'
 * };
 * 
 * pollDownload(params);
 * ```
 * 
 * 
 * Poll the Hub API for status of a dataset export until the download is ready or export failed. Emits `<downloadId>ExportComplete` event when polling received completion status; `<downloadId>ExportError`event when export or polling fails.
 * @param params - parameters that define the download
 * @param eventEmitter an Event Emitter
 * @param pollingInterval number of milliseconds for the polling interval
 */
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
