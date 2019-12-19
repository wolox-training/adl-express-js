module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'session',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
      userId: { allowNull: false, type: DataTypes.INTEGER, field: 'user_id', primaryKey: true }
    },
    {
      underscored: true,
      paranoid: true,
      timestamps: true
    }
  );

  Session.associate = models => {
    Session.belongsTo(models.user);
  };

  return Session;
};
