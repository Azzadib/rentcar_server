import Sequelize from 'sequelize'
import { sequelize } from '../../config/config-db'
import car from './CarModel'
import carCart from './CarCartModel'
import carComment from './CarCommentModel'
import carImage from './CarImageModel'
import lineItem from './LineItemModel'
import order from './OrderModel'
import user from './UserModel'

const models = {
    Car: car(sequelize, Sequelize),
    CarCart: carCart(sequelize, Sequelize),
    CarComment: carComment(sequelize, Sequelize),
    CarImage: carImage(sequelize, Sequelize),
    LineItem: lineItem(sequelize, Sequelize),
    Order: order(sequelize, Sequelize),
    User: user(sequelize, Sequelize),
}

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) models[key].associate(models)
})

export default models