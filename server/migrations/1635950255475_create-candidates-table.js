/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('candidates', {
    id: 'id',
    email: {
      type: 'varchar(1000)',
      notNull: false
    },
    status: {
      type: 'varchar(1000)',
      notNull: false,
      default: 'tentative'
    }
  });
};
