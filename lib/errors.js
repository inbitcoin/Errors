var http = require('http')

module.exports = (function () {
  // WARNING: when creating a new error, make sure to set a code
  // error codes must not be reused

  function errors() {}

  // ColoredCoins base error (all errors will inherit from it)
  errors.ColoredCoinsError = class ColoredCoinsError extends Error {
    constructor(msg, errorCode, defaultMsg, defaultResponse) {
      super(msg)
      this.name = this.constructor.name
      if (!errorCode) {
        throw new Error('Must specify code')
      }
      if (typeof errorCode !== 'number') {
        throw new Error('code must be a number')
      }
      if (!defaultMsg) {
        defaultMsg = 'An unexpected ' + this.name + ' occurred.'
      }
      var attrs = {}
      if (msg && typeof msg === 'object') {
        attrs = msg
        Object.defineProperty(this, 'message', {
          value: attrs['message'] || defaultMsg,
          configurable: true,
          enumerable: true,
        })
        Object.defineProperty(this, 'explanation', {
          value: attrs['explanation'],
          configurable: true,
          enumerable: true,
        })
        Object.defineProperty(this, 'status', {
          value: attrs['status'] || (http.STATUS_CODES[errorCode] ? errorCode : 500),
          configurable: true,
          // normalize for http status code and connect compat
          enumerable: true,
          // allow to change status
          writable: true,
        })
        Object.defineProperty(this, 'code', {
          value: attrs['code'] || errorCode,
          configurable: true,
          enumerable: true,
        })
        Object.defineProperty(this, 'response', {
          value: attrs['response'] || defaultResponse,
          configurable: true,
          enumerable: true,
        })
        for (var key in attrs) {
          if (!this.hasOwnProperty(key)) {
            Object.defineProperty(this, key, {
              value: attrs[key],
              configurable: true,
              enumerable: true,
            })
          }
        }
      } else {
        this.message = msg || defaultMsg
        this.code = errorCode
        this.status = 500
        this.response = defaultResponse
      }
    }
  }

  // validation errors

  errors.ValidationError = class ValidationError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 10000, 'Validation error')
      this.status = 400
    }
  }

  errors.ResolutionTooHighError = class ResolutionTooHighError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 11001, 'Sample resolution too high')
      this.status = 500
    }
  }

  errors.BlocksRangeTooHighError = class BlocksRangeTooHighError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 11002, 'Requested blocks range is too high')
      this.status = 500
    }
  }

  // coloredcoinsd errors

  errors.CCTransactionConstructionError = class CCTransactionConstructionError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20000, 'Colored transaction construction has failed')
    }
  }

  errors.OutputAlreadySpentError = class OutputAlreadySpentError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20001, 'Output is already spent')
    }
  }

  errors.NoOutputWithSuchAssetError = class NoOutputWithSuchAssetError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20002, 'No output with the requested asset')
    }
  }

  errors.NotEnoughFundsError = class NotEnoughFundsError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20003, 'Not enough satoshi to cover transaction')
    }
  }

  errors.NotEnoughAssetsError = class NotEnoughAssetsError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20004, 'Not enough assets to cover transfer transaction')
    }
  }

  errors.MissingIssuanceTxidError = class MissingIssuanceTxidError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20005, 'Missing issuanceTxid for utxo', 'Check that the utxo is carrying assets')
    }
  }

  errors.SeedMetadataError = class SeedMetadataError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20011, 'Metadata seed has failed')
    }
  }

  errors.DownloadMetadataError = class DownloadMetadataError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20012, 'Metadata download has failed')
    }
  }

  errors.UploadMetadataError = class UploadMetadataError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20013, 'Metadata upload has failed')
    }
  }

  errors.MetadataMissingShaError = class MetadataMissingShaError extends errors.ColoredCoinsError {
    constructor(message) {
      super(message, 20014, "Metadata is missing sha1 or sha2 - can't issue")
    }
  }

  return errors
})()
