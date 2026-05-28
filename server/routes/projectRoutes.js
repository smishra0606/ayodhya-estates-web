const express = require('express');
const router = express.Router();
const multer = require('multer');
const projectController = require('../controllers/projectController');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', projectController.getProjects);

router.post('/', upload.single('heroImage'), projectController.createProject);

router.get('/:slug', projectController.getProjectBySlug);

router.put('/:id([0-9a-fA-F]{24})', projectController.updateProject);

router.delete('/:id([0-9a-fA-F]{24})', projectController.deleteProject);

router.put('/:slug', projectController.updateProjectBySlug);

router.delete('/:slug', projectController.deleteProjectBySlug);

module.exports = router;
