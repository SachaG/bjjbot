Categories.addField([
{
  fieldName: 'alias',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["admin"]
  }
},
{
  fieldName: 'hasChildren',
  fieldSchema: {
    type: Boolean,
    optional: true,
    editableBy: ["admin"]
  }
}
]);