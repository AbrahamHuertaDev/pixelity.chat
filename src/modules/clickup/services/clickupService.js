const axios = require('axios');

class ClickUpService {
  constructor() {
    this.baseURL = 'https://api.clickup.com/api/v2';
  }

  // Crear cliente axios con el token de autorización
  createClient(authToken) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      }
    });
  }

  // Obtener todos los espacios de trabajo
  async getWorkspaces(authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get('/team');
      return response.data;
    } catch (error) {
      console.log(`Error al obtener espacios de trabajo: ${error.message}`);
      return null;
    }
  }

  // Obtener todos los espacios de un workspace
  async getSpaces(workspaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/space`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener espacios: ${error.message}`);
      return null;
    }
  }

  // Obtener todas las carpetas de un espacio
  async getFolders(spaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/space/${spaceId}/folder`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener carpetas: ${error.message}`);
      return null;
    }
  }

  // Obtener todas las listas de una carpeta
  async getFolderLists(folderId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/folder/${folderId}/list`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener listas de carpeta: ${error.message}`);
      return null;
    }
  }

  // Obtener todas las listas sin carpeta de un espacio
  async getFolderlessLists(spaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/space/${spaceId}/list`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener listas sin carpeta: ${error.message}`);
      return null;
    }
  }

  // Obtener todas las tareas de una lista
  async getTasks(listId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/list/${listId}/task`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener tareas: ${error.message}`);
      return null;
    }
  }

  // Obtener etiquetas de un espacio
  async getSpaceTags(spaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/space/${spaceId}/tag`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener etiquetas: ${error.message}`);
      return null;
    }
  }

  // Obtener roles personalizados
  async getCustomRoles(workspaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/customroles`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener roles personalizados: ${error.message}`);
      return null;
    }
  }

  // Obtener objetivos
  async getGoals(workspaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/goal`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener objetivos: ${error.message}`);
      return null;
    }
  }

  // Buscar documentos
  async searchDocs(workspaceId, query, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.log(`Error al buscar documentos: ${error.message}`);
      return null;
    }
  }

  // Obtener comentarios de una tarea
  async getTaskComments(taskId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/task/${taskId}/comment`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener comentarios: ${error.message}`);
      return null;
    }
  }

  // Obtener plantillas de tareas
  async getTaskTemplates(workspaceId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/task_template`);
      return response.data;
    } catch (error) {
      console.log(`Error al obtener plantillas: ${error.message}`);
      return null;
    }
  }

  // Obtener entradas de tiempo
  async getTimeEntries(workspaceId, startDate, endDate, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.get(`/team/${workspaceId}/time_entries`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.log(`Error al obtener entradas de tiempo: ${error.message}`);
      return null;
    }
  }

  // Obtener toda la información centralizada
  async getAllData(workspaceId, authToken) {
    const result = {
      spaces: [],
      customRoles: null,
      goals: null,
      taskTemplates: null,
      timestamp: new Date().toISOString()
    };

    try {
      // Obtener datos básicos del workspace
      const [spaces, customRoles, goals, taskTemplates] = await Promise.all([
        this.getSpaces(workspaceId, authToken),
        this.getCustomRoles(workspaceId, authToken),
        this.getGoals(workspaceId, authToken),
        this.getTaskTemplates(workspaceId, authToken)
      ]);

      result.customRoles = customRoles;
      result.goals = goals;
      result.taskTemplates = taskTemplates;

      // Si no hay espacios, retornar solo los datos básicos
      if (!spaces || !spaces.spaces) {
        return result;
      }

      // Obtener carpetas y listas para cada espacio
      const spacesWithDetails = await Promise.all(
        spaces.spaces.map(async (space) => {
          const spaceResult = { ...space, folders: [], folderlessLists: [], tags: null };

          try {
            const [folders, folderlessLists, tags] = await Promise.all([
              this.getFolders(space.id, authToken),
              this.getFolderlessLists(space.id, authToken),
              this.getSpaceTags(space.id, authToken)
            ]);

            spaceResult.tags = tags;

            // Obtener listas de cada carpeta
            if (folders && folders.folders) {
              const foldersWithLists = await Promise.all(
                folders.folders.map(async (folder) => {
                  const folderResult = { ...folder, lists: [] };

                  try {
                    const lists = await this.getFolderLists(folder.id, authToken);
                    if (lists && lists.lists) {
                      const listsWithTasks = await Promise.all(
                        lists.lists.map(async (list) => {
                          const listResult = { ...list, tasks: [], comments: [] };

                          try {
                            const [tasks, comments] = await Promise.all([
                              this.getTasks(list.id, authToken),
                              this.getTaskComments(list.id, authToken)
                            ]);

                            if (tasks) listResult.tasks = tasks.tasks || [];
                            if (comments) listResult.comments = comments.comments || [];
                          } catch (error) {
                            console.log(`Error al obtener detalles de lista ${list.id}: ${error.message}`);
                          }

                          return listResult;
                        })
                      );
                      folderResult.lists = listsWithTasks;
                    }
                  } catch (error) {
                    console.log(`Error al obtener listas de carpeta ${folder.id}: ${error.message}`);
                  }

                  return folderResult;
                })
              );
              spaceResult.folders = foldersWithLists;
            }

            // Obtener tareas y comentarios para listas sin carpeta
            if (folderlessLists && folderlessLists.lists) {
              const folderlessListsWithTasks = await Promise.all(
                folderlessLists.lists.map(async (list) => {
                  const listResult = { ...list, tasks: [], comments: [] };

                  try {
                    const [tasks, comments] = await Promise.all([
                      this.getTasks(list.id, authToken),
                      this.getTaskComments(list.id, authToken)
                    ]);

                    if (tasks) listResult.tasks = tasks.tasks || [];
                    if (comments) listResult.comments = comments.comments || [];
                  } catch (error) {
                    console.log(`Error al obtener detalles de lista sin carpeta ${list.id}: ${error.message}`);
                  }

                  return listResult;
                })
              );
              spaceResult.folderlessLists = folderlessListsWithTasks;
            }
          } catch (error) {
            console.log(`Error al obtener detalles del espacio ${space.id}: ${error.message}`);
          }

          return spaceResult;
        })
      );

      result.spaces = spacesWithDetails;
    } catch (error) {
      console.log(`Error al obtener datos del workspace ${workspaceId}: ${error.message}`);
    }

    return result;
  }
}

module.exports = new ClickUpService(); 