import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('field_id')
      table.integer('user_id')
      table.timestamp('play_date_start')
      table.dateTime('play_date_end')
      table.integer('booking_user_id')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
