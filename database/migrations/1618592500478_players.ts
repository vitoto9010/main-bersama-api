import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Players extends BaseSchema {
  protected tableName = 'players'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id')
      table.integer('booking_id')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
