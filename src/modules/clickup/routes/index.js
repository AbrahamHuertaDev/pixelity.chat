const express = require('express');
const router = express.Router();
const ClickUpController = require('../controllers/clickupController');
const createRoutes = require('./create');

// Ruta para obtener todos los datos de un workspace
router.get('/workspace/:workspaceId/all', ClickUpController.getAllData);

// Rutas para espacios de trabajo
router.get('/workspaces', ClickUpController.getWorkspaces);
router.get('/workspace/:workspaceId/spaces', ClickUpController.getSpaces);

// Rutas para carpetas y listas
router.get('/space/:spaceId/folders', ClickUpController.getFolders);
router.get('/folder/:folderId/lists', ClickUpController.getFolderLists);
router.get('/space/:spaceId/lists', ClickUpController.getFolderlessLists);

// Rutas para tareas
router.get('/list/:listId/tasks', ClickUpController.getTasks);
router.get('/task/:taskId/comments', ClickUpController.getTaskComments);

// Rutas para etiquetas y roles
router.get('/space/:spaceId/tags', ClickUpController.getSpaceTags);
router.get('/workspace/:workspaceId/roles', ClickUpController.getCustomRoles);

// Rutas para objetivos y plantillas
router.get('/workspace/:workspaceId/goals', ClickUpController.getGoals);
router.get('/workspace/:workspaceId/templates', ClickUpController.getTaskTemplates);

// Rutas para documentos y tiempo
router.get('/workspace/:workspaceId/search', ClickUpController.searchDocs);
router.get('/workspace/:workspaceId/time-entries', ClickUpController.getTimeEntries);

// Rutas de creación
router.use('/', createRoutes);

module.exports = router; 