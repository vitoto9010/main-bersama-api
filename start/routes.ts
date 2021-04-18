/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
// import BookingsController from 'App/Controllers/Http/BookingsController'

Route.get('/', async () => {
  return {
    hello: 'world'
  }
})

Route.group(() => {

  Route.get('/about', async () => {
    return {
      title: 'about todo api',
      body: 'this is todo api built with adonis',
    }
  }).as('about')

  Route.resource('todos', 'TodosController').only(['index', 'show', 'store'])
  Route.resource('venues', 'VenuesController').apiOnly().middleware({ '*':'auth'})
  Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({ '*':'auth'})
  Route.resource('bookings', 'BookingsController').apiOnly().middleware({ '*':'auth'})
  Route.post('/bookings/:id/join', 'BookingsController.join').as('booking.join').middleware('auth')
  Route.post('/bookings/:id/unjoin', 'BookingsController.unjoin').as('booking.unjoin').middleware('auth')

  Route.get('/test-context-http', async (ctx) => {
    console.log(ctx.inspect())
    return 'OK'
  }).as('testHttpContext')

  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/verifikasi-otp', 'AuthController.otpConfirmation').as('auth.otp')
  Route.get('/api/hello', 'TestsController.hello').as('hello')

}).prefix('/api/v1').as('apiv1')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})
