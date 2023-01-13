# Website Backend for Big Data Centre of Excellence
A web portal for managing team member details and event updates, also provides APIs for the website. 

# API Routes

### Request
`GET /api/v1/status/`
### Response
```
{
    message: 'success' | 'failed',
    data: {...}
}
```

### Request
`GET /api/v1/event/[code?]/`
### Response
```
{
    message: 'success',
    data: {...} | [{...}, {...}, ...]
}
```

### Request
`GET /api/v1/member/[year?]/`
### Response
```
{
    message: 'success',
    data: {...} | [{...}, {...}, ...]
}
```

### Request
`POST /api/v1/register/`
### Response
```
{
    message: 'created',
    data: {...}
}
```

### Request
`POST /api/v1/contact/`
### Response
```
{
    message: 'created',
    data: {...}
}
```