import * as fetchMock from 'fetch-mock';
import { requestDatasetExport } from "../src/request-dataset-export";

describe("requestDatasetExport", () => {

  afterEach(() => fetchMock.restore());

  fit('handle remote server 502 error', async done => {
    try {
      fetchMock.post('http://hub.com/api/v3/abcdef0123456789abcdef0123456789_0/downloads', {
        status: 502
      }, {
        body: {
          spatialRefId: 4326,
          format: 'csv'
        }
      });

      expect(await requestDatasetExport({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: 4326,
        format: 'csv'
      })).toThrow()
    } catch (err) {
      const { message, status, url } = err;
      expect(message).toEqual('Bad Gateway');
      expect(status).toEqual(502);
      expect(url).toEqual('http://hub.com/api/v3/abcdef0123456789abcdef0123456789_0/downloads');
    } finally {
      done();
    }
  });
});