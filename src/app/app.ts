import { Application, PartialApplicationConfig } from 'lisk-sdk';
// import { registerModules } from './modules';
import { registerPlugins } from './plugins';
import { BadgeModule } from './modules/badge/module';
import { IdentityModule } from './modules/identity/module';

export const getApplication = (config: PartialApplicationConfig): Application => {
    const { app } = Application.defaultApplication(config);
    const badgeModule = new BadgeModule();
    const identityModule = new IdentityModule();

    app.registerModule(badgeModule);
    app.registerModule(identityModule);
    badgeModule.addDependencies(identityModule.method);

    // registerModules(app);
    registerPlugins(app);

    console.log('!!!! app');

    return app;
};
