# Exchanger
Simple NodeJS API to calculate exchange amounts based on ecb rates.

# API Usage

Request:
```
GET '/exchange/<base_currency>/<target_currency>/<amount>'
```

Response:
```
{
  "base_currency": "<base_currency",
  "target_currency": "<target_currency",
  "base_amount": "<amount>",
  "target_amount": "<calculated_amount>"
}
```

Example:
```
GET '/exchange/JPY/USD/100.45'
{
  "base_currency": "JPY",
  "target_currency": "USD",
  "base_amount": "100.45",
  "target_amount": "0.90"
}
```

> NOTE: The amount must be given in english format and without thousand seperators

# Get it started

```
make build
make run
```
