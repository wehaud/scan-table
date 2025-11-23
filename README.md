# Тестовое задание: Таблица сканирований

**Стек:** React, TypeScript, AntDesign, TanStack Query, MobX, Axios, Express, PostgreSQL



## Функционал

- Пагинация через TanStack Query (React Query)  
- Фильтрация по IP и статусу  
- Удаление с подтверждением (Popconfirm)  
- Массовое удаление через MobX  
- Переход на карточку IP  
- Мини-backend с API и Swagger 



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
```

### 2. Заполнение базы тестовыми данными

> [!TIP]
> В проекте есть скрипт seed.ts, который создаёт таблицу scans (если её нет) и добавляет 1000 тестовых записей.

Для запуска:
```bash
cd backend
npm install
npx ts-node src/seed.ts
# или
# node seed.js
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

> [!TIP]
> Swagger документация: http://localhost:5000/api-docs



## Структура
```bash
src/
  api/
    scans.ts                      # Запросы к api
  app/
    AppLayout.tsx               
  features/
    scans/
      components/
        ScanTable.tsx            # Таблица
        ScanFilters.tsx          # Фильтры
        ScanTableActions.tsx
        SelectionActions.tsx     # Кнопочки
      hooks/
        useScans.ts              # Получение сканов
        useScanTableState.ts     # Фильтрация и пагинация
        useScanSelection.ts      # Выделение
        useDeleteScan.ts         # Удаление
        useBulkDeleteScan.ts     # Удаление нескольких
    ip/
      components/
        IpCard.tsx
  shared/
    hooks/
      useDebounce.ts             
  stores/
    selectedStore.ts             # Стор для выделенных

backend/
  src/
    index.ts
    config.ts
    db.ts
    types.ts
    seed.ts                      # Заполнение бд демо данными
    routes/
      scanRoutes.ts
    services/
      scanService.ts
    swagger.ts
    utils/
      parseNumber.ts
```
