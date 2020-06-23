export interface IDatasetExportRequestParameters {
  host: string;
  datasetId: string;
  spatialRefId?: number;
  spatialRefWkt?: string;
  format?: string;
  geometry?: string;
  where?: string;
}