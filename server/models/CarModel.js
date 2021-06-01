const car = (sequelize, DataTypes) => {
  const Car = sequelize.define('cars', {
    car_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    car_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: "cars_car_number_key"
    },
    car_manufacturer: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    car_model: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    car_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    car_passenger: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    car_baggage: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    car_door: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    car_ac: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    car_type: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    car_description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    car_user_id: {
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
      tableName: 'cars',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "cars_pkey",
          unique: true,
          fields: [
            { name: "car_id" },
          ]
        },
      ]
    })

  Car.associate = models => {
    Car.hasMany(models.CarComment, { foreignKey: 'carco_car_id', onDelete: 'CASCADE' })
    Car.hasMany(models.CarImage, { foreignKey: 'caim_car_id', onDelete: 'CASCADE' })
    Car.hasMany(models.LineItem, { foreignKey: 'lite_car_id', onDelete: 'CASCADE' })
    Car.belongsTo(models.User, { foreignKey: 'car_user_id' })
  }

  return Car
}

export default car