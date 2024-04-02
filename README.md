# Proyecto TalentPitch

Este proyecto se ha desarrollado utilizando un conjunto de tecnologías modernas y eficientes para ofrecer una solución backend robusta y escalable. Aquí encontrarás toda la información necesaria para la instalación, configuración y uso de TalentPitch API.

## Stack Tecnológico

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **GitHub Actions**
- **OpenAI (ChatGPT)**
- **VPS con Ubuntu y Nginx**
- **Docker con Docker Compose**

## Instrucciones de Instalación

1. **Clonar el Repositorio**
   Clona el repositorio a tu máquina local usando: `git clone <URL_DEL_REPOSITORIO`

2. **Instalar Docker y Docker Compose**
   Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

3. **Crear Archivo .env**
   En la raíz del proyecto, crea un archivo `.env` siguiendo el ejemplo proporcionado en `.env.example`. Configura las siguientes variables:

- `POSTGRES_PASSWORD`: Elige una contraseña segura.
- `DATABASE_URL`: Construye esta URL usando el password elegido.
- `GPT_SECRET`: Obtén esta clave desde el dashboard de OpenAI.

4. **Ejecutar la Aplicación**
   Ejecuta el proyecto con: `npm run start` o `bash yarn start`

Esto levantará la base de datos y la aplicación en modo local, quedando disponible en `http://localhost:4000`.

## Test unitarios

Para ejecutar los test unitarios, utiliza el comando `npm run test` o `yarn test`. dentro de la carpeta `api`.

## Instrucciones de Uso

Para probar el API que esta desplegada en el servidor VPS, puedes acceder a la siguiente URL:
`https://talentpitch-api.netglow.tech`

Para llenar la base de datos con informacion dummy desde la API de openai, ejecuta el siguiente endpoint:

`GET /api/v1/fill-db`

esto llenara la base de datos con:

- 5 usuarios
- 5 empresas
- 5 programas
- 10 retos
- 5 participantes en programas

El backend tambien expone un CRUD (Crear, Leer, Actualizar, Eliminar) para los siguientes modelos, con los endpoints especificados:

### Modelo `users`

- **Listar Usuarios**
  `GET /api/v1/users`
- **Obtener Usuario por ID**
  `GET /api/v1/user/:id`
- **Crear Usuario**
  `POST /api/v1/user`
  `Body: {"name": "string", "email": "string", "image_path": "string"}`
- **Actualizar Usuario por ID**
  `PUT /api/v1/user/:id`
  `Body: {"name": "string", "email": "string", "image_path": "string"}`
- **Eliminar Usuario por ID**
  `DELETE /api/v1/user/:id`

### Modelo `programs`

- **Listar Programas**
  `GET /api/v1/programs`
- **Obtener Programa por ID**
  `GET /api/v1/program/:id`
- **Crear Programa**
  `POST /api/v1/program`
  `Body: {"title": "string", "description": "string", "users_id": "string", "start_date": "string", "end_date": "string"}`
- **Actualizar Programa por ID**
  `PUT /api/v1/program/:id`
  `Body: {"title": "string", "description": "string", "users_id": "string", "start_date": "string", "end_date": "string"}`
- **Eliminar Programa por ID**
  `DELETE /api/v1/program/:id`

### Modelo `companies`

- **Listar Empresas**
  `GET /api/v1/companies`
- **Obtener Empresa por ID**
  `GET /api/v1/company/:id`
- **Crear Empresa**
  `POST /api/v1/company`
  `Body: {"name": "string", "industry": "string", "location": "string", "users_id": "string"}`
- **Actualizar Empresa por ID**
  `PUT /api/v1/company/:id`
  `Body: {"name": "string", "industry": "string", "location": "string", "users_id": "string"}`
- **Eliminar Empresa por ID**
  `DELETE /api/v1/company/:id`

### Modelo `Retos`

- **Listar Retos**
  `GET /api/v1/challenges`
- **Obtener Reto por ID**
  `GET /api/v1/challenge/:id`
- **Crear Reto**
  `POST /api/v1/challenge`
  `Body: {"title": "string", "description": "string", "users_id": "string",difficulty: integer}`
- **Actualizar Reto por ID**
  `PUT /api/v1/challenge/:id`
  `Body: {"title": "string", "description": "string", "users_id": "string",difficulty: integer}`
- **Eliminar Reto por ID**
  `DELETE /api/v1/challenge/:id`

### Modelo `participations`

- **Listar Participaciones**
  `GET /api/v1/program-participants`
- **Obtener Participacion por ID**
  `GET /api/v1/program-participant/:id`
- **Crear Participacion**
  `POST /api/v1/program-participant`
  `Body: {"programs_id": "string"}` y alguno de las 3 posibles relaciones `{"users_id": "string"}` o `{"companies_id": "string"}` o `{"challenges_id": "string"}`
- **Actualizar Participacion por ID**
  `PUT /api/v1/program-participant/:id`
  `Body: {"programs_id": "string"}` y alguno de las 3 posibles relaciones `{"users_id": "string"}` o `{"companies_id": "string"}` o `{"challenges_id": "string"}`
- **Eliminar Participacion por ID**
  `DELETE /api/v1/program-participant/:id`

Sigue estas instrucciones para interactuar con la aplicación y gestionar los recursos disponibles.
