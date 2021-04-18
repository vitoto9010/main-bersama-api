import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.enu('type', ['futsal', 'mini soccer', 'basketball'],)
      table.integer('venue_id')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
