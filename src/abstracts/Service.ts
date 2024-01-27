/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Base Service
 */
export default abstract class Service {
  /**
   * Inject services; this method should be overridden by subclasses
   * if they need to perform specific actions when injecting services.
   * The services injected must be constructed.
   * @param {Object.<string, Service>} services Services
   * @return {void} Nothing
   */
  injectServices(services: { [key: string]: Service }): void {
    // Do nothing by default
    // Subclasses can override this method to perform specific actions.
  }
}
