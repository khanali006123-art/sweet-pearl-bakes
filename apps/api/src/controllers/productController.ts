import { Request, Response, NextFunction } from 'express';
import { localStore } from '../config/store';
import { ProductCreateUpdateSchema } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search } = req.query;
    let products = localStore.getData().products.filter(p => p.isActive);

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    products.sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const product = localStore.getData().products.find(p => p.slug === slug && p.isActive);

    if (!product) {
      res.status(404).json({ success: false, message: 'Bakery item not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllProducts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const products = [...localStore.getData().products].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = ProductCreateUpdateSchema.parse(req.body);
    const existing = localStore.getData().products.find(p => p.slug === parsed.slug);
    if (existing) {
      res.status(400).json({ success: false, message: 'A product with this slug already exists' });
      return;
    }

    const newProduct = {
      ...parsed,
      _id: `prod_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    localStore.getData().products.push(newProduct);
    localStore.save();

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parsed = ProductCreateUpdateSchema.parse(req.body);
    const index = localStore.getData().products.findIndex(p => p._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updated = {
      ...localStore.getData().products[index],
      ...parsed,
      updatedAt: new Date()
    };

    localStore.getData().products[index] = updated;
    localStore.save();

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const index = localStore.getData().products.findIndex(p => p._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    localStore.getData().products.splice(index, 1);
    localStore.save();

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
