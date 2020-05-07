/**
 * Hash of the team group templates.
 * This hash is used to determin what teams can be created in what products
 * based on what privs and stored in what properties
 * We define the various groups via json structures. The .config hash controls
 * the i18n, as well as the portal vs ago, and basic vs premium definition.
 * This allows us to add/remove/edit groups by simply modifying this hash
 * instead of spreading complex construction logic all over the application
 */
export const WELLKNOWNTEAMS = [
  {
    config: {
      groupType: "Hub Collaboration Group",
      type: "core",
      availableIn: ["premium"],
      propertyName: "collaborationGroupId",
      requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
      titleI18n: "collaborationTitle",
      descriptionI18n: "collaborationDesc",
      snippetI18n: "collaborationSnippet"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    capabilities: "updateitemcontrol",
    _edit_privacy: "on",
    _edit_contributors: "on",
    tags: [
      "Hub Group",
      "Hub Initiative Group",
      "Hub Site Group",
      "Hub Core Team Group",
      "Hub Team Group"
    ]
  },
  {
    config: {
      groupType: "Hub Collaboration Group",
      type: "core",
      availableIn: ["basic"],
      propertyName: "collaborationGroupId",
      requiredPrivs: ["portal:admin:createUpdateCapableGroup"],
      titleI18n: "collaborationTitleBasic",
      descriptionI18n: "collaborationDescBasic",
      snippetI18n: "collaborationSnippetBasic"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    capabilities: "updateitemcontrol",
    _edit_privacy: "on",
    _edit_contributors: "on",
    tags: [
      "Hub Group",
      "Hub Site Group",
      "Hub Core Team Group",
      "Hub Team Group"
    ]
  },
  {
    config: {
      groupType: "Portal Collaboration Group",
      type: "core",
      availableIn: ["portal"],
      propertyName: "collaborationGroupId",
      requiredPrivs: [
        "portal:user:createGroup",
        "portal:admin:createUpdateCapableGroup"
      ],
      titleI18n: "collaborationTitlePortal",
      descriptionI18n: "collaborationDescPortal",
      snippetI18n: "collaborationSnippetPortal"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    capabilities: "updateitemcontrol",
    _edit_privacy: "on",
    _edit_contributors: "on",
    tags: ["Sites Group", "Sites Core Team Group"]
  },
  {
    config: {
      groupType: "Hub Content Group",
      type: "content",
      availableIn: ["premium"],
      propertyName: "contentGroupId",
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "contentTitle",
      descriptionI18n: "contentDesc",
      snippetI18n: "contentSnippet"
    },
    access: "public",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: [
      "Hub Group",
      "Hub Content Group",
      "Hub Site Group",
      "Hub Initiative Group"
    ]
  },
  {
    config: {
      groupType: "Hub Content Group",
      type: "content",
      availableIn: ["basic"],
      propertyName: "contentGroupId",
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "contentTitleBasic",
      descriptionI18n: "contentDescBasic",
      snippetI18n: "contentSnippetBasic"
    },
    access: "public",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: ["Hub Group", "Hub Content Group", "Hub Site Group"]
  },
  {
    config: {
      groupType: "Portal Content Group",
      type: "content",
      availableIn: ["portal"],
      propertyName: "contentGroupId",
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "contentTitle",
      descriptionI18n: "contentDescPortal",
      snippetI18n: "contentSnippetPortal"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: ["Sites Group", "Sites Content Group"]
  },
  {
    // this is only ever created in AGO, so we don't have a second entry for followers
    config: {
      groupType: "Hub Followers Group",
      type: "followers",
      availableIn: ["premium"],
      propertyName: "followersGroupId",
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "followersTitle",
      descriptionI18n: "followersDesc",
      snippetI18n: "followersSnippet"
    },
    access: "public",
    autoJoin: true,
    isInvitationOnly: false,
    isViewOnly: true,
    notificationsEnabled: true,
    sortField: "title",
    sortOrder: "asc",
    tags: [
      "Hub Group",
      "Hub Initiative Followers Group",
      "Hub Initiative Group"
    ]
  },
  {
    config: {
      groupType: "Generic AGO Site Team",
      type: "team",
      availableIn: ["basic"],
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "teamTitle",
      descriptionI18n: "teamDesc",
      snippetI18n: "teamSnippet"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: ["Site Team Group"]
  },
  {
    config: {
      groupType: "Generic AGO Initiative Team",
      type: "team",
      availableIn: ["premium"],
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "teamTitle",
      descriptionI18n: "teamDesc",
      snippetI18n: "teamSnippet"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: ["Hub Team Group"]
  },
  {
    config: {
      groupType: "Generic Portal Team",
      type: "team",
      availableIn: ["portal"],
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "teamTitle",
      descriptionI18n: "teamDesc",
      snippetI18n: "teamSnippet"
    },
    access: "org",
    autoJoin: false,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "modified",
    sortOrder: "desc",
    tags: ["Site Team Group"]
  },
  {
    config: {
      groupType: "Generic Event Team",
      type: "event",
      availableIn: ["premium"],
      requiredPrivs: ["portal:user:createGroup"],
      titleI18n: "eventTeamTitle",
      descriptionI18n: "eventTeamDesc",
      snippetI18n: "eventTeamSnippet"
    },
    access: "public",
    autoJoin: true,
    isInvitationOnly: false,
    isViewOnly: false,
    sortField: "title",
    sortOrder: "asc",
    tags: ["Hub Group", "Hub Event Group", "Hub Initiative Group"]
  }
];
