'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.hasMany(models.hotPost);
      post.hasMany(models.vote);
      post.hasMany(models.comment);
      post.belongsTo(models.user,{foreignKey:"userId"});
      post.belongsToMany(models.user,{through:models.postReport});
    }
  };
  post.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};