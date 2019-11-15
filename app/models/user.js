module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      underscored: true
    }
  );

  return User;
};
