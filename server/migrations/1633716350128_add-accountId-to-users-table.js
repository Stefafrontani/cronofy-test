/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('users', {
    accountId: {
      type: 'varchar(1000)',
      notNull: true
    }
  });
};
  
