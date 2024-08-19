import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).send({ status: 'Event Bus Service is running' });
});

export default router;
