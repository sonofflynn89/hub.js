import * as fetchMock from 'fetch-mock';
import { fetchDownload } from "../src/fetch-download";

describe("fetchDownload", () => {

  afterEach(fetchMock.restore)

  it('test', async done => {
    try {
      fetchMock.mock('http://hub.com/api/v3/abcdef0123456789abcdef0123456789_0/downloads?spatialRefId=4326&spatialRefWkt=&formats=csv&filters=', {
        status: 200,
        body: {
          hello: 'world'
        }
      })
      const result = await fetchDownload({
        host: 'http://hub.com',
        datasetId: 'abcdef0123456789abcdef0123456789_0',
        spatialRefId: 4326,
        format: 'csv'
      });
      expect(typeof result === 'string').toEqual(true)
    } catch (err) {
      console.log(err)
    } finally {
      done();
    }
    
    
  })
})