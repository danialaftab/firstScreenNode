'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    type: DataTypes.STRING,
    actor_id: DataTypes.INTEGER,
    repo_id: DataTypes.INTEGER,
    payload: DataTypes.TEXT('long'),
    public: DataTypes.BOOLEAN,
    created_at: DataTypes.TEXT,
    organization_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  
  Event.associate = function(models) {
    Event.belongsTo(models.Actor, {
      foreignKey: 'actor_id',
      as : 'actor'
    })

    Event.belongsTo(models.Repo, {
      foreignKey: 'repo_id',
      as : 'repo'
    })

    Event.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      as : 'org'
    })
  };
  return Event;
};