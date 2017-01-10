global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var expect = chai.expect;
var app = server.app;

chai.use(chaiHttp);

var id = '';
var id2 = '';

describe('Shopping List', function() {
	before(function(done) {
		server.runServer(function(){
			Item.create({name: 'Broad beans'},
						{name: 'Tomatoes'},
						{name: 'Peppers'}, function() {
				done();		
			});
		});
	});

	after(function(done) {
		Item.remove(function() {
			done();
		});
	});

	var testSeries = function(res){
		res.body[0].name.should.equal('Broad beans');
		res.body[1].name.should.equal('Tomatoes');
		res.body[2].name.should.equal('Peppers');
	}

	var defaultTests = function(res) {
		res.body[0].should.all.have.keys('_id', 'name', '__v');
		res.body[1].should.all.have.keys('_id', 'name', '__v');
		res.body[2].should.all.have.keys('_id', 'name', '__v');
		res.body[0].name.should.be.a('string').and.equal('Broad beans');
		res.body[0]._id.should.be.a('string');
		res.body[1].name.should.be.a('string').and.equal('Tomatoes');
		res.body[1]._id.should.be.a('string');
		res.body[2].name.should.be.a('string').and.equal('Peppers');
		res.body[2]._id.should.be.a('string');
	}

	it('should list items on GET', function(done) {
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			id = res.body[0]._id;
    			id2 = res.body[1]._id;
    			should.equal(err, null);
    			res.should.have.status(200);
    			res.should.be.json;
    			res.body.should.be.a('array');
    			res.body.should.have.length(3);
    			res.body[0].should.be.a('object');
    			res.body[0].should.have.property('_id');
    			res.body[0].should.have.property('name');
    			res.body[0]._id.should.be.a('string');
    			res.body[0].name.should.be.a('string');
    			testSeries(res);
    			done();
    		})
    });
    it('should add an item on post', function(done) {
    	chai.request(app)
	    	.post('/items')
	    	.send({'name': 'Kale'})
	    	.end(function(err, res) {
	    		should.equal(err, null);
	    		res.should.have.status(201);
	    		res.should.be.json;
	    		res.body.should.be.a('object');
	    		res.body.should.have.property('name');
	    		res.body.should.have.property('_id');
	    		res.body.name.should.be.a('string');
	    		res.body._id.should.be.a('string');
	    		res.body.name.should.equal('Kale');	
	    	})
	    chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			res.body.should.be.a('array');
				res.body.should.have.length(4);
				res.body[0].should.all.have.keys('_id', 'name', '__v');
				res.body[1].should.all.have.keys('_id', 'name', '__v');
				res.body[2].should.all.have.keys('_id', 'name', '__v');
				res.body[0].name.should.be.a('string').and.equal('Broad beans');
				res.body[0]._id.should.be.a('string');
				res.body[1].name.should.be.a('string').and.equal('Tomatoes');
				res.body[1]._id.should.be.a('string');
				res.body[2].name.should.be.a('string').and.equal('Peppers');
				res.body[2]._id.should.be.a('string');
	    		res.body[3].should.all.have.keys('_id', 'name', '__v');
	    		res.body[3].name.should.be.a('string').and.equal('Kale');
	    		res.body[3]._id.should.be.a('string');
	    		done();	
    		})
    });
    it('should exit gracefully if no name is given', function(done) {
    	chai.request(app)
    		.post('/items')
    		.send({'name': ''})
    		.end(function(err, res) {
    			err.should.have.status(500);
    		})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			res.body.should.be.a('array');
    			res.body.should.have.length(4);
    			defaultTests(res);
   				done();
    		})    		
    });
    it('should exit gacefully if invalid json is sent', function(done) {
    	chai.request(app)
    		.post('/items')
    		.send('kale')
    		.end(function(err, res) {
    			err.should.have.status(500);
    		})
    	chai.request(app)
    		.get('/items')
			.end(function(err, res) {
				res.body.should.be.a('array');
				res.body.should.have.length(4)
				res.body[0].should.all.have.keys('_id', 'name', '__v');
				res.body[1].should.all.have.keys('_id', 'name', '__v');
				res.body[2].should.all.have.keys('_id', 'name', '__v');
				res.body[0].name.should.be.a('string').and.equal('Broad beans');
				res.body[0]._id.should.be.a('string');
				res.body[1].name.should.be.a('string').and.equal('Tomatoes');
				res.body[1]._id.should.be.a('string');
				res.body[2].name.should.be.a('string').and.equal('Peppers');
				res.body[2]._id.should.be.a('string');
    			done();
			});
    			
    });
    it('should edit an item on put', function(done) {
    	chai.request(app)
    		.put('/items/' + id)
    		.send({'id': id, 'name': 'Kale'})
    		.end(function(err, res) {
    			res.should.have.status(201);
    		})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			res.body.should.be.a('array');
    			res.body.should.have.length(4);
    			res.body[0].should.all.have.keys('_id', 'name', '__v');
				res.body[1].should.all.have.keys('_id', 'name', '__v');
				res.body[2].should.all.have.keys('_id', 'name', '__v');
				res.body[0].name.should.be.a('string').and.equal('Kale');
				res.body[0]._id.should.be.a('string');
				res.body[1].name.should.be.a('string').and.equal('Tomatoes');
				res.body[1]._id.should.be.a('string');
				res.body[2].name.should.be.a('string').and.equal('Peppers');
				res.body[2]._id.should.be.a('string');
				res.body[3].name.should.be.a('string').and.equal('Kale');
				res.body[3]._id.should.be.a('string');
    			done();
    		})
    });
    it('should exit gracefully when no id is recieved', function(done) {
    	chai.request(app)
    		.put('/items/')
    		.send({'id': id2, 'name': 'Kale'})
    		.end(function(err,res) {
    			err.should.have.status(404);
    		})
    	chai.request(app)
    		.get('/items/')
    		.end(function(err, res){
    			res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Tomatoes');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Peppers');
    			res.body[2]._id.should.be.a('string');
    			res.body[3].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[3].name.should.be.a('string').and.equal('Kale');
    			res.body[3]._id.should.be.a('string');
    			done();
    		})
    });
    it('should exit gracefully when a different id is used in the body than the url', function(done){
    	chai.request(app)
    		.put('/items/' + id2)
    		.send({'name': 'Kale', 'id': id})
    		.end(function(err,res) {
    			err.should.have.status(400);	
			})
		chai.request(app)
			.get('/items')
			.end(function(err, res) {
				res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Tomatoes');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Peppers');
    			res.body[2]._id.should.be.a('string');
    			res.body[3].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[3].name.should.be.a('string').and.equal('Kale');
    			res.body[3]._id.should.be.a('string');
    			done();
			})
    })
    it('should exit gracefully if no body data is given', function(done) {
    	chai.request(app)
    		.put('/items/1')
    		.send()
    		.end(function(err,res) {
    			err.should.have.status(400);
			})
		chai.request(app)
			.get('/items')
			.end(function(err, res) {
				res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Tomatoes');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Peppers');
    			res.body[2]._id.should.be.a('string');
    			res.body[3].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[3].name.should.be.a('string').and.equal('Kale');
    			res.body[3]._id.should.be.a('string');
    			done();
			})
    });
    it('should exit gracefully if invalid json is sent', function(done) {
    	chai.request(app)
    		.put('/items')
    		.send({'nam': 'Kale'})
    		.end(function(err, res) {
    			err.should.have.status(404);
			})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Tomatoes');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Peppers');
    			res.body[2]._id.should.be.a('string');
    			res.body[3].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[3].name.should.be.a('string').and.equal('Kale');
    			res.body[3]._id.should.be.a('string');
    			done();
    		})
    })
   
    it('should delete an item on delete', function(done) {
    	chai.request(app)
    		.delete('/items/' + id2)
    		.end(function(err, res){
    			should.equal(err, null);
    			res.should.have.status(201);
    		})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
    			res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Peppers');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Kale');
    			res.body[2]._id.should.be.a('string');
				done();
    		})
    });
    it('should exit gracefully if no item is there to delete', function(done) {
    	chai.request(app)
    		.delete('/items/6')
    		.end(function(err, res){
    			err.should.have.status(500);
    		})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res){
    			res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Peppers');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Kale');
    			res.body[2]._id.should.be.a('string');
				done();
    		})	
    });
    it('should exit gracefully if no id is sent in the url', function(done) {
    	chai.request(app)
    		.delete('/items/')
    		.end(function(err, res){
    			err.should.have.status(404);
    		})
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res){
    			res.body[0].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[0].name.should.be.a('string').and.equal('Kale');
    			res.body[0]._id.should.be.a('string');
    			res.body[1].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[1].name.should.be.a('string').and.equal('Peppers');
    			res.body[1]._id.should.be.a('string');
    			res.body[2].should.be.an('object').and.have.all.keys('name', '_id', '__v');
    			res.body[2].name.should.be.a('string').and.equal('Kale');
    			res.body[2]._id.should.be.a('string');
				done();
    		})
    });
});