import { Request, Response, NextFunction } from 'express';
import { localStore } from '../config/store';
import { ContactMessageSchema, IContactMessage } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = ContactMessageSchema.parse(req.body);

    const newMsg: IContactMessage = {
      _id: `msg_${Date.now()}`,
      name: validated.name,
      email: validated.email || undefined,
      phone: validated.phone || undefined,
      message: validated.message,
      status: 'New',
      createdAt: new Date()
    };

    localStore.getData().messages.unshift(newMsg);
    localStore.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Sweet Pearl Bakes will contact you shortly.',
      data: newMsg
    });
  } catch (err) {
    next(err);
  }
}

export async function adminGetMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const messages = [...localStore.getData().messages].sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateMessageStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const msg = localStore.getData().messages.find(m => m._id === id);
    if (!msg) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    msg.status = status;
    localStore.save();

    res.json({ success: true, message: 'Message status updated', data: msg });
  } catch (err) {
    next(err);
  }
}
