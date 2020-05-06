import { IDomainEntry } from "./types";
import { isGuid } from "@esri/hub-common";

/**
 * Determine if a domain entry belongs to a legacy site.
 * This is used to allow customers to "reclaim" domains that
 * were associated with legacy sites which can no longer be
 * edited.
 * @param {IHubDomain} domainEntry Domain Info record
 */
export function isDomainForLegacySite(domainEntry: IDomainEntry) {
  return !isGuid(domainEntry.siteId);
}
