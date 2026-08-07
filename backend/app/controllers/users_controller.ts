import type { HttpContext } from '@adonisjs/core/http'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@foadonis/openapi/decorators'
import User from '#models/user'
import { UserTransformer } from '#transformers/user_transformer'
import { UserResponse, UsersListResponse } from '#transformers/api_responses'

export default class UsersController {
  /**
   * GET /api/v1/users
   * Lista todos los usuarios. Requiere autenticación.
   */
  @ApiOperation({
    summary: 'List users',
    description:
      'Returns every user, newest first. There is no pagination and no filtering: the whole table is serialized on each call.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: () => UsersListResponse, description: 'The full list.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  async index({ response }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')
    return response.ok({ users: UserTransformer.collection(users) })
  }

  /**
   * GET /api/v1/users/:id
   * Devuelve un usuario por id. Requiere autenticación.
   */
  @ApiOperation({
    summary: 'Get a user by id',
    description:
      'Looks the user up by primary key. A non-numeric path segment reaches this route as well and fails the lookup, so the 404 also covers unknown sub-paths under `/users`.',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', schema: { type: 'integer' }, description: 'Primary key of the user.' })
  @ApiResponse({ status: 200, type: () => UserResponse, description: 'The requested user.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 404, description: 'No user matches that id.' })
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({ user: UserTransformer.toJSON(user) })
  }

  /*
  |----------------------------------------------------------------------
  | NOTA PARA EL FORMADOR:
  | El endpoint GET /api/v1/users/active (usuarios vistos en las
  | últimas 24h) se implementa EN VIVO durante la demo de la Sesión 3
  | aplicando el flujo Explore-Plan-Execute. No lo pre-implementes aquí.
  |----------------------------------------------------------------------
  */
}
