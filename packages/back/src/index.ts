import {FeatureToggleApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {ConnectionOptions} from 'typeorm';
import {ToggleController} from './controllers';
import CONFIG from '../ormconfig';

export {FeatureToggleApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new FeatureToggleApplication(options);

  app.controller(ToggleController);
  await app.connectDB(CONFIG as ConnectionOptions);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
