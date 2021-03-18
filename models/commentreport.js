'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      commentReport.belongsTo(models.comment,{foreignKey:"commentId"});
      commentReport.belongsTo(models.user,{foreignKey:"reportBy"});
    }
  };
  commentReport.init({
    reportBy: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'commentReport',
  });
  return commentReport;
};