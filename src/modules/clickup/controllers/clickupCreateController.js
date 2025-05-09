const clickUpCreateService = require('../services/clickupCreateService');

class ClickUpCreateController {
  static getAuthToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Token de autorización no proporcionado');
    }
    return authHeader;
  }

  // Crear un espacio (proyecto)
  static async createSpace(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { workspaceId } = req.params;
      const spaceData = req.body;

      const result = await clickUpCreateService.createSpace(workspaceId, spaceData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear el espacio' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear una carpeta
  static async createFolder(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { spaceId } = req.params;
      const folderData = req.body;

      const result = await clickUpCreateService.createFolder(spaceId, folderData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear la carpeta' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear una lista
  static async createList(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { spaceId } = req.params;
      const listData = req.body;

      const result = await clickUpCreateService.createList(spaceId, listData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear la lista' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear una lista dentro de una carpeta
  static async createFolderList(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { folderId } = req.params;
      const listData = req.body;

      const result = await clickUpCreateService.createFolderList(folderId, listData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear la lista en la carpeta' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear una tarea
  static async createTask(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { listId } = req.params;
      const taskData = req.body;

      const result = await clickUpCreateService.createTask(listId, taskData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear la tarea' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear una etiqueta
  static async createTag(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { spaceId } = req.params;
      const tagData = req.body;

      const result = await clickUpCreateService.createTag(spaceId, tagData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear la etiqueta' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Agregar etiqueta a una tarea
  static async addTagToTask(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { taskId, tagName } = req.params;

      const result = await clickUpCreateService.addTagToTask(taskId, tagName, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo agregar la etiqueta a la tarea' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Crear un proyecto completo
  static async createProject(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { workspace_id, space_id } = req.params;
      const projectData = req.body;

      if (!workspace_id || !space_id) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren workspace_id y space_id en la URL'
        });
      }

      const result = await clickUpCreateService.createProject(workspace_id, space_id, projectData, authToken);
      
      if (result.errors && result.errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El proyecto se creó con algunos errores',
          data: result,
          errors: result.errors
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear el proyecto',
        details: error.message
      });
    }
  }

  // Crear un documento
  static async createDoc(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { workspaceId } = req.params;
      const docData = req.body;

      const result = await clickUpCreateService.createDoc(workspaceId, docData, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo crear el documento' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Asociar documento a un espacio
  static async attachDocToSpace(req, res) {
    try {
      const authToken = ClickUpCreateController.getAuthToken(req);
      const { spaceId, docId } = req.params;

      const result = await clickUpCreateService.attachDocToSpace(spaceId, docId, authToken);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo asociar el documento al espacio' });
      }

      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = ClickUpCreateController; 