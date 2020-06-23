export interface IDownloadMetadataRequestParameters {
  host: string;
  datasetId: string;
  format: string;
  spatialRefId?: string;
  spatialRefWkt?: string;
  geometry?: string;
  where?: string;
}