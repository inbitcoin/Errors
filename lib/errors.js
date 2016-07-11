var errors = require('errors')

// validation errors

errors.create({
  name: 'InvalidAddressError',
  code: 'e10001',
  status: 422,
  defaultMessage: 'Invalid address'
})

errors.create({
  name: 'InvalidAssetIdError',
  code: 'e10002',
  status: 422,
  defaultMessage: 'Invalid asset ID'
})

errors.create({
  name: 'InvalidTxidError',
  code: 'e10003',
  status: 422,
  defaultMessage: 'Invalid transaction ID'
})

module.exports = errors
