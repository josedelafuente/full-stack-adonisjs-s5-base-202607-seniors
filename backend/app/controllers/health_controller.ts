import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { HealthResponse } from '#transformers/api_responses'

export default class HealthController {
  /**
   * GET /api/v1/health
   * Endpoint de liveness. Creado en la Sesión 2 mediante el flujo OpenSpec.
   */
  @ApiOperation({
    summary: 'Liveness check',
    description:
      'Returns as soon as the HTTP layer is up. It does not check the database, so a healthy response does not imply the app can serve data.',
  })
  @ApiResponse({ status: 200, type: () => HealthResponse, description: 'The service is up.' })
  async index({ response }: HttpContext) {
    return response.ok({ status: 'ok' })
  }
}
