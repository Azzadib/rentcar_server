import server from '../server/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'

chai.should()
chai.use(chaiHttp)

describe('Rent car - Car', () => {
    describe("Create car data", () => {
        it("It should return error because price is null.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'SUV')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Price should be a number. Found: undefined.')
                    done()
                })
        });

        it("It should return error because price is nan.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 'hundred')
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'SUV')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Price should be a number. Found: hundred.')
                    done()
                })
        });

        it("It should return error because passenger is undefined.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                //.field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'SUV')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Passenger should be a number. Found: undefined.')
                    done()
                })
        });

        it("It should return error because passenger has wrong value.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                .field('car_passenger', 20)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'SUV')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Passenger only accept 2, 3, 5, 8 or 10 as value. Found: 20.')
                    done()
                })
        });

        it("It should return error because door has wrong value.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 20)
                .field('car_ac', 1)
                .field('car_type', 'SUV')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Door only accept 2, 4 or 5 as value. Found: 20.')
                    done()
                })
        });

        it("It should return error because car type has wrong value.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'Tank')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Type only accept Sedan, SUV or Truck as value. Found: Tank.')
                    done()
                })
        });

        it("It should create complete car data.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'Sedan')
                .field('car_description', 'This is car description')
                .attach(1, fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach(1, fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('car_number').eq('A1111AA')
                    response.body.should.have.property('car_manufacturer').eq('BMW')
                    response.body.should.have.property('car_model').eq('X5')
                    response.body.should.have.property('car_number').eq('A1111AA')
                    response.body.should.have.property('car_price').eq(100)
                    response.body.should.have.property('car_passenger').eq(2)
                    response.body.should.have.property('car_baggage').eq(true)
                    response.body.should.have.property('car_door').eq(2)
                    response.body.should.have.property('car_ac').eq(true)
                    response.body.should.have.property('car_type').eq('Sedan')
                    response.body.should.have.property('car_description').eq('This is car description')
                    response.body.should.have.property('car_user_id').eq(null)
                    response.body.should.have.property('car_images').length.should.not.be.eq(0)
                    done()
                })
        });

        it("It should return error because car number is already exists.", (done) => {
            chai.request(server)
                .post('/api/car/cardata/A1111AA')
                .set('content-type', 'multipart/form-data')
                .field('car_manufacturer', 'BMW')
                .field('car_model', 'X5')
                .field('car_price', 100)
                .field('car_passenger', 2)
                .field('car_baggage', 1)
                .field('car_door', 2)
                .field('car_ac', 1)
                .field('car_type', 'Sedan')
                .field('car_description', 'This is car description')
                .attach('1', fs.readFileSync('tests/car10fl.jpg'), `${process.cwd()}/images/cardata/A1111AA/car10fl.jpg`)
                .attach('0', fs.readFileSync('tests/car10r.jpeg'), `${process.cwd()}/images/cardata/A1111AA/car10r.jpeg`)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Car number already exists.')
                    done()
                })
        });
    })

    describe("Update car data", () => {
        it("It should return error because car to be updated not found.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 100,
                'car_passenger': 2,
                'car_baggage': 1,
                'car_door': 2,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/999')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Car to be updated not found.')
                    done()
                })
        });

        it("It should return error because price is nan.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 'hundred',
                'car_passenger': 2,
                'car_baggage': 1,
                'car_door': 2,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Price should be a positive number. Found: hundred.')
                    done()
                })
        });

        it("It should return error because price is negative.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': -100,
                'car_passenger': 2,
                'car_baggage': 1,
                'car_door': 2,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Price should be a positive number. Found: -100.')
                    done()
                })
        });

        it("It should return error because passenger has wrong value.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 100,
                'car_passenger': 20,
                'car_baggage': 1,
                'car_door': 2,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Passenger only accept 2, 3, 5, 8 or 10 as value. Found: 20.')
                    done()
                })
        });

        it("It should return error because door has wrong value.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 100,
                'car_passenger': 2,
                'car_baggage': 1,
                'car_door': 20,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Door only accept 2, 4 or 5 as value. Found: 20.')
                    done()
                })
        });

        it("It should return error because car type has wrong value.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 100,
                'car_passenger': 2,
                'car_baggage': 1,
                'car_door': 2,
                'car_ac': 1,
                'car_type': 'Tank',
                'car_description': 'This is car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    response.body.should.have.property('message').eq('Type only accept Sedan, SUV or Truck as value. Found: Tank.')
                    done()
                })
        });

        it("It should update complete car data.", (done) => {
            const car = {
                'car_manufacturer': 'BMW',
                'car_model': 'X5',
                'car_price': 1000,
                'car_passenger': 3,
                'car_baggage': 1,
                'car_door': 4,
                'car_ac': 1,
                'car_type': 'SUV',
                'car_description': 'This is new car description'
            }
            chai.request(server)
                .put('/api/car/1')
                .send(car)
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.a('object')
                    response.body.should.have.property('car_number').eq('A1111AA')
                    response.body.should.have.property('car_manufacturer').eq('BMW')
                    response.body.should.have.property('car_model').eq('X5')
                    response.body.should.have.property('car_price').eq(1000)
                    response.body.should.have.property('car_passenger').eq(3)
                    response.body.should.have.property('car_baggage').eq(true)
                    response.body.should.have.property('car_door').eq(4)
                    response.body.should.have.property('car_ac').eq(true)
                    response.body.should.have.property('car_type').eq('SUV')
                    response.body.should.have.property('car_description').eq('This is new car description')
                    response.body.should.have.property('car_user_id').eq(null)
                    done()
                })
        });
    })

    describe("Get car data", () => {
        it("It should return all car data", (done) => {
            chai.request(server)
                .get("/api/car/allcar")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.not.be.eq(0);
                    done();
                });
        });

        it("It should return error because car ID is NaN", (done) => {
            chai.request(server)
                .get("/api/car/n")
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('ID of searched car is null or has wrong type.')
                    done();
                });
        });

        it("It should return error because car ID is not found", (done) => {
            chai.request(server)
                .get("/api/car/9999999")
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('Car not found.')
                    done();
                });
        });
    })

    describe("Delete car data", () => {
        it("It should return error because car ID is NaN", (done) => {
            chai.request(server)
                .delete("/api/car/n")
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('ID of searched car is null or has wrong type.')
                    done();
                });
        });

        it("It should return error because car ID is not found", (done) => {
            chai.request(server)
                .delete("/api/car/9999999")
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('Car to be deleted not found.')
                    done();
                });
        });

        it("It should delete car", (done) => {
            chai.request(server)
                .delete("/api/car/1")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('Car deleted.')
                    done();
                });
        });

        it("It should return not found because car has benn deleted", (done) => {
            chai.request(server)
                .get("/api/car/1")
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('Car not found.')
                    done();
                });
        });
    })
});