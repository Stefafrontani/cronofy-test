const returnArrayOfJson = (query) => (
  `coalesce(
    (
      SELECT array_to_json(array_agg(row_to_json(x)))
      FROM (${query}) x
    ),
    '[]'
  )`
)

module.exports = {
  returnArrayOfJson
};

/**
 * 
 * EXAMPLES WHEN RETRIEVING COMPLEX STRUCTURES
  // const response = await pool.query(
  //   `
  //     SELECT
  //       "id",
  //       (
  //         SELECT array_to_json(array_agg(row_to_json(x)))
  //         FROM (
  //           SELECT p."profileName"
  //           FROM profiles p
  //           INNER JOIN users u
  //           ON u.id = p."userId"
  //         ) x
  //       ) as profiles
  //     FROM users u
  //   ;`
  // );

  // SELECT row_to_json(x) from (SELECT id, "accessToken" FROM users) x; ::  (many records each containing one value)
  //  {"id":2,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"}
  //  {"id":3,"accessToken":"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS"}
  //  {"id":1,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"}
  //  {"id":6,"accessToken":"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t"}

  // SELECT array_agg(row_to_json(x)) from (SELECT id, "accessToken" FROM users) x;  ::  (one record back containing an Array of values, instead of many records each containing one value)
  // {
  //   "{\"id\":2,\"accessToken\":\"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR\"}",
  //   "{\"id\":3,\"accessToken\":\"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS\"}",
  //   "{\"id\":1,\"accessToken\":\"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR\"}",
  //   "{\"id\":6,\"accessToken\":\"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t\"}"
  // }

  // SELECT array_to_json(array_agg(row_to_json(x))) from (SELECT id, "accessToken" FROM users) x;
  // [
  //   {"id":2,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"},
  //   {"id":3,"accessToken":"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS"},
  //   {"id":1,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"},
  //   {"id":6,"accessToken":"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t"}
  // ]
 */