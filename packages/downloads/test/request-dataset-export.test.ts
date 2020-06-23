import * as fetchMock from 'fetch-mock';
import { requestDatasetExport } from "../src/request-dataset-export";

describe("requestDatasetExport", () => {

  afterEach(() => fetchMock.restore());

  it('handle remote server 502 error', async done => {
    try {
      fetchMock.post('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads', {
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
      expect(url).toEqual('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads');
    } finally {
      done();
    }
  });

  it('handle remote server 400 error', async done => {
    try {
      fetchMock.post('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads', {
        status: 400
      }, {
        body: {
          spatialRefId: 4326,
          format: 'tsv'
        }
      });

      expect(await requestDatasetExport({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: 4326,
        format: 'tsv'
      })).toThrow()
    } catch (err) {
      const { message, status, url } = err;
      expect(message).toEqual('Bad Request');
      expect(status).toEqual(400);
      expect(url).toEqual('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads');
    } finally {
      done();
    }
  });

  it('success', async done => {
    try {
      fetchMock.post('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads', {
        status: 200,
        body: {
          downloadId: '123'
        }
      }, {
        body: {
          spatialRefId: 4326,
          format: 'csv'
        }
      });

      const json:any = await requestDatasetExport({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: 4326,
        format: 'csv'
      });
      expect(json.downloadId).toEqual('123')
    } catch (err) {
      const { message, status, url } = err;
      expect(message).toEqual('Bad Request');
      expect(status).toEqual(400);
      expect(url).toEqual('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads');
    } finally {
      done();
    }
  });

  it('success with a host that has trailing slash', async done => {
    try {
      fetchMock.post('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads', {
        status: 200,
        body: {
          downloadId: '123'
        }
      }, {
        body: {
          spatialRefId: 4326,
          format: 'csv'
        }
      });

      const json:any = await requestDatasetExport({
        host: 'http://hub.com/',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: 4326,
        format: 'csv'
      });
      expect(json.downloadId).toEqual('123')
    } catch (err) {
      const { message, status, url } = err;
      expect(message).toEqual('Bad Request');
      expect(status).toEqual(400);
      expect(url).toEqual('http://hub.com/api/v3/datasets/abcdef0123456789abcdef0123456789_0/downloads');
    } finally {
      done();
    }
  });
});