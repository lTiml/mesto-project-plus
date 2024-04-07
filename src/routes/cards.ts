import { Router } from 'express';
import { createCard, deleteCard, dislikeCard, getCards, likeCard } from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../validator/validator';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
