import fs from 'fs'
import path from 'path'

const photoDir = process.cwd() + '/images'

const listPassenger = [2, 3, 5, 8, 10]
const listDoor = [2, 4, 5]
const listType = ['Sedan', 'SUV', 'Truck']
const listStatus = ['Open', 'Leased']

const findAllCar = async (req, res) => {
    try {
        const cars = await req.context.models.Car.findAll(
            {
                include: [
                    { model: req.context.models.CarImage }
                ],
                order: [
                    ['car_manufacturer', 'ASC'],
                    ['car_model', 'ASC'],
                    ['car_number', 'ASC'],
                ],
            }
        )
        return res.status(200).send(cars)
    } catch (error) {
        return res.status(500).send({ message: `Find all car ${error}.` })
    }
}

const findOneCar = async (req, res) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                    { model: req.context.models.LineItem }
                ],
                where: { car_id: req.params.id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car not found.' })
        return res.status(200).send(car)
    } catch (error) {
        return res.status(500).send({ message: `Find one car ${error}.` })
    }
}

const findOneCarID = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                where: { car_id: req.params.id }
            }
        )
        req.existscar = car
        if (car) {
            req.params.id = car.car_id
            req.number = car.car_number
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find one car ID ${error}.` })
    }
}

const findOneCarNum = async (req, res, next) => {
    try {
        if (req.params.id !== undefined && req.params.number === undefined) req.params.number = req.params.id
        if (req.params.number === undefined || !req.params.number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) res.status(400).send({ message: 'ID of searched car is null or has wrong type.' })
        const car = await req.context.models.Car.findOne(
            {
                include: [
                    { model: req.context.models.CarImage },
                    { model: req.context.models.CarComment },
                    { model: req.context.models.LineItem }
                ],
                where: { car_number: req.params.number }
            }
        )
        if ((req.params.folder === undefined || req.number !== undefined) && (req.body.carco_comment == undefined || req.body.carco_rating === undefined) && req.body.lite_days === undefined) return res.status(200).send(car)
        req.existsnumber = car
        if (car) {
            req.params.id = car.car_id
            req.params.number = car.car_number
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find one car number ${error}.` })
    }
}

const createCar = async (req, res, next) => {
    try {
        if (req.existsnumber) return res.status(400).send({ message: 'Car number already exists.' })
        let { car_manufacturer, car_model, car_price, car_passenger, car_baggage, car_door, car_ac, car_type, car_status, car_user_id, car_description } = req.dataUploaded.fields

        const car_number = req.params.number
        if (!car_number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) return res.status(400).send({ message: 'Car number format is wrong.' })

        if (isNaN(car_price)) return res.status(400).send({ message: `Price should be a number. Found: ${car_price}.` })
        if (car_price < 0) return res.status(400).send({ message: `Price should be a positive number.  Found: ${car_price}.` })

        if (isNaN(car_passenger)) return res.status(400).send({ message: `Passenger should be a number. Found: ${car_passenger}.` })
        car_passenger = parseInt(car_passenger)
        if (listPassenger.indexOf(car_passenger) === -1) return res.status(400).send({ message: `Passenger only accept 2, 3, 5, 8 or 10 as value. Found: ${car_passenger}.` })

        car_baggage = parseInt(car_baggage)
        if (car_baggage !== 0 && car_baggage !== 1) return res.status(400).send({ message: `Baggage should be 0 or 1. Found: ${car_baggage}.` })

        if (isNaN(car_door)) return res.status(400).send({ message: `Door should be a number. Found: ${car_door}.` })
        car_door = parseInt(car_door)
        if (listDoor.indexOf(car_door) === -1) return res.status(400).send({ message: `Door only accept 2, 4 or 5 as value. Found: ${car_door}.` })

        car_ac = parseInt(car_ac)
        if (car_ac !== 0 && car_ac !== 1) return res.status(400).send({ message: `Ac should be 0 or 1. Found: ${car_ac}.` })

        if (!car_type) return res.status(400).send({ message: 'Type can\'t be null.' })
        if (listType.indexOf(car_type) === -1) return res.status(400).send({ message: `Type only accept Sedan, SUV or Truck as value. Found: ${car_type}.` })

        if (!car_status) return res.status(400).send({ message: 'Status can\'t be null.' })
        if (listStatus.indexOf(car_status) === -1) return res.status(400).send({ message: `Status only accept Open or Leased as value. Found: ${car_status}.` })

        const car = await req.context.models.Car.create(
            {
                car_number: car_number,
                car_manufacturer: car_manufacturer,
                car_model: car_model,
                car_price: car_price,
                car_passenger: car_passenger,
                car_baggage: car_baggage,
                car_door: car_door,
                car_ac: car_ac,
                car_type: car_type,
                car_status: car_status,
                car_description: car_description,
                car_user_id: car_user_id
            }
        )
        if (!car.car_id) return res.status(500).send({ message: 'Failed to create car.' })

        req.params.id = car.car_id
        req.params.number = car.car_number
        next()
    } catch (error) {
        return res.status(500).send({ message: `Create car ${error}` })
    }
}

const updateCar = async (req, res) => {
    try {
        const oldCar = req.existscar
        if (!oldCar) return res.status(404).send({ message: 'Car to be updated not found.' })

        if (isNaN(req.params.id) || req.params.id < 0) return res.status(400).send({ message: 'ID of the car to be updated is null or has wrong type.' })
        let { car_manufacturer, car_model, car_price, car_passenger, car_baggage, car_door, car_ac, car_type, car_status, car_description, car_user_id } = req.body

        if (!car_manufacturer) car_manufacturer = oldCar.car_manufacturer
        if (!car_model) car_model = oldCar.car_model

        if (car_price === undefined) car_price = oldCar.car_price
        if (isNaN(car_price) || car_price < 0) res.status(400).send({ message: `Price should be a positive number. Found: ${car_price}.` })

        if (car_passenger === undefined) car_passenger = oldCar.car_passenger
        if (listPassenger.indexOf(car_passenger) === -1) return res.status(400).send({ message: `Passenger only accept 2, 3, 5, 8 or 10 as value. Found: ${car_passenger}.` })

        if (car_baggage === undefined) car_baggage = oldCar.car_baggage
        else if (car_baggage !== 0 && car_baggage !== 1) return res.status(400).send({ message: `Baggage should be 0 or 1. Found: ${car_baggage}.` })

        if (car_door === undefined) car_door = oldCar.car_door
        if (listDoor.indexOf(car_door) === -1) return res.status(400).send({ message: `Door only accept 2, 4 or 5 as value. Found: ${car_door}.` })

        if (car_ac === undefined) car_ac = oldCar.car_ac
        else if (car_ac !== 0 && car_ac !== 1) return res.status(400).send({ message: `Ac should be 0 or 1. Found: ${car_ac}.` })

        if (car_type === undefined) car_type = oldCar.car_type
        if (listType.indexOf(car_type) === -1) return res.status(400).send({ message: `Type only accept Sedan, SUV or Truck as value. Found: ${car_type}.` })

        if (car_status === undefined) car_status = oldCar.car_status
        if (listStatus.indexOf(car_status) === -1) return res.status(400).send({ message: `Status only accept Open or Leased as value. Found: ${car_status}.` })

        if (car_description === undefined) car_description = oldCar.car_description

        const newCar = await req.context.models.Car.update(
            {
                car_manufacturer: car_manufacturer,
                car_model: car_model,
                car_price: car_price,
                car_passenger: car_passenger,
                car_baggage: car_baggage,
                car_door: car_door,
                car_ac: car_ac,
                car_type: car_type,
                car_status: car_status,
                car_description: car_description,
                car_user_id: car_user_id
            },
            {
                returning: true, where: { car_id: req.params.id }
            }
        )
        if (!newCar[0]) return res.status(500).send({ message: 'Failed to update car.' })
        return res.status(201).send(newCar[1][0])
    } catch (error) {
        return res.status(500).send({ message: `Update car ${error}.` })
    }
}

let notAvailable = []
const carAvailable = async (req, res, next) => {
    try {
        const selectedCar = req.proceedlite
        if (!selectedCar) return res.status(404).send({ message: 'Can\'t order unknown car.' })

        for (const item of selectedCar) {
            await checkAvailable(req, res, item)
        }
        req.isAvailable = notAvailable.length
        next()
    } catch (error) {
        return res.status(500).send({ message: `Car available ${error}.` })
    }
}

const checkAvailable = async (req, res, item) => {
    try {
        const car = await req.context.models.Car.findOne(
            {
                where: { car_id: item.lite_car_id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car to be rent not found.' })
        if (car.car_user_id !== null) notAvailable.push(car.car_id)
    } catch (error) {
        return res.status(500).send({ message: `Check available ${error}.` })
    }
}

const rentCar = async (req, res) => {
    try {
        const order = req.orderdata
        const selectedCar = req.proceedlite
        if (!selectedCar) return res.status(404).send({ message: 'Can\'t order unknown car.' })

        for (const item of selectedCar) {
            await setNotAvailable(req, res, item, order)
        }
        return res.status(201).send(order)
    } catch (error) {
        return res.status(500).send({ message: `Rent car ${error}.` })
    }
}

const setNotAvailable = async (req, res, item, order) => {
    try {
        const car = await req.context.models.Car.update(
            { car_user_id: order.order_user_id },
            {
                returning: true,
                where: { car_id: item.lite_car_id }
            }
        )
        if (!car) return res.status(404).send({ message: 'Car to be rent not found.' })
    } catch (error) {
        return res.status(500).send({ message: `Set not available ${error}.` })
    }
}

const deleteCar = async (req, res) => {
    try {
        const toDeleteCar = req.existscar
        if (!toDeleteCar) res.status(404).send({ message: 'Car to be deleted not found.' })

        await req.context.models.Car.destroy(
            {
                where: { car_id: toDeleteCar.car_id }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ message: 'Failed to delete Car.' })
            if (fs.existsSync(path.join(photoDir + '/cardata' + `/${toDeleteCar.car_number}/`))) fs.rmdirSync(path.join(photoDir + '/cardata' + `/${toDeleteCar.car_number}/`), { recursive: true })
            res.status(200).send({ message: 'Car deleted.' })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete car ${error}.` })
    }
}

export default {
    findAllCar,
    findOneCar,
    findOneCarID,
    findOneCarNum,
    createCar,
    updateCar,
    carAvailable,
    rentCar,
    deleteCar,
}