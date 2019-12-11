const constants = require('../../lib/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: constants.user_types.USER,
        validate: {
          isIn: [[constants.user_types.ADMIN, constants.user_types.USER]]
        }
      }
    },
    {
      underscored: true
    }
  );

  User.associate = models => {
    User.belongsToMany(models.album, {
      through: 'userAlbums',
      as: 'albums',
      foreignKey: 'userId',
      otherKey: 'albumId'
    });

    User.hasOne(models.token);
  };

  return User;
};
