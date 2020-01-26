'use strict';
module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define('Actor', {
    login: DataTypes.STRING,
    display_login: DataTypes.STRING,
    gravatar_id: DataTypes.STRING,
    url: DataTypes.STRING,
    avatar_url: DataTypes.STRING
  }, { timestamps: false});
  Actor.associate = function(models) {
    // associations can be defined here
  };
  return Actor;
};