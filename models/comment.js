'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.user,{foreignKey:'userId'});
      comment.belongsTo(models.post,{foreignKey:'postId'});
      comment.belongsToMany(models.user,{through:models.commentReport});
      comment.belongsToMany(models.user,{through:models.like});
    }
  };
  comment.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};