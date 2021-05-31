import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

router.get('/all', IndexController.CarCommentController.findAllComment)
router.get('/id/:id', IndexController.CarCommentController.findCommentByID)
router.get('/user/:id', IndexController.UserController.existsUser, IndexController.CarCommentController.findCommentByUser)
router.get('/car/:id', IndexController.CarController.findOneCarID, IndexController.CarCommentController.findCommentByCar)
router.post('/:id/:number', IndexController.UserController.existsUser, IndexController.CarController.findOneCarNum,
    IndexController.CarCommentController.createComment)
router.put('/:id/', IndexController.CarCommentController.existsComment, IndexController.CarCommentController.editComment)
router.delete('/:id', IndexController.CarCommentController.existsComment, IndexController.CarCommentController.deleteComment)

export default router