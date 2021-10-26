SELECT
  u.id,
  u."accessToken",
  coalesce(
    (
      SELECT arary_to_json(array_agg(row_to_json(x)))
      FROM (
        SELECT p."userId", p."profileName"
        FROM users u
        INNER JOIN profiles p
        ON u.id = p."userId"
      ) X
    ),
    '[]'
  ) as profiles
FROM users u;

SELECT array_to_json(array_agg(row_to_json(x)))
  FROM (
    SELECT p."profileName"
    FROM users u
    JOIN profiles p
    ON u."id" = p."userId"
    WHERE u."id" = p."userId"
  ) x;


SELECT array_to_json(array_agg(b))
FROM (
  SELECT id, "accessToken"
  FROM users
  INNER JOIN profiles p
  ON p."userId" = u."id"
  WHERE p."userId" = u."id"
) b;


SELECT
  id,
  u."accessToken",
  (
    SELECT row_to_json(x)
    FROM (
      SELECT *
      FROM profiles p
      WHERE u."id" = p."userId"
    ) x
  ) AS profile
FROM users u;

SELECT
  id,
  u."accessToken",
  (
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT *
          FROM profiles p
          WHERE u.id = p."userId"
        ) x
      ),
      '[]'
    )
  ) AS profiles
FROM users u;

INSERT INTO profiles (id, "providerName", "profileId", "profileName", "providerService", "userId") VALUES (12, 'google', 'pro_YV3@8uKNwwH-RMjV', 'tech.stefanofrontani@gmail.com', 'google', 2);