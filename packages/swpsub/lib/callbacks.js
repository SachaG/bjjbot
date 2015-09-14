function detectCategories (data) {

  var title = data.title.toLowerCase();
  var categories = Categories.find().fetch();
  var addedCategories = [];
  var excludedCategories = ["Positions", "Moves", "Role", "Type"];

  categories.forEach(function (category) {

    var name = category.name.toLowerCase();
    var nameInTitle = title.indexOf(name) !== -1;
    var aliasArray = category.alias && category.alias.split(",");

    var aliasInTitle = _.some(aliasArray, function (alias) {
      return title.indexOf(alias.toLowerCase()) !== -1;
    });

    // console.log(name)
    // console.log(nameInTitle)
    // console.log(aliasArray)
    // console.log(aliasInTitle)

    // if category name or one of its aliases is contained within post title
    if (nameInTitle || aliasInTitle) {

      // loop through parents and add them too, unless they're excluded or already in the array
      category.getParents().reverse().forEach(function (category) {
        if (!_.contains(excludedCategories, category.name) && !_.findWhere(addedCategories, {_id: category._id}) ) {
          addedCategories.push(category);
        }
      });

      // add current category to addedCategories
      addedCategories.push(category);

    }
  });


  // loop over all added categories and check their boxes and expand their menu tree
  addedCategories.forEach(function (category) {
    $("[value="+category._id+"]").prop("checked", true);
    // expand menu tree, except for root level categories which are always expanded
    $("[value="+category._id+"]").closest(".menu-item-wrapper").find(".menu-items-toggle").not(".toggle-expanded").click();
  });

  var $controls = $("[name=url").parents(".controls");
  var categoriesMarkup = addedCategories.map(function (category) {
    return "<li>"+category.name+"</li>";
  });
  $(".detected-categories").remove();
  $controls.append('<div class="detected-categories"><h4>Auto-detected the following categories:</h4><ul>'+categoriesMarkup.join("")+'</ul><p>(Scroll down to edit categories)</p></div>');

}
Telescope.callbacks.add("afterEmbedlyPrefill", detectCategories);

