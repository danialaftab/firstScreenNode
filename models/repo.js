'use strict';
module.exports = (sequelize, DataTypes) => {
  const Repo = sequelize.define('Repo', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, { timestamps: false});
  Repo.associate = function(models) {
    // associations can be defined here
  };
  return Repo;
};