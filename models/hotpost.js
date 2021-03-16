'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hotPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      hotPost.belongsTo(models.post,{foreignKey:"postId"});
    }
  };
  hotPost.init({
    date: DataTypes.DATE,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hotPost',
  });
  return hotPost;
};