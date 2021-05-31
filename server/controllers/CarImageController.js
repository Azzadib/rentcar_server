import fs, { existsSync } from 'fs'
import path from 'path'

const photoDir = process.cwd() + '/images'

const findAllCarImage = async (req, res) => {
    try {
        const carImages = await req.context.models.CarImage.findAll()
        return res.status(200).send(carImages)
    } catch (error) {
        return res.status(500).send({ message: `Find all car image ${error}.` })
    }
}

const createCarImage = async (req, res, next) => {
    try {
        const { images } = req.dataUploaded
        if (req.params.id === undefined || isNaN(req.params.id)) return res.status(400).send({ message: 'ID of image owner is null or has wrong type.' })
        if (!req.params.number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) if (existsSync(path.join(photoDir + `/avatar` + `/${req.number}` + `/${images[0].fileName}`))) fs.unlinkSync(path.join(photoDir + `/avatar` + `/${req.number}` + `/${images[0].fileName}`))

        const imageOwner = await req.context.models.Car.findOne(
            {
                where: { car_id: req.params.id }
            }
        )

        for (const data of images) {
            await writeTable(req, res, data, imageOwner.car_id)
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: `Create car image ${error}.` })
    }
}

const writeTable = async (req, res, data, car_id) => {
    try {
        if (req.car_id !== undefined) car_id = req.car_id
        const { key, fileName, fileSize, fileType } = data
        if (fileType.split('/')[0] === 'image') {
            const carimage = await req.context.models.CarImage.create(
                {
                    caim_filename: fileName,
                    caim_filesize: fileSize,
                    caim_filetype: fileType,
                    caim_primary: parseInt(key),
                    caim_car_id: car_id
                }
            )
            if (!carimage) return res.status(500).send({ message: 'Failed to update car image.' })
        }
    } catch (error) {
        return res.status(500).send({ message: `Write table car image ${error}.` })
    }
}

const updateCarImage = async (req, res) => {
    try {
        if (req.params.number === undefined || !req.params.number.match(/^[A-Z]+([0-9]+)([A-Z]+){2}$/)) return res.status(400).send({ message: 'ID of image owner is null or has wrong type.' })
        const { images } = req.dataUploaded
        if (parseInt(images[0].key) !== 1) return res.status(400).send({ message: 'Only primary image can edited. Use add image to add more secondary image.' })
        const imageOwner = req.existsnumber
        if (!imageOwner) return res.status(404).send({ message: 'Car image owner not found.' })

        const oldImg = await req.context.models.CarImage.findOne({
            where: {
                caim_car_id: imageOwner.car_id,
                caim_primary: true
            }
        })
        if (oldImg) fs.unlinkSync(path.join(photoDir + '/cardata' + `/${imageOwner.car_number}/` + oldImg.caim_filename))

        for (const data of images) {
            await updateTable(req, res, data, imageOwner.car_id, oldImg.caim_id)
        }
    } catch (error) {
        return res.status(500).send({ message: `Update car image ${error}.` })
    }
}

const updateTable = async (req, res, data, car_id, caim_id) => {
    try {
        const { key, fileName, fileSize, fileType } = data
        if (fileType.split('/')[0] === 'image') {
            const newcarimage = await req.context.models.CarImage.update(
                {
                    caim_filename: fileName,
                    caim_filesize: fileSize,
                    caim_filetype: fileType,
                    caim_primary: parseInt(key),
                    caim_car_id: car_id
                },
                {
                    returning: true, where: { caim_id: caim_id }
                }
            )
            if (!newcarimage) return res.status(500).send({ message: 'Failed to update car image.' })
            return res.status(201).send({ message: 'Car image updated.' })
        }
    } catch (error) {
        return res.status(500).send({ message: `Update table car image ${error}.` })
    }
}

const deleteCarImage = async (req, res) => {
    try {
        const imageOwner = await req.context.models.Car.findOne(
            {
                where: { car_id: req.params.id }
            }
        )
        if (!imageOwner) return res.status(400).send({ message: 'Image owner not found.' })
        const exists = await req.context.models.CarImage.findOne(
            {
                where: {
                    caim_car_id: req.params.id,
                    caim_filename: req.body.filename
                }
            }
        )
        if (!exists) return res.status(400).send({ message: 'Car image to deleted is not exists.' })

        await req.context.models.CarImage.destroy(
            {
                where: {
                    caim_car_id: req.params.id,
                    caim_filename: req.body.filename
                }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ message: 'Failed to delete message.' })
            if (fs.existsSync(path.join(photoDir + '/cardata' + `/${imageOwner.car_number}/` + req.body.filename))) fs.unlinkSync(path.join(photoDir + '/cardata' + `/${imageOwner.car_number}/` + req.body.filename))
            return res.status(200).send({ message: 'Image deleted.' })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete car ${error}.` })
    }
}

export default {
    findAllCarImage,
    createCarImage,
    updateCarImage,
    deleteCarImage,
}