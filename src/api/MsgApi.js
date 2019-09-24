'use strict';

const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');
const UserApi = require('./UserApi');

/**
 * Defines the REST API with endpoints related to messages.
 */
class MsgApi extends RequestHandler {
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
    return '/msg';
  }

  /**
   * Registers the request handling functions.
   */
  registerHandlers() {
    try {
      /*
       * Adds a new message to the conversation. The author will be set to the
       * username in the 'chatAuth' cookie.
       *
       * parameter msg: The chat message.
       * return 200: The newly created message, if the message was added.
       *        401: If the user was not authenticated.
       */
      this.router.post('/', (req, res) => {
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
          const msg = this.contr.addMsg(req.body.msg, req.user);
          this.convertAuthorIdToUrl(msg);
          this.sendHttpResponse(res, 200, msg);
        } catch (err) {
          this.handleException(err, res);
        }
      });

      /*
       * Deletes the specified message.
       *
       * parameter id The id of the message that shall be deleted.
       * return 204: If the message was deleted.
       *        401: If the user was not authenticated, or was not the author
       *             of the specified message.
       *        404: If the specified message did not exist.
       */
      this.router.delete('/:id', (req, res) => {
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
          const msg = this.contr.findMsg(parseInt(req.params.id, 10));
          if (msg === null) {
            this.sendHttpResponse(res, 404, 'No such message');
            return;
          }
          if (req.user.id !== msg.authorId) {
            this.sendHttpResponse(res, 401, 'Unauthorised user');
            return;
          }
          this.contr.deleteMsg(parseInt(req.params.id, 10));
          this.sendHttpResponse(res, 204);
        } catch (err) {
          this.handleException(err, res);
        }
      });

      /*
       * Reads all messages
       *
       * return 200: An array containing all messages, if messages were read.
       *        401: If the user was not authenticated.
       *        404: If there are no messages at all.
       */
      this.router.get('/', (req, res) => {
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
          const msgs = this.contr.findAllNotDeletedMsgs();
          if (msgs.length === 0) {
            this.sendHttpResponse(res, 404, 'No messages');
            return;
          }
          for (const msg of msgs) {
            this.convertAuthorIdToUrl(msg);
          }
          this.sendHttpResponse(res, 200, msgs);
        } catch (err) {
          this.handleException(err, res);
        }
      });
    } catch (err) {
      this.logger.logException(err);
    }
  }

  /*
   * Only 'private' helper methods below.
   */

  // eslint-disable-next-line require-jsdoc
  convertAuthorIdToUrl(msg) {
    msg.author =
      RequestHandler.URL_PREFIX +
      process.env.HOST +
      ':' +
      process.env.PORT +
      UserApi.USER_API_PATH +
      '/' +
      msg.authorId;
    delete msg.authorId;
  }
}

module.exports = MsgApi;
