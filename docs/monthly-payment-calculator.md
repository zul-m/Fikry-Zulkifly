# Monthly Payment Calculator

The "Anggaran bayaran bulanan" figure shown on each property page is a rough estimate of how much a buyer would pay per month on a home loan. It is not financial advice — it assumes fixed inputs and ignores fees, insurance, and lender-specific terms.

## Assumptions

| Input | Value | Why |
|---|---|---|
| Down payment | 10% of asking price | Minimum common deposit in Malaysia |
| Loan amount | 90% of asking price | Price minus down payment |
| Annual interest rate | 4.5% | Approximate mid-market BLR-based rate |
| Loan tenure | 35 years | Maximum residential tenure allowed by most Malaysian banks |

## How the number is calculated

### Step 1 — Work out the loan amount

```
Loan = Asking price × 90%
```

Example: RM 500,000 × 90% = **RM 450,000**

### Step 2 — Convert the annual rate to a monthly rate

```
Monthly rate = 4.5% ÷ 12 = 0.375% per month
```

### Step 3 — Count the total number of monthly payments

```
Payments = 35 years × 12 months = 420 payments
```

### Step 4 — Apply the standard loan repayment formula

This is the same formula used by every bank to calculate a fixed monthly instalment:

```
Monthly payment = Loan × [r × (1 + r)^n] ÷ [(1 + r)^n − 1]

where
  r = monthly interest rate (0.00375)
  n = total number of payments (420)
```

For the RM 500,000 example this gives roughly **RM 2,051/month**.

### What the formula does

Each month, part of the payment covers that month's interest on the remaining balance, and the rest chips away at the principal. The formula works out the one fixed amount that, paid every month for exactly 35 years, brings the balance to zero on the last payment. This is called a *fully amortising* loan.

## What the estimate does not include

- Stamp duty and legal fees
- Mortgage Reducing Term Assurance (MRTA) or other insurance
- Maintenance fees and sinking funds (for strata titles)
- Variations in interest rate (some loans are floating, not fixed)
- Eligibility checks — actual approved tenure and rate depend on the buyer's profile
