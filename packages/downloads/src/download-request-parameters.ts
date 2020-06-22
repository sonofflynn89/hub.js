export interface IDownloadRequestParameters {
  host: string;
  datasetId: string;
  format: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  geometry?: object;
  where?: string;
}