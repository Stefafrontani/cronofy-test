/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('profiles', {
    id: 'id',
    providerName: {
      type: 'varchar(1000)',
      notNull: false
    },
    profileId: {
      type: 'varchar(1000)',
      notNull: false
    },
    profileName: {
      type: 'varchar(1000)',
      notNull: false
    },
    providerService: {
      type: 'varchar(1000)',
      notNull: false
    },
    userId: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });
};
