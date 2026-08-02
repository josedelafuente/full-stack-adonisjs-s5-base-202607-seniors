# Ejercicio previo S5 — Revisión de backlog + auditoría de documentación

**Autor:** José de la Fuente
**Fecha:** 2 de agosto de 2026
**Repositorio auditado:** `LIDR-academy/full-stack-adonisjs-s5-base-202607-seniors` (fork propio, rama `alumno/jose-delafuente`)
**Entregable del pre-S4 revisado:** backlog de 12 historias de FlowSync generado desde `docs/PRD.md`

> **Nota de método.** Todos los hallazgos marcados como *verificado ejecutando* se comprobaron levantando el
> proyecto y llamando a la API, no leyendo el código. El anexo final documenta cómo reproducirlos.
>
> **Reparto de autoría.** La ejecución, los conteos y la redacción se apoyaron en un copiloto de IA
> (Claude Code). La selección de los cuatro ajustes, el estado asignado a cada tipo de documentación y el
> contenido de los dos Top 3 son decisiones propias, tomadas sobre la evidencia recolectada. Donde el
> criterio era discutible, queda señalado en el texto.

---

# Parte A — Revisión del backlog de historias de usuario

## Paso 2 — Contraste con lo que sé hoy

### ¿Siguen teniendo sentido las historias? ¿Se coló alcance inventado?

Sí, y no se coló. Verificado por contraste directo contra el PRD: cero menciones de notificaciones push,
webhooks, XML, JSON, app móvil o calendarios no-Google. Los cuatro puntos del *out of scope* explícito
(§1) están respetados.

El error que la S4 marcó como el más común de la IA —inflar el alcance, tipo *"exportar a CSV, JSON y
XML"* cuando el PRD solo dice CSV— no aparece. Lo atribuyo a las restricciones explícitas del prompt
(*"no inventes features"*, *"solo MVP"*) más que al azar.

### ¿Hay criterios de aceptación que ahora vea incompletos o poco verificables?

Sí, con un patrón sistemático: **ninguno de los ~50 criterios de aceptación especifica el código de
estado HTTP esperado en los casos de error**. Describen el efecto visible (*"veo un mensaje
comprensible"*) pero no el contrato de la API.

Lo que hace este hallazgo interesante no es la ausencia, sino **por qué** se produjo. El criterio sí
estaba en mi prompt, con un ejemplo literal de criterio correcto: `✅ Then el sistema responde con error
401 y el mensaje "Email o contraseña incorrectos"`. Pero el non-goal 3 del mismo prompt decía *"No
propongas arquitectura. Nada de endpoints, tablas, esquemas... El 'cómo' no es tuyo"*, y un código de
estado cayó bajo esa sombra. El modelo no falló: **obedeció a la prohibición en lugar de al ejemplo**, y
las dos instrucciones eran mías.

Lo verifiqué reejecutando el prompt en dos contextos limpios, cambiando una sola línea para admitir los
contratos observables: **con el prompt original, cero códigos de estado; con la línea desambiguada,
siete**, sin que se colara ni un endpoint ni una decisión de implementación. La ambigüedad era mía, no un
sesgo del modelo. Detalle secundario: la corrida limpia del original sí escribió el mensaje de error
concreto, así que esa parte fue ruido de una ejecución; **lo reproducible es únicamente la ausencia del
código de estado**.

Y una matización honesta: este criterio lo traigo de trabajar en brownfield, donde el código existente es
la fuente del contrato y basta con leerlo. En greenfield es discutible. Un 401 en un login es vocabulario
compartido; elegir entre 400 y 422 para un fallo de validación sí es una decisión de diseño que no le
corresponde al backlog. La regla útil no es "pon el código siempre", sino **distinguir el contrato
estándar de la decisión de diseño**, y cuando sea lo segundo, declararlo como pregunta abierta en lugar
de dejarlo en blanco.

### ¿Hay historias que hayan cambiado de naturaleza?

Sí, toda la épica 5 (Sincronización con Google Calendar). Cuando la escribí traté la sincronización como
funcionalidad descomponible. Hoy la leo como **territorio no explorado**: sus 4 historias acumulan 7
marcas de `(asumido)` —la densidad más alta del backlog— y los supuestos no son de detalle, son
estructurales: zona horaria, retroactividad de la primera sincronización, qué ocurre con el evento al
completar la tarea, política de reintentos.

### ¿Faltan historias que ahora sí deberían estar?

No falta funcionalidad: la cobertura del PRD está completa. Lo que falta es de otra naturaleza — un
**spike** que debería reemplazar (no acompañar) a la épica 5, y la declaración de **qué documentación
produce cada historia**, que es la lección de esta sesión.

### Contraste con el backlog del mentor: ¿qué prioricé distinto? ¿Quién acertó?

Dos diferencias reales, y el mentor acertó en la que importa.

| | Mi backlog | El del mentor | Veredicto |
|---|---|---|---|
| **Épica de sincronización** | 4 historias descompuestas | **No la creó**: un solo spike (`FLOW-13`), épica pendiente hasta revisarlo | **Él** — desarrollado bajo la tabla |
| **Escala de estimación** | Fibonacci | T-shirt en su `AGENTS.md`, pero Fibonacci en su skill `estimate-story` | **Yo, por poco.** Su propia demo tiene las dos escalas conviviendo. Pero el problema es de la herramienta, no de la escala: Linear tiene un único campo `estimate`, así que el time-box del spike terminó expresado en story points con una nota aclaratoria en un comentario. Quien sume el tablero suma peras con manzanas |

**Sobre la épica de sincronización.** El PRD §7 recomienda explícitamente *"un spike técnico antes de
comprometer su decomposición en tareas"*. Mi backlog descompuso la épica en cuatro historias; el suyo se
detuvo en el spike y dejó la épica sin crear. No fue una diferencia de información —el PRD era el mismo
para los dos— sino de criterio sobre cuándo una recomendación de riesgo debe frenar la planificación. La
densidad de supuestos lo confirma a posteriori: la épica 5 acumula 7 marcas de `(asumido)` en 4
historias, la más alta del backlog. Descomponer no aportó certeza; repartió la incertidumbre en más
sitios.

Donde mi entrega superó a la de referencia: el **listón explícito de criterios rechazables** en el
prompt. Los criterios de `FLOW-1` de la demo dicen *"un mensaje comprensible"* y *"un error de validación
claro"* — exactamente la familia que mi prompt rechaza con ejemplos. La demo aprieta donde hay una
magnitud que medir y afloja donde el criterio es cualitativo, que es justo el que se degrada solo.

## Paso 3 — Los cuatro ajustes

### Ajuste 1 — Retirar la épica 5 y sustituirla por un spike de Google Calendar

**Motivo:** el PRD §7 lo recomienda de forma explícita y el backlog descompuso igual. Descomponer una
integración externa cuyo comportamiento aún no está explorado produjo 7 supuestos estructurales en 4
historias — más superficie de planificación sobre la misma incertidumbre. Un spike no es menos trabajo:
es no fingir una certeza que todavía no existe.

### Ajuste 2 — Añadir non-goals y Definition of Done explícitos a cada historia

**Motivo:** el cierre de la S4 define el backlog AI-ready como *INVEST + Given/When/Then + contexto +
non-goals + DoD*. Mi backlog razona el DoD una sola vez, en las notas de alcance (el caso de responsive),
y nunca baja a las historias. Con un agente implementando, lo que no está escrito como fuera de alcance
se convierte en alcance.

### Ajuste 3 — Desambiguar el non-goal de arquitectura para que no se lleve por delante los contratos de error

**Motivo:** el problema no era que faltara el criterio —estaba, con ejemplo—, sino que otra instrucción
del mismo prompt lo anulaba. Lo confirmé con un A/B: cambiando esa única línea, los códigos de estado
pasan de 0 a 7 sin efectos secundarios. El aprendizaje va más allá de este caso: **un prompt puede
contener una instrucción y su neutralización a la vez**, y el output no lo señala — solo muestra la
ausencia. `prompt.md` y `output.md` quedan como se entregaron: corregirlos ahora falsearía la relación
entre ambos, y la contradicción es el hallazgo, no un defecto a parchear.

### Ajuste 4 — Declarar en cada historia qué documentación produce

**Motivo:** es la lección de la S5, y mi backlog tiene 0 menciones de documentación como entregable.
Auditar el repo base mostró el resultado de no hacerlo: cero ADRs, cero diagramas y una especificación
que promete un endpoint que no existe. La documentación que no es criterio de aceptación de alguna
historia no la escribe nadie.

### Dos candidatos que descarté a propósito

- **Responsive como historia propia.** Mi backlog ya lo resolvió mejor: lo declaró *"no verificable dentro
  de ninguna historia funcional sin inventar alcance"* y lo mandó al DoD del MVP. Convertirlo en historia
  sería empeorarlo.
- **Preguntas abiertas como issues bloqueantes.** Las 10 ya están documentadas con su fuente e impacto.
  Moverlas a issues es un cambio de proceso, no un ajuste del backlog.

---

# Parte B — Auditoría de documentación del proyecto

## Paso 4 — Formato elegido

Tabla de estados con detalle ampliado solo donde hay evidencia de ejecución. Elegí tabla porque los ocho
tipos se comparan mejor en paralelo, y añadí las secciones de detalle porque tres de los hallazgos no se
sostienen sin mostrar cómo se reprodujeron.

## Paso 5 — Auditoría por tipo

| # | Tipo | Estado | Observación | Ubicación |
|---|---|---|---|---|
| 1 | **README de proyecto** | **Parcial o pobre** | Bien estructurado y con comandos correctos, pero **no permite arrancar desde cero**: dos pasos fallan y ninguno está documentado. Además deja el repo sucio con artefactos generados sin ignorar | `README.md:21-43`, `backend/README.md` |
| 2 | **Arquitectura general** | **Parcial o pobre** | Descrita en prosa en tres sitios, pero **cero diagramas** de ningún tipo, y con una triple contradicción sobre el C4 | `README.md:6-14`, `CLAUDE.md:7-26`, `docs/PRD.md` §5 |
| 3 | **API / endpoints** | **Parcial o pobre** | Tabla de 7 endpoints correcta y verificada en vivo, pero **sin OpenAPI**, con una ruta indocumentada y sin contratos de error | `README.md:47-57`, `openspec/specs/*` |
| 4 | **Docstrings (TSDoc)** | **Parcial o pobre** | 12 de 31 archivos propios tienen bloque `/** */`, pero **0 de 31 usan una sola etiqueta TSDoc** (`@param`/`@returns`/`@throws`). El frontend no tiene ni un bloque | `backend/app/**`, `frontend/src/**` |
| 5 | **Decisiones técnicas (ADRs)** | **Inexistente** | No hay ningún ADR ni carpeta que los contenga. La ausencia está declarada como deliberada en `docs/README.md:8`, pero `README.md:11` los lista como contenido ya presente de `docs/` | Prometido en `README.md:11` |
| 6 | **Guía operacional** | **Inexistente** | Cero despliegue, cero CI, cero Docker, cero runbook, cero troubleshooting. El arranque local existe, pero se evalúa en el tipo 1 | — |
| 7 | **Convenciones de código** | **Parcial o pobre** | `CLAUDE.md` es bueno y **el código lo cumple**, pero afirma un hecho falso verificable sobre sí mismo, y el frontend no tiene linter ni formatter | `CLAUDE.md:41-49`, `backend/eslint.config.js` |
| 8 | **OpenSpec ↔ código** | **Parcial o pobre** | Divergencia confirmada **por ejecución**: la especificación promete un endpoint que no existe. 2 de sus 3 escenarios fallan y el tercero pasa por la razón equivocada | `openspec/specs/users/spec.md:51-77` |

### Detalle de los hallazgos verificados ejecutando

#### Tipo 1 — los dos fallos del README

Sobre un clon limpio, con `npm ci` (respetando el lockfile versionado) y Node 24:

- **El paso 4 falla.** `npm run migration:run` → `Cannot open database because the directory does not
  exist`. Causa: `backend/config/database.ts` apunta a `app.tmpPath('db.sqlite3')` → `backend/tmp/`, y
  **`backend/tmp` está en `.gitignore`**, así que nunca llega al clon. Ningún documento del repo menciona
  crearlo. Fix: `mkdir backend/tmp`.
- **El paso 5 falla.** `npm run dev` → `Cannot find package '@poppinss/ts-exec'`. No está declarado en
  `package.json` ni presente en el lockfile, pero el assembler lanza el proceso hijo con
  `--import=@poppinss/ts-exec`. Fix: `npm install @poppinss/ts-exec`.
- **El requisito de Node no está aplicado.** El README pide Node 24 correctamente, pero
  `backend/package.json` no tiene campo `engines`, así que npm no lo verifica; con Node 22 se produce el
  mismo error críptico, sin pista de que el problema es la versión. Aparte, y como desalineación menor y
  no como incumplimiento: `@types/node` está fijado en `^22.15.18`, un rango que no cubre las APIs
  añadidas en Node 24. No impide ejecutar —los tipos no imponen runtime— pero conviene validarlo contra
  las APIs realmente usadas antes de tocarlo.
- **El README deja el repo sucio.** `npm run migration:run` genera `backend/.adonisjs/` y
  `backend/database/schema.ts` —este último con el aviso *"automatically generated / DO NOT EDIT
  manually"*— y ninguno de los dos está en `.gitignore`. Quien siga el README y haga `git add .` commitea
  artefactos generados.

#### Tipo 2 — la triple contradicción sobre el C4

Tres afirmaciones del propio repo que no pueden ser ciertas a la vez:

- `README.md:11` → `docs/` contiene "PRD.md, ADRs, diagramas"
- `docs/README.md:5-7` → el PRD incluye un "diagrama C4"
- `docs/README.md:8` → los diagramas "se añaden en sesiones posteriores"

La realidad es la tercera: el PRD tiene **0 menciones** de C4 y el repo **0 archivos** de diagrama (ni
mermaid, ni `.png`, ni `.svg`, ni `.puml`).

#### Tipo 3 — qué falta en la API

Los 7 endpoints de la tabla del README responden exactamente como documentan, verificado con `curl`:
register, login, logout, profile, health, users y users/:id. Pero:

- **No hay OpenAPI ni Swagger** en ningún sitio del repo.
- `GET /` existe en `routes.ts:10` y responde `200 {"app":...,"status":"running"}` **sin estar
  documentado en ninguna parte**.
- Ningún documento lista los códigos de error por endpoint.

#### Tipo 7 — el `AGENTS.md` fantasma

`CLAUDE.md:3-5` afirma literalmente:

> *"En la Sesión 3 formalizamos esta memoria como `AGENTS.md` y la enlazamos con `ln -s AGENTS.md
> CLAUDE.md` para que sea agnóstica de la herramienta."*

Verificado: **`AGENTS.md` no existe** en el repo, y **`CLAUDE.md` no es un symlink** (es un archivo
regular). El documento que define las convenciones se equivoca sobre su propia naturaleza.

El contrapunto justo: la sección de convenciones del backend (`CLAUDE.md:41-49`) **sí se cumple
literalmente** en el código. `routes.ts` solo cablea rutas sin lógica de negocio, los cinco controllers
validan siempre con un validator de VineJS y serializan siempre vía `UserTransformer` sin devolver nunca
el modelo Lucid crudo, y todos los imports usan subpaths (`#controllers/*`, `#models/*`).

#### Tipo 8 — la divergencia, escenario por escenario

La especificación (`users/spec.md:51-77`) usa lenguaje normativo vigente: *"El sistema SHALL exponer `GET
/api/v1/users/active`"*, con tres escenarios.

| Escenario de la spec | Realidad ejecutada | |
|---|---|---|
| 200 con `{users}` ordenados por `last_seen_at` descendente | **404** con `E_ROW_NOT_FOUND` | Falla |
| Excluye usuarios con `last_seen_at` nulo o fuera de la ventana de 24h | No hay endpoint que excluya nada | Falla |
| 401 sin token | **401** | Pasa, pero **por accidente**: el middleware `auth` protege todo el grupo de rutas, no porque el endpoint exista |

Dos matices que hacen el hallazgo peor de lo que parece:

1. **El 404 no es "ruta no encontrada".** La ruta `/users/:id` (`routes.ts:35`) captura `"active"` como si
   fuera un id y `firstOrFail` de Lucid explota. El router se traga la llamada en silencio.
2. **El repo ya contiene la información correcta y la spec la contradice.** `README.md:57` dice *"El
   endpoint `GET /api/v1/users/active` se implementa en vivo en la Sesión 3"* — es decir, declara
   honestamente que aún no está. El código confirma el README. Es la especificación, y solo ella, la que
   se equivoca.

Y el dato sí existe: `last_seen_at` está en el modelo, en la migración, y el login lo actualiza
(verificado: tras hacer login, `lastSeenAt` pasa de `null` a la fecha). El esquema soporta la capability,
la spec la promete, el endpoint no está.

### Tipos adicionales detectados

| Tipo | Estado | Observación |
|---|---|---|
| **Variables de entorno** | **Parcial o pobre** | Están cruzadas: `.env.example` declara `TZ`, que `start/env.ts` no valida; y `env.ts:15` valida `DB_DATABASE`, que **no está en `.env.example` y que `config/database.ts` nunca usa** (el nombre del fichero SQLite está fijado en código). Variable declarada, validada y muerta |
| **Documentación interna filtrada** | **Es un defecto del montaje, no del proyecto** | `docs/NOTAS-FORMADOR.md` se autodescribe como *"Documento interno para el mentor. NO es material para los alumnos"* y viaja en el repo que clonan los alumnos, con la solución del ejercicio explicada |

## Paso 6 — Los dos Top 3

**Criterio aplicado:** duele lo que **sorprende a quien llega**, no lo que está declarado y gestionado.
Por eso los ADRs y la guía operacional quedan fuera pese a ser los dos únicos `Inexistente`: su ausencia
está anunciada en `docs/README.md:8`, y nadie espera runbooks de producción en un repo-plantilla.

### Top 3 carencias que más duelen

**1. El README no permite arrancar el proyecto desde cero, que es lo único que un README tiene que
garantizar.**
Dos de los cinco pasos del arranque fallan en un clon limpio y ninguno está documentado: `backend/tmp/` no
existe porque está en `.gitignore` (rompe las migraciones) y `@poppinss/ts-exec` no está declarado como
dependencia (rompe `npm run dev`). Los dos fallan con errores que no dicen qué hacer. El requisito de
Node 24 está en la prosa pero no aplicado, así que con Node 22 el síntoma es idéntico y engañoso. Duele
porque es la puerta de entrada y porque el coste recae entero sobre quien menos contexto tiene.

**2. La especificación de OpenSpec contradice al README y al código sobre el mismo endpoint — y es la
especificación la que lee el agente.**
`users/spec.md:53` declara con lenguaje normativo vigente que el sistema *SHALL exponer* `GET
/api/v1/users/active`, con tres escenarios detallados. `README.md:57` dice lo contrario y acierta. El
código confirma el README. Duele más que una desactualización corriente porque el máster propone OpenSpec
como fuente de verdad para que un agente implemente: aquí el agente construiría sobre la única capa que se
equivoca, teniendo el dato correcto a un archivo de distancia.

**3. No existe especificación formal de la API: vive triplicada en prosa, sin fuente única, y ya
divergió.**
Los endpoints se describen en `README.md`, `openspec/specs/authentication/spec.md` y
`openspec/specs/users/spec.md`, sin OpenAPI ni Swagger en ningún sitio. Tres copias que hay que mantener a
mano — y la carencia 2 es la prueba de que ya no se mantienen. Además nada documenta los códigos de error,
y `GET /` responde 200 sin figurar en ninguna de las tres. Duele porque es la carencia que el directo
puede cerrar de raíz: una especificación generada del código convierte tres copias divergentes en una
fuente y dos derivados.

### Top 3 cosas que ya están bien

**1. La API real hace exactamente lo que su documentación dice, y el frontend arranca sin fricción.**
Los 7 endpoints de `README.md:47-57` los verifiqué uno a uno con `curl`: responden con el código y la
forma documentados. El frontend levantó siguiendo el README sin un solo tropiezo. La tabla de endpoints es
el artefacto más fiable del repo — **no reescribirla**: sirve como fuente para generar el OpenAPI.

**2. Las convenciones del backend son ciertas, y el código las cumple al pie de la letra.**
`CLAUDE.md:41-49` no es documentación aspiracional: `routes.ts` solo cablea rutas sin lógica, los cinco
controllers validan siempre con VineJS y serializan siempre vía `UserTransformer`, y todos los imports
usan subpaths. Documentación que describe la realidad en lugar de prescribirla. **No tocar esa sección** —
es la que mejor resiste la verificación contra el código.

**3. El PRD funciona como fuente de verdad de producto, y lo hace bien.**
139 líneas con *out of scope* explícito (§1, cuatro exclusiones nombradas), requisitos no funcionales
cuantificados, y riesgos que no se limitan a señalar el peligro sino que dicen qué hacer con él: §7
declara la sincronización como el mayor riesgo técnico del MVP y acto seguido recomienda *"un spike
técnico antes de comprometer su decomposición en tareas"*. Añade además una nota de producto que acota
la dirección de la sincronización para el MVP. Es el documento que permite auditar sin ambigüedad si un
backlog derivado se salió del alcance. **No rehacerlo**: el material de planificación ya tiene su fuente.

---

# Paso 7 — Exploración rápida de tres formatos

**C4 model.** Obliga a decidir **a qué nivel de abstracción y para quién** hablas antes de dibujar, algo
que unas notas en Markdown nunca fuerzan: los cuatro niveles (Software system → Container → Component →
Code) tienen unidades distintas y audiencias distintas, y del más alto el sitio oficial dice que es *"the
sort of diagram that you could show to non-technical people"*.
*Aplicado a este repo:* la arquitectura está descrita en prosa en tres sitios y ninguno declara a qué
nivel habla; por eso las tres descripciones se solapan sin completarse.

**ADR.** Conserva el **por qué** y lo que se descartó, con una regla que un Markdown editable destruye por
diseño — *"Don't alter existing information in an ADR. Instead, amend the ADR by adding new information,
or supersede the ADR by creating a new ADR"*, sobre la plantilla de cinco campos de Nygard (Title,
Status, Context, Decision, Consequences).
*Aplicado a este repo:* hay justificaciones reales sueltas en prosa —el `UserTransformer` en
`CLAUDE.md:45-47`, el recorte de la sincronización inversa en `PRD.md:91`— pero al vivir dentro de
documentos que se reescriben, la próxima edición se las lleva sin dejar rastro.

**OpenAPI.** Deja de ser documentación **para leer** y pasa a ser una fuente **legible por máquina** de la
que se derivan otras cosas: GitHub publica la suya (`github/rest-api-description`) precisamente para
*"generate libraries to facilitate using the REST API, validate and test integrations, or explore and
interact with the REST API using third-party tools, such as Insomnia or Postman"*.
*Aplicado a este repo:* es la respuesta directa a la carencia n.º 3 — tres descripciones de la misma API
en prosa que hay que sincronizar a mano y que ya divergieron; una especificación convierte tres copias en
una fuente y dos derivados.

**Fuentes:** [c4model.com](https://c4model.com) ·
[joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)
· [spec.openapis.org](https://spec.openapis.org/oas/v3.2.0.html) ·
[github/rest-api-description](https://docs.github.com/en/rest/about-the-rest-api/about-the-openapi-description-for-the-rest-api)

---

# Anexo — Cómo reproducir los hallazgos de ejecución

Entorno usado: Node 24.4.1, npm 11.4.2, Linux (WSL2).

**Punto de partida (importante).** `npm ci` por sí solo **no** devuelve el repo a su estado original: no
revierte un `package.json` modificado por el fix de `ts-exec`, ni borra los artefactos sin versionar que
generan las migraciones. Lo ideal es un clon nuevo; si se reutiliza el mismo directorio, este es el reset
completo:

```bash
# desde la raíz del repo
git checkout -- backend/package.json backend/package-lock.json
rm -rf backend/node_modules backend/tmp backend/.adonisjs \
       backend/database/schema.ts backend/.env
git status --short          # debe salir vacío
```

**Los dos fallos del arranque:**

```bash
cd backend
npm ci
cp .env.example .env
node ace generate:key
npm run migration:run        # falla: "Cannot open database because the directory does not exist"
mkdir tmp                    # fix no documentado
npm run migration:run        # ahora sí: "Migrated in 144 ms"
npm run dev                  # falla: "Cannot find package '@poppinss/ts-exec'"
npm install @poppinss/ts-exec   # segundo fix no documentado (añade 14 paquetes)
npm run dev                  # ahora arranca en :3333
```

**La divergencia de la especificación.** La base de datos está recién migrada y por tanto vacía, así que
hay que crear la cuenta antes de poder autenticarse:

```bash
B=http://localhost:3333/api/v1

# 1. crear la cuenta (sin esto, el login no tiene contra qué autenticar)
curl -s -X POST $B/account/register -H 'Content-Type: application/json' \
  -d '{"fullName":"Audit User","email":"audit@example.com","password":"secret1234"}'
# → 201

# 2. autenticarse y quedarse con el token
TOKEN=$(curl -s -X POST $B/account/login -H 'Content-Type: application/json' \
  -d '{"email":"audit@example.com","password":"secret1234"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# 3. el endpoint que la spec promete
curl -s -w '\nHTTP %{http_code}\n' $B/users/active -H "Authorization: Bearer $TOKEN"
# → HTTP 404, con "name":"E_ROW_NOT_FOUND" de Lucid
#   No es un 404 de ruta inexistente: /users/:id captura "active" como si fuera un id.

# 4. contraste — el endpoint que sí existe
curl -s -w '\nHTTP %{http_code}\n' $B/users -H "Authorization: Bearer $TOKEN"
# → HTTP 200, y lastSeenAt viene poblado tras el login,
#   lo que confirma que el dato que la spec necesita sí existe.

# 5. el tercer escenario de la spec, que "pasa" por accidente
curl -s -o /dev/null -w 'HTTP %{http_code}\n' $B/users/active
# → HTTP 401, pero por el middleware auth del grupo, no porque el endpoint exista.
```

**Los conteos de docstrings:** 31 archivos `.ts`/`.tsx` propios (excluyendo `node_modules`,
`database/schema.ts` y `vite-env.d.ts`, ambos generados); 12 con algún bloque `/** */`, todos en backend;
**0** con etiquetas `@param`, `@returns` o `@throws`.
