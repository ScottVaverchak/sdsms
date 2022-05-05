# sdsms
_Super Duper Simple Messaging Service_

## Getting started

### Install 

Before beginning, make sure you have a new version of nodejs installed.
You can use your favorite package manager of choice, or 
head over to [nodejs](https://nodejs.org/en/) and download it for your 
platform of choice

### Building 
Once nodejs is installed, clone this repo to a local folder. Once this is
complete, run:

`npm i`

To install the dependencies. Once this is complete, follow it up with a:

`npm run build`

This will build the application inside of the `./dist/` folder. 

Once this is complete, you may start the application on your local machine
with the following command: 

`npm run start`

### Seeded Data

sdsms comes with preseeded data for users: 

```typescript
{ id: '123', name: 'Gandalf' },
{ id: '456', name: 'Saruman' },
{ id: '789', name: 'Radagast'}
```

Due to the evolving nature of this application, adding new users during
runtime is not avilable. In order to add more users, it is best to edit 
the seeded data found [here](https://github.com/ScottVaverchak/sdsms/blob/master/src/datalayer/database.ts#L24)

Along with some user data, a few messages are also seeded. These include
one message that is considered expired, and another that is considered
valid. (For more information about message expiration and constraints, 
please refer to the API documentation below.)

The message data is shown below: 

```typescript
{ 
    id: v4(), 
    sender_id: '456', 
    recv_id: '123', 
    message: 'wanna come over and talk about hobbits?', 
    creation: thirtyDaysAgo() - (1 * 24 * 60 * 60 )
},
{ 
    id: v4(), 
    sender_id: '456', 
    recv_id: '123', 
    message: 'don\'t forget your staff!', 
    creation: thirtyDaysAgo() + (1 * 24 * 60 * 60 )
}
```
---

# Endpoints 
Below are the end points available to call

## Send Message
### **POST** /message

This endpoint will send a message between users. This endpoint will send a 200/OK 
when it is successful. For error conditions, please see the Error section below

### Data
```json
{
    "user_id": "123", 
    "recv_id": "456", 
    "message": "For Frodo"
}
```
| Field Name | Description | Required | Validation |
|------------|-------------|----------|------------|
| user_id    | The ID of the user sending the message | true | Must be a valid user|
| recv_id    | The ID of the user that will be receiving the message | true | Must be a valid user |
| message | The message to send | true | Length must be > 0 and <= 42 |

### Errors

Errors will send back the following data when an error occurs: 

```json 
{
    "error": "Error Message Here"
}
```

| Error Message | Description | 
|---------------|-------------|
| Invalid payload. Missing user_id | `user_id` is missing from the payload | 
| Invalid payload. Missing recv_id | `recv_id` is missing from the payload |
| Invalid payload. Missing or empty message | `message` is missing from the payload |
| Invalid user | `user_id` or `recv_id` are not valid users |
| Message cannot exceed 42 characters | The message is too long - 42 characters is the maximum | 
| Internal error | An internal error occured | 

--- 

<br />
<br />

## Retrieve Messages
### **GET** /message/:user_id

This endpoint will retrieve messages for the user from the last 30 days, up to 100 messages will
be returned. On success, this endpoint will reply with the following data: 

```json 
{ 
    "messages": [ 
        { 
            "id": "<string>", 
            "sender_id": "<string>", 
            "recv_id": "<string>", 
            "message": "<string>", 
            "creation": "<number>" 
        }
    ]
}
```

### Data 

| Field Name | Description | Type |
|------------|-------------|------|
| id | ID of the message | string |
| sender_id | ID of the sending User | string | 
| recv_id | ID of the receiving User | string | 
| message | The message to send | string | 
| creation | Unixtime stamp of when the message was created | number |

### Errors 

| Error Message | Description | 
|---------------|-------------|
| Internal error | An internal error occured | 

<br />
<br />

### Retrieve Messages from a Specific User
### **GET** /message/:user_id/:recv_id

This endpoint will retrieve messages for the user sent from the `recv_id` user from the last 30
 days, up to 100 messages will be returned. On success, this endpoint will reply with the 
 following data: 

```json 
{ 
    "messages": [ 
        { 
            "id": "<string>", 
            "sender_id": "<string>", 
            "recv_id": "<string>", 
            "message": "<string>", 
            "creation": "<number>" 
        }
    ]
}
```

### Data 

| Field Name | Description | Type |
|------------|-------------|------|
| id | ID of the message | string |
| sender_id | ID of the sending User | string | 
| recv_id | ID of the receiving User | string | 
| message | The message to send | string | 
| creation | Unixtime stamp of when the message was created | number |

### Errors 

| Error Message | Description | 
|---------------|-------------|
| Internal error | An internal error occured | 
