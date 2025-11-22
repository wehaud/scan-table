# Тестовое задание: Таблица сканирований

**Стек:**React, TypeScript, AntDesign, TanStack Query, MobX, Axios, Express, PostgreSQL

---

## Функционал

- Пагинация через TanStack Query (React Query)  
- Фильтрация по IP и статусу  
- Удаление с подтверждением (Popconfirm)  
- Массовое удаление через MobX  
- Переход на карточку IP  
- Мини-backend с API и Swagger 

---

## Запуск проекта

### 1. PostgreSQL

Создать базу данных и таблицу scans:

```sql
CREATE TABLE scans (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(50),
  status VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
```


Настроить .env файл в backend:
```bash
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scans_db
PORT=5000
MAX_PAGE_SIZE=50
```

### 2. Заполнение базы тестовыми данными

В проекте есть скрипт seed.ts, который создаёт таблицу scans (если её нет) и добавляет 1000 тестовых записей.

Для запуска:
```bash
cd backend
npm install
npx ts-node src/seed.ts
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

> [!TIP]
> Приложение будет доступно на http://localhost:3000

### 4. Backend
```bash
cd backend
npm install
npm run dev   # запуск сервера с авто-перезапуском (nodemon)
npm start     # запуск сервера один раз (ts-node)
```

> [!TIP]
> API доступно на http://localhost:5000
> Swagger документация: http://localhost:5000/api-docs

---

## Структура
```bash
src/
  components/
    ScanTable.tsx       # Таблица сканов с фильтрацией, пагинацией и выделением строк
    ScanFilters.tsx     # Фильтры по IP и статусу
    IpCard.tsx          # Карточка IP / Типа продукт(?)
    AppLayout.tsx
  stores/
    selectedStore.ts    # MobX store для выделенных строк
  types.ts
  App.tsx
  index.tsx

backend/
  src/
    index.ts
    types.ts
    services/
      scanService.ts    
  package.json
  tsconfig.json
```