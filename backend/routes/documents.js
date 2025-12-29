const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Management routes
router.get('/', documentController.listDocuments);
router.delete('/:filename', documentController.deleteDocument);
router.post('/clear', documentController.clearAll);

module.exports = router;
