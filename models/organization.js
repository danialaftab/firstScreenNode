'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    login: DataTypes.STRING,
    gravatar_id: DataTypes.STRING,
    url: DataTypes.STRING,
    avatar_url: DataTypes.STRING
  }, { timestamps: false});
  Organization.associate = function(models) {
    // associations can be defined here
  };
  return Organization;
};