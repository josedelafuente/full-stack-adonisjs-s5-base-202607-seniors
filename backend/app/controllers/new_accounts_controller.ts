import type { HttpContext } from '@adonisjs/core/http'
import { ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import User from '#models/user'
import { signupValidator } from '#validators/auth'
import { UserTransformer } from '#transformers/user_transformer'
import { AuthResponse } from '#transformers/api_responses'

export default class NewAccountsController {
  /**
   * POST /account/register
   * Crea una cuenta nueva y devuelve el usuario + un access token.
   */
  @ApiOperation({
    summary: 'Register a new account',
    description:
      'Creates the account and returns it together with a first access token, so the caller does not need to log in right after registering.',
  })
  @ApiBody({ type: () => signupValidator })
  @ApiResponse({ status: 201, type: () => AuthResponse, description: 'Account created.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed. Includes the case of an email that is already taken.',
  })
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    const user = await User.create(data)
    const token = await User.accessTokens.create(user)

    return response.created({
      user: UserTransformer.toJSON(user),
      token: token.value!.release(),
    })
  }
}
