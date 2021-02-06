const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req.query
  const requestQuery = {...req.query};

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from requestQuery
  removeFields.forEach(param => delete requestQuery[param]);

  //Create query String
  let queryStr = JSON.stringify(requestQuery);

  //Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = model.find(JSON.parse(queryStr)).populate('courses');

  //Select fields
  if(req.query.select) {
    const field = req.query.select.split(',').join(' ');
    query = query.select(field);
  }

  
  //Sort
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page-1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if(populate) {
    query = query.populate(populate);
  }

  //Executing our query
  const models = await query;

  //Paginatio result
  const pagination = {};
  if(endIndex<total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if(startIndex>0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.advancedResults = {
    success: true,
    count: models.length,
    pagination,
    data: models
  };

  next();
};

module.exports = advancedResults;