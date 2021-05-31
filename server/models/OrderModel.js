const order = (sequelize, DataTypes) => {
  const Order = sequelize.define('orders', {
    order_name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.fn('CONCAT', 'ORD', '', sequelize.literal("EXTRACT (YEAR FROM NOW() + INTERVAL '7 HOUR')"), sequelize.fn('LPAD', sequelize.fn('CONCAT', '', sequelize.literal("EXTRACT (MONTH FROM NOW() + INTERVAL '7 HOUR')")), 2, '0'), sequelize.fn('LPAD', sequelize.fn('CONCAT', '', sequelize.literal("EXTRACT (DAY FROM NOW() + INTERVAL '7 HOUR')")), 2, '0'), '-', sequelize.fn('lpad', sequelize.fn('concat', sequelize.literal("nextval('order_name_sequence')")), 4, '0'))
    },
    order_created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal("NOW() + INTERVAL '7 HOUR'")
    },
    order_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    order_tax: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    order_total_due: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    order_total_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    order_pay_trx_number: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    order_city: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    order_address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    order_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    order_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'orders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "orders_pkey",
        unique: true,
        fields: [
          { name: "order_name" },
        ]
      },
    ]
  })

  Order.associate = models => {
    Order.belongsTo(models.User, { foreignKey: 'order_user_id' })
  }

  return Order
}

export default order