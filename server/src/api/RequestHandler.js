'use strict';

const express = require('express');
const Controller = require('../controller/Controller');
const Logger = require('../util/Logger');

/**
 * Superclass for all request handlers.
 */
class RequestHandler {
  /**
   * Constructs a new instance, and also creates router and logger
   * for use by subclasses.
   */
  constructor() {
    this.router = express.Router(); // eslint-disable-line new-cap
    this.logger = new Logger();
    this.contr = new Controller();
  }

  /**
   * Protocol part (http) of a URL.
   */
  static get URL_PREFIX() {
    return 'http://';
  }

  /**
   * Sends an http response with the specified http status and body.
   * @param {Request} res The express Response object.
   * @param {number} status The status code of the response.
   * @param {any} body The body of the response.
   */
  sendHttpResponse(res, status, body) {
    if (body === undefined) {
      res.status(status).end();
      return;
    }
    let errOrSucc = null;
    if (status < 400) {
      errOrSucc = 'success';
    } else {
      errOrSucc = 'error';
    }
    res.status(status).json({[errOrSucc]: body});
  }

  /*
   * Only 'private' helper methods below here.
   */

  // eslint-disable-next-line require-jsdoc
  handleException(err, res) {
    this.logger.logException(err);
    this.sendHttpResponse(res, 500, 'Operation failed');
  }

  // eslint-disable-next-line require-jsdoc
  convertAuthorIdToUrl(msg) {
    msg.author = RequestHandler.URL_PREFIX + process.env.SERVER_HOST +
                 ':' + process.env.SERVER_PORT + UserApi.USER_API_PATH +
                 '/' + msg.authorId;
    delete msg.authorId;
  }
}

module.exports = RequestHandler;
