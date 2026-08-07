import type { HttpContext } from '@adonisjs/core/http'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { UserTransformer } from '#transformers/user_transformer'
import { UserResponse } from '#transformers/api_responses'

export default class ProfilesController {
  /**
   * GET /account/profile
   * Devuelve el usuario autenticado. Requiere Bearer token.
   */
  @ApiOperation({
    summary: 'Get the authenticated user',
    description: 'Resolves the user from the access token in the request. Takes no parameters.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: () => UserResponse, description: 'The authenticated user.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ user: UserTransformer.toJSON(user) })
  }
}
