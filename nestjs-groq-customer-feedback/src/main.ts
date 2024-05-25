import { env } from '~configs/env.config';
import { Bootstrap } from '~core/bootstrap';

async function bootstrap() {
  const bootstrap = new Bootstrap();
  await bootstrap.initApp();
  bootstrap.enableCors();
  bootstrap.setupMiddleware();
  bootstrap.setupGlobalPipe();
  bootstrap.setupSwagger();
  await bootstrap.startApp();
}

bootstrap()
  .then(() => console.log(`The application starts successfully at port ${env.PORT}`))
  .catch((error) => console.error(error));
