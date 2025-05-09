const express = require('express');
const router = express.Router();
const ClickUpCreateController = require('../controllers/clickupCreateController');

// Ruta para crear un proyecto completo
router.post('/workspace/:workspace_id/space/:space_id/project', ClickUpCreateController.createProject);

// Rutas individuales
router.post('/workspace/:workspaceId/space', ClickUpCreateController.createSpace);
router.post('/space/:spaceId/folder', ClickUpCreateController.createFolder);
router.post('/space/:spaceId/list', ClickUpCreateController.createList);
router.post('/folder/:folderId/list', ClickUpCreateController.createFolderList);
router.post('/list/:listId/task', ClickUpCreateController.createTask);
router.post('/space/:spaceId/tag', ClickUpCreateController.createTag);
router.post('/task/:taskId/tag/:tagName', ClickUpCreateController.addTagToTask);

// Rutas para documentos
router.post('/workspace/:workspaceId/doc', ClickUpCreateController.createDoc);
router.post('/space/:spaceId/doc/:docId', ClickUpCreateController.attachDocToSpace);

module.exports = router; 