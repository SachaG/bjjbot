var tabdown = Npm.require('tabdown');

/* -------------- Standard sub-categories -------------- */

var getCategoryTree = function () {
  var categoriesTxt = Assets.getText("categories/categories.txt");
  var categoriesArray = categoriesTxt.split("\n");
  var tree = tabdown.parse(categoriesArray, '\t');
  return tree;
};

var importCategories = function () {

  var root = getCategoryTree();

  var parseAndInsert = function parseAndInsert (node) {

    node.children.forEach(function (node, index) {
      
      // console.log(node)
      var nodeArray = node.data.split("|");
      var category = {
        name: nodeArray[0],
        order: index
      };

      if (nodeArray.length >= 2) {
        category.description = nodeArray[1];
      }

      if (nodeArray.length >= 3) {
        category.alias = nodeArray[2];
      }

      // look for an existing category with the same name
      var existingCategory = Categories.findOne({name: category.name});

      if (existingCategory) {

        // if it exists, update it
        console.log("// Category “"+category.name+"” already exists, updating…");
        Categories.update(existingCategory._id, {$set: category});
        node._id = existingCategory._id;

      } else {
        
        // if it doesn't, create it
        console.log("// Category “"+category.name+"” doesn't exist, creating…");
        if (node.parent && node.parent.data) {
          var parentCategory = Categories.findOne(node.parent._id);
          category.parentId = parentCategory._id;
          node.parentId = parentCategory._id;
        }

        // console.log(category)
        
        var categoryId = Categories.insert(category);
        node._id = categoryId;
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
  importCategories: function () {
    if (Users.is.admin(this.userId)) {
      console.log("// parsing & inserting categories…")
      // Categories.remove({});
      importCategories();
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