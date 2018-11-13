'use strict';

/**
 * Linebot.js controller
 *
 * @description: A set of functions called "actions" for managing `Linebot`.
 */

module.exports = {

  /**
   * Retrieve linebot records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.linebot.search(ctx.query);
    } else {
      return strapi.services.linebot.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a linebot record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.linebot.fetch(ctx.params);
  },

  /**
   * Retrieve a linebot record.
   *
   * @return {Object}
   */

  webhook: async (ctx) => {
    // console.log(ctx.request.body);

    Promise
      .all(ctx.request.body.events.map(strapi.services.linebot.handleEvent))
      .catch(function (err) {
        console.log("before then");
        console.log(err);
      })
      .then((result) => ctx.response.body = result)
      .catch(function (err) {
        console.log( "Something bad happens in webhook call");
        console.log(err);
        process.exit(1);
      });
  },

  /**
   * Count linebot records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.linebot.count(ctx.query);
  },

  /**
   * Create a/an linebot record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.linebot.add(ctx.request.body);
  },

  /**
   * Update a/an linebot record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.linebot.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an linebot record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.linebot.remove(ctx.params);
  }
};

