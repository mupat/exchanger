# Exchanger
Simple NodeJS API to calculate exchange amounts based on ecb rates.

# API Usage
API exposes some routes

## status
see actual status of api

```
GET '/status'
{
  "status": "ok",
  "last_updated": "2017-03-27"
}
```

## update
manual trigger fetch of actual ecb rates

```
GET '/udate'

200 or {
  message: "<error>"
}
```

## rates
see actual used rates

```
GET '/rates'
[
  {
    "currency": "USD",
    "rate": "1.0889"
  },
  {
    "currency": "JPY",
    "rate": "119.93"
  },
  {
    "currency": "BGN",
    "rate": "1.9558"
  },
  ...
]
```

## exchange
do exchange calculation
> NOTE: The amount must be given in english format and without thousand seperators

```
GET '/exchange/<base_currency>/<target_currency>/<amount>'

{
  "base_currency": "<base_currency",
  "target_currency": "<target_currency",
  "base_amount": "<amount>",
  "target_amount": "<calculated_amount>"
} or {
 message: "<error>"
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

# Get it started
```
make build
make run
```

# Tests
Currently the tests running only by using npm. Running them inside a docker container is failing. I need to investigate more time to find a solution.
```
npm test
```
