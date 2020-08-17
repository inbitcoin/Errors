/* eslint-env mocha */
var errors = require('../index.js')
var errorHandler = errors.errorHandler
var DynamicMiddleware = require('dynamic-middleware')
var assert = require('assert')
var request = require('supertest')
var bodyParser = require('body-parser')
var express = require('express')
var app = express()

var placeHolderMiddleware = function (req, res, next) { next() }
var requestIdMiddleware = function (req, res, next) {
  req.headers['X-Request-Id'] = 'request-id-1234'
  next()
}
var dynamicRequestIdMiddleware = DynamicMiddleware.create(placeHolderMiddleware)
var errorHandlerProduction = errorHandler() // default, unless explicitly process.env.NODE_ENV = 'development'
var errorHandlerDevelopment = errorHandler({env: 'development'})
var dynamicErrorHandler = DynamicMiddleware.create(errorHandlerProduction)

app.use(dynamicRequestIdMiddleware.handler())
app.use(bodyParser.json())
app.get('/string_error', function (req, res, next) {
  next('Some Error')
})
app.get('/array_error', function (req, res, next) {
  next(['Some Error', 500])
})
app.get('/error', function (req, res, next) {
  next(new Error('Some Error'))
})
app.get('/cc_error', function (req, res, next) {
  if (!req.query || req.query.explain !== 'true') {
    return next(new errors.ValidationError())
  }
  next(new errors.ValidationError({
    explanation: 'The given address is invalid'
  }))
})
app.use(dynamicErrorHandler.errorHandler())

describe('Test error of correct format - production', function () {
  it('string error', function (done) {
    request(app)
			.get('/string_error')
			.expect(500)
			.end(function (err, res) {
        if (err) return done(err)
        assert.deepEqual(res.body, {
          status: 500,
          message: 'Some Error'
        })
        done()
      })
  })

  it('array error', function (done) {
    request(app)
			.get('/array_error')
			.expect(500)
			.end(function (err, res) {
        if (err) return done(err)
        assert.deepEqual(res.body, {
          status: 500,
          message: 'Some Error'
        })
        done()
      })
	})

  it('raw error', function (done) {
    request(app)
			.get('/error')
			.expect(500)
			.end(function (err, res) {
				if (err) return done(err)
				assert.deepEqual(res.body, {
          status: 500,
          message: 'Internal server error'
				})
				done()
			})
	})

  it('Colored-Coins error', function (done) {
    request(app)
			.get('/cc_error')
			.expect(400)
			.end(function (err, res) {
        if (err) return done(err)
				assert.deepEqual(res.body, {
          name: 'ValidationError',
          code: 10000,
          status: 400,
          message: 'Validation error'
				})
				done()
			})
	})

	it('Colored-Coins error, with explanation', function (done) {
    request(app)
			.get('/cc_error?explain=true')
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err)
				assert.deepEqual(res.body, {
					name: 'ValidationError',
					code: 10000,
					status: 400,
					explanation: 'The given address is invalid',
					message: 'Validation error'
				})
				done()
			})
	})
})

describe('Test error of correct format - development', function () {

	before(function () {
		dynamicErrorHandler.replace(errorHandlerDevelopment)
	})

  it('string error', function (done) {
    request(app)
			.get('/string_error')
			.expect(500)
			.end(function (err, res) {
				if (err) return done(err)
				assert.equal(res.body.status, 500)
				assert.equal(res.body.message, 'Some Error')
				assert.notEqual(res.body.stack, undefined)
				done()
			})
	})

	it('array error', function (done) {
    request(app)
			.get('/array_error')
			.expect(500)
			.end(function (err, res) {
				if (err) return done(err)
				assert.equal(res.body.status, 500)
				assert.equal(res.body.message, 'Some Error')
				assert.notEqual(res.body.stack, undefined)
				done()
			})
	})

	it('raw error', function (done) {
    request(app)
			.get('/error')
			.expect(500)
			.end(function (err, res) {
				if (err) return done(err)
				assert.equal(res.body.status, 500)
				assert.equal(res.body.message, 'Internal server error')
				assert.notEqual(res.body.original, undefined)
				done()
			})
	})

	it('Colored-Coins error', function (done) {
    request(app)
			.get('/cc_error')
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err)
				assert.equal(res.body.status, 400)
				assert.equal(res.body.name, 'ValidationError')
				assert.equal(res.body.code, 10000)
				assert.equal(res.body.message, 'Validation error')
				assert.notEqual(res.body.stack, undefined)
				done()
			})
	})

	it('Colored-Coins error with explanation', function (done) {
    request(app)
			.get('/cc_error?explain=true')
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err)
				assert.equal(res.body.status, 400)
				assert.equal(res.body.name, 'ValidationError')
				assert.equal(res.body.code, 10000)
				assert.equal(res.body.message, 'Validation error')
				assert.equal(res.body.explanation, 'The given address is invalid')
				assert.notEqual(res.body.stack, undefined)
				done()
			})
	})

  it('Colored-Coins error with request-id', function (done) {
    dynamicRequestIdMiddleware.replace(requestIdMiddleware)
    request(app)
      .get('/cc_error?explain=true')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        assert.equal(res.body.status, 400)
        assert.equal(res.body.name, 'ValidationError')
        assert.equal(res.body.code, 10000)
        assert.equal(res.body.message, 'Validation error')
        assert.equal(res.body.explanation, 'The given address is invalid')
        assert.equal(res.body.requestId, 'request-id-1234')
        assert.notEqual(res.body.stack, undefined)
        done()
      })
  })
})
