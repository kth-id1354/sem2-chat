'use strict';

const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');

/**
 * Defines the REST API with endpoints related to users.
 */
class UserApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  get path() {
    return '/user';
  }

  /**
   * Registers the request handling functions.
   */
  registerHandler() {
    try {
      /*
       * Login a user. This is not a real login since no password is required.
       * The only check that is performed is that the username exists in
       * the database.
       *
       * parameter username: The username is also used as display name.
       * return 201: If the user was successfully authenticated
       *        401: If authentication failed.
       */
      this.router.post(
          '/login',
          (req, res, next) => {
            try {
              const loggedInUser = this.contr.login(req.body.username);
              if (loggedInUser === null) {
                this.sendHttpResponse(res, 401, 'Login failed');
                return;
              } else {
                Authorization.sendAuthCookie(loggedInUser, res);
                this.sendHttpResponse(res, 204);
                return;
              }
            } catch (err) {
              res.status(500).send({error: 'Operation failed.'});
            }
          }
      );
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = UserApi;
