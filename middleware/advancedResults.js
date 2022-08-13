// Example:
// advancedResults(Educator, 'students')
const advancedResults = (model, populate) => async (req, res, next) => {

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // *****STUDY***** Fields to exclude        
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // *****STUDY***** For each removeFields parameter, delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // *****STUDY***** Create query string
    let queryStr = JSON.stringify(reqQuery)

    // *****STUDY***** Create operators ($gt, $gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // *****STUDY***** Finding resource
    query = model.find(JSON.parse(queryStr));

    // *****STUDY***** Select Fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // *****STUDY***** Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    // *****STUDY***** Second param here is radix. Read up on radix!!
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Population
        // Mongoose .populate():
        // This does not mutate our persistent data
        // It is a getter which is combining fields for us
        // Here, at the .populate() method, we are going 
        // to the path: of ex: 'bootcamp' and selecting
        // the name and description of the bootcamp 
        // associated with that particular course.
    if(populate) {
        query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    // Pagination result

    // Init empty object
    const pagination = {};

    if(endIndex < total) {
        // Populate object
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        // Populate object
        pagination.prev ={
            page: page -1,
            limit
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;