# Database Migration Report: PostgreSQL (Prisma) to MongoDB (Mongoose)

## 1. Overview
The ExpenseMate database persistence layer has been migrated from PostgreSQL via Prisma to MongoDB via Mongoose. The migration was isolated strictly to repositories, database models/connection, and environment configuration. The domain services, controllers, routes, request/response contracts, and frontend user interface remained completely intact.

---

## 2. Before State vs. Target State

- **Before State**:
  - Relational schema hosted on PostgreSQL with foreign keys and auto-incrementing integer IDs.
  - ORM access using Prisma (`@prisma/client`, `@prisma/adapter-pg`).
  - Configuration had inline defaults and hard-coded fallbacks across controller and service modules.
- **Target State**:
  - Document-oriented collections hosted on MongoDB via Mongoose ODM.
  - Foreign keys replaced by document references using `mongoose.Schema.Types.ObjectId` (mapped to string `id` in repository outputs).
  - Centralized, fail-fast configuration in `src/config/index.js` enforcing required environment variables (`MONGODB_URI`, `JWT_SECRET`).
  - Prisma retained only as a development tool (`devDependencies`) for the idempotent migration script.

---

## 3. Schema Design

Separate collections were created with document references rather than embedded arrays, as transactions grow unbounded over time:

1. **`users` (`User`)**:
   - Fields: `name` (String, required), `email` (String, unique, lowercase, trimmed), `password` (String, required), `legacyId` (Number, indexed), `created_at` (Date).
2. **`categories` (`Category`)**:
   - Fields: `name` (String, required), `nameNormalized` (String, lowercase, trimmed), `type` (Enum: `INCOME`, `EXPENSE`), `user_id` (ObjectId -> User), `legacyId` (Number, indexed).
   - Index: Unique compound index on `{ nameNormalized: 1, user_id: 1 }` preserving case-insensitive name uniqueness per user.
3. **`budgets` (`Budget`)**:
   - Fields: `amount` (Decimal128), `month` (Number, 1-12), `year` (Number), `userId` (ObjectId -> User), `legacyId` (Number, indexed).
   - Index: Unique compound index on `{ userId: 1, year: 1, month: 1 }`.
4. **`transactions` (`Transaction`)**:
   - Fields: `amount` (Decimal128), `type` (Enum: `INCOME`, `EXPENSE`), `title` (String), `description` (String, nullable), `date` (Date), `category_id` (ObjectId -> Category), `userId` (ObjectId -> User), `legacyId` (Number, indexed), `created_at` (Date).
   - Indexes: Compound index on `{ userId: 1, date: -1 }` and `{ userId: 1, category_id: 1 }`.

---

## 4. Steps Performed

1. **Installed Mongoose**: Added `mongoose` to production runtime dependencies; shifted `@prisma/client`, `@prisma/adapter-pg`, and `pg` to `devDependencies`.
2. **Centralized Configuration**:
   - Created [`src/config/index.js`](file:///d:/Desktop/SCD%20project/backend/src/config/index.js) validating `MONGODB_URI` and `JWT_SECRET` fail-fast on boot.
   - Centralized bcrypt rounds, token expiry, CORS origins, and cookie options.
   - Added `.env.example` in backend and frontend; verified `.env` files are ignored in `.gitignore`.
   - Added fail-fast test [`tests/config.test.js`](file:///d:/Desktop/SCD%20project/backend/tests/config.test.js).
3. **Mongoose Schema & Models**:
   - Created schemas in `src/models/` for `User`, `Category`, `Budget`, and `Transaction`.
4. **Repository Layer Rewrite**:
   - Rewrote `userRepository`, `categoryRepository`, `budgetRepository`, and `transactionRepository` using Mongoose.
   - Guaranteed identical signature, arguments, and return shapes with opaque string `id` mapping (`_id` -> `id`).
   - Stored monetary amounts as `Decimal128` and serialized to plain strings (e.g. `"150.50"`), matching previous API output.
5. **Idempotent Data Migration**:
   - Developed [`scripts/migrate-postgres-to-mongo.js`](file:///d:/Desktop/SCD%20project/backend/scripts/migrate-postgres-to-mongo.js) supporting `--dry-run`.
   - Maintained relations by mapping PostgreSQL integer IDs to Mongo `ObjectId`s and saving `legacyId`.
   - Seeded PostgreSQL with sample data and executed the migration script.
6. **Frontend Compatibility Check**:
   - Updated frontend API URL fallbacks to support `NEXT_PUBLIC_API_URL` alongside `NEXT_PUBLIC_BACKEND_URL`. Verified that the frontend treats `id` as `string | number`.

---

## 5. Risks and Compatibility Considerations

- **ObjectId vs Integer IDs**:
  - In PostgreSQL, IDs were integer numbers. In MongoDB, IDs are 24-character hex ObjectIds. The domain services and frontend interfaces (`string | number`) handle opaque string IDs without issue; any obsolete `parseInt(id)` calls were broadened to accept opaque IDs.
- **Fixed Precision Money (Decimal128)**:
  - Floating point drift in financial balances is prevented by using `Decimal128` in MongoDB storage while serializing as exact strings/numbers during API payload construction.
- **Case-Insensitive Category Uniqueness**:
  - Enforced via a normalized lowercase field (`nameNormalized`) with a unique compound index on `(nameNormalized, user_id)`.
- **Relationship Population vs Joins**:
  - Replaced relational SQL joins with indexed references and Mongoose `.populate("category_id")` or manual lookups without query overhead.

---

## 6. Verification and Evidence

All verifications were executed and verified locally:

1. **Migration Verification**:
   - Verification report saved at [docs/evidence/migration-verification.txt](file:///d:/Desktop/SCD%20project/docs/evidence/migration-verification.txt).
   - Validated: 0 orphaned references, 100% table-to-collection count parity, and matching per-user total income and expenses across PostgreSQL and MongoDB.
2. **Regression Test Suite**:
   - Complete 14/14 test pass on MongoDB saved at [docs/evidence/regression-after-migration.txt](file:///d:/Desktop/SCD%20project/docs/evidence/regression-after-migration.txt).
3. **Layer Architecture Enforcement**:
   - `npm run check:layers` passed with 0 violations.
4. **Fail-Fast Configuration**:
   - `tests/config.test.js` passed, confirming immediate process exit when required secrets are omitted.
