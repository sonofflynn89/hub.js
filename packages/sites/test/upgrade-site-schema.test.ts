import { upgradeSiteSchema } from "../src";
import * as _applySiteSchemaModule from "../src/_apply-site-schema";
import * as _enforceLowercaseDomainsModule from "../src/_enforce-lowercase-domains";
import * as _ensureCatalogModule from "../src/_ensure-catalog";
import * as _purgeNonGuidsFromCatalogModule from "../src/_purge-non-guids-from-catalog";
import { IModel } from "@esri/hub-common";
import { SITE_SCHEMA_VERSION } from "../src/site-schema-version";
import { expectAllCalled, expectAll } from "./test-helpers.test";

describe("upgradeSiteSchema", () => {
  let applySpy: jasmine.Spy;
  let enforceLowercaseSpy: jasmine.Spy;
  let ensureCatalogSpy: jasmine.Spy;
  let purgeNonGuidsSpy: jasmine.Spy;
  beforeEach(() => {
    applySpy = spyOn(_applySiteSchemaModule, "_applySiteSchema").and.callFake(
      (model: IModel) => model
    );
    enforceLowercaseSpy = spyOn(
      _enforceLowercaseDomainsModule,
      "_enforceLowercaseDomains"
    ).and.callFake((model: IModel) => model);
    ensureCatalogSpy = spyOn(
      _ensureCatalogModule,
      "_ensureCatalog"
    ).and.callFake((model: IModel) => model);
    purgeNonGuidsSpy = spyOn(
      _purgeNonGuidsFromCatalogModule,
      "_purgeNonGuidsFromCatalog"
    ).and.callFake((model: IModel) => model);
  });

  it("runs schema upgrades", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION - 1
        }
      }
    } as IModel;

    upgradeSiteSchema(model);

    expectAllCalled(
      [applySpy, enforceLowercaseSpy, ensureCatalogSpy, purgeNonGuidsSpy],
      expect
    );
  });

  it("skips upgrade if already at current schema version", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: SITE_SCHEMA_VERSION
        }
      }
    } as IModel;

    upgradeSiteSchema(model);

    expectAll(
      [applySpy, enforceLowercaseSpy, ensureCatalogSpy, purgeNonGuidsSpy],
      "toHaveBeenCalled",
      false,
      expect
    );
  });
});
