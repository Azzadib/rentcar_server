import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

router.get('/', IndexController.CarImageController.findAllCarImage)
router.post('/:folder/:id', IndexController.CarController.findOneCarNum, IndexController.UploadController.fileUpload,
    IndexController.CarImageController.createCarImage, IndexController.CarController.findOneCar)
router.put('/:folder/:number', IndexController.CarController.findOneCarNum, IndexController.UploadController.fileUpload,
    IndexController.CarImageController.updateCarImage)
router.delete('/:id', IndexController.CarImageController.deleteCarImage)

//* Download image
router.get('/:folder/download', IndexController.DownloadController.download)

export default router