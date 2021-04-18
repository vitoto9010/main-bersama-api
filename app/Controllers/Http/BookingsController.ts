// import { Response } from '@adonisjs/http-server/build/standalone'
// import AuthManager from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import VenueValidator from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import Booking from 'App/Models/Booking'
// import Venue from 'App/Models/Venue'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class BookingsController {

   /**
  * @swagger
  * /api/v1/bookings:
  *   get:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: Show all bookings available
  *     responses:
  *       200:
  *         description: found all bookings
  */
  public async index ({response}: HttpContextContract) {
    const bookings = await Booking.all()
    return response.created({message: 'found all bookings', bookings})
  }

   /**
  * @swagger
  * /api/v1/bookings:
  *   post:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: insert new bookings
  *     parameters:
  *       - field_id: field_id
  *         description: field_id of field for booking
  *         in: query
  *         required: true
  *         type: int
  *       - play_date_start: play_date_start
  *         description: play_date_start of bookings
  *         in: query
  *         required: true
  *         type: string
  *       - play_date_end: play_date_end
  *         description: play_date_end of bookings
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: booking inserted
  */
  public async store({request, response, auth}: HttpContextContract) {
    const session_user = auth.user
    const id = session_user?.id

    const bookingSchema = schema.create({
      field_id: schema.number(),
    })

    const validatedData = await request.validate({
      schema: bookingSchema,
      messages: {
        'field_id.required' : 'field_id harus diisi'
      }
    })

    let field_id = validatedData.field_id
    let play_date_start = request.input('play_date_start')
    let play_date_end = request.input('play_date_end')
    let booking_user_id = id

    let booking = new Booking()
    booking.field_id = field_id
    booking.play_date_start = play_date_start
    booking.play_date_end = play_date_end
    booking.booking_user_id = booking_user_id

    await booking.save()
    console.log("booking: ", booking)

    return response.created({message: 'berhasil booking'})

  }

  /**
  * @swagger
  * /api/v1/bookings/:id:
  *   get:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: Show 1 bookings detail with player
  *     responses:
  *       200:
  *         description: one booking detail with player list
  */
  public async show({params, response}: HttpContextContract) {
    const findId = params.id
    let booking = await Booking.query().where('id', findId).preload('players')
    return response.created({message: 'found', booking})
  }

  /**
  * @swagger
  * /api/v1/bookings/:id/join:
  *   post:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: join to 1 bookings
  *     responses:
  *       200:
  *         description: join booking
  */
  public async join({params, response, auth}: HttpContextContract) {
    const findId = params.id
    const session_user = auth.user
    const id = session_user?.id
    let user = await User.find(id)
    let booking = await Booking.find(findId)
    if (booking != null && user!= null) {
      await booking.related('players').attach([user.id])
    }
    return response.created({message: 'Joined', booking})
  }

  /**
  * @swagger
  * /api/v1/bookings/:id/unjoin:
  *   post:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: unjoin to 1 bookings
  *     responses:
  *       200:
  *         description: unjoin booking
  */
  public async unjoin({params, response, auth}: HttpContextContract) {
    const findId = params.id
    const session_user = auth.user
    const id = session_user?.id
    let user = await User.find(id)
    let booking = await Booking.find(findId)
      if (booking != null && user!= null) {
        await booking.related('players').detach([user.id])
      }
    return response.created({message: 'found', booking})
  }

    /**
  * @swagger
  * /api/v1/bookings/:id:
  *   put, patch:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: change field id of bookings
  *     parameters:
  *       - field_id: field_id
  *         description: field_id of field for booking
  *         in: query
  *         required: true
  *         type: int
  *     responses:
  *       200:
  *         description: update the field_id off bookings
  */
  public async update({params, response, request}: HttpContextContract) {
    let field_id = request.input('field_id')
    let id = params.id
    let booking = await Booking.findOrFail(id)
    booking.field_id = field_id
    await booking.save()
    return response.created({message: 'updated', booking})
  }

   /**
  * @swagger
  * /api/v1/bookings/:id:
  *   delete:
  *     tags:
  *       - Bookings
  *     security:
  *       - bearerAuth: []
  *     summary: delete bookings
  *     responses:
  *       200:
  *         description: bookings deleted
  */
  public async destroy({params, response}: HttpContextContract) {
    let destroyId = params.id
    let booking = await Booking.findOrFail(destroyId)
    await booking.delete()
    return response.created({message: 'deleted', booking})
  }
}
