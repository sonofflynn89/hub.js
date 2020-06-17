export interface IDownloadRequestParameters {
  host: string;
  datasetId: string;
  filters?: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  format: string;
};