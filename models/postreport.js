'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class postReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      postReport.belongsTo(models.user,{foreignKey:"reportBy"});
      postReport.belongsTo(models.post,{foreignKey:"postId"});
    }
  };
  postReport.init({
    reportBy: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'postReport',
  });
  return postReport;
};