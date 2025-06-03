import gc from "@sg/game-client-base";

declare global {
    interface Window {
        envConfig: gc.Configs.SiteConfigs;
        crossConfig: gc.Configs.SiteConfigs;
    }
}

const defaultConfig: gc.Configs.SiteConfigs = {
    isDev: false,
    systemType: "SG",
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    ssl: true,
    subDomain: "l1-proxy1",
    env: "LOCAL0",
    sentryUrl: "https://2af29bdacdbf4d9ba2db6600b450541f@sentry.lumigame.com/28",
    subGuideDomain: "l1-guide",
    enableMsgpackParserOnNotification: false,
    enableMsgpackParserAllGames: false,
    websocket: {
        proxyPath: "marblefootball2",
        route: "marblefootball2",
    },
    tolgeeUrl: "",
    storagePrefixKey: "portrait_marbleFootball2",
};

let configDev = {
    isDev: defaultConfig.isDev,
    userServiceUrlDev: defaultConfig.userServiceUrlDev,
    serverDomainMapper: defaultConfig.serverDomainMapper,
    notificationServiceUrlDev: defaultConfig.notificationServiceUrlDev,
};

if (window.envConfig) {
    configDev = {
        isDev: undefined,
        userServiceUrlDev: undefined,
        serverDomainMapper: undefined,
        notificationServiceUrlDev: undefined,
    };
}

export const siteConfigs: gc.Configs.SiteConfigs =
    window.envConfig && window.envConfig.isDev
        ? defaultConfig
        : { ...defaultConfig, ...configDev, ...window.envConfig, ...window.crossConfig };

window.envConfig = siteConfigs;
gc.Shared.utils.StorageManager.setPrefixKey(siteConfigs.storagePrefixKey);
