'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.post,{through:models.vote});
      user.belongsToMany(models.comment,{through:models.like});
      user.belongsToMany(models.post,{through:models.comment});
      user.hasMany(models.post,{foreignKey:"userId"})
    }
  };
  user.init({
    username: DataTypes.STRING,
    hashedpw: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};