const findAllComment = async (req, res) => {
    try {
        const comments = await req.context.models.CarComment.findAll()
        return res.status(200).send(comments)
    } catch (error) {
        return res.status(500).send({ message: `Find all comment ${error}.` })
    }
}

const findCommentByID = async (req, res) => {
    try {
        const comment = await req.context.models.CarComment.findOne(
            {
                where: { carco_id: req.params.id }
            }
        )
        return res.status(200).send({ comment })
    } catch (error) {
        return res.status(500).send({ message: `Find comment by ID ${error}.` })
    }
}

const findCommentByUser = async (req, res) => {
    try {
        const user = req.existsuser
        if (!user) return res.status(400).send({ message: 'User data not found.' })
        const comment = await req.context.models.CarComment.findAll(
            {
                where: { carco_user_id: user.user_id }
            }
        )
        return res.status(200).send({ comment })
    } catch (error) {
        return res.status(500).send({ message: `Find comment by user ${error}.` })
    }
}

const findCommentByCar = async (req, res) => {
    try {
        const car = req.existscar
        if (!car) return res.status(400).send({ message: 'Car data not found.' })
        const comment = await req.context.models.CarComment.findAll(
            {
                where: { carco_car_id: car.car_id }
            }
        )
        return res.status(200).send({ comment })
    } catch (error) {
        return res.status(500).send({ message: `Find comment by car ${error}.` })
    }
}

const existsComment = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) return res.status(500).send({ message: 'Comment ID is null or as wrong type.' })
        const comment = await req.context.models.CarComment.findOne(
            {
                where: { carco_id: req.params.id }
            }
        )
        req.existscomment = comment
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find comment by ID ${error}.` })
    }
}

const createComment = async (req, res) => {
    try {
        const user = req.existsuser
        if (!user) return res.status(400).send({ message: 'User data not found.' })

        const car = req.existsnumber
        if (!car) return res.status(400).send({ message: 'Car data not found.' })

        const { carco_comment, carco_rating } = req.body

        if (carco_rating === undefined || isNaN(carco_rating)) return res.status(500).send({ message: 'Rating is null or has wrong type.' })
        if (carco_rating < 1 || carco_rating > 5) return res.status(400).send({ message: `Rating should be in range of 1 to 5. Found: ${carco_rating}.` })

        const comment = await req.context.models.CarComment.create(
            {
                carco_comment: carco_comment,
                carco_rating: carco_rating,
                carco_user_id: user.user_id,
                carco_car_id: car.car_id
            }
        )
        if (!comment) return res.status(500).send({ message: 'Failed to create comment.' })
        return res.status(201).send(comment)
    } catch (error) {
        return res.status(500).send({ message: `Create comment ${error}.` })
    }
}

const editComment = async (req, res) => {
    try {
        const oldComment = req.existscomment
        if (!oldComment) return res.status(400).send({ message: 'Car comment to be edited is not exists.' })

        let { carco_comment, carco_rating } = req.body

        if (carco_rating === undefined) carco_rating = oldComment.carco_rating
        if (isNaN(carco_rating)) return res.status(500).send({ message: 'Rating has wrong type.' })
        if (carco_rating < 1 || carco_rating > 5) return res.status(400).send({ message: `Rating should be integer in range of 1 to 5. Found: ${carco_rating}.` })

        if (carco_comment === undefined) carco_comment = oldComment.carco_comment ? oldComment.carco_comment : null

        const comment = await req.context.models.CarComment.update(
            {
                carco_comment: carco_comment,
                carco_rating: carco_rating
            },
            {
                returning: true, where: { carco_id: req.params.id }
            }
        )
        if (!comment[0]) return res.status(500).send({ message: 'Failed to update comment.' })
        return res.status(201).send(comment[1][0])
    } catch (error) {
        return res.status(500).send({ message: `Update comment ${error}.` })
    }
}

const deleteComment = async (req, res) => {
    try {
        const toDeleteComment = req.existscomment
        if (!toDeleteComment) return res.status(500).send({ message: 'Comment to be deleted is not exists.' })

        await req.context.models.CarComment.destroy(
            {
                where: { carco_id: toDeleteComment.carco_id }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ message: `Failed to delete comment.` })
            res.status(200).send({ message: `Comment deleted.` })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete comment ${error}.` })
    }
}

export default {
    findAllComment,
    findCommentByID,
    findCommentByUser,
    findCommentByCar,
    existsComment,
    createComment,
    editComment,
    deleteComment,
}