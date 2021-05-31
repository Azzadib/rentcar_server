import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

router.get('/alluser', IndexController.UserController.findAllUsers)
router.get('/:id', IndexController.UserController.findOneUser)
router.post('/signup', IndexController.UserController.existsEmail, IndexController.UserController.signUp)
router.post('/login', IndexController.UserController.existsEmail, IndexController.UserController.login)
router.put('/:id', IndexController.UserController.existsUser, IndexController.UserController.existsEmail, IndexController.UserController.updateUser)
router.put('/:id/:folder', IndexController.UserController.existsUser, IndexController.UploadController.fileUpload,
    IndexController.UserController.userAvatar)
router.delete('/:id', IndexController.UserController.existsUser, IndexController.UserController.deleteUser)
router.delete('/:avatar/:id', IndexController.UserController.existsUser, IndexController.UserController.deleteUserAvatar)
router.get('/signout', IndexController.UserController.signOut)

//* Download avatar
router.get('/:folder/download', IndexController.DownloadController.download)

export default router