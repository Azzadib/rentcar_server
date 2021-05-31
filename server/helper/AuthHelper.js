import crypto from 'crypto'

const AuthHelper = {
    hashPassword(password, salt) {
        return this.encryptPassword(password, salt)
    },

    encryptPassword(password, salt) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', salt)
                .update(password)
                .digest('hex')
        } catch (error) {
            return ''
        }
    },

    makeSalt() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    authenticate(plaintext, hashPassword, salt) {
        return this.encryptPassword(plaintext, salt) == hashPassword
    }
}

export default AuthHelper