import { defineConfig } from '@foadonis/openapi'

/**
 * Agrupación de operaciones en la documentación.
 *
 * Por defecto el paquete etiqueta cada operación con el nombre de su controller, y
 * eso reparte un mismo recurso en grupos distintos: `NewAccounts` y `AccessTokens`
 * son las dos mitades de la autenticación, y `Profiles` es el mismo recurso que
 * `Users` visto por el propio usuario.
 *
 * Se resuelve aquí y no con `@ApiTags` en cada controller porque los dos mecanismos
 * se suman en lugar de reemplazarse: con ambos, cada operación queda con el tag
 * elegido y el automático a la vez (`Health, Health`).
 *
 * Un controller que no esté en el mapa cae al comportamiento por defecto, así que
 * las rutas de la propia documentación conservan su grupo sin declararlas aquí.
 */
const CONTROLLER_TAGS: Record<string, string> = {
  HealthController: 'Health',
  NewAccountsController: 'Auth',
  AccessTokensController: 'Auth',
  ProfilesController: 'Profile',
  UsersController: 'Users',
}

/**
 * Configuración del contrato OpenAPI.
 *
 * `document` se mergea sobre el documento generado desde los decoradores, así que
 * aquí va solo lo que no puede inferirse del código: identidad de la API, servidores
 * y el esquema de seguridad.
 *
 * El esquema se llama `bearer` porque es el nombre que usa `@ApiBearerAuth()`
 * internamente (`ApiSecurity('bearer')`). Si se renombra aquí, las rutas protegidas
 * quedan referenciando un esquema inexistente.
 */
export default defineConfig({
  ui: 'scalar',
  tagger: (_route, target) => [
    CONTROLLER_TAGS[target.name] ?? target.name.replace(/Controller$/, ''),
  ],
  document: {
    info: {
      title: 'FlowSync API',
      version: '1.0.0',
      description:
        'REST API of FlowSync, the AI4Devs master project. Every endpoint lives under the `/api/v1` prefix. Authentication uses opaque access tokens issued at login.',
    },
    servers: [{ url: 'http://localhost:3333', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
          description:
            'Access token returned by `POST /api/v1/account/login`. Send it as `Authorization: Bearer oat_...`.',
        },
      },
    },
  },
})
