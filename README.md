# Errors
Errors assigned to Colored-Coins servers responses.
This module allows servers reuse errors, acheiving more comprehensive and readable error responses,
and more importantly - enables better logging and tracing of errors by client applications or error analysis thanks to well-defined error codes.
## Usage
### Installation
```
$ npm install cc-errors
```
### Creating error messages
First, `require` the module like so:
```javascript
require('cc-errors')
```
Create specific Error instance of one of the supported error classes:
```javascript
console.log(new errors.InvalidAddressError().toJSON())
```
gives us:
```
{ code: 'e10001',
  status: 422,
  name: 'InvalidAddressError',
  message: 'Invalid address' }
```
Override messages on instantiation:
```javascript
console.log(new errors.InvalidAddressError({
	explanation: 'Address 123xyz is not a valid address',
	response: 'Change the argument \'fromAddress\' to be a valid address'
}).toJSON())
```
outputs:
```
{ explanation: 'Address 123xyz is not a valid address',
  response: 'Change the argument \'fromAddress\' to be a valid address',
  code: 'e10001',
  status: 422,
  name: 'InvalidAddressError',
  message: 'Invalid address' }
```


