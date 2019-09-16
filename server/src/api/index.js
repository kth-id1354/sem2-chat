'use strict';

const UserApi = require('./UserApi');
const MsgApi = require('./MsgApi');

/**
 * Contains all request handlers.
 */
class RequestHandlerLoader {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.reqHandlers = [];
  }

  /**
   * Adds a new request handler.
   *
   * @param {RequestHandler} reqHandler The request handler that will be added.
   */
  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  /**
   * Makes all request handlers available in the specified express
   * Application object.
   *
   * @param {Application} app The express application hosting the
   *                          request handlers.
   */
  loadHandlers(app) {
    this.reqHandlers.forEach((reqHandler) => {
      reqHandler.registerHandlers();
      app.use(reqHandler.path, reqHandler.router);
    });
  }
}

const loader = new RequestHandlerLoader();
loader.addRequestHandler(new UserApi());
loader.addRequestHandler(new MsgApi());

module.exports = loader;
