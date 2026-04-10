import express from 'express';

import { getAllSneakers, getSneakerById, addSneaker, deleteSneaker } from '../controllers/sneakerController.js';
import { requireAuth } from '../middleware/authorize.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/', getAllSneakers);

router.get('/:id', getSneakerById);

router.post('/', requireAuth, isAdmin, addSneaker);

router.delete('/:id', requireAuth, isAdmin, deleteSneaker);

export default router;
