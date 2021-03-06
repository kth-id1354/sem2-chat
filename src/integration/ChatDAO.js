'use strict';

const WError = require('verror').WError;
const UserDTO = require('../model/UserDTO');
const MsgDTO = require('../model/MsgDTO');

/**
 * This class is responsible for all calls to the database. There shall not
 * be any database-related code outside this class. This version of the chat
 * server does not have a database. Instead, all data is saved in plain objects.
 */
class ChatDAO {
  /**
   * Creates a new instance and initializes the in-memory datastore.
   */
  constructor() {
    this.datastore = require('../data/Datastore');
    if (this.datastore.users.length === 0) {
      this.createDefaultUsers();
    }
  }

  /**
   * Searches for a user with the specified username.
   *
   * @param {string} username The username of the searched user.
   * @return {array} An array containing all users with the
   *                 specified username. Each element in the returned
   *                 array is a userDTO. The array is empty if no matching
   *                 users were found.
   */
  findUserByUsername(username) {
    const foundUsers = [];
    this.datastore.users.forEach((user) => {
      if (user.username === username) {
        foundUsers.push(Object.assign({}, user));
      }
    });
    return foundUsers;
  }

  /**
   * Searches for a user with the specified id.
   *
   * @param {number} id The id of the searched user.
   * @return {UserDTO} A UserDTO representing the user with the specified id,
   *                 or null if no matching user was found.
   */
  findUserById(id) {
    const foundUser = this.getUserInDbById(id);
    if (foundUser === null) {
      return null;
    }
    return Object.assign({}, foundUser);
  }

  /**
   * Updates the user with the id of the specified User object. All fields
   * present in the specified User object are updated.
   *
   * @param {UserDTO} user The new state of the user instance.
   * @throws Throws an exception if failed to update the user.
   */
  updateUser(user) {
    const foundUser = this.getUserInDbById(user.id);
    if (foundUser === null) {
      throw new WError(
          {
            info: {
              ChatDAO: 'Failed to update user.',
              username: user.username,
            },
          },
          `No user with id ${user.id}.`
      );
    }
    if (user.username !== null) {
      foundUser.username = user.username;
    }
    if (user.loggedInUntil !== null) {
      foundUser.loggedInUntil = user.loggedInUntil;
    }
  }

  /**
   * Creates the specified message.
   *
   * @param {string} msg The message to add.
   * @param {UserDTO} author The message author.
   * @return {MsgDTO} The newly created message.
   */
  createMsg(msg, author) {
    const newMsg = new MsgDTO(
        this.datastore.getNextMsgId(),
        author.id,
        msg,
        null
    );
    this.datastore.msgs.push(newMsg);
    return Object.assign({}, newMsg);
  }

  /**
   * Searches for a message with the specified id.
   *
   * @param {number} id The id of the searched message.
   * @return {MsgDTO} The message with the specified id, or null if there was
   *                  no such message.
   */
  findMsgById(id) {
    const foundMsg = this.getMsgInDbById(id);
    if (foundMsg === null) {
      return null;
    }
    return Object.assign({}, foundMsg);
  }

  /**
   * Reads all messages.
   *
   * @return {MsgDTO[]} An array containing all messages that are not deleted.
   *                    The array will be empty if there are no such messages.
   */
  findAllNotDeletedMsgs() {
    const notDeletedMsgs = [];
    this.datastore.msgs.forEach((msg) => {
      if (msg.deletedAt === null) {
        notDeletedMsgs.push(Object.assign({}, msg));
      }
    });
    return notDeletedMsgs;
  }

  /**
   * Deletes the message with the specified id.
   *
   * @param {number} id The id of the message that shall be deleted.
   * @throws Throws an exception if failed to delete the specified message.
   */
  deleteMsg(id) {
    const foundMsg = this.getMsgInDbById(id);
    if (foundMsg === null) {
      throw new WError(
          {
            info: {
              ChatDAO: 'Failed to delete message.',
              msg: id,
            },
          },
          `No message with id ${id}.`
      );
    }
    foundMsg.deletedAt = new Date().toDateString();
  }

  /*
   * Only 'private' helper methods below.
   */

  // eslint-disable-next-line require-jsdoc
  createDefaultUsers() {
    this.datastore.users.push(new UserDTO(1, 'stina', null));
    this.datastore.users.push(new UserDTO(2, 'nisse', null));
  }

  // eslint-disable-next-line require-jsdoc
  getUserInDbById(id) {
    let foundUser = null;
    this.datastore.users.forEach((user) => {
      if (user.id === id) {
        foundUser = user;
        return;
      }
    });
    return foundUser;
  }

  // eslint-disable-next-line require-jsdoc
  getMsgInDbById(id) {
    let foundMsg = null;
    this.datastore.msgs.forEach((msg) => {
      if (msg.id === id) {
        foundMsg = msg;
        return;
      }
    });
    return foundMsg;
  }
}

module.exports = ChatDAO;
