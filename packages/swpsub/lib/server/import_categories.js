var tabdown = Npm.require('tabdown');

/* -------------- Standard sub-categories -------------- */

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
      
      console.log(node)

      var category = {
        name: node.data.split("|")[0],
        description: node.data.split("|")[1],
        order: index
      };

      if (node.parent && node.parent.data) {
        var parentCategory = Categories.findOne(node.parent._id);
        category.parentId = parentCategory._id;
        node.parentId = parentCategory._id;
      }

      console.log(category)
      
      var categoryId = Categories.insert(category);
      node._id = categoryId;

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
      console.log("// parsing & inserting categories…")
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