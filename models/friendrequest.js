'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FriendRequest.init({
    fromName: DataTypes.STRING,
    fromId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FriendRequest',
  });
  return FriendRequest;
};