/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('users', {
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
    }
  }); 
};
