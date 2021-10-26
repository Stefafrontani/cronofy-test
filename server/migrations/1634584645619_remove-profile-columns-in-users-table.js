/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumns('users', [
    'providerName',
    'profileId',
    'profileName',
    'providerService']); 
};
