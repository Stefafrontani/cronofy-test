/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    sub: {
      type: 'varchar(1000)',
      notNull: false
    },
    accessToken: {
      type: 'varchar(1000)',
      notNull: false
    },
    refreshToken: {
      type: 'varchar(1000)',
      notNull: false
    },
  })
};
