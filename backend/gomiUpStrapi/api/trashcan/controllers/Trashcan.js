'use strict';

/**
 * Trashcan.js controller
 *
 * @description: A set of functions called "actions" for managing `Trashcan`.
 */

module.exports = {

  /**
   * Retrieve trashcan records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.trashcan.search(ctx.query);
    } else {
      return strapi.services.trashcan.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a trashcan record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.trashcan.fetch(ctx.params);
  },

  /**
   * Retrieve a trashcan record's specific attribute.
   *
   * @return {Object}
   */

  findOneAttribute: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.trashcan.fetchAndGetAttribute(ctx.params);
  },

  /**
   * Count trashcan records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.trashcan.count(ctx.query);
  },

  /**
   * Create a/an trashcan record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.trashcan.add(ctx.request.body);
  },

  /**
   * Update a/an trashcan record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.trashcan.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an trashcan record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.trashcan.remove(ctx.params);
  }
};
