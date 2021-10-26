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
}