import {
  getItemStatus,
  IGetItemStatusResponse,
  updateItem,
  removeItem,
  moveItem,
  createFolder,
  IAddFolderResponse,
  setItemAccess,
  getUserContent
} from "@esri/arcgis-rest-portal";
import { DownloadFormat } from "../download-format";
import * as EventEmitter from "eventemitter3";
import { urlBuilder } from "../utils";
import { UserSession } from "@esri/arcgis-rest-auth";

class ExportCompletionError extends Error {
  constructor(message: string) {
    /* istanbul ignore next */
    super(message);
    Object.setPrototypeOf(this, ExportCompletionError.prototype);
  }
}

/**
 * @private
 */
export interface IPortalPollExportJobStatusParams {
  downloadId: string;
  datasetId: string;
  format: DownloadFormat;
  authentication: UserSession;
  jobId: string;
  exportCreated: number;
  eventEmitter: EventEmitter;
  pollingInterval: number;
  spatialRefId?: string;
  geometry?: string;
  where?: string;
}

/**
 * @private
 */
export function portalPollExportJobStatus(
  params: IPortalPollExportJobStatusParams
): void {
  const {
    downloadId,
    datasetId,
    format,
    spatialRefId,
    jobId,
    authentication,
    exportCreated,
    eventEmitter,
    pollingInterval
  } = params;

  getItemStatus({ id: downloadId, jobId, jobType: "export", authentication })
    .then((metadata: IGetItemStatusResponse) => {
      if (metadata.status === "completed") {
        return completedHandler({
          datasetId,
          format,
          authentication,
          downloadId,
          spatialRefId,
          exportCreated,
          eventEmitter
        });
      }

      if (metadata.status === "failed") {
        return eventEmitter.emit(`${downloadId}ExportError`, {
          detail: {
            metadata: {
              errors: [new Error(metadata.statusMessage)]
            }
          }
        });
      }

      return setTimeout(() => {
        portalPollExportJobStatus(params);
      }, pollingInterval);
    })
    .catch((error: any) => {
      if (error instanceof ExportCompletionError) {
        return eventEmitter.emit(`${downloadId}ExportError`, {
          detail: { metadata: { errors: [error] } }
        });
      }

      return eventEmitter.emit(`${downloadId}PollingError`, {
        detail: { error }
      });
    });
}

function completedHandler(params: any): Promise<any> {
  const {
    downloadId,
    datasetId,
    exportCreated,
    format,
    spatialRefId,
    eventEmitter,
    authentication
  } = params;

  return updateItem({
    item: {
      id: downloadId,
      typeKeywords: `export:${datasetId},modified:${exportCreated},spatialRefId:${spatialRefId}`
    },
    authentication
  })
    .then(() => {
      return setItemAccess({
        id: downloadId,
        authentication,
        access: "private"
      });
    })
    .then(() => {
      return getExportsFolderId(authentication);
    })
    .then(exportFolderId => {
      return moveItem({
        itemId: downloadId,
        folderId: exportFolderId,
        authentication
      });
    })
    .catch(err => {
      if (err && err.code === "CONT_0011") {
        // Skipping file move, already exists in target folder
        return;
      }

      removeItem({
        id: downloadId,
        authentication
      });
      throw new ExportCompletionError(err.message);
    })
    .then(() => {
      return eventEmitter.emit(`${downloadId}ExportComplete`, {
        detail: {
          metadata: {
            downloadId,
            status: "ready",
            lastModified: new Date().toISOString(),
            downloadUrl: urlBuilder({
              host: authentication.portal,
              route: `content/items/${downloadId}/data`,
              query: { token: authentication.token }
            })
          }
        }
      });
    });
}

function getExportsFolderId(authentication: UserSession): Promise<string> {
  return getUserContent({ authentication })
    .then((userContent: any) => {
      const exportFolder = userContent.folders.find((folder: any) => {
        return folder.title === "item-exports";
      });
      if (exportFolder) {
        return { folder: exportFolder };
      }
      return createFolder({ authentication, title: "item-exports" });
    })
    .then((response: unknown) => {
      const { folder } = response as IAddFolderResponse;
      return folder.id;
    });
}
