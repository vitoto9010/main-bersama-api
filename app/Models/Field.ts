import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
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
*          type: sring
*        type:
*          type: string
*        venue_id:
*          type: int
*      required:
*        - name
*        - type
*        - venue_id
*/
export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String

  @column()
  public type: ['futsal', 'mini soccer', 'basketball']

  @column()
  public venue_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Booking, {
    foreignKey: 'field_id',
  })
  public bookings: HasMany<typeof Booking>
}
