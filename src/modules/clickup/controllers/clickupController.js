const clickUpService = require('../services/clickupService');

class ClickUpController {
  // Obtener el token de autorización de los encabezados
  static getAuthToken(req) {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Token de autorización no proporcionado');
    }
    return authHeader;
  }

  // Obtener todos los espacios de trabajo
  static async getWorkspaces(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const workspaces = await clickUpService.getWorkspaces(authToken);
      res.json(workspaces);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener todos los espacios de un workspace
  static async getSpaces(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const spaces = await clickUpService.getSpaces(workspaceId, authToken);
      res.json(spaces);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener todas las carpetas de un espacio
  static async getFolders(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { spaceId } = req.params;
      const folders = await clickUpService.getFolders(spaceId, authToken);
      res.json(folders);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener todas las listas de una carpeta
  static async getFolderLists(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { folderId } = req.params;
      const lists = await clickUpService.getFolderLists(folderId, authToken);
      res.json(lists);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener todas las listas sin carpeta de un espacio
  static async getFolderlessLists(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { spaceId } = req.params;
      const lists = await clickUpService.getFolderlessLists(spaceId, authToken);
      res.json(lists);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener todas las tareas de una lista
  static async getTasks(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { listId } = req.params;
      const tasks = await clickUpService.getTasks(listId, authToken);
      res.json(tasks);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener etiquetas de un espacio
  static async getSpaceTags(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { spaceId } = req.params;
      const tags = await clickUpService.getSpaceTags(spaceId, authToken);
      res.json(tags);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener roles personalizados
  static async getCustomRoles(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const roles = await clickUpService.getCustomRoles(workspaceId, authToken);
      res.json(roles);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener objetivos
  static async getGoals(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const goals = await clickUpService.getGoals(workspaceId, authToken);
      res.json(goals);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Buscar documentos
  static async searchDocs(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const { query } = req.query;
      const docs = await clickUpService.searchDocs(workspaceId, query, authToken);
      res.json(docs);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener comentarios de una tarea
  static async getTaskComments(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { taskId } = req.params;
      const comments = await clickUpService.getTaskComments(taskId, authToken);
      res.json(comments);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener plantillas de tareas
  static async getTaskTemplates(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const templates = await clickUpService.getTaskTemplates(workspaceId, authToken);
      res.json(templates);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener entradas de tiempo
  static async getTimeEntries(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const { startDate, endDate } = req.query;
      const timeEntries = await clickUpService.getTimeEntries(workspaceId, startDate, endDate, authToken);
      res.json(timeEntries);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Obtener toda la información centralizada
  static async getAllData(req, res) {
    try {
      const authToken = ClickUpController.getAuthToken(req);
      const { workspaceId } = req.params;
      const data = await clickUpService.getAllData(workspaceId, authToken);
      res.json(data);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = ClickUpController; 