# Test cases

Checks were run locally against the backend at `http://localhost:8080`, with the frontend built using `npm run build`. The actual results are recorded in the last column.

| # | Feature | Input | Expected | Actual |
|---:|---|---|---|---|
| 1 | List plans | `GET /plans` | Returns Monthly, Quarterly, and Yearly plans on an empty database | Pass — 200; 3 plans |
| 2 | Create plan | Valid name, duration `2`, price `1800` | `201 Created`; plan is saved | Pass — 201 |
| 3 | Validate plan | Duration `0` | `400 Bad Request` with a validation message | Pass — 400 |
| 4 | Duplicate plan | Existing plan name | `409 Conflict` | Pass — 409 |
| 5 | Update plan | `PUT /plans/{id}` with valid values | Updated plan is returned | Pass — 200; duration updated |
| 6 | Delete unused plan | Delete a plan with no members | `204 No Content` | Pass — 204 |
| 7 | Protect assigned plan | Delete a plan assigned to a member | `409 Conflict` with explanation | Pass — 409 |
| 8 | List members | `GET /members` | Returns member records and plan information | Pass — 200; 5 seeded members |
| 9 | Read member | `GET /members/{id}` for an existing id | Returns the matching member | Pass — 200 |
| 10 | Unknown member | `GET /members/999999` | `404 Not Found` with a clear message | Pass — 404 |
| 11 | Create member | Valid name, 10-digit phone, email, join date, and plan | `201 Created`; four-digit code and calculated expiry returned | Pass — 201; 4-digit code and expiry returned |
| 12 | Required name | Empty name | `400 Bad Request` | Pass — 400 |
| 13 | Phone length | 9 or 11 digits | `400 Bad Request` | Pass — 400 |
| 14 | Email format | `not-an-email` | `400 Bad Request` | Pass — 400 |
| 15 | Duplicate phone | Phone used by another member | `409 Conflict` | Pass — 409 |
| 16 | Duplicate email | Email used by another member | `409 Conflict` | Pass — 409 |
| 17 | Invalid member plan | Unknown `planId` | `400 Bad Request` | Pass — 400 |
| 18 | Search members | `GET /members/search?name=aar` | Case-insensitive partial matches are returned | Pass — 200; Aarav Sharma matched |
| 19 | Renewal watch | `GET /members/expired` | Expired and next-seven-day memberships are returned | Pass — 200; 4 expired/expiring members |
| 20 | Dashboard counts | `GET /dashboard` | Total, active, expired, and expiring-soon counts are returned | Pass — 200; counts returned for 5 members |
| 21 | Check in active member | `POST /attendance` with valid member code | `201 Created`; today’s visit is saved | Pass — 201 |
| 22 | Unknown code | `POST /attendance` with unused code | `404 Not Found` | Pass — 404 |
| 23 | Expired check-in | Expired member code | `400 Bad Request`; no visit is saved | Pass — 400 |
| 24 | Duplicate daily check-in | Check in same active code twice today | Second request is `409 Conflict` | Pass — first 201, duplicate 409 |
| 25 | Attendance history | `GET /attendance/{memberId}` | Saved check-in dates are returned | Pass — 200; visit returned |
| 26 | Record payment | Member id and selected plan id | `201 Created`; selected plan price is recorded and expiry extended by its duration | Pass — 201; selected plan and renewed expiry returned |
| 27 | Invalid renewal plan | Unknown plan id | `400 Bad Request` | Pass — 400 |
| 28 | Payment history | `GET /payments/{memberId}` | Saved payments are returned newest first | Pass — 200; payment returned |
| 29 | Build backend | Maven `package` goal | Build succeeds without compile errors | Pass — Maven package BUILD SUCCESS |
| 30 | Build frontend | `npm run build` | Vite creates a production bundle | Pass — Vite build SUCCESS |
| 31 | Sample payment history | `GET /payments/{id}` for a seeded member | Sample member has prior payment records with plan details | Pass — two records seeded per sample member |
