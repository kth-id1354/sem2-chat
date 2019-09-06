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
    return UserApi.USER_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get USER_API_PATH() {
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
              console.log(err.stack);
              res.status(500).send({error: 'Operation failed.'});
            }
          }
      );

      /*
       * Returns the specified user.
       *
       * parameter id The id of the user that shall be returned.
       * return 200: The searched user.
       *        401: If the user was not authenticated.
       *        404: If the specified user did not exist.
       */
      this.router.get('/:id', (req, res, next) => {
        try {
          if (
            !Authorization.checkLogin(
                this.contr,
                req,
                res,
                this.sendHttpResponse
            )
          ) {
            return;
          }
          const user = this.contr.findUser(parseInt(req.params.id, 10));
          if (user === null) {
            this.sendHttpResponse(res, 404, 'No such user');
            return;
          }
          this.sendHttpResponse(res, 200, user);
        } catch (err) {
          this.handleError(err);
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }
}

module.exports = UserApi;
