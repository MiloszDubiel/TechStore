# Fullstack E-commerce

Nowoczesna aplikacja sklepu internetowego ze sprzętem IT stworzona z wykorzystaniem **React**, **Node.js**, **Express** oraz **TypeScript**. Projekt powstał w celu rozwijania umiejętności FullStack Web Development

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

## Hierarchia uprawnień

```text
USER
 ├── przegląda produkty
 ├── kupuje
 ├── składa zamówienia
 ├── zarządza profilem
 ├── stworzenie profilu sklepu
 ├── wystawia produkty
 ├── zarządza sklepem
 └── obsługuje zamówienia


ADMIN
 ├── wszystko co USER (opcjonalnie)
 ├── panel administracyjny
 ├── zarządza użytkownikami
 ├── zarządza sprzedawcami
 ├── moderuje produkty
 └── zarządza całym systemem

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

### 3. Uruchom kontener Docker

```bash
cd docker compose up --build
```
### 4. Przejdź na [http://localhost:51](http://localhost:5173/)


---

## 📌 Planowane funkcjonalności

* Integracja płatności (Stripe)
* Powiadomienia e-mail
* Wyszukiwarka z podpowiedziami
* Dashboard sprzedaży
* Dark Mode
* CI/CD (GitHub Actions)

---

## Cel projektu

Celem projektu jest stworzenie kompletnej aplikacji e-commerce z wykorzystaniem nowoczesnych technologii, takich jak:

* architektura warstwowa,
* REST API,
* walidacja danych,
* autoryzacja i uwierzytelnianie,
* obsługa błędów,
* bezpieczne przechowywanie danych,
* optymalizacja wydajności,
* responsywny interfejs użytkownika.



