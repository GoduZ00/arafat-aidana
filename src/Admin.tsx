import { useState, useEffect } from 'react';
import { getGuests, deleteGuest, type Guest } from './api';
import { Trash2, Users, UserCheck, UserX, X } from 'lucide-react';

export default function Admin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

  const loadGuests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGuests();
      setGuests(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setError('Ошибка загрузки данных');
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const confirmDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGuest(deleteId);
      setGuests(guests.filter((g) => g.id !== deleteId));
    } catch (e) {
      console.error(e);
    }
    setDeleteId(null);
  };

  const attending = guests.filter((g) => g.attending === 'yes');
  const notAttending = guests.filter((g) => g.attending === 'no');

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2C3E2D] mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>
          Список гостей
        </h1>
        <p className="text-[#3E2723]/60 mb-8">Управление ответами на приглашение</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#C5A059]/20 text-center shadow-sm">
            <Users className="w-6 h-6 mx-auto mb-2 text-[#C5A059]" />
            <p className="text-2xl md:text-3xl font-serif text-[#2C3E2D]">{guests.length}</p>
            <p className="text-xs text-[#3E2723]/50 uppercase tracking-wider">Всего</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#8A9A5B]/20 text-center shadow-sm">
            <UserCheck className="w-6 h-6 mx-auto mb-2 text-[#8A9A5B]" />
            <p className="text-2xl md:text-3xl font-serif text-[#2C3E2D]">{attending.length}</p>
            <p className="text-xs text-[#3E2723]/50 uppercase tracking-wider">Придёт</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-red-300/30 text-center shadow-sm">
            <UserX className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <p className="text-2xl md:text-3xl font-serif text-[#2C3E2D]">{notAttending.length}</p>
            <p className="text-xs text-[#3E2723]/50 uppercase tracking-wider">Не придёт</p>
          </div>
        </div>

        {/* Guest List */}
        {loading ? (
          <div className="text-center py-12 text-[#3E2723]/50">Загрузка...</div>
        ) : guests.length === 0 ? (
          <div className="text-center py-12 text-[#3E2723]/50 bg-white rounded-2xl border border-[#C5A059]/10">
            <p className="text-lg">Пока нет ответов</p>
            <p className="text-sm mt-1">Гости пока не подтвердили присутствие</p>
          </div>
        ) : (
          <div className="space-y-3">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className={`bg-white rounded-xl p-4 flex items-center justify-between border shadow-sm ${
                  guest.attending === 'yes'
                    ? 'border-[#8A9A5B]/20'
                    : 'border-red-200/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      guest.attending === 'yes'
                        ? 'bg-[#8A9A5B]/10 text-[#8A9A5B]'
                        : 'bg-red-50 text-red-400'
                    }`}
                  >
                    {guest.attending === 'yes' ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#2C3E2D] truncate">{guest.name}</p>
                    <p className="text-xs text-[#3E2723]/50">
                      {guest.attending === 'yes' ? 'Придёт' : 'Не придёт'}
                      {guest.guests && ` · ${guest.guests}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#3E2723]/40">
                    {new Date(guest.created_at).toLocaleDateString('ru-RU')}
                  </span>
                  <button
                    onClick={() => confirmDelete(guest.id, guest.name)}
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={loadGuests}
          className="mt-6 w-full py-3 bg-[#C5A059] text-white rounded-xl font-medium hover:bg-[#b08d4a] transition-colors"
        >
          Обновить список
        </button>
      </div>

      {/* Custom Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center">
            <button
              onClick={() => setDeleteId(null)}
              className="absolute top-3 right-3 p-1 text-[#3E2723]/30 hover:text-[#3E2723]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-xl font-serif text-[#2C3E2D] mb-2">Удалить ответ?</h3>
            <p className="text-[#3E2723]/60 text-sm mb-6">
              Ответ от <span className="font-medium text-[#2C3E2D]">{deleteName}</span> будет удалён
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#8A9A5B]/30 text-[#3E2723] font-medium hover:bg-[#FDFBF7] transition-colors text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
