/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('candidates_events', {
    id: 'id',
    candidateId: {
      type: 'integer',
      notNull: true,
      references: '"candidates"',
      onDelete: 'cascade',
    },
    eventId: {
      type: 'integer',
      notNull: true,
      references: '"events"',
      onDelete: 'cascade',
    },
    status: {
      type: 'varchar(1000)',
      notNull: true,
      default: 'tentative'
    }
  });
};