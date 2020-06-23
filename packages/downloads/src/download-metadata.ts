export interface IDownloadMetadata {
  downloadId: string,
  status: string,
  lastEditDate:string,
  contentLastModified?: string,
  lastModified?: string,
  downloadUrl?: string,
  contentLength?: number,
  cacheTime?: number
}