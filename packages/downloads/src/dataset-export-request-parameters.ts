export interface IDatasetExportRequestParameters {
  host: string;
  datasetId: string;
  spatialRefId?: string;
  spatialRefWkt?: string;
  format?: string;
  geometry?: string;
  where?: string;
}