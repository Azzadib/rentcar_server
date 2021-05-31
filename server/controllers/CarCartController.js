import { sequelize } from '../../config/config-db'

const findCartByUser = async (req, res) => {
    try {
        const user = req.existsuser
        if (!user) return res.status(404).send({ message: 'Customer not found.' })

        const cart = await req.context.models.CarCart.findAll(
            {
                where: { cart_user_id: user.user_id }
            }
        )
        return res.status(200).send(cart)
    } catch (error) {
        return res.status(500).send({ message: `Find cart by user ${error}.` })
    }
}

const existsCartID = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) return res.status(400).send({ message: 'ID of searched cart is null or has wrong type.' })
        const cart = await req.context.models.CarCart.findOne(
            {
                where: { cart_id: req.params.id }
            }
        )
        req.existscartid = cart
        next()
    } catch (error) {
        return res.status(500).send({ message: `Exists cart ID ${error}.` })
    }
}

const existsCartUser = async (req, res, next) => {
    try {
        const user = req.existsuser
        if (!user) return res.status(404).send({ message: 'Customer not found.' })
        const cart = await req.context.models.CarCart.findOne(
            {
                where: {
                    cart_user_id: user.user_id,
                    cart_status: 'open'
                }
            }
        )
        req.existscartuser = cart
        next()
    } catch (error) {
        return res.status(500).send({ message: `Exists cart user ${error}.` })
    }
}

const createCart = async (req, res, next) => {
    try {
        let cart = req.existscartuser
        const user = req.existsuser
        if (!cart) {
            cart = await req.context.models.CarCart.create(
                {
                    cart_status: 'open',
                    cart_user_id: user.user_id
                }
            )
            if (!cart) return res.status(500).send({ message: 'Failed to create new cart.' })
        }
        req.existscart = cart
        next()
    } catch (error) {
        return res.status(500).send({ message: `Create cart ${error}.` })
    }
}

const cartSummary = async (req, res, next) => {
    try {
        const cart = req.existscartid
        if (!cart) return res.status(404).send({ message: 'Can\'t show data of unknown cart.' })

        const { order_city } = req.body

        const summary = await sequelize.query(
            'SELECT lite_cart_id, lite_status, COUNT(lite_car_id) AS "total_car", SUM(lite_price) AS "total_due", SUM(lite_days) AS "total_days", SUM(lite_discount) AS "total_discount" FROM line_item WHERE (lite_cart_id = :cartId) GROUP BY lite_cart_id, lite_status',
            {
                replacements: { cartId: parseInt(cart.cart_id) },
                type: sequelize.QueryTypes.SELECT
            }
        )
        if (!order_city) return res.status(200).send(summary[0])
        req.summary = summary[0]
        next()
    } catch (error) {
        return res.status(500).send({ message: `Show sum in cart ${error}.` })
    }
}

const closeCart = async (req, res, next) => {
    try {
        const closed = await req.context.models.CarCart.update(
            { cart_status: 'closed' },
            {
                returning: true,
                where: { cart_id: req.params.id }
            }
        )
        if (!closed) return res.status(500).send({ message: 'Failed to close cart.' })
        next()
    } catch (error) {
        return res.status(500).send({ message: `Close cart ${error}.` })
    }
}

export default {
    findCartByUser,
    existsCartUser,
    existsCartID,
    createCart,
    cartSummary,
    closeCart
}