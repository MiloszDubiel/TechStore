# Fullstack E-commerce

Nowoczesna aplikacja sklepu internetowego ze sprzętem IT stworzona z wykorzystaniem **React**, **Node.js**, **Express** oraz **TypeScript**. Projekt powstał w celu rozwijania umiejętności Full Stack Web Development oraz zaprezentowania praktycznej znajomości współczesnych technologii wykorzystywanych przy tworzeniu aplikacji webowych.

## Funkcjonalności

### Użytkownik

* Rejestracja i logowanie użytkowników
* Autoryzacja z wykorzystaniem JWT
* Zarządzanie profilem użytkownika
* Przeglądanie produktów
* Wyszukiwanie i filtrowanie produktów
* Sortowanie produktów
* Szczegóły produktu
* Dodawanie produktów do koszyka
* Zarządzanie zawartością koszyka
* Składanie zamówień
* Historia zamówień

### Administrator

* Zarządzanie produktami (CRUD)
* Zarządzanie kategoriami
* Zarządzanie użytkownikami
* Zarządzanie zamówieniami
* Dashboard z podstawowymi statystykami

---

## Technologie

### Frontend

* React
* TypeScript
* React Router
* TanStack Query
* Axios
* React Hook Form - w trakcie implementacji
* Zod - w trakcie implementacji
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript
* MySQL
* JWT Authentication
* bcrypt
* Multer
* CORS

---

## Struktura projektu

```text
fullstack-ecommerce/
│
├── frontend/          
├── backend/         
└── README.md
```

---

## Uruchomienie projektu

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/MiloszDubiel/fullstack-ecommerce.git
```

### 2. Przejdź do katalogu projektu

```bash
cd fullstack-ecommerce
```

### 3. Instalacja zależności

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd ../backend
npm install
```

### 4. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env` w katalogu `server` i uzupełnij odpowiednimi wartościami.

Przykład:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```


### 5. Uruchom aplikację

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## 📌 Planowane funkcjonalności

* Integracja płatności (Stripe)
* Lista ulubionych produktów
* Opinie i oceny produktów
* Powiadomienia e-mail
* Wyszukiwarka z podpowiedziami
* Panel administratora
* Upload zdjęć produktów
* Dashboard sprzedaży
* Dark Mode
* Docker
* CI/CD (GitHub Actions)

---

## Cel projektu

Celem projektu jest stworzenie kompletnej aplikacji e-commerce z wykorzystaniem nowoczesnych technologii oraz dobrych praktyk programistycznych, takich jak:

* architektura warstwowa,
* REST API,
* walidacja danych,
* autoryzacja i uwierzytelnianie,
* obsługa błędów,
* bezpieczne przechowywanie danych,
* optymalizacja wydajności,
* responsywny interfejs użytkownika.

Projekt jest rozwijany jako element portfolio Full Stack JavaScript/TypeScript.



