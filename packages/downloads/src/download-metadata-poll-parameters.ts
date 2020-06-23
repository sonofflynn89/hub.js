import { IDownloadMetadataRequestParameters } from './download-metadata-request-parameters';

export interface IDownloadMetadataPollParameters extends IDownloadMetadataRequestParameters {
  downloadId: string;
}