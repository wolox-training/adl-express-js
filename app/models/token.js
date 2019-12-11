module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'token',
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true, unique: true },
      userId: { allowNull: false, type: DataTypes.INTEGER, field: 'user_id', primaryKey: true }
    },
    {
      underscored: true
    }
  );

  Token.associate = models => {
    Token.belongsTo(models.user);
  };

  return Token;
};
