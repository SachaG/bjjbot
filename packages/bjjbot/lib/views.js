Telescope.callbacks.remove("postsParameters", "addCategoryParameter");

function addCategoryIntersectionParameter (parameters, terms) {
  // filter by category if category slugs are provided
  if (!!terms.cat) {

    var categoriesIds = [];
    var find = {};

    if (typeof terms.cat === "string") { // cat is a string
      find = {slug: terms.cat};
    } else { // cat is an array
      find = {slug: {$in: terms.cat}};
    }

    // get all categories passed in terms
    var categories = Categories.find(find).fetch();

    var categoriesIds = _.pluck(categories, "_id");

    parameters.find.categories = {$all: categoriesIds};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addCategoryIntersectionParameter);