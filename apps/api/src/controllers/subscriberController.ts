import { Request, Response, NextFunction } from 'express';
import { localStore } from '../config/store';
import { SubscriberSchema } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

export async function subscribe(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = SubscriberSchema.parse(req.body);

    const existing = localStore.getData().subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.json({ success: true, message: 'You are already subscribed to Sweet Pearl Bakes updates!' });
      return;
    }

    const newSub = {
      _id: `sub_${Date.now()}`,
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      unsubscribed: false
    };

    localStore.getData().subscribers.push(newSub);
    localStore.save();

    res.status(201).json({ success: true, message: 'Thank you for subscribing to Sweet Pearl Bakes!', data: newSub });
  } catch (err) {
    next(err);
  }
}

export async function adminGetSubscribers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const subs = [...localStore.getData().subscribers].sort(
      (a, b) => new Date(b.subscribedAt!).getTime() - new Date(a.subscribedAt!).getTime()
    );
    res.json({ success: true, data: subs });
  } catch (err) {
    next(err);
  }
}
