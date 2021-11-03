/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.alterColumn('users_events', "status", {
    type: 'varchar(1000)'
  });
};