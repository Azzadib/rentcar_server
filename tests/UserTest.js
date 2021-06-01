import server from '../server/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'

chai.should()
chai.use(chaiHttp)

describe('Rent car - User', () => {
    describe('User signup', () => {
        it("It should return error because email is null.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email can\'t be blank.')
                    done()
                })
        })

        it("It should return error because email has wrong format.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin2rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email format is not valid.')
                    done()
                })
        })

        it("It should return error because name is null.", (done) => {
            const user = {
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Name can\'t be blank.')
                    done()
                })
        })

        it("It should return error because name has wrong format.", (done) => {
            const user = {
                "user_name": "A",
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Name should be at least 2 characters of alphabet, number or \' _ \'.')
                    done()
                })
        })

        it("It should return error because password is null.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin.one@rentcar.id",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Password can\'t be blank.')
                    done()
                })
        })

        it("It should return error because password has wrong format.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin.one@rentcar.id",
                "user_password": "passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Password should be at least 8 characters of uppercase, lowercase, and special character.')
                    done()
                })
        })

        it("It should return error because birthdate has wrong format.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "19990101",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Birthdate format should be yyyy/mm/dd , yyyy-mm-dd or yyyy.mm.dd')
                    done()
                })
        })

        it("It should return full signup data.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.should.be.a('object')
                    response.body.should.have.property('user_name').eq('Admin One')
                    response.body.should.have.property('user_email').eq('admin.one@rentcar.id')
                    response.body.should.have.property('user_birthdate').eq('1999-01-01')
                    response.body.should.have.property('user_gender').eq('male')
                    response.body.should.have.property('user_avatar').eq(null)
                    response.body.should.have.property('user_type').eq('Admin')
                    response.should.not.have.property('user_password')
                    response.should.not.have.property('user_salt')
                    done()
                })
        })

        it("It should return full signup data.", (done) => {
            const user = {
                "user_name": "Admin Two",
                "user_email": "admin.two@rentcar.id",
                "user_password": "Passadmin2#",
                "user_birthdate": "1999-10-10",
                "user_gender": "female"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.should.be.a('object')
                    response.body.should.have.property('user_name').eq('Admin Two')
                    response.body.should.have.property('user_email').eq('admin.two@rentcar.id')
                    response.body.should.have.property('user_birthdate').eq('1999-10-10')
                    response.body.should.have.property('user_gender').eq('female')
                    response.body.should.have.property('user_avatar').eq(null)
                    response.body.should.have.property('user_type').eq('Admin')
                    response.should.not.have.property('user_password')
                    response.should.not.have.property('user_salt')
                    done()
                })
        })

        it("It should return error because email is already exists.", (done) => {
            const user = {
                "user_name": "Admin One",
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#",
                "user_birthdate": "1999-01-01",
                "user_gender": "male"
            }
            chai.request(server)
                .post('/api/user/signup')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email is already exists.')
                    done()
                })
        })
    })

     describe("User avatar", () => {
        it("It should return error because add avatar to nan user id.", (done) => {
            chai.request(server)
                .put('/api/user/a/avatar')
                .set('content-type', 'multipart/form-data')
                .attach('user_avatar', fs.readFileSync('tests/avatar1.png'), `${process.cwd()}/images/avatar/1/avatar1.png`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('ID of searched user is null or has wrong type.')
                    done()
                })
        })

        it("It should return error because avatar owner not found.", (done) => {
            chai.request(server)
                .put('/api/user/9999/avatar')
                .set('content-type', 'multipart/form-data')
                .attach('user_avatar', fs.readFileSync('tests/avatar1.png'), `${process.cwd()}/images/avatar/1/avatar1.png`)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Avatar owner not found.')
                    done()
                })
        })

        it("It should return error because post to wrong folder.", (done) => {
            chai.request(server)
                .put('/api/user/1/photo')
                .set('content-type', 'multipart/form-data')
                .attach('user_avatar', fs.readFileSync('tests/avatar1.png'), `${process.cwd()}/images/avatar/1/avatar1.png`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Image upload target is null or has wrong value.')
                    done()
                })
        })

        it("It should update the user avatar.", (done) => {
            chai.request(server)
                .put('/api/user/1/avatar')
                .set('content-type', 'multipart/form-data')
                .attach('user_avatar', fs.readFileSync('tests/avatar1.png'), `${process.cwd()}/images/avatar/1/avatar1.png`)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Avatar updated.')
                    done()
                })
        })
    })
 
     describe("Find user", () => {
        it("It should retun error because search user with nan ID.", (done) => {
            chai.request(server)
                .get('/api/user/a')
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('ID of searched user is null or has wrong type.')
                    done()
                })
        })

        it("It should retun error because user not found.", (done) => {
            chai.request(server)
                .get('/api/user/999')
                .end((err, response) => {
                    response.should.have.status(404)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('User not found.')
                    done()
                })
        })

        it("It should return user data.", (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, response) => {
                    response.should.have.status(200)
                    response.should.be.a('object')
                    response.body.should.have.property('user_name').eq('Admin One')
                    response.body.should.have.property('user_email').eq('admin.one@rentcar.id')
                    response.body.should.have.property('user_birthdate').eq('1999-01-01')
                    response.body.should.have.property('user_gender').eq('male')
                    response.body.should.have.property('user_avatar').eq('avatar1.png')
                    response.body.should.have.property('user_type').eq('Admin')
                    response.should.not.have.property('user_password')
                    response.should.not.have.property('user_salt')
                    response.body.should.have.property('cars')
                    response.body.should.have.property('car_comments')
                    response.body.should.have.property('car_carts')
                    response.body.should.have.property('orders')
                    done()
                })
        })
    }) 

     describe("User login", () => {
        it("It should return error because login without email.", (done) => {
            const user = {
                "user_password": "Passadmin1#"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email can\'t be blank.')
                    done()
                })
        })

        it("It should return error because login without password.", (done) => {
            const user = {
                "user_email": "admin.one@rentcar.id"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Password can\'t be blank.')
                    done()
                })
        })

        it("It should return error because login with unregistered email.", (done) => {
            const user = {
                "user_email": "admin.onee@rentcar.id",
                "user_password": "Passadmin1#"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('User not found.')
                    done()
                })
        })

        it("It should return error because login with wrong password.", (done) => {
            const user = {
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmim1#"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email and password doesn\'t match.')
                    done()
                })
        })

        it("It should login successfully.", (done) => {
            const user = {
                "user_email": "admin.one@rentcar.id",
                "user_password": "Passadmin1#"
            }
            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.should.be.a('object')
                    response.body.should.have.property('token')
                    response.body.should.have.property('user').have.property('user_name').eq('Admin One')
                    response.body.should.have.deep.property('user').have.property('user_email').eq('admin.one@rentcar.id')
                    response.body.should.have.deep.property('user').have.property('user_birthdate').eq('1999-01-01')
                    response.body.should.have.deep.property('user').have.property('user_gender').eq('male')
                    response.body.should.have.deep.property('user').have.property('user_avatar').eq('avatar1.png')
                    response.body.should.have.deep.property('user').have.property('user_type').eq('Admin')
                    response.body.should.have.deep.property('user').not.have.property('user_password')
                    response.body.should.have.deep.property('user').not.have.property('user_salt')
                    done()
                })
        })
    }) 

     describe('User update', () => {
        it("It should return error because id of to be updated user is nan.", (done) => {
            const user = {}
            chai.request(server)
                .put('/api/user/a')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('ID of searched user is null or has wrong type.')
                    done()
                })
        })

        it("It should return error because update data of not exists user.", (done) => {
            const user = {
                "user_email": "admin.two@rentcar.id",
                "user_password": "PassAdmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/9999')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('User to be updated not found.')
                    done()
                })
        })

        it("It should return error because new email is already exists.", (done) => {
            const user = {
                "user_email": "admin.two@rentcar.id",
                "user_password": "PassAdmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('New email is already exists.')
                    done()
                })
        })

        it("It should return error because new email has wrong format.", (done) => {
            const user = {
                "user_name": "First Admin",
                "user_email": "admin.first2rentcar.id",
                "user_password": "PassAdmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('Email format is not valid.')
                    done()
                })
        })

        it("It should return error because new name has wrong format.", (done) => {
            const user = {
                "user_name": "A",
                "user_email": "admin.first@rentcar.id",
                "user_password": "PassAadmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('New name should be at least 2 characters of alphabet, number or \' _ \'.')
                    done()
                })
        })

        it("It should return error because new password has wrong format.", (done) => {
            const user = {
                "user_name": "First Admin",
                "user_email": "admin.one@rentcar.id",
                "user_password": "passadmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('New password should be at least 8 characters of uppercase, lowercase, and special character.')
                    done()
                })
        })

        it("It should return error because new birthdate has wrong format.", (done) => {
            const user = {
                "user_name": "First Admin",
                "user_email": "admin.first@rentcar.id",
                "user_password": "PassAdmin1#",
                "user_birthdate": "19991111",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('New birthdate format should be yyyy/mm/dd , yyyy-mm-dd or yyyy.mm.dd')
                    done()
                })
        })

        it("It should return full updated user data.", (done) => {
            const user = {
                "user_name": "First Admin",
                "user_email": "admin.first@rentcar.id",
                "user_password": "PassAdmin1#",
                "user_birthdate": "1999-11-11",
                "user_gender": "male"
            }
            chai.request(server)
                .put('/api/user/1')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.should.be.a('object')
                    response.body.should.have.property('user_name').eq('First Admin')
                    response.body.should.have.property('user_email').eq('admin.first@rentcar.id')
                    response.body.should.have.property('user_birthdate').eq('1999-11-11')
                    response.body.should.have.property('user_gender').eq('male')
                    response.body.should.have.property('user_avatar')
                    response.body.should.have.property('user_type').eq('Admin')
                    response.should.not.have.property('user_password')
                    response.should.not.have.property('user_salt')
                    done()
                })
        })
    }) 

     describe("Delete user", () => {
        it("It should return error because delete not exists user.", (done) => {
            chai.request(server)
                .delete('/api/user/9999')
                .end((err, response) => {
                    response.should.have.status(404)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('User to be deleted not found.')
                    done()
                })
        })

        it("It should delete user", (done) => {
            chai.request(server)
                .delete('/api/user/1')
                .end((err, response) => {
                    response.should.have.status(200)
                    response.should.be.a('object')
                    response.body.should.have.property('message').eq('User deleted.')
                    done()
                })
        })
    })
})