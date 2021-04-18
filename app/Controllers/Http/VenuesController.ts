// import { Response } from '@adonisjs/http-server/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import VenueValidator from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import Venue from 'App/Models/Venue'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class VenuesController {

   /**
  * @swagger
  * /api/v1/venues:
  *   get:
  *     tags:
  *       - Venues
  *     security:
  *       - bearerAuth: []
  *     summary: Show all venues available
  *     responses:
  *       200:
  *         description: found all venues
  */
  public async index ({response}: HttpContextContract) {
    let venues = await Venue.query().preload('bookings')

    return response.status(200).json({message: 'success fetch venue', data: venues})
  }

   /**
  * @swagger
  * /api/v1/venues:
  *   post:
  *     tags:
  *       - Venues
  *     security:
  *       - bearerAuth: []
  *     summary: Insert new venue
  *     parameters:
  *       - name: name
  *         description: name of venue
  *         in: query
  *         required: true
  *         type: string
  *       - address: address
  *         description: address of venues
  *         in: query
  *         required: true
  *         type: string
  *       - phone: phone
  *         description: phone of venues
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: venues inserted
  */
  public async store({request, response}: HttpContextContract) {
    const venueSchema = schema.create({
      name: schema.string(),
      address: schema.string(),
      phone: schema.string()
    })

    const validatedData = await request.validate({
      schema: venueSchema,
      messages: {
        'name.required' : 'name harus diisi',
        'address.required' : 'address harus diisi',
        'phone.required' : 'phone harus diisi'
      }
    })
    let name = validatedData.name
    let address = validatedData.address
    let phone = validatedData.phone

    let venue = new Venue()
    venue.name = name
    venue.address = address
    venue.phone = phone
    await venue.save()
    console.log("venue: ", venue)

    return response.created({message: 'created'})
  }

  /**
  * @swagger
  * /api/v1/venues/:id:
  *   get:
  *     tags:
  *       - Venues
  *     security:
  *       - bearerAuth: []
  *     summary: Show 1 venue
  *     responses:
  *       200:
  *         description: one venue detail with fields list
  */
  public async show({params, response}: HttpContextContract) {
    const findId = params.id
    const venue = await Venue.query().where('id', findId).preload('bookings')
    return response.created({message: 'found', venue})
  }

    /**
  * @swagger
  * /api/v1/venues/:id:
  *   put, patch:
  *     tags:
  *       - Venues
  *     security:
  *       - bearerAuth: []
  *     summary: change field id of venues
  *     parameters:
  *       - name: name
  *         description: name of venue
  *         in: query
  *         required: true
  *         type: int
  *     responses:
  *       200:
  *         description: update the name of venues
  */
  public async update({params, response, request}: HttpContextContract) {
    let name = request.input('name')
    let id = params.id
    let venue = await Venue.findOrFail(id)
    venue.name = name
    return response.created({message: 'updated', venue})
  }

  /**
  * @swagger
  * /api/v1/venues/:id:
  *   delete:
  *     tags:
  *       - Venues
  *     security:
  *       - bearerAuth: []
  *     summary: delete venues
  *     responses:
  *       200:
  *         description: venues deleted
  */
  public async destroy({params, response}: HttpContextContract) {
    let destroyId = params.id
    let venue = await Venue.findOrFail(destroyId)
    await venue.delete()
    return response.created({message: 'deleted', venue})
  }

}
