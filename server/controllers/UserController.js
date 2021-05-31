import AuthHelper from '../helper/AuthHelper'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../../config/config'

import fs from 'fs'
import path from 'path'

const photoDir = process.cwd() + '/images'

const findAllUsers = async (req, res) => {
    try {
        const users = await req.context.models.User.findAll({
            attributes: {
                exclude: ['user_password', 'user_salt']
            },
            order: [
                ['user_name', 'ASC']
            ],
        })
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ message: `Find User ${error}.` })
    }
}

const findOneUser = async (req, res) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched user is null or has wrong type.' })
        const user = await req.context.models.User.findOne(
            {
                where: {
                    user_id: req.params.id
                },
                attributes: {
                    exclude: ['user_password', 'user_salt']
                },
                include: [
                    { model: req.context.models.CarComment },
                    { model: req.context.models.Car },
                    { model: req.context.models.CarCart },
                    { model: req.context.models.Order }
                ]
            })
        if (!user) return res.status(404).send({ message: 'User not found.' })
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ message: `Find User ${error}.` })
    }
}

const existsUser = async (req, res, next) => {
    try {
        if (req.params.id === undefined || isNaN(req.params.id)) res.status(400).send({ message: 'ID of searched user is null or has wrong type.' })
        const user = await req.context.models.User.findOne(
            {
                where: { user_id: req.params.id }
            }
        )
        req.existsuser = user
        next()
    } catch (error) {
        return res.status(500).send({ message: `Find User ${error}.` })
    }
}

const existsEmail = async (req, res, next) => {
    try {
        if (!req.body.user_email) return res.status(400).send({ message: 'Email can\'t be blank.' })
        const emailFormat = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        if (!req.body.user_email.match(emailFormat)) return res.status(400).send({ message: 'Email format is not valid.' })

        const exists = await req.context.models.User.findOne(
            {
                where: { user_email: req.body.user_email }
            }
        )
        req.existsemail = exists
    } catch (error) {
        return res.status(500).send({ message: `Check email ${error}.` })
    }
    next()
}

const signUp = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_birthdate, user_gender } = req.body

        if (req.existsemail) return res.status(400).send({ message: 'Email is already exists.' })

        if (!user_name) return res.status(400).send({ message: 'Name can\'t be blank.' })
        const nameFormat = /^[a-zA-Z0-9_]+([ a-zA-Z0-9_]+){2}$/
        if (!user_name.match(nameFormat)) return res.status(400).send({ message: 'Name should be at least 2 characters of alphabet, number or \' _ \'.' })

        if (!user_password) return res.status(400).send({ message: 'Password can\'t be blank.' })
        const passwordFormat = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
        if (!user_password.match(passwordFormat)) return res.status(400).send({ message: 'Password should be at least 8 characters of uppercase, lowercase, and special character.' })

        if (user_birthdate !== undefined) {
            const dateFormat = /^\d{4}([./-])\d{2}\1\d{2}$/
            if (!user_birthdate.match(dateFormat)) return res.status(400).send({ message: 'Birthdate format should be yyyy/mm/dd , yyyy-mm-dd or yyyy.mm.dd' })
        }

        const user_type = user_name.split(' ')[0].toLowerCase() === 'admin' ? 'Admin' : 'User'

        const salt = AuthHelper.makeSalt()
        const hashPassword = AuthHelper.hashPassword(user_password, salt)

        const user = await req.context.models.User.create(
            {
                user_name: user_name,
                user_email: user_email,
                user_password: hashPassword,
                user_salt: salt,
                user_birthdate: user_birthdate,
                user_gender: user_gender,
                user_type: user_type,
            }
        )
        if (!user.user_id) return res.status(500).send({ message: 'Failed to signUp.' })
        return res.status(201).send(
            {
                user_name: user.user_name,
                user_email: user.user_email,
                user_birthdate: user.user_birthdate,
                user_gender: user.user_gender,
                user_avatar: user.user_avatar,
                user_type: user.user_type,
            }
        )
    } catch (error) {
        return res.status(500).send({ message: `Sign up ${error}.` })
    }

}

const login = async (req, res) => {
    try {
        const { user_password } = req.body
        const user = req.existsemail
        if (!user) return res.status(400).send({ message: 'User not found.' })

        if (!user_password) return res.status(400).send({ message: 'Password can\'t be blank.' })

        if (!AuthHelper.authenticate(user_password, user.user_password, user.user_salt)) {
            return res.status(400).send({ message: "Email and password doesn't match." })
        }

        else {
            const token = jwt.sign({ _id: user.user_id }, config.jwtSecret)

            res.cookie("t", token, {
                expire: new Date() + 999
            })

            return res.status(200).send(
                {
                    token,
                    user: {
                        user_id: user.user_id,
                        user_name: user.user_name,
                        user_email: user.user_email,
                        user_birthdate: user.user_birthdate,
                        user_gender: user.user_gender,
                        user_avatar: user.user_avatar,
                        user_type: user.user_type,
                    }
                }
            )
        }
    } catch (error) {
        return res.status(500).send({ message: `Login ${error}.` })
    }
}

const updateUser = async (req, res) => {
    try {
        let passIncluded = true
        let birthdateIncluded = false
        let salt = ''
        let { user_name, user_email, user_password, user_birthdate, user_gender } = req.body

        const oldUser = req.existsuser
        const oldEmail = req.existsemail

        if (!oldUser) return res.status(400).send({ message: 'User to be updated not found.' })

        if (oldEmail && oldUser.user_email !== oldEmail.user_email) return res.status(400).send({ message: 'New email is already exists.' })
        const emailFormat = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        if (!user_email.match(emailFormat)) return res.status(400).send({ message: 'Email format is not valid.' })

        if (user_name === undefined) user_name = oldUser.user_name
        const nameFormat = /^[a-zA-Z0-9_]+([ a-zA-Z0-9_]+){2}$/
        if (!user_name.match(nameFormat)) return res.status(400).send({ message: 'New name should be at least 2 characters of alphabet, number or \' _ \'.' })

        if (user_password === undefined) {
            passIncluded = false
            user_password = oldUser.user_password
            salt = oldUser.user_salt
        }

        if (passIncluded) {
            const passwordFormat = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
            if (!user_password.match(passwordFormat)) return res.status(400).send({ message: 'New password should be at least 8 characters of uppercase, lowercase, and special character.' })
            salt = AuthHelper.makeSalt()
            user_password = AuthHelper.hashPassword(user_password, salt)
        }

        if (user_birthdate !== undefined) {
            birthdateIncluded = true
            const dateFormat = /^\d{4}([./-])\d{2}\1\d{2}$/
            if (!user_birthdate.match(dateFormat)) return res.status(400).send({ message: 'New birthdate format should be yyyy/mm/dd , yyyy-mm-dd or yyyy.mm.dd' })
        }

        if (!birthdateIncluded) user_birthdate = oldUser.user_birthdate ? oldUser.user_birthdate : null

        if (user_gender === undefined) user_gender = oldUser.user_gender ? oldUser.user_gender : null

        const newUser = await req.context.models.User.update(
            {
                user_name: user_name,
                user_email: user_email,
                user_password: user_password,
                user_salt: salt,
                user_birthdate: user_birthdate,
                user_gender: user_gender,
            },
            {
                returning: true, where: { user_id: req.params.id }
            }
        )
        if (!newUser[0]) return res.status(500).send({ message: 'Failed to update user.' })
        return res.status(201).send({
            user_name: newUser[1][0].user_name,
            user_email: newUser[1][0].user_email,
            user_birthdate: newUser[1][0].user_birthdate,
            user_gender: newUser[1][0].user_gender,
            user_avatar: newUser[1][0].user_avatar,
            user_type: newUser[1][0].user_type,
        })
    } catch (error) {
        return res.status(500).send({ message: `Update user ${error}.` })
    }
}

const userAvatar = async (req, res) => {
    try {
        const { images } = req.dataUploaded
        if (req.params.id === undefined || isNaN(req.params.id)) {
            fs.rmdirSync(path.join(photoDir + '/avatar' + `/${req.params.id}/`), { recursive: true })
            return res.status(400).send({ message: 'ID of image owner is null or has wrong type.' })
        }
        const imageOwner = req.existsuser
        if (!imageOwner) return res.status(404).send({ message: 'Avatar owner not found.' })
        if (fs.existsSync(photoDir + '/avatar' + `/${imageOwner.user_id}/` + imageOwner.user_avatar) && imageOwner.user_avatar && images[0].fileName !== '') fs.unlinkSync(path.join(photoDir + '/avatar' + `/${imageOwner.user_id}/` + imageOwner.user_avatar))

        for (const data of images) {
            if (data.fileName) {
                const user = await req.context.models.User.update(
                    { user_avatar: data.fileName },
                    {
                        returning: true, where: { user_id: imageOwner.user_id }
                    }
                )
                if (!user[0]) return res.status(500).send({ message: 'Failed to update avatar.' })
                return res.status(201).send({ message: 'Avatar updated.' })
            }
        }
    } catch (error) {
        return res.status(500).send({ message: `Add avatar ${error}.` })
    }
}

const deleteUserAvatar = async (req, res) => {
    try {
        const { user_avatar } = req.body
        const avatarOwner = req.existsuser

        if (!avatarOwner) return res.status(400).send({ message: `Avatar owner not found.` })

        if (avatarOwner.user_avatar !== user_avatar) return res.status(400).send({ message: `User avatar to deleted is not esists.` })

        const deleteavatar = await req.context.models.User.update(
            {
                user_avatar: null
            },
            { where: { user_id: avatarOwner.user_id } }
        )
        if (!deleteavatar) return res.status(500).send({ message: 'Failed to delete avatar.' })
        if (fs.existsSync(path.join(photoDir + '/avatar' + `/${avatarOwner.user_id}/` + `/${user_avatar}`))) fs.unlinkSync(path.join(photoDir + '/avatar' + `/${avatarOwner.user_id}/` + `/${user_avatar}`))
        return res.status(201).send({ message: 'User avatar deleted.' })
    } catch (error) {
        return res.status(500).send({ message: `Delete user avatar ${error}.` })
    }
}

const deleteUser = async (req, res) => {
    try {
        const toDeleteUser = req.existsuser
        if (!toDeleteUser) res.status(404).send({ message: 'User to be deleted not found.' })

        await req.context.models.User.destroy(
            {
                where: { user_id: req.params.id }
            }
        ).then(count => {
            if (!count) return res.status(500).send({ error: 'Failed to delete user.' })
            if (toDeleteUser.user_avatar) if (fs.existsSync(path.join(photoDir + '/avatar' + `/${toDeleteUser.user_id}/`))) fs.rmdirSync(path.join(photoDir + '/avatar' + `/${toDeleteUser.user_id}/`), { recursive: true })
            res.status(200).send({ message: 'User deleted.' })
        })
    } catch (error) {
        return res.status(500).send({ message: `Delete user ${error}.` })
    }
}

const signOut = (req, res) => {
    try {
        res.clearCookie("t")
        return res.status(200).send({ message: "Signed out." })
    } catch (error) {
        return res.status(500).send({ message: `Sign out ${error}.` })
    }
}

const requireLogin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['sha1', 'RS256', 'HS256']
})

const isAuthorized = (req, res, next) => {
    try {
        const authorized = req.user && req.auth && req.user.id == req.auth.id
        if (!(authorized)) return res.status(403).send({ message: 'User not authorized.' })
        next()
    } catch (error) {
        return res.status(500).send({ message: `Function isAuthorized ${error}.` })
    }
}

export default {
    findAllUsers,
    findOneUser,
    existsUser,
    existsEmail,
    signUp,
    login,
    updateUser,
    userAvatar,
    deleteUser,
    deleteUserAvatar,
    signOut,
    requireLogin,
    isAuthorized,
}