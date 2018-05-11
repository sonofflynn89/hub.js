import { fetchDomain, fetchDomains, getHubUrl } from "../src/index";
import * as fetchMock from "fetch-mock";

describe("fetchDomain", () => {
  afterEach(fetchMock.restore);

  it("should return a domain", done => {
    fetchMock.once(
      "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc",
      [{ domain: "data.foo.com" }]
    );

    fetchDomain("5bc").then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
      );
      expect(options.method).toBe("GET");
      expect(url).toContain("siteId=5bc");
      expect(response).toBe("data.foo.com");
      done();
    });
  });

  it("should return custom domain if multiple entries exist", done => {
    fetchMock.once(
      `https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc`,
      [{ domain: "data.foo.com" }, { domain: "org.hub.arcgis.com" }]
    );
    fetchDomain("5bc").then(domain => {
      expect(domain).toBe("data.foo.com");
      const [domainUrl, domainOptions]: [
        string,
        RequestInit
      ] = fetchMock.lastCall(
        "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
      );
      expect(domainUrl).toContain("siteId=5bc");
      done();
    });
  });
  it("should return first if multiple non-custom entries exist", done => {
    fetchMock.once(
      `https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc`,
      [{ domain: "org-beta.hub.arcgis.com" }, { domain: "org.hub.arcgis.com" }]
    );
    fetchDomain("5bc").then(domain => {
      expect(domain).toBe("org-beta.hub.arcgis.com");
      expect(fetchMock.done()).toBeTruthy();
      const [domainUrl, domainOptions]: [
        string,
        RequestInit
      ] = fetchMock.lastCall(
        "https://hub.arcgis.com/utilities/domains?f=json&siteId=5bc"
      );
      expect(domainUrl).toContain("siteId=5bc");
      done();
    });
  });
});

describe("getHubUrl()", () => {
  it("should default to prod", done => {
    const url = getHubUrl();
    expect(url).toBe("https://hub.arcgis.com");
    done();
  });

  it("should convert a dev portal to hubdev", done => {
    // create a fake requestOptions
    const opts = {
      authentication: {
        portal: "https://dc.mapsdevext.arcgis.com",
        getToken(): Promise<string> {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getHubUrl(opts);
    expect(url).toBe("https://hubdev.arcgis.com");
    done();
  });

  it("should convert a qa portal to hubdev", done => {
    // create a fake requestOptions
    const opts = {
      authentication: {
        portal: "https://dc.mapsqaext.arcgis.com",
        getToken(): Promise<string> {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getHubUrl(opts);
    expect(url).toBe("https://hubqa.arcgis.com");
    done();
  });
});