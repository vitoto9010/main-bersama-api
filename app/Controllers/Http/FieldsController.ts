// import { Response } from '@adonisjs/http-server/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import VenueValidator from 'App/Validators/VenueValidator'
// import Database from '@ioc:Adonis/Lucid/Database'
import Field from 'App/Models/Field'

export default class FieldsController {
  public async index ({response}: HttpContextContract) {
    let fields = await Field.all()

    return response.status(200).json({message: 'success fetch venue', data: fields})
  }

  public async store({request, response, params}: HttpContextContract) {
    let name = request.input('name')
    let type = request.input('type')
    let venue_id = params.venue_id

    let field = new Field()
    field.name = name
    field.type = type
    field.venue_id = venue_id
    await field.save()
    console.log("field: ", field)

    return response.created({message: 'created'})

  }

  public async show({params, response}: HttpContextContract) {
    const findId = params.id
    let field = await Field.find(findId)
    return response.created({message: 'found', field})
  }

  public async update({params, response, request}: HttpContextContract) {
    let name = request.input('name')
    let id = params.id
    let field = await Field.findOrFail(id)
    field.name = name
    return response.created({message: 'updated', field})
  }

  public async destroy({params, response}: HttpContextContract) {
    let destroyId = params.id
    let field = await Field.findOrFail(destroyId)
    await field.delete()
    return response.created({message: 'deleted', field})
  }
}
