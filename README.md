# Pixelity Modules API

API para integración con ClickUp y otros servicios, diseñada para ser utilizada con n8n como project manager.

## Requisitos

- Node.js (versión 14 o superior)
- npm o yarn
- API Key de ClickUp

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd pixelity-modules
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar las siguientes variables:
     ```
     PORT=3000
     CLICKUP_API_KEY=tu_api_key_aqui
     ```

## Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## Endpoints de ClickUp

### Espacios de trabajo
- `GET /api/clickup/workspaces` - Obtener todos los espacios de trabajo

### Proyectos
- `GET /api/clickup/workspaces/:workspaceId/projects` - Obtener proyectos de un espacio de trabajo

### Listas
- `GET /api/clickup/spaces/:spaceId/lists` - Obtener listas de un proyecto

### Tareas
- `GET /api/clickup/lists/:listId/tasks` - Obtener tareas de una lista

### Usuarios
- `GET /api/clickup/workspaces/:workspaceId/users` - Obtener usuarios de un espacio de trabajo

### Etiquetas
- `GET /api/clickup/workspaces/:workspaceId/tags` - Obtener etiquetas de un espacio de trabajo

### Prioridades
- `GET /api/clickup/priorities` - Obtener todas las prioridades

### Detalles completos
- `GET /api/clickup/workspaces/:workspaceId/details` - Obtener todos los detalles de un proyecto (incluye proyectos, listas, tareas, usuarios, etiquetas y prioridades)

## Integración con n8n

Para integrar esta API con n8n:

1. En n8n, crear un nuevo workflow
2. Agregar un nodo HTTP Request
3. Configurar el nodo con la URL de la API y el endpoint deseado
4. Los datos devueltos estarán en formato JSON y podrán ser procesados por n8n

## Estructura del Proyecto

```
src/
├── index.js
└── modules/
    └── clickup/
        ├── controllers/
        │   └── clickupController.js
        ├── services/
        │   └── clickupService.js
        └── routes/
            └── index.js
``` 