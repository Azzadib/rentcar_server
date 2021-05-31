import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

router.get('/allcar', IndexController.CarController.findAllCar)
router.get('/:id', IndexController.CarController.findOneCarID)
router.get('/num/:number', IndexController.CarController.findOneCarNum)
router.post('/:folder/:number', IndexController.CarController.findOneCarNum, IndexController.UploadController.fileUpload,
    IndexController.CarController.createCar, IndexController.CarImageController.createCarImage, IndexController.CarController.findOneCar)
router.put('/:id', IndexController.CarController.findOneCarID, IndexController.CarController.updateCar)
router.delete('/:id', IndexController.CarController.findOneCarID, IndexController.CarController.deleteCar)

export default router