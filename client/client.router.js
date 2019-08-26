const express = require('express');
const router = express.Router();
const keyValidator = require('../utils/inputValidation/key');
const splitValidator = require('../utils/inputValidation/split');
const attributesValidator = require('../utils/inputValidation/attributes');
const clientController = require('./client.controller');

const parseValidators = (validators) => {
  const errors = [];
  validators.forEach(validator => {
    if (validator && !validator.valid) errors.push(validator.error);
  });
  return errors;
};

const treatmentValidation = (req, res, next) => {
  const matchingKeyValidation = keyValidator(req.query.key, 'key');
  const bucketingKeyValidation = req.query['bucketing-key'] !== undefined ? keyValidator(req.query['bucketing-key'], 'bucketing-key') : null;
  const splitNameValidation = splitValidator(req.query['split-name']);
  const attributesValidation = attributesValidator(req.query.attributes);

  const error = parseValidators([matchingKeyValidation, bucketingKeyValidation, splitNameValidation, attributesValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      matchingKey: matchingKeyValidation.value,
      splitName: splitNameValidation.value,
      attributes: attributesValidation.value,
    };

    if (bucketingKeyValidation && bucketingKeyValidation.valid) req.splitio.bucketingKey = bucketingKeyValidation.value;
  }

  next();
};

router.get('/get-treatment', treatmentValidation, clientController.getTreatment);
router.get('/get-treatment-with-config', treatmentValidation, clientController.getTreatmentWithConfig);
router.get('/get-treatments', clientController.getTreatments);

module.exports = router;
