'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vote.belongsTo(models.user,{foreignKey:"userId"});
      vote.belongsTo(models.post,{foreignKey:"postId"});
    }
  };
  vote.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    vote: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'vote',
  });
  return vote;
};