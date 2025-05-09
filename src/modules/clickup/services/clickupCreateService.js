const axios = require('axios');

class ClickUpCreateService {
  constructor() {
    this.baseURL = 'https://api.clickup.com/api/v2';
    this.docBaseURL = 'https://api.clickup.com/api/v3';
  }

  createClient(authToken) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      }
    });
  }

  createDocClient(authToken) {
    return axios.create({
      baseURL: this.docBaseURL,
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      }
    });
  }

  // Crear un espacio (proyecto)
  async createSpace(workspaceId, spaceData, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/team/${workspaceId}/space`, spaceData);
      return response.data;
    } catch (error) {
      console.log(error);
      console.log(`Error al crear espacio: ${error.message}`);
      return null;
    }
  }

  // Crear una carpeta
  async createFolder(spaceId, folderData, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/space/${spaceId}/folder`, folderData);
      return response.data;
    } catch (error) {
      console.log(`Error al crear carpeta: ${error.message}`);
      return null;
    }
  }

  // Crear una lista
  async createList(spaceId, listData, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/space/${spaceId}/list`, listData);
      return response.data;
    } catch (error) {
      console.log(`Error al crear lista: ${error.message}`);
      return null;
    }
  }

  // Crear una lista dentro de una carpeta
  async createFolderList(folderId, listData, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/folder/${folderId}/list`, listData);
      return response.data;
    } catch (error) {
      console.log(`Error al crear lista en carpeta: ${error.message}`);
      return null;
    }
  }

  // Crear una tarea
  async createTask(listId, taskData, authToken) {
    try {
      const client = this.createClient(authToken);
      const formattedTaskData = {
        name: taskData.name,
        description: taskData.description || '',
        markdown_content: taskData.description || '',
        status: taskData.status || 'to do',
        priority: taskData.priority || 3,
        due_date: taskData.due_date ? new Date(taskData.due_date).getTime() : null,
        assignees: taskData.assignees || [],
        custom_fields: taskData.custom_fields || []
      };
      const response = await client.post(`/list/${listId}/task`, formattedTaskData);
      return response.data;
    } catch (error) {
      console.log(`Error al crear tarea: ${error.message}`);
      if (error.response) {
        console.log(`Detalles del error: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }

  // Crear una etiqueta
  async createTag(spaceId, tagData, authToken) {
    try {
      const client = this.createClient(authToken);
      // Formato correcto según la documentación de ClickUp
      const formattedTagData = {
        tag: {
          name: tagData.name,
          tag_fg: tagData.color || '#000000',
          tag_bg: tagData.background || '#ffffff'
        }
      };
      const response = await client.post(`/space/${spaceId}/tag`, formattedTagData);
      return response.data;
    } catch (error) {
      console.log(`Error al crear etiqueta: ${error.message}`);
      return null;
    }
  }

  // Agregar etiqueta a una tarea
  async addTagToTask(taskId, tagName, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/task/${taskId}/tag/${encodeURIComponent(tagName)}`);
      return response.data;
    } catch (error) {
      console.log(`Error al agregar etiqueta a tarea: ${error.message}`);
      return null;
    }
  }

  // Crear un documento
  async createDoc(workspaceId, docData, authToken) {
    try {
      const client = this.createDocClient(authToken);
      
      // Crear el documento principal usando la ruta v3 con el tipo de padre correcto
      const docResponse = await client.post(`/workspaces/${workspaceId}/docs`, {
        name: docData.name,
        parent: {
          id: workspaceId,
          type: 12 // 12 para Workspace
        },
        create_page: true
      });

      if (!docResponse.data || !docResponse.data.id) {
        throw new Error('No se pudo crear el documento');
      }

      const docId = docResponse.data.id;
      const createdPages = [];

      // Crear las páginas del documento usando la ruta v3
      if (docData.pages && docData.pages.length > 0) {
        for (const page of docData.pages) {
          const pageResponse = await client.post(`/workspaces/${workspaceId}/docs/${docId}/pages`, {
            name: page.name,
            content: page.content,
            content_format: page.content_format || 'text/md'
          });
          
          if (pageResponse.data) {
            createdPages.push(pageResponse.data);
          }
        }
      }

      return {
        doc: docResponse.data,
        pages: createdPages
      };
    } catch (error) {
      console.log(error);
      console.log(`Error al crear documento: ${error.message}`);
      if (error.response) {
        console.log(`Detalles del error: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }

  // Asociar documento a un espacio
  async attachDocToSpace(spaceId, docId, authToken) {
    try {
      const client = this.createClient(authToken);
      const response = await client.post(`/space/${spaceId}/doc/${docId}`);
      return response.data;
    } catch (error) {
      console.log(`Error al asociar documento al espacio: ${error.message}`);
      if (error.response) {
        console.log(`Detalles del error: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }

  // Crear un proyecto completo
  async createProject(workspaceId, spaceId, projectData, authToken) {
    const result = {
      folders: [],
      lists: [],
      tasks: [],
      tags: [],
      errors: []
    };

    try {
      // 1. Crear etiquetas en el espacio existente
      if (projectData.tags && projectData.tags.length > 0) {
        for (const tag of projectData.tags) {
          const createdTag = await this.createTag(spaceId, {
            name: tag.name,
            color: tag.color || '#000000',
            background: tag.background || '#ffffff'
          }, authToken);
          if (createdTag) result.tags.push(createdTag);
        }
      }

      // 2. Crear carpetas y sus listas
      if (projectData.folders && projectData.folders.length > 0) {
        for (const folderData of projectData.folders) {
          const folder = await this.createFolder(spaceId, {
            name: folderData.name
          }, authToken);

          if (folder) {
            result.folders.push(folder);

            // Crear listas dentro de la carpeta
            if (folderData.lists && folderData.lists.length > 0) {
              for (const listData of folderData.lists) {
                const list = await this.createFolderList(folder.id, {
                  name: listData.name,
                  content: listData.description || '',
                  due_date: listData.due_date ? new Date(listData.due_date).getTime() : null,
                  priority: listData.priority || 3
                }, authToken);

                if (list) {
                  result.lists.push(list);

                  // Crear tareas en la lista
                  if (listData.tasks && listData.tasks.length > 0) {
                    for (const taskData of listData.tasks) {
                      const task = await this.createTask(list.id, {
                        name: taskData.name,
                        description: taskData.description || '',
                        status: taskData.status || 'to do',
                        priority: taskData.priority || 3,
                        due_date: taskData.due_date,
                        assignees: taskData.assignees || []
                      }, authToken);

                      if (task) {
                        result.tasks.push(task);

                        // Agregar etiquetas a la tarea
                        if (taskData.tags && taskData.tags.length > 0) {
                          for (const tagName of taskData.tags) {
                            await this.addTagToTask(task.id, tagName, authToken);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // 3. Crear listas sin carpeta
      if (projectData.lists && projectData.lists.length > 0) {
        for (const listData of projectData.lists) {
          const list = await this.createList(spaceId, {
            name: listData.name,
            content: listData.description || '',
            due_date: listData.due_date ? new Date(listData.due_date).getTime() : null,
            priority: listData.priority || 3
          }, authToken);

          if (list) {
            result.lists.push(list);

            // Crear tareas en la lista
            if (listData.tasks && listData.tasks.length > 0) {
              for (const taskData of listData.tasks) {
                const task = await this.createTask(list.id, {
                  name: taskData.name,
                  description: taskData.description || '',
                  status: taskData.status || 'to do',
                  priority: taskData.priority || 3,
                  due_date: taskData.due_date,
                  assignees: taskData.assignees || []
                }, authToken);

                if (task) {
                  result.tasks.push(task);

                  // Agregar etiquetas a la tarea
                  if (taskData.tags && taskData.tags.length > 0) {
                    for (const tagName of taskData.tags) {
                      await this.addTagToTask(task.id, tagName, authToken);
                    }
                  }
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.log(`Error al crear proyecto: ${error.message}`);
      result.errors.push(error.message);
    }

    return result;
  }
}

module.exports = new ClickUpCreateService(); 