const findLitebByCart = async (req, res, next) => {
    try {
        const cart = req.existscartid
        if (!cart) return res.status(404).send({ message: 'Can\'t get items from unknown cart.' })

        const lite = await req.context.models.LineItem.findAll(
            {
                where: { lite_cart_id: cart.cart_id }
            }
        )
        if (req.body.lite_status === undefined) return res.status(200).send(lite)
        req.proceedlite = lite
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find line item by cart ${error}.` })
    }
}

const findLitebByCar = async (req, res) => {
    try {
        const car = req.existscar
        if (!car) return res.status(404).send({ message: 'Can\'t get items of unknown car.' })

        const lite = await req.context.models.LineItem.findAll(
            {
                where: { lite_car_id: car.car_id }
            }
        )
        return res.status(200).send(lite)
    } catch (error) {
        return res.status(500).send({ message: `Find line item by car ${error}.` })
    }
}

const findLitebByCarNum = async (req, res) => {
    try {
        const car = req.existsnumber
        if (!car) return res.status(404).send({ message: 'Can\'t get items of unknown car.' })

        const lite = await req.context.models.LineItem.findAll(
            {
                where: { lite_car_id: car.car_id }
            }
        )
        return res.status(200).send(lite)
    } catch (error) {
        return res.status(500).send({ message: `Find line item by car number ${error}.` })
    }
}

const existsLiteID = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) return res.status(500).send({ message: 'Id of searched line item is null or has wrong type.' })

        const lite = await req.context.models.LineItem.findOne(
            {
                where: { lite_id: req.params.id }
            }
        )
        req.existsliteid = lite
        if (lite) req.params.id = lite.lite_car_id
        next()
    } catch (error) {
        return res.status(500).send({ message: `Check exists line item by ID ${error}.` })
    }
}

const existsLiteCC = async (req, res, next) => {
    try {
        const car = req.existsnumber
        if (!car) return res.status(404).send({ message: 'Car to be rent is not found.' })

        const cart = req.existscart
        if (!cart) return res.status(404).send({ message: 'Cart is not available.' })

        const lite = await req.context.models.LineItem.findOne(
            {
                where: {
                    lite_cart_id: cart.cart_id,
                    lite_car_id: car.car_id
                }
            }
        )
        req.existsliteCC = lite
        if (lite) req.params.id = lite.lite_car_id
        next()
    } catch (error) {
        return res.status(500).send({ message: `Check exists line item by car & cart ${error}.` })
    }
}

const createLite = async (req, res) => {
    try {
        const car = req.existsnumber
        if (!car) return res.status(404).send({ message: 'Car to be rent is not found.' })

        const cart = req.existscart
        if (!cart) return res.status(404).send({ message: 'Cart is not available.' })

        let { lite_days, lite_status } = req.body
        if (lite_days === undefined || isNaN(lite_days)) return res.status(400).send({ message: 'Rent duration is null or has wrong type.' })
        if (lite_days < 1) return res.status(400).send({ message: `Minimum rent days is 1 day. Found: ${lite_days}.` })
        if (lite_days > 14) return res.status(400).send({ message: `Can\'t rent each car more than 14 days. Found: ${lite_days} days.` })

        const lite_price = car.car_price * lite_days
        const lite_discount = lite_days > 2 ? (0.15 * lite_price) : 0

        if (lite_status === undefined) lite_status = 'cart'

        const lite = await req.context.models.LineItem.create(
            {
                lite_days: lite_days,
                lite_price: lite_price,
                lite_discount: lite_discount,
                lite_status: 'cart',
                lite_car_id: car.car_id,
                lite_cart_id: cart.cart_id
            }
        )
        if (!lite) return res.status(500).send({ message: 'Failed to add item to cart.' })
        return res.status(201).send(lite)
    } catch (error) {
        return res.status(500).send({ message: `Create line item ${error}.` })
    }
}

const editLiteCC = async (req, res, next) => {
    try {
        const car = req.existsnumber
        if (!car) return res.status(404).send({ message: 'Car to be rent is not found.' })

        const cart = req.existscart
        if (!cart) return res.status(404).send({ message: 'Cart is not available.' })

        const exists = req.existsliteCC

        if (exists) {
            const { lite_days } = req.body
            if (lite_days === undefined || isNaN(lite_days)) return res.status(400).send({ message: 'Rent duration is null or has wrong type.' })
            if (lite_days < 1) return res.status(400).send({ message: `Minimum rent days is 1 day. Found: ${lite_days}.` })
            if (lite_days > 14) return res.status(400).send({ message: `Can\'t rent each car more than 14 days. Found: ${lite_days} days.` })

            const lite_price = car.car_price * lite_days
            const lite_discount = lite_days > 2 ? (0.15 * lite_price) : 0


            const lite = await req.context.models.LineItem.update(
                {
                    lite_days: lite_days,
                    lite_price: lite_price,
                    lite_discount: lite_discount
                },
                {
                    returning: true, where: {
                        lite_cart_id: cart.cart_id,
                        lite_car_id: car.car_id
                    }
                }
            )
            if (!lite[0]) return res.status(500).send({ message: 'Failed to edit item.' })
            return res.status(201).send(lite[1][0])
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Update line item  by car & cart ${error}.` })
    }
}

const editLiteID = async (req, res) => {
    try {
        const oldLite = req.existsliteid
        if (!oldLite) return res.status(404).send({ message: 'Line item to be edited is not found.' })

        const car = req.existscar
        if (!car) return res.status(404).send({ message: 'Item can\'t be updated because car to be rent is not found.' })

        const { lite_days } = req.body
        if (lite_days === undefined || isNaN(lite_days)) return res.status(400).send({ message: 'Rent duration is null or has wrong type.' })
        if (lite_days < 1) return res.status(400).send({ message: `Minimum rent days is 1 day. Found: ${lite_days}.` })
        if (lite_days > 14) return res.status(400).send({ message: `Can\'t rent each car more than 14 days. Found: ${lite_days} days.` })

        const lite_price = car.car_price * lite_days
        const lite_discount = lite_days > 2 ? (0.15 * lite_price) : 0

        const newLite = await req.context.models.LineItem.update(
            {
                lite_days: lite_days,
                lite_price: lite_price,
                lite_discount: lite_discount
            },
            {
                returning: true, where: { lite_id: oldLite.lite_id }
            }
        )
        if (!newLite) return res.status(500).send({ message: 'Failed to update item.' })
        return res.status(201).send(newLite[1][0])
    } catch (error) {
        return res.status(500).send({ message: `Edit line item ${error}.` })
    }
}

const processLite = async (req, res, next) => {
    try {
        const notAvailable = req.isAvailable
        if (notAvailable) return res.status(404).send({ message: 'Selected car is not availabe for now.' })

        const checkout = req.proceedlite
        if (!checkout) return res.status(404).send({ message: 'Can\'t checkout empty cart.' })

        for (const item of checkout) {
            await setLiteProcess(req, res, item)
        }
        if (!req.orderdata) return res.status(201).send({ message: 'Checkout successful.' })
        next()
    } catch (error) {
        return res.status(500).send({ message: `Process lite ${error}.` })
    }
}

const setLiteProcess = async (req, res, item) => {
    try {
        const order = req.orderdata
        const lite_order_name = order ? order.order_name : null
        const { lite_status } = req.body
        const tocheckout = await req.context.models.LineItem.update(
            {
                lite_status: lite_status,
                lite_order_name: lite_order_name
            },
            {
                returning: true,
                where: { lite_id: item.lite_id }
            }
        )
        if (!tocheckout[0]) return res.status(500).send({ message: 'Failed to checkout.' })
    } catch (error) {
        return res.status(500).send({ message: `Set lite process ${error}.` })
    }
}

const deleteLiteID = async (req, res) => {
    try {
        const toDeleteLite = req.existsliteid
        if (!toDeleteLite) return res.status(404).send({ message: 'Item to be deleted is not found.' })

        await req.context.models.LineItem.destroy(
            {
                where: { lite_id: toDeleteLite.lite_id }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ message: 'Failed to delete item.' })
            res.status(201).send({ message: 'Item deleted.' })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete line item ${error}.` })
    }
}

export default {
    findLitebByCart,
    findLitebByCar,
    findLitebByCarNum,
    existsLiteID,
    existsLiteCC,
    createLite,
    editLiteCC,
    editLiteID,
    processLite,
    deleteLiteID,
}