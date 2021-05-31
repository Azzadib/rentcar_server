const carImage = (sequelize, DataTypes) => {
  const CarImage = sequelize.define('car_images', {
    caim_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    caim_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    caim_filesize: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    caim_filetype: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    caim_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    caim_car_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cars',
        key: 'car_id'
      }
    }
  },
    {
      sequelize,
      tableName: 'car_images',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "car_images_pkey",
          unique: true,
          fields: [
            { name: "caim_id" },
          ]
        },
      ]
    })

  CarImage.associate = models => {
    CarImage.belongsTo(models.Car, { foreignKey: 'caim_car_id' })
  }

  return CarImage
}

export default carImage