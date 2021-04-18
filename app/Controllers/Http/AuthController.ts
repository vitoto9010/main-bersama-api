import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {

   /**
  * @swagger
  * /api/v1/login:
  *   post:
  *     tags:
  *       - Authentication
  *     summary: Do Login
  *     parameters:
  *       - email: email
  *         description: user email
  *         in: query
  *         required: true
  *         type: int
  *       - password: password
  *         description: password user
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Send login success and logged in
  */
  public async login ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return response.status(200).json({message: 'login success', token})
  }

   /**
  * @swagger
  * /api/v1/register:
  *   post:
  *     tags:
  *       - Authentication
  *     summary: Do Register of new user
  *     parameters:
  *       - name: name
  *         description: name of user
  *         in: query
  *         required: true
  *         type: int
  *       - email: email
  *         description: email of user
  *         in: query
  *         required: true
  *         type: string
  *       - password: password
  *         description: password of user
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Send Register success and send email with otp
  */
  public async register({ request, response}: HttpContextContract) {
    const name = request.input('name')
    const email = request.input('email')
    const password = request.input('password')

    const newUser = await User.create({name, email, password})

    const otp_code = Math.floor(100000 + Math.random() * 900000)

    await Database.table('otp_codes').insert({otp_code: otp_code, user_id: newUser.id})

    await Mail.send((message) => {
        message
          .from('admin@todo.com')
          .to(email)
          .subject('Welcome Onboard!')
          .htmlView('emails/otp_verification', { otp_code })
    })

    return response.created({ message: 'register success, please verify'})
  }

   /**
  * @swagger
  * /api/v1/verifikasi-otp:
  *   post:
  *     tags:
  *       - Authentication
  *     summary: Do confirmation for OTP
  *     parameters:
  *       - otp_code: otp_code
  *         description: otp code that has been sent to email
  *         in: query
  *         required: true
  *         type: int
  *       - email: email
  *         description: email of user
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: do confirmation otp
  */
  public async otpConfirmation({request, response}: HttpContextContract){
    let otp_code = request.input('otp_code')
    let email = request.input('email')

    let user = await User.findBy('email', email)
    let otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).first()

    if (user?.id == otpCheck.user_id) {
      if (user?.isVerified != null) {
        user.isVerified = true
      }
      await user?.save()
      return response.status(200).json({message: 'berhasil konfirmasi otp'})
    } else {
      return response.status(400).json({message: 'gagal konfirmasi otp'})
    }
  }
}
