/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('events', {
    id: 'id',
    subscriptionCallbackUrl: {
      type: 'varchar(1000)',
      notNull: false
    },
    summary: {
      type: 'varchar(1000)',
      notNull: false
    },
    description: {
      type: 'varchar(1000)',
      notNull: false
    },
    start: {
      type: 'TIMESTAMP with time zone',
      notNull: false
    },
    end: {
      type: 'TIMESTAMP with time zone',
      notNull: false
    },
    status: {
      type: 'varchar(1000)',
      notNull: true,
      default: 'tentative'
    }
  });
};