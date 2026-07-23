# Настройка Supabase (база данных)

## Шаг 1 — Создай проект

1. Зайди на https://supabase.com
2. Sign up (можно через GitHub)
3. Нажми **New project**
4. Name: `arafat-aidana`
5. Database Password: придумай пароль
6. Region: выбери ближайший (East US или West Europe)
7. Нажми **Create new project**

## Шаг 2 — Создай таблицу

1. В левом меню выбери **Table Editor**
2. Нажми **New table**
3. Name: `guests`
4. Disable Row Level Security (для простоты)
5. Нажми **Save**
6. Добавь колонки (нажми +):
   - `name` — type: **text**
   - `attending` — type: **text**
   - `guests` — type: **text**
7. Колонка `id` и `created_at` уже есть автоматически

## Шаг 3 — Скопируй ключи

1. Зайди в **Settings → API**
2. Скопируй:
   - **Project URL** (вида `https://xxxx.supabase.co`)
   - **anon public key** (длинная строка)

## Шаг 4 — Вставь в .env

```
VITE_SUPABASE_URL="вставь_URL"
VITE_SUPABASE_ANON_KEY="вставь_ключ"
```

## Шаг 5 — Загрузи на GitHub

```bash
git add .
git commit -m "Add Supabase backend"
git push
```

Vercel автоматически пересоберёт сайт.
