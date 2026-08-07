import { ApiProperty } from '@foadonis/openapi/decorators'

/**
 * DTOs del contrato público de la API.
 *
 * Existen para que el OpenAPI describa lo que los controllers devuelven de verdad,
 * sin exponer el modelo Lucid: el shape sale de `UserTransformer`, y estas clases
 * son su declaración para el contrato. Si el transformer cambia, estas clases
 * cambian con él — son la misma decisión escrita dos veces a propósito, porque
 * el transformer no lleva tipos que el generador pueda leer.
 *
 * Las descripciones van en inglés por la convención de artefactos de
 * `docs/decisiones-documentacion-flowsync.md`; los comentarios de código siguen
 * en español, como el resto del repositorio.
 */

export class UserResource {
  @ApiProperty({ type: Number, description: 'Unique identifier of the user.', example: 1 })
  declare id: number

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Display name. Null when the account was created without one.',
    example: 'Ada Lovelace',
  })
  declare fullName: string | null

  @ApiProperty({
    type: String,
    format: 'email',
    description: 'Normalized email address. Doubles as the login identifier.',
    example: 'audit@example.com',
  })
  declare email: string

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Last successful login. Null until the user logs in for the first time.',
    example: '2026-08-06T18:20:11.000-04:00',
  })
  declare lastSeenAt: string | null

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: 'Creation timestamp of the account.',
    example: '2026-08-02T09:34:00.000-04:00',
  })
  declare createdAt: string | null
}

export class AuthResponse {
  @ApiProperty({ type: () => UserResource, description: 'The authenticated user.' })
  declare user: UserResource

  @ApiProperty({
    type: String,
    description:
      'Opaque access token, prefixed with `oat_`. Send it as `Authorization: Bearer <token>`. Returned only once, at creation time.',
    example: 'oat_MQ.dEhKZm4wZ0F5b0RwcVBibjB5YkJ3',
  })
  declare token: string
}

export class UserResponse {
  @ApiProperty({ type: () => UserResource })
  declare user: UserResource
}

export class UsersListResponse {
  @ApiProperty({ type: () => [UserResource], description: 'Users, newest first.' })
  declare users: UserResource[]
}

export class LogoutResponse {
  @ApiProperty({
    type: Boolean,
    description: 'Always true. The token used in the request has been deleted.',
    example: true,
  })
  declare revoked: boolean
}

export class HealthResponse {
  @ApiProperty({ type: String, description: 'Liveness marker.', example: 'ok' })
  declare status: string
}
