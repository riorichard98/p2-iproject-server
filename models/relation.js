'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Relation.belongsTo(models.User,{foreignKey:'withId'})
    }
  }
  Relation.init({
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    withId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Relation',
  });
  return Relation;
};