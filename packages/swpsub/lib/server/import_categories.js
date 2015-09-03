var tabdown = Npm.require('tabdown');

/* -------------- Standard sub-categories -------------- */

var topGuardCategories = ["Concepts & Grips", "Passes", "Submissions", "Transitions"];
var bottomGuardCategories = ["Concepts & Grips", "Sweeps", "Submissions", "Transitions"];
var positions = ["Side Control", "Mount", "Back", "Crucifix","Other Positions"];
var topPositionCategories = ["Concepts & Grips", "Submissions", "Transitions"];
var bottomPositionCategories = ["Concepts & Grips", "Escapes", "Submissions", "Transitions"];
var submissions = ["Armlocks", "Leglocks", "Chokes", "Gi Chokes"];

var getCategoryTree = function () {
  var categoriesTxt = Assets.getText("categories/categories.txt");
  var categoriesArray = categoriesTxt.split("\n");
  var tree = tabdown.parse(categoriesArray, '\t');
  return tree;
};

var insertCategories = function () {

  var root = getCategoryTree();

  var parseAndInsert = function parseAndInsert (node) {

    node.children.forEach(function (node, index) {
      
      var category = {
        name: node.data, 
        order: index
      };

      if (node.parent && node.parent.data) {
        var parentCategory = Categories.findOne(node.parent._id);
        category.parentId = parentCategory._id;
        node.parentId = parentCategory._id;
      }

      var categoryId = Categories.insert(category);
      node._id = categoryId;

      // Guards
      if (node.parent && node.parent.data && node.parent.data === "Guard") {
        // if we're in a “guard” category, insert top & bottom along with their subcategories
        var topId = Categories.insert({name: "Top", parentId: categoryId});
        var bottomId = Categories.insert({name: "Bottom", parentId: categoryId});
        topGuardCategories.forEach(function (category) {
          Categories.insert({name: category, parentId: topId});
        });
        bottomGuardCategories.forEach(function (category) {
          Categories.insert({name: category, parentId: bottomId});
        });
      }

      // Positions
      if (_.contains(positions, category.name)) {
        var topId = Categories.insert({name: "Top", parentId: categoryId});
        var bottomId = Categories.insert({name: "Bottom", parentId: categoryId});
        topPositionCategories.forEach(function (category) {
          Categories.insert({name: category, parentId: topId});
        });
        bottomPositionCategories.forEach(function (category) {
          Categories.insert({name: category, parentId: bottomId});
        });
      }

      // Submissions
      if (node.parent && node.parent.data && _.contains(submissions, node.parent.data)) {
        Categories.insert({name: "Attack", parentId: categoryId});
        Categories.insert({name: "Defense", parentId: categoryId});
      }

      node.inserted = true;

      if (node.children) {
        parseAndInsert(node);
      }

    });
  }(root);

};

Meteor.startup(function () {
 
});

Meteor.methods({
  getCategoryTree: function () {
    // we need to filter out any circular reference
    return JSON.parse(JSON.stringify( getCategoryTree(), function(key, value) {
      if( key === 'parent') { 
        return value && value.data;
      } else {
        return value;
      }
    }));
  },
  insertCategories: function () {
    if (Users.is.admin(this.userId)) {
      Categories.remove({});
      insertCategories();
    }
  }
});


// def _recurse_tree(parent, depth, source):
//     last_line = source.readline().rstrip()
//     while last_line:
//         tabs = last_line.count('\t')
//         if tabs < depth:
//             break
//         node = last_line.strip()
//         if tabs >= depth:
//             if parent is not None:
//                 print "%s: %s" %(parent, node)
//             last_line = _recurse_tree(node, tabs+1, source)
//     return last_line

// inFile = open("test.txt")
// _recurse_tree(None, 0, inFile)