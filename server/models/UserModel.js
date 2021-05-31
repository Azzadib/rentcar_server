const user = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(55),
      allowNull: false,
      unique: "users_user_email_key"
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    user_gender: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    user_avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "users_pkey",
          unique: true,
          fields: [
            { name: "user_id" },
          ]
        },
      ]
    })

  User.associate = models => {
    User.hasMany(models.CarComment, { foreignKey: 'carco_user_id', onDelete: 'CASCADE' })
    User.hasMany(models.Car, { foreignKey: 'car_user_id', onDelete: 'CASCADE' })
    User.hasMany(models.CarCart, { foreignKey: 'cart_user_id', onDelete: 'CASCADE' })
    User.hasMany(models.Order, { foreignKey: 'order_user_id', onDelete: 'CASCADE' })
  }

  return User
}

export default user