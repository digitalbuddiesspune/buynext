import { Router } from 'express';
import { 
  createOrder, 
  verifyPayment, 
  createCodOrder, 
  initiatePayuPayment, 
  handlePayuResponse 
} from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

// Razorpay Routes
router.post('/orders', createOrder);
router.post('/verify', auth, verifyPayment);

// COD Route
router.post('/cod', auth, createCodOrder);

// PayU Routes
router.post('/payu/initiate', auth, initiatePayuPayment);
router.post('/payu/response', handlePayuResponse);

export default router;
