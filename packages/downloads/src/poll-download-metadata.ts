import { IDownloadMetadataPollParameters } from "./download-metadata-poll-parameters";
import { requestDownloadMetadata } from "./request-download-metadata";
import * as EventEmitter from 'eventemitter3';

/**
 * ```js
 * import { pollDownloadMetadata } from "@esri/hub-downloads";
 * const params = {
 *   downloadId: 'abcdef0123456789abcdef0123456789_0::csv'
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'csv'
 * };
 * pollDownloadMetadata(params);
 * ```
 * 
 * Poll the Hub API for status of a dataset export until the download is ready or export/polling fails. Emits `<downloadId>ExportComplete` event when polling loop receives completion status. Emits `<downloadId>ExportError` event when the export fails. Emits `<downloadId>PollingError` event when polling fails.
 * @param params - parameters that define the download
 * @param eventEmitter an Event Emitter
 * @param pollingInterval number of milliseconds for the polling interval
 */
export function pollDownloadMetadata (params:IDownloadMetadataPollParameters, eventEmitter: EventEmitter, pollingInterval: number) {
  const {
    downloadId
  } = params;

  requestDownloadMetadata(params)
    .then(metadata => {
      if (isUpToDate(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportComplete`, { detail: { metadata } });
      }
      if (exportDatasetFailed(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportError`, { detail: { metadata } });
      }
      return setTimeout(() => {
        pollDownloadMetadata(params, eventEmitter, pollingInterval);
      }, pollingInterval);
    }).catch(error => {
      return eventEmitter.emit(`${downloadId}PollingError`, { detail: { error } });
    });
}

function isUpToDate (metadata: any) {
  return metadata && (metadata.status === 'ready');
}

function exportDatasetFailed (metadata: any) {
  return metadata && (metadata.status === 'error_updating' || metadata.status === 'error_creating');
}