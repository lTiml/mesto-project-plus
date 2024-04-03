import { Router } from 'express';
import { createCard, deleteCard, dislikeCard, getCards, likeCard } from '../controllers/cards';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
