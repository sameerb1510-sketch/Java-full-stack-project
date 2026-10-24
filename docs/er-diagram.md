# Database ER diagram

```mermaid
erDiagram
    PLANS ||--o{ MEMBERS : "covers"
    MEMBERS ||--o{ ATTENDANCE : "checks in"
    MEMBERS ||--o{ PAYMENTS : "makes"
    PLANS ||--o{ PAYMENTS : "purchased in"

    PLANS {
        bigint id PK
        varchar name UK
        int duration_months
        decimal price
    }
    MEMBERS {
        bigint id PK
        char member_code UK
        varchar name
        char phone UK
        varchar email UK
        date join_date
        date expiry_date
        bigint plan_id FK
    }
    ATTENDANCE {
        bigint id PK
        bigint member_id FK
        date check_in_date
    }
    PAYMENTS {
        bigint id PK
        bigint member_id FK
        bigint plan_id FK
        decimal amount
        date payment_date
    }
```

The member code, phone, and email are unique. Attendance has a unique `(member_id, check_in_date)` key so a member cannot be checked in twice on the same day. A member belongs to one plan; a plan may be assigned to many members. Attendance belongs to one member. Each payment belongs to a member and records the plan purchased at that time, so the history remains accurate if the member later changes plans.
