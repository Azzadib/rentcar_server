const carComment = (sequelize, DataTypes) => {
  const CarComment = sequelize.define('car_comments', {
    carco_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    carco_comment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    carco_created_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_DATE')
    },
    carco_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carco_car_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cars',
        key: 'car_id'
      }
    },
    carco_user_id: {
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
      tableName: 'car_comments',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "car_comments_pkey",
          unique: true,
          fields: [
            { name: "carco_id" },
          ]
        },
      ]
    })

  CarComment.associate = models => {
    CarComment.belongsTo(models.User, { foreignKey: 'carco_user_id' })
    CarComment.belongsTo(models.Car, { foreignKey: 'carco_car_id' })
  }

  return CarComment
}

export default carComment