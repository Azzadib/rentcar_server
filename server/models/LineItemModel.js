const lineItem = (sequelize, DataTypes) => {
  const LineItem = sequelize.define('line_item', {
    lite_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    lite_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    lite_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    lite_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    lite_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    lite_car_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cars',
        key: 'car_id'
      }
    },
    lite_cart_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'car_carts',
        key: 'cart_id'
      }
    },
    lite_order_name: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  },
    {
      sequelize,
      tableName: 'line_item',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "line_item_pkey",
          unique: true,
          fields: [
            { name: "lite_id" },
          ]
        },
      ]
    })

  LineItem.associate = models => {
    LineItem.belongsTo(models.Car, { foreignKey: 'lite_car_id' })
    LineItem.belongsTo(models.CarCart, { foreignKey: 'lite_cart_id' })
  }

  return LineItem
}

export default lineItem