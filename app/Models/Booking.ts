import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

/**
*  @swagger
*  definitions:
*    User:
*      type: object
*      properties:
*        id:
*          type: uint
*        field_id:
*          type: int
*        play_date_start:
*          type: DateTime
*        play_date_end:
*          type: DateTime
*      required:
*        - field_id
*        - play_date_start
*        - play_date_end
*/
export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public field_id: number

  @column()
  public play_date_start: DateTime

  @column()
  public play_date_end: DateTime

  @column()
  public booking_user_id: number | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'players',
    localKey: 'id',
    pivotForeignKey: 'booking_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public players: ManyToMany<typeof User>

}
