export interface IDownloadFetchParameters {
  host: string;
  datasetId: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  formats?: string;
  geometry?: string;
  where?: string;
}
