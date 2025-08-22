# PhotoEditor — онлайн фоторедактор

**Разработала:** Копылова Екатерина Сергеевна

**Название веб-приложения:** PhotoEditor

**Демо (GitLab Pages):** [https://your-gitlab-username.gitlab.io/course-work/](https://your-gitlab-username.gitlab.io/course-work/)

---

## О проекте

PhotoEditor — это современное веб-приложение для редактирования фотографий прямо в браузере. Поддерживаются базовые и продвинутые инструменты обработки изображений, работа с фильтрами, кривыми, пресетами, а также авторизация пользователей и сохранение пресетов в облако.

### Основные возможности

- Редактирование фото: фильтры, кривые, пресеты
- Drag&Drop загрузка изображений
- Сохранение и загрузка пресетов
- Авторизация через Firebase
- Интеграция с WASM-модулями для фильтров
- Современный UI на React + MUI
- Хранение пользовательских данных в Firestore

### Технологии

- React, Redux, React Router
- TypeScript
- Vite
- Firebase (Auth, Firestore, Analytics)
- WASM/Emscripten (фильтры)
- Vitest, Testing Library (тесты)

---

### Структура проекта

- `src/components/` — основные React-компоненты (PhotoEditor, Toolbar, Header, UserProfile и др.)
- `src/store/` — Redux store, хуки и слайсы
- `src/services/` — сервисы для работы с пресетами, firebase и т.д.
- `src/assets/` — статические ресурсы
- `src/wasm/` — WASM/emscripten модули и их обёртки
- `src/setupTests.ts` — глобальные моки и настройки для тестов

---

### Запуск проекта

```bash
npm install
npm run dev
```

### Тесты

```bash
npm run test
```

---

_Для публикации используется GitLab Pages. Путь к приложению: `/course-work/_
