import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

//* Handle item in cart
router.get('/bycart/:id', IndexController.CarCartController.existsCartID, IndexController.LineItemController.findLitebByCart)
router.get('/bycar/:id', IndexController.CarController.findOneCarID, IndexController.LineItemController.findLitebByCar)
router.get('/bynum/:number', IndexController.CarController.findOneCarNum, IndexController.LineItemController.findLitebByCarNum)

router.post('/tocart/:id/:number',
    IndexController.UserController.existsUser, IndexController.CarCartController.existsCartUser, IndexController.CarCartController.createCart,
    IndexController.CarController.findOneCarNum, IndexController.LineItemController.existsLiteCC, IndexController.LineItemController.editLiteCC,
    IndexController.LineItemController.createLite)

router.put('/itemedit/:id',
    IndexController.LineItemController.existsLiteID, IndexController.CarController.findOneCarID, IndexController.LineItemController.editLiteID)

router.delete('/itemdelete/:id', IndexController.LineItemController.existsLiteID, IndexController.LineItemController.deleteLiteID)

//* Handle cart
router.get('/cartbyuser/:id', IndexController.UserController.existsUser, IndexController.CarCartController.findCartByUser)
router.get('/sum/:id', IndexController.CarCartController.existsCartID, IndexController.CarCartController.cartSummary)

//* Proceed to checkout
router.post('/checkout/:id', IndexController.CarCartController.existsCartID, IndexController.LineItemController.findLitebByCart,
    IndexController.CarController.carAvailable, IndexController.LineItemController.processLite)

//* Place order
router.post('/order/:id', IndexController.CarCartController.existsCartID, IndexController.CarCartController.cartSummary,
    IndexController.LineItemController.findLitebByCart, IndexController.CarController.carAvailable, IndexController.OrderController.createOrder, 
    IndexController.LineItemController.processLite, IndexController.CarCartController.closeCart, IndexController.CarController.rentCar)

//* Cancel, rent, or close order

router.get('/test', IndexController.OrderController.createOrder)
router.get('/try', IndexController.OrderController.getAllOrder)


export default router