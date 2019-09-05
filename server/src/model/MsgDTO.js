'use strict';

/**
 * A message in the chat conversation.
 */
class MsgDTO {
  /**
   * Creates a new instance.
   *
   * @param {number} id The id of the newly created instance. This property
   *                    will be automatically generated when a new message is
   *                    created. Any value specified when creating a new
   *                    message will be ignored.
   * @param {number} authorId The id of the user who submitted the message.
   * @param {string} msg The message content.
   * @param {string} deletedAt The time when the msg with the specified id was
   *                           deleted, if it is deleted. This property will be
   *                           set automatically when a msg is deleted.
   */
  constructor(id, authorId, msg, deletedAt) {
    this.id = id;
    this.authorId = authorId;
    this.msg = msg;
    this.deletedAt = deletedAt;
  }
}

module.exports = MsgDTO;
