import { repositories } from '@/repositories';
import UserService from './UserService';
import AuthenticationService from './AuthenticationService';

// Inject repositories of each service into the service
const userService = new UserService(repositories);
const authenticationService = new AuthenticationService(repositories);

// Define services to be injected into each service, this should be the same as export below
const services = {
  userService: new UserService(repositories),
  authenticationService: new AuthenticationService(repositories),
};

// Inject all services to each service, this enables the service-to-service call
Object.values(services).forEach((service) => {
  service.injectServices(services);
});

export {
  services as default,

  // IMPORTANT: Keep it in-sync with the services constant above
  userService as UserService,
  authenticationService as AuthenticationService,
};
