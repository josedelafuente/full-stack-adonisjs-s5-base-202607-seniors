import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { UserTransformer } from '#transformers/user_transformer'
import { AuthResponse, LogoutResponse } from '#transformers/api_responses'

export default class AccessTokensController {
  /**
   * POST /account/login
   * Verifica credenciales y emite un access token.
   */
  @ApiOperation({
    summary: 'Log in',
    description:
      'Verifies the credentials and issues an access token. Also refreshes the `lastSeenAt` timestamp of the user.',
  })
  @ApiBody({ type: () => loginValidator })
  @ApiResponse({ status: 200, type: () => AuthResponse, description: 'Credentials accepted.' })
  @ApiResponse({ status: 400, description: 'Validation failed on the request body.' })
  @ApiResponse({ status: 401, description: 'Email or password does not match.' })
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    user.lastSeenAt = DateTime.now()
    await user.save()

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: UserTransformer.toJSON(user),
      token: token.value!.release(),
    })
  }

  /**
   * POST /account/logout
   * Revoca el token usado en la petición actual.
   */
  @ApiOperation({
    summary: 'Log out',
    description:
      'Deletes the access token used in this request. Other tokens of the same user stay valid.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: () => LogoutResponse, description: 'Token revoked.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ revoked: true })
  }
}
