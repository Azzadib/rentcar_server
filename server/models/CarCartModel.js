const carCart = (sequelize, DataTypes) => {
  const CarCart = sequelize.define('car_carts', {
    cart_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cart_created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_DATE')
    },
    cart_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    cart_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  },
    {
      sequelize,
      tableName: 'car_carts',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "car_carts_pkey",
          unique: true,
          fields: [
            { name: "cart_id" },
          ]
        },
      ]
    })

  CarCart.associate = models => {
    CarCart.hasMany(models.LineItem, { foreignKey: 'lite_cart_id', onDelete: 'CASCADE' })
    CarCart.belongsTo(models.User, { foreignKey: 'cart_user_id' })
  }

  return CarCart
}

export default carCart