module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'album',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
      title: { type: DataTypes.STRING, allowNull: false }
    },
    {
      underscored: true
    }
  );

  return User;
};
