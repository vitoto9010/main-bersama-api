import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TodoValidator from 'App/Validators/TodoValidator'

export default class TodosController {
  public async index ({response}: HttpContextContract) {
    const data = [
      { id: 1, task: "belajar Adonis", dueDate: "2021-04-10"}
    ]
    return response.status(200).json(data)
  }

  public async store({request}: HttpContextContract) {
    const data = await request.validate(TodoValidator)

    console.log(data);

    return"OK"

  }

  public async show({params, response}: HttpContextContract) {
    const data = { id: params.id, tasl: "belajar Adonis", dueDate: "2021-04-10"}
    return response.status(200).json(data)
  }

  public async update({params, response}: HttpContextContract) {
    const data = { id: params.id, tasl: "belajar Adonis", dueDate: "2021-04-10"}
    return response.status(200).json(data)
  }

  public async delete({params, response}: HttpContextContract) {
    const data = { id: params.id, tasl: "belajar Adonis", dueDate: "2021-04-10"}
    return response.status(200).json(data)
  }


}
