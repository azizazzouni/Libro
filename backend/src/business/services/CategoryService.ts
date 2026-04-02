import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ConflictError } from '../exceptions/ConflictError';
import { generateSlug } from '../../shared/utils/slug';
import { prisma } from '../../config/database';
const categoryRepo = new CategoryRepository();

export class CategoryService {
  async getCategories() {
    return categoryRepo.findAll();
  }

  async getCategoryById(id: number) {
    const cat = await categoryRepo.findById(id);
    if (!cat) throw new NotFoundError('Category');
    return cat;
  }

  async createCategory(data: { name: string; description?: string; parentId?: number }) {
    const slug = generateSlug(data.name);
    const existing = await categoryRepo.findBySlug(slug);
    if (existing) throw new ConflictError('Category already exists');
    return categoryRepo.create({ ...data, slug });
  }

  async updateCategory(id: number, data: Partial<{ name: string; description: string }>) {
    const cat = await categoryRepo.findById(id);
    if (!cat) throw new NotFoundError('Category');
    const updateData: Record<string, unknown> = { ...data };
    if (data.name) updateData['slug'] = generateSlug(data.name);
    return categoryRepo.update(id, updateData);
  }

  async deleteCategory(id: number) {
    const cat = await categoryRepo.findById(id);
    if (!cat) throw new NotFoundError('Category');

    // Supprimer les relations BookCategory d'abord
    await prisma.bookCategory.deleteMany({ where: { categoryId: id } });

    return categoryRepo.delete(id);
  }
}
