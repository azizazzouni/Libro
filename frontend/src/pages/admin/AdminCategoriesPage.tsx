import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriesApi } from '../../api/categoriesApi';
import { Category } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { CategoryFormModal } from '../../components/admin/CategoryFormModal';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi
      .getAll()
      .then(({ data }) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };
  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await categoriesApi.delete(id);
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Catégories</h1>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-parchment text-ink-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Nom</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Parente</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Sous-catégories</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-parchment/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-ink-900">{cat.name}</td>
                  <td className="px-5 py-3 text-ink-400 hidden md:table-cell">
                    {cat.parentId ? (
                      categories.find((c) => c.id === cat.parentId)?.name || '—'
                    ) : (
                      <span className="badge bg-ink-100 text-ink-600">Principale</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {cat.children?.length ? (
                      <span className="text-ink-600">
                        {cat.children.map((c) => c.name).join(', ')}
                      </span>
                    ) : (
                      <span className="text-ink-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={14} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="text-center py-12 text-ink-400 text-sm">Aucune catégorie trouvée.</div>
          )}
        </div>
      )}

      {modalOpen && (
        <CategoryFormModal
          category={selectedCategory}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={fetchCategories}
        />
      )}
    </div>
  );
}
