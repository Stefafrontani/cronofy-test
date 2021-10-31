/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users_events', {
    id: 'id',
    profileId: {
      type: 'integer',
      notNull: true,
      references: '"profiles"',
      onDelete: 'cascade',
    },
    eventId: {
      type: 'integer',
      notNull: true,
      references: '"events"',
      onDelete: 'cascade',
    },
    status: {
      type: 'integer',
      notNull: true
    }
  });
};