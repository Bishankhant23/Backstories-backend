export function pagination(pageQuery, limitQuery, defaultLimit = 10) {
  let page = parseInt(pageQuery);
  let limit = parseInt(limitQuery);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = defaultLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}