# SPACZ User App (Frontend) — Technical Study Guide

> Scope: the student app in `D:\spacz-user` (Expo SDK 57, React Native 0.86.3, expo-router).
> Every statement was checked against the source files named in it. Where a fact could not be confirmed
> from the code that was read, the text says **Not determinable from the provided code.** Secrets are never
> reproduced; they appear as `[SECRET / ENVIRONMENT VARIABLE]`.
>
> This is a study guide for review, not a line-by-line audit. The vendor web editor (`Spacz_Partner`) is
> separate and is not described here except where it shares contracts with the backend.

---

## 1. Frontend overview

### 1.1 What the app does (simple terms)

A student installs the app, logs in with a phone number and a one-time code (OTP), completes a short
registration, then:

- browses study halls (libraries) by city, program and filters,
- opens a hall, sees its photos, amenities and seat map for chosen dates,
- taps one seat, picks a plan (day or month), sees the price breakdown,
- holds the seat, confirms it, and sees it under **Bookings**,
- manages a profile, exam/course choices, identity documents, notifications and feedback.

### 1.2 Stack (from `package.json`)

| Area | Package / version | Role |
|---|---|---|
| Runtime | `expo ~57.0.18`, `react-native 0.86.3`, `react 19.2.3` | app runtime |
| Routing | `expo-router ~57.0.17` (file-based; `main: expo-router/entry`) | screens, layouts, deep links |
| State | `zustand ^5.0.15` | two stores: `authStore`, `bookingStore` |
| Secure storage | `expo-secure-store ~57.0.3` | session tokens on native |
| Files / media | `expo-file-system`, `expo-image-picker`, `expo-image-manipulator`, `expo-image` | document upload, photos |
| Location | `expo-location ~57.0.20` | city detection (`useLocation`) |
| Gestures / layout | `react-native-gesture-handler ~2.32`, `react-native-reanimated 4.5.1`, `react-native-safe-area-context ~5.7`, `react-native-screens ~4.26` | navigation, gestures |
| Web | `react-native-web ~0.21`, `react-dom 19.2.3` | web build (`expo start --web`) |
| UI | `@expo/ui`, `expo-glass-effect`, `expo-symbols`, `@expo/vector-icons`, `@expo-google-fonts/montserrat` | icons, fonts |
| Lint / types | `eslint ^9` with `eslint-config-expo`, `typescript ~6.0.3` | |

Scripts: `start`, `android`, `ios`, `web` (port 3000), `lint` (`expo lint`).

**Project rule:** `AGENTS.md` states that Expo has changed and that the exact versioned docs
(`https://docs.expo.dev/versions/v57.0.0/`) must be read before writing code. This guide describes the code as
it is; it does not re-verify against Expo docs.

### 1.3 Architecture in one picture

```
 Screen (src/app/...)          ← expo-router file = route
   │ reads state / calls hooks
   ▼
 Hook (src/hooks/...)          ← loading / error state, calls a service
   │
   ▼
 Service (src/services/...)    ← one module per backend area; maps JSON → app types
   │
   ▼
 api.ts  request<T>()          ← one HTTP client: base URL, bearer token, 401 refresh, ApiError
   │
   ▼
 Gateway :8080  →  backend services (see BACKEND_README.md)

 Global state: authStore (session, user), bookingStore (selected seat, dates, plan)
 Pure helpers: src/utils/*, src/constants/*
```

Rules that hold across the code read:

1. Screens never call `fetch` directly; they use services through hooks.
2. Only `api.ts` knows about tokens, base URL, and error shapes.
3. Services convert backend JSON into `src/types/*` shapes (e.g. `toUser`, `toBooking`).

---

## 2. Project structure

```
spacz-user/
├── package.json · app.json · tsconfig · eslint config
├── AGENTS.md / CLAUDE.md          ← project instructions (read Expo v57 docs first)
├── assets/                        ← images, fonts, icons
├── src/
│   ├── app/                       ← ROUTES (expo-router). Each file is a screen or a layout
│   │   ├── _layout.tsx            ← root Stack, hydrate session, splash
│   │   ├── index.tsx              ← redirect: intro (signed out) or home (signed in)
│   │   ├── offers.tsx             ← offers list
│   │   ├── (auth)/                ← intro, mobile-number, otp, register (+ _layout guard)
│   │   ├── (tabs)/                ← home, study-centre, profile (+ _layout Tabs)
│   │   ├── study-centre/          ← [id], select-date, seat-map, price-breakup, confirmation (+ _layout)
│   │   ├── bookings/              ← index, [id] (+ _layout)
│   │   └── profile/               ← personal, documents, feedback, notifications, privacy, terms, help-center (+ _layout)
│   ├── components/
│   │   ├── ui/                    ← Button, Input, Card, Badge, Loader, EmptyState, ErrorMessage, Divider, RatingStars, SegmentedTabs, ImagePlaceholder
│   │   ├── common/                ← ScreenContainer, BackButton, SectionTitle, LegalDocument
│   │   ├── auth/                  ← AuthHeader, OtpInput
│   │   ├── home/                  ← HomeHeader, HomeServiceCard, ExclusiveBanner, OfferCard
│   │   ├── study-centre/          ← StudyCentreCard, StudyCentreSearchBar, FilterChips
│   │   ├── booking/               ← SeatMap, Seat, SeatLegend, DateDurationPicker, PriceBreakupCard, BookingCard, PaymentStatusBadge
│   │   └── profile/               ← ProfileHeader, ProfileMenuItem, DocumentCard, NotificationItem
│   ├── services/                  ← api.ts + one service per backend area
│   ├── hooks/                     ← useAuth, useProfile, useStudyCentres, useBooking, useOffers, useNotifications, useLocation
│   ├── store/                     ← authStore.ts, bookingStore.ts
│   ├── types/                     ← TypeScript types for app data (auth, user, studyCentre, booking, offer, notification, common)
│   ├── constants/                 ← config.ts (API URL, timings), theme.ts, colors.ts, spacing.ts, typography.ts
│   └── utils/                     ← storage.ts, validation.ts, formatting.ts, date.ts
```

**Route groups.** Folders in parentheses (`(auth)`, `(tabs)`) group screens without adding a URL segment.
A `_layout.tsx` in a folder defines the navigator for that folder (Stack, Tabs).

---

## 3. Screens (routes)

| Route file | Purpose | Data it uses (service / store) |
|---|---|---|
| `app/_layout.tsx` | Root Stack; calls `authStore.hydrate()`; shows splash until done | `useAuthStore` |
| `app/index.tsx` | `Redirect` to `/(auth)/intro` if signed out, `/(tabs)/home` if signed in | `useAuthStore` |
| `(auth)/intro.tsx` | First screen for signed-out users | — |
| `(auth)/mobile-number.tsx` | Enter phone → request OTP | `auth.service.requestOtp` (via `useAuth`) |
| `(auth)/otp.tsx` | Enter 6-digit code (`OtpInput`), resend after cooldown | `verifyOtp`, `setPendingPhoneNumber` |
| `(auth)/register.tsx` | Name/city/… form; completes registration | `registerWithOtp` |
| `(auth)/_layout.tsx` | Guard: `otp` redirects to `mobile-number` if no phone pending (see §8) | `authStore` |
| `(tabs)/home.tsx` | Home: greeting, service cards, banner, offers preview | `useOffers`, `useLocation` |
| `(tabs)/study-centre.tsx` | Search and list of halls with filters | `useStudyCentres`, `studyCentre.service` |
| `(tabs)/profile.tsx` | Profile hub with menu items | `useProfile`, `useAuthStore` |
| `study-centre/[id].tsx` | Hall detail: photos, amenities, programs, availability | `getStudyCentreById` (+ availability) |
| `study-centre/select-date.tsx` | Date and plan (day/month) via `DateDurationPicker` | `bookingStore.setDateAndDuration` |
| `study-centre/seat-map.tsx` | Seat map for the chosen dates; choose one seat | `useSeatMap` → `getSeatLayout`; `bookingStore.toggleSeat` |
| `study-centre/price-breakup.tsx` | Price breakdown and "Continue" | `booking.service.getQuote` (via `useBooking`) |
| `study-centre/confirmation.tsx` | Create booking, then confirm | `useCreateBooking` → `createBooking`, `confirmBooking` |
| `study-centre/_layout.tsx` | Stack for the booking flow | — |
| `bookings/index.tsx` | My bookings (list) | `getMyBookings` |
| `bookings/[id].tsx` | One booking, status badge, cancel | `getBookingById`, `cancelBooking` |
| `offers.tsx` | All offers | `offer.service` (`/api/offers`) |
| `profile/personal.tsx` | Edit name, email, city, etc. | `profile.service` (`getProfile`, `updateProfile`) |
| `profile/documents.tsx` | Upload and view identity documents | `document.service` |
| `profile/feedback.tsx` | Send feedback; list own feedback | `profile.service` feedback methods |
| `profile/notifications.tsx` | Notification list by category | `notification.service` |
| `profile/privacy.tsx`, `terms.tsx`, `help-center.tsx` | Static/legal content | `LegalDocument` component |

Not determinable from the code read: the exact content of `help-center.tsx` and `privacy.tsx`/`terms.tsx` text
(not read in full).

---

## 4. Components

### 4.1 Reusable UI (`src/components/ui`)

| Component | Use |
|---|---|
| `Button` | primary/secondary actions with loading state |
| `Input` | text field with label and error |
| `Card`, `Divider`, `Badge` | layout and status chips |
| `Loader`, `EmptyState`, `ErrorMessage` | loading, empty and error states on screens |
| `SegmentedTabs` | two- or more-option switcher (e.g. Upcoming / Past) |
| `RatingStars` | star display |
| `ImagePlaceholder` | placeholder while a hall photo loads |

### 4.2 Feature components

| Component | Responsibility |
|---|---|
| `booking/SeatMap` | Lays out the hall's blocks: a grid of `Seat`s **plus fixture chips on the N/S/E/W/centre bands outside the grid** (AC units are fixtures, not seats). |
| `booking/Seat` | One seat cell: available, booked, selected. |
| `booking/SeatLegend` | Colour meanings for the seat map. |
| `booking/DateDurationPicker` | Start date and plan; enforces the backend window. |
| `booking/PriceBreakupCard` | Renders the quote lines (base, discount, platform fee, taxes, total). |
| `booking/BookingCard`, `PaymentStatusBadge` | Booking summary and status label in lists/detail. |
| `study-centre/StudyCentreCard`, `FilterChips`, `StudyCentreSearchBar` | Hall list items and filters. |
| `home/OfferCard`, `ExclusiveBanner`, `HomeHeader`, `HomeServiceCard` | Home screen blocks. |
| `profile/DocumentCard`, `NotificationItem`, `ProfileHeader`, `ProfileMenuItem` | Profile screens. |
| `auth/OtpInput`, `AuthHeader` | OTP entry (paste-aware, see §8) and auth screen header. |
| `common/ScreenContainer` | Screen wrapper (`contentStyle` is used to make a flex child fill height). |
| `common/BackButton`, `SectionTitle`, `LegalDocument` | Navigation and text blocks. |

---

## 5. API integration

### 5.1 The HTTP client (`src/services/api.ts`)

| Function | What it does (verified in code) |
|---|---|
| `buildUrl(path, query)` | joins the base URL with the path and encodes query parameters |
| `send(path, options)` | `fetch` with JSON or `FormData` body; adds `Authorization: Bearer <token>` when `auth !== false`; in dev (`__DEV__`) logs method/path/status but **never tokens** |
| `execute(path, options)` | on **401** for an authenticated call (and not for `/api/auth/*`): one shared refresh (single-flight) via `POST /api/auth/refresh`, then retries the call once; if refresh fails: `clearSession()` and `onSessionExpired` |
| `request<T>(path, options)` | the public function every service uses; returns parsed JSON typed as `T` |
| `requestDataUri(path)` | fetches binary content (e.g. a stored document) as a `data:` URI |
| `toTransportError` | network failure → `ApiError` code `NETWORK_ERROR`; other failures → `REQUEST_ERROR` |
| `toApiError` | non-2xx JSON → `ApiError(status, code, message, fieldErrors, correlationId)` using the backend's `ApiError` body (see BACKEND_README §13) |
| `errorMessage(err, fallback)` | user-facing text: 401 → session expired, 413 → file too large, 5xx → server error, other → backend message or fallback |

Options accepted by `request`: `method`, `body`, `query`, `auth` (default true), and multipart handling is
chosen when the body is `FormData`.

### 5.2 Config (`src/constants/config.ts`)

- `resolveApiBaseUrl()`: uses `EXPO_PUBLIC_API_BASE_URL` when set (trailing slashes removed). Otherwise, **only in
  dev** (`__DEV__`), it uses the Metro host with port `EXPO_PUBLIC_API_PORT` (default `8080`, the gateway); on a
  phone this is the PC's LAN address. In a non-dev build with no `EXPO_PUBLIC_API_BASE_URL`, `api.ts` throws
  `CONFIG_ERROR`.
- `otpResendSeconds: 30` (cooldown on the OTP screen).
- Environment variables: `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_API_PORT`. Their values are not secret (they are
  inlined into the client bundle); none were found in the code read.

### 5.3 Endpoints the app calls (from the services)

| Service file | Method | Path | Auth |
|---|---|---|---|
| `auth.service` | POST | `/api/auth/otp/request` | no |
| `auth.service` | POST | `/api/auth/otp/verify` (first call, then again with `role`+name for registration) | no |
| `auth.service` | POST | `/api/auth/logout` (body `refreshToken`) | no |
| `api.ts` | POST | `/api/auth/refresh` | refresh token |
| `profile.service` | GET / PUT | `/api/users/me` | yes |
| `profile.service` | GET / POST | `/api/users/me/programs` | yes |
| `profile.service` | GET / POST | `/api/users/me/feedback` | yes |
| `document.service` | GET | `/api/users/me/documents` | yes |
| `document.service` | PUT | `/api/users/me/documents/{type}` (multipart) | yes |
| `studyCentre.service` | GET | `/api/studyhalls` (paged search) | no |
| `studyCentre.service` | GET | `/api/studyhalls/{id}` and `/{id}/availability` | no |
| `studyCentre.service` | GET | `/api/studyhalls/{id}/layout?startDate&endDate` | no |
| `studyCentre.service` | GET | `/api/programs`, `/api/studyhalls/locations` | no |
| `booking.service` | POST | `/api/bookings/quote` | yes |
| `booking.service` | POST | `/api/bookings` (one per seat) | yes |
| `booking.service` | GET | `/api/bookings/me`, `/api/bookings/{id}` | yes |
| `booking.service` | POST | `/api/bookings/{id}/confirm`, `/api/bookings/{id}/cancel` (body `reason`) | yes |
| `offer.service` | GET | `/api/offers` | no |
| `notification.service` | GET | `/api/notifications?type=…` | yes |

These paths match the gateway routes in BACKEND_README §4.2 and the endpoint list in §5.2 there.

### 5.4 Data mapping

Services convert the backend shape to app types. Examples checked: `profile.service` `toUser()` (on `getProfile`
and `updateProfile`), `booking.service` `toBooking()` (on every booking response), and
`studyCentre.service`, which maps `layout.fixtures` into the app's `LayoutFixture` type. The app never uses
backend DTO names directly outside services.

---

## 6. Authentication flow

### 6.1 Steps (signed-out user)

```
intro → mobile-number
   POST /api/auth/otp/request {phone}           → code sent by SMS (dev: logged on the server)
   store pendingPhoneNumber (authStore.setPendingPhoneNumber)
otp
   POST /api/auth/otp/verify {phone, code}
     ├─ 200 → tokens returned → loginSuccess → home
     └─ 422 REGISTRATION_REQUIRED → verifyOtp returns null
          → register screen
          → POST /api/auth/otp/verify {phone, code, role:'USER', firstName, …}
          → tokens → loginSuccess → home
```

`auth.service.verifyOtp` returns `null` on `REGISTRATION_REQUIRED` (it is an expected branch, not an error).
`registerWithOtp` always uses role `USER`.

### 6.2 Session store (`src/store/authStore.ts`)

| Member | Behaviour (verified) |
|---|---|
| `hydrate()` | loads the stored session (`loadSession`); if one exists, calls `profileService.getProfile()`. On **401/403** → clears the session. On a **network failure** → keeps the session (the user stays signed in offline). |
| `setPendingPhoneNumber(phone)` | remembers the phone between the OTP request and verify screens |
| `loginSuccess(auth)` | `setSession(tokens)` and user |
| `logout()` | calls `POST /api/auth/logout` with the refresh token (best effort) and clears local session |

### 6.3 Token storage (`src/utils/storage.ts`)

- Native: `expo-secure-store` (`[SECRET / ENVIRONMENT VARIABLE]` values are never in code).
- Web: `localStorage`.
- The stored value is the session (access token, refresh token, expiry). Exact key names: see `storage.ts`
  (not reproduced here).

### 6.4 Refresh and expiry

When any authenticated call returns 401, `api.ts` refreshes once (all concurrent 401s wait for the same refresh —
single-flight), retries the call, and on failure clears the session and calls `onSessionExpired`, which sends the
user back to sign-in.

---

## 7. State management

### 7.1 Stores (Zustand)

| Store | File | Holds | Key actions |
|---|---|---|---|
| `useAuthStore` | `src/store/authStore.ts` | session status, user, `pendingPhoneNumber` | `hydrate`, `setPendingPhoneNumber`, `loginSuccess`, `logout` |
| `useBookingStore` | `src/store/bookingStore.ts` | the booking in progress: studyCentre, start/end date, plan, selected seat | `setDateAndDuration` (clears the selected seat), `toggleSeat` (**one seat only** — choosing another replaces it) |

`SelectedSeat` fields: `id`, `label`, `blockId`, `blockName`, `pricePerDay`, `pricePerMonth`.

### 7.2 Hooks (wrap services with loading and error state)

| Hook | Wraps | Notes |
|---|---|---|
| `useAuth` | auth.service | OTP request/verify/register; exposes `loading`, `error` |
| `useProfile` | profile.service | load/update profile |
| `useStudyCentres` | studyCentre.service | list, filters, paging |
| `useBooking` → `useSeatMap` | `getSeatLayout` | fetches layout for the chosen dates |
| `useBooking` → `useCreateBooking` | `createBooking` | **one booking per selected seat**; if one fails, the partial bookings are cancelled; a conflict shows the `SEAT_UNAVAILABLE` message |
| `useOffers` | offer.service | offers list |
| `useNotifications` | notification.service | notifications by category |
| `useLocation` | expo-location | current city |

Hooks use a `cancelled` flag and set state inside effects in a way that satisfies the project's lint rule
`set-state-in-effect` (refactored earlier in the project's history).

### 7.3 Where state lives (rule of thumb used in the code)

- Server data (halls, bookings, profile): fetched in hooks, held in component state. Not cached globally.
- Session and the booking in progress: global stores, because several screens need them.

---

## 8. Navigation

### 8.1 Expo Router

File-based routing: the path of a file under `src/app` is its URL. Parentheses hide a segment. Layouts:

- Root `_layout.tsx`: `Stack`, runs `hydrate()`, keeps the splash visible until hydration completes.
- `(auth)/_layout.tsx`: guard screens. `otp` checks `hadPendingPhoneNumberOnMount` (a snapshot taken on mount) and
  redirects to `mobile-number` if there is no phone waiting. The snapshot prevents a race: after a successful
  login the store clears the pending phone, and without the snapshot the OTP screen would redirect away mid-success.
- `(tabs)/_layout.tsx`: `Tabs` (home, study-centre, profile). Whether `bookings` is a tab is **Not determinable
  from the code read** — the screens live at `app/bookings/` and are reachable by route.
- `study-centre/_layout.tsx`, `bookings/_layout.tsx`, `profile/_layout.tsx`: Stacks.

### 8.2 Booking journey (routes in order)

```
(tabs)/study-centre  →  study-centre/[id]  →  study-centre/select-date
   →  study-centre/seat-map  (footer "Continue" only when a seat is selected)
   →  study-centre/price-breakup
   →  study-centre/confirmation  (creates and confirms the booking)
   →  bookings/[id]
```

### 8.3 Deep links

Routes are file-based, so a deep link to a booking or hall reaches the screen directly. Earlier debugging found
that unguarded deep links could bypass the intro/auth decision; the `index.tsx` redirect and layout guards are the
current mitigation.

---

## 9. UI layer

- **Theme:** `constants/theme.ts`, `colors.ts`, `spacing.ts`, `typography.ts` (font: Montserrat from
  `@expo-google-fonts/montserrat`). Components import tokens rather than raw values.
- **Screen frame:** `ScreenContainer` provides safe-area padding and the background. Its `contentStyle` prop is used
  where a child must fill the height (the seat map).
- **Seat map** (`components/booking/SeatMap.tsx`): renders the grid inside a `ScrollView` and draws fixture chips
  (AC) on the outer bands. Fixtures are not seats and cannot be selected.
- **Seat-map footer:** shown only when a seat is selected; `flexShrink: 0` so it stays on screen.
- **Responsive:** designed for phone width; the web build uses the same components through `react-native-web`.
- **Lists:** `FlatList`-style rendering is used in screens with long lists (Not determinable which were converted to
  a virtualised list in every screen — not every file was read).

Design fidelity to the Figma file is a stated project goal in the conversation history; the code does not reference
Figma, so fidelity cannot be checked from the code alone.

---

## 10. Main user flows

### 10.1 First launch
`app/index.tsx` → signed out → `(auth)/intro` → `mobile-number` → `otp` → (`register` if new) → `(tabs)/home`.

### 10.2 Find and book a seat
1. Home or Study Centre list (`useStudyCentres`).
2. Hall detail (`study-centre/[id]`): photos, amenities, programs, availability.
3. `select-date`: start date and plan → `bookingStore.setDateAndDuration`.
4. `seat-map`: `useSeatMap` loads `/layout?startDate&endDate`; the student taps one available seat → `toggleSeat`.
5. `price-breakup`: quote from `POST /api/bookings/quote`, shown with `PriceBreakupCard`.
6. `confirmation`: `useCreateBooking` holds the seat (`POST /api/bookings`), then confirms
   (`POST /api/bookings/{id}/confirm`).
7. `bookings/[id]`: booking details and status.

**Payment:** the app's "confirm" step is the point where a payment would happen. The backend has no payment gateway
(BACKEND_README §12.4), so **no payment provider is integrated in the app code read.** Payment integration:
**Not determinable from the provided code.**

### 10.3 Cancel a booking
`bookings/[id]` → `cancelBooking(id, reason)` → `POST /api/bookings/{id}/cancel`.

### 10.4 Documents
`profile/documents.tsx` lists types via `GET /api/users/me/documents`. Upload uses `document.service.uploadDocument`:
`PUT /api/users/me/documents/{type}` with `FormData`. `MAX_DOCUMENT_BYTES = 1.5 MB` is defined in `document.service.ts`.
Where it is enforced before upload was not confirmed in this pass; the backend also enforces a size limit
(`spacz.storage` max file bytes in user-service, value not read). Upload encoding differs by platform
(native file URI vs web `Blob`), handled inside `document.service`.

### 10.5 Notifications
`profile/notifications.tsx` → `GET /api/notifications?type=<category>` (an admin-service content endpoint, through
the gateway).

### 10.6 Feedback
`profile/feedback.tsx` → `POST /api/users/me/feedback`; the list is `GET /api/users/me/feedback?size=20`.

---

## 11. Error handling

| Layer | What happens |
|---|---|
| Network down | `toTransportError` → `ApiError` code `NETWORK_ERROR`; screens show an offline message via `errorMessage`. |
| Non-2xx from backend | `toApiError` reads the backend `ApiError` body: `status`, `error` (code), `message`, `fieldErrors`, `correlationId`. |
| 401 | refresh once, retry; on failure clear session. |
| 403 | shown as access denied (`errorMessage` fallback). |
| 409 `SEAT_UNAVAILABLE` | "One of the selected seats was just taken" — the booking hook cancels partial holds first. |
| 413 | "file too large" (documents). |
| 5xx | generic server message. |
| Screen level | `ErrorMessage` and `EmptyState` components; hooks return `error`. |

The app does not use an error-reporting service in the code read (Not determinable whether one is configured
elsewhere).

---

## 12. Environment and configuration

| Setting | Where | Meaning |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | `config.ts` | full gateway base URL (inlined at bundle time) |
| `EXPO_PUBLIC_API_PORT` | `config.ts` | gateway port when the host comes from Metro; default `8080` |
| Metro host | Expo dev server | used to build the base URL on devices |
| `otpResendSeconds` | `config.ts` | `30` |
| App identity | `app.json` | name, slug, scheme, bundle/package identifiers (not all read) |
| Session storage | `storage.ts` | `expo-secure-store` on native, `localStorage` on web |

Environment variables beginning with `EXPO_PUBLIC_` are embedded in the client bundle and are **not secret**.
No API keys or passwords were found in the frontend code read. Anything that is a secret would be
`[SECRET / ENVIRONMENT VARIABLE]` and must never be committed.

---

## 13. Backend contracts the app depends on

- The base URL is the **gateway** (8080), never the services directly.
- Tokens: access token is sent as `Authorization: Bearer`; refresh uses `/api/auth/refresh`.
- Error body: `ApiError` (BACKEND_README §13.2). The app keys user messages on `error` codes:
  `SEAT_UNAVAILABLE`, `REGISTRATION_REQUIRED`, `NETWORK_ERROR`, `REQUEST_ERROR`.
- Layout response: `HallLayoutResponse` → `floors[].blocks[].layout.cells` and `fixtures`. Seat availability
  per requested date comes from the layout endpoint, so the seat map is one request.
- Booking plan values: day or month; the app sends the plan the student picked.

---

## 14. End-to-end flow (one example)

Student books seat `A-12` for one month (illustrative; seat id and dates are placeholders):

```
seat-map         GET /api/studyhalls/7/layout?startDate=…&endDate=…   (no auth)
                 → cells, fixtures, available flags
student taps A-12 → bookingStore.toggleSeat({id, label:'A-12', pricePerMonth, …})
price-breakup    POST /api/bookings/quote {studyHallId, seatId, plan, startDate, …}   (Bearer)
                 plan is 'DAILY' or 'MONTHLY' (types/booking.ts). A monthly request sends months: 1
                 (booking.service.ts); a daily one sends endDate.
                 → PriceBreakupCard
confirmation     POST /api/bookings {…}                                                 → PENDING, holdExpiresAt
                 POST /api/bookings/{id}/confirm                                        → CONFIRMED
bookings/[id]    GET /api/bookings/{id}                                                 → status badge
```

Failure path: another student took A-12 in the meantime → backend 409 `SEAT_UNAVAILABLE` → `useCreateBooking`
cancels partial holds → the screen shows the conflict message and the student picks another seat.

The booking plan rule (`booking.service.ts` `planForSeat`) picks MONTHLY when the duration is exactly 30 days and the
seat has a monthly price; otherwise DAILY.

---

## 15. Technical review questions

| # | Question | Answer | Where |
|---|---|---|---|
| 1 | Why are screens thin? | Logic is in hooks and services so it can change without touching the UI. | §1.3 |
| 2 | Where does the token live and who reads it? | `expo-secure-store` on native, `localStorage` on web; only `api.ts` attaches it. | §6.3, §5.1 |
| 3 | How are 401s handled without a refresh storm? | Single-flight refresh: concurrent 401s await one refresh. | §6.4 |
| 4 | Why keep the session when offline? | `hydrate()` only clears on 401/403, so a network blip does not log the student out. | §6.2 |
| 5 | Why does the OTP screen have a snapshot? | To avoid a race with the guard after login clears the pending phone. | §8.1 |
| 6 | How is a seat kept single-select? | `bookingStore.toggleSeat` replaces the previous selection. | §7.1 |
| 7 | How are AC units shown? | As fixture chips outside the seat grid; they are not seats. | §4.2 |
| 8 | What happens if a booking fails midway? | `useCreateBooking` cancels partial holds. | §7.2 |
| 9 | Is payment implemented? | No provider in code read; confirm is a status change. | §10.2 |
| 10 | Why is the document size checked in the app? | Early feedback before upload; the backend also enforces its own limit. | §10.4 |
| 11 | How does the app know the API address on a phone? | From the Metro host plus `EXPO_PUBLIC_API_PORT`. | §5.2 |
| 12 | What is not verified? | Design fidelity to Figma; payment; every screen's internals; `help-center`/legal text; enum literal names. | §16 |

---

## 16. Not determinable from the provided code

- Payment provider integration (none found).
- Figma fidelity of each screen (no reference in code).
- Full content of `help-center.tsx`, `privacy.tsx`, `terms.tsx`.
- Whether `bookings` is a visible tab (see §8.1).
- Exact storage key names and the shape of the saved session beyond what `storage.ts` exposes (not reproduced).
- Crash / analytics reporting, if any.
- Production build, store submission and environment values for production (`app.json`/EAS config not fully read).
- Automated tests for the app (none inspected; `lint` is the only script found).
- Booking status literal strings in every screen (plan values `DAILY`/`MONTHLY` were checked in `types/booking.ts`).

---

## HOW TO STUDY THIS PROJECT

Read in this order:

1. §1 Overview and the architecture diagram.
2. §2 Structure — learn the route folders first.
3. §3 Screens table; open `src/app/_layout.tsx` and `src/app/index.tsx`.
4. §6 Authentication: open `services/api.ts`, `services/auth.service.ts`, `store/authStore.ts`, then `(auth)/otp.tsx`.
5. §5 API integration: read `api.ts` `request`, `execute`, `toApiError` line by line.
6. §7 State: `store/bookingStore.ts` and `hooks/useBooking.ts`.
7. §10.2 Booking journey: follow the screens in order from `study-centre/[id].tsx` to `confirmation.tsx`.
8. §4 Components: `booking/SeatMap.tsx` and `booking/Seat.tsx`.
9. §10.4 Documents and §10.5 Notifications.
10. §11 Error handling and §12 configuration.
11. §14 End-to-end example, with BACKEND_README §18 beside it.
12. Run `npm run lint` and the app on web (`npm run web`) to see the flow.

## IF THE REVIEWER OPENS THIS FILE, WHAT SHOULD I BE ABLE TO EXPLAIN?

- [ ] The route folders and what each group (`(auth)`, `(tabs)`, `study-centre`, `bookings`, `profile`) does.
- [ ] Why screens call hooks and hooks call services, and why only `api.ts` touches tokens and URLs.
- [ ] How the OTP login works, including the `REGISTRATION_REQUIRED` second step.
- [ ] How a 401 is refreshed once and what happens when refresh fails.
- [ ] Why the session survives a network failure but not a 401/403.
- [ ] The two global stores and what each holds.
- [ ] The seat booking journey from hall detail to booking detail, and how a conflict is shown.
- [ ] How AC units are displayed (fixtures, not seats).
- [ ] How documents and notifications reach the backend.
- [ ] Which values are public `EXPO_PUBLIC_` configuration and where secrets must never go.
- [ ] Which parts are **not** implemented or not determinable (§16), especially payment.
