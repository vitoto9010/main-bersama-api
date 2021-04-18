import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasManyThrough, HasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Field from 'App/Models/Field'
import Booking from './Booking'

/**
*  @swagger
*  definitions:
*    User:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*        address:
*          type: string
*        phone:
*          type: string
*      required:
*        - name
*        - address
*        - phone
*/
export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public address:string

  @column()
  public phone:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Field, {
    foreignKey: 'venue_id',
  })
  public fields: HasMany<typeof Field>

  @hasManyThrough([() => Booking, () => Field], {
    localKey: 'id',
    foreignKey: 'venue_id',
    throughLocalKey: 'id',
    throughForeignKey: 'field_id'
  })
  public bookings: HasManyThrough<typeof Booking>
}
