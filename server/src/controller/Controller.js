'use strict';

const moment = require('moment');
moment().format();
const ChatDAO = require('../integration/ChatDAO');

/**
 * The application's controller. No other class shall call the model or
 * intagration layer.
 */
class Controller {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.chatDAO = new ChatDAO();
  }

  /**
   * Login a user. This is not a real login since no password is required. The
   * only check that is performed is that the username exists in the database.
   *
   * @param {string} username: The username of the user logging in.
   * @return {User} The logged in user if login succeeded, or null if login
   *                failed.
   * @throws Throws an exception if unable to attempt to login the specified
   *         user.
   */
  login(username) {
    const users = this.chatDAO.findUserByUsername(username);
    if (users.length === 0) {
      return null;
    }
    const loggedInUser = users[0];
    this.setUsersStatusToLoggedIn(users[0]);
    return loggedInUser;
  }

  /**
   * Checks if the specified user is logged in. Returns true if the user is
   * logged in and false if the user is not logged in.
   *
   * @param {string} username: The username of the user logging in.
   * @return {UserDTO} A userDTO describing the logged in user if the user is
   *                   logged in. Null if the user is not logged in.
   * @throws Throws an exception if failed to verify whether the specified user
   *         is logged in.
   */
  isLoggedIn(username) {
    const users = this.chatDAO.findUserByUsername(username);
    if (users.length === 0) {
      return null;
    }
    const loggedInUser = users[0];
    const loginExpires = moment(loggedInUser.loggedInUntil);
    if (loginExpires === null) {
      return null;
    }
    const now = moment();
    if (loginExpires.isBefore(now)) {
      return null;
    }
    return loggedInUser;
  }

  /**
   * Adds the specified message to the conversation.
   *
   * @param {string} msg The message to add.
   * @param {UserDTO} author The message author.
   * @return {MsgDTO} The newly created message.
   * @throws Throws an exception if failed to add the specified message.
   */
  addMsg(msg, author) {
    return this.chatDAO.createMsg(msg, author);
  }

  /**
   * Returns the message with the specified id.
   *
   * @param {number} msgId The id of the searched message.
   * @return {MsgDTO} The message with the specified id, or null if there was
   *                  no such message.
   * @throws Throws an exception if failed to search for the specified message.
   */
  findMsg(msgId) {
    return this.chatDAO.findMsgById(msgId);
  }

  /**
   * Returns all messages
   *
   * @return {MsgDTO[]} An array containing all messages. The array will be
   *                    empty if there are no messages.
   * @throws Throws an exception if failed to search for the specified message.
   */
  findAllNotDeletedMsgs() {
    return this.chatDAO.findAllNotDeletedMsgs();
  }

  /**
   * Deletes the message with the specified id.
   *
   * @param {number} msgId The id of the message that shall be deleted.
   * @throws Throws an exception if failed to delete the specified message.
   */
  deleteMsg(msgId) {
    this.chatDAO.deleteMsg(msgId);
  }

  /*
   * only 'private' helper methods below
   */
  // eslint-disable-next-line require-jsdoc
  setUsersStatusToLoggedIn(user) {
    const periodToStayLoggedIn = moment.duration({hours: 24});
    user.loggedInUntil = new Date(moment() + periodToStayLoggedIn);
    this.chatDAO.updateUser(user);
  }
}
module.exports = Controller;
