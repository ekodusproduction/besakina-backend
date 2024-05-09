import { body, validationResult } from 'express-validator';
import { validateImagesArray } from '../../../Utility/imageValidator.js';
import { deleteFiles } from '../../../Utility/deleteFiles.js';

export const vehiclesValidationRules = () => {
  return [
    body('type').isString().withMessage('Vehicle type must be a string').notEmpty().withMessage('Vehicle type is required'),
    body('brand').isString().withMessage('Brand must be a string').notEmpty().withMessage('Brand is required'),
    body('registration_year').optional().isString().withMessage('Registration year must be an integer'),
    body('kilometer_driven').optional().isString().withMessage('Kilometer driven must be an string'),
    body('title').isString().withMessage('Ad title must be a string').trim().notEmpty().withMessage('Ad title is required'),
    body('description').isString().withMessage('Description must be a string').trim().notEmpty().withMessage('Description is required'),
    body('price').isString().withMessage('Price must be a integer').notEmpty().withMessage('Price is required'),

    body('fuel').optional().isString().withMessage('fuel must be a string'),
    body('second_hand').optional().isString().withMessage('second_hand must be a string'),
    body('model').optional().isString().withMessage('model must be a string'),
    body('transmission').optional().isString().withMessage('transmission must be a string'),
    body('variant').optional().isString().withMessage('variant must be a string'),

    body('street').isString().withMessage('Street must be a string'),
    body('locality').isString().withMessage('locality must be a string'),
    body('city').isString().withMessage('City must be a string'),
    body('state').isString().withMessage('State must be a string'),
    body('pincode').isString().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),

    body('images').optional(),
    body('video').optional(),

    body('map_location').optional(),
    body('longitude').optional(),
    body('latitude').optional(),
  ];
};


export const editVehiclesValidationRules = () => {
  return [
    body('vehicle_type').optional().isString().withMessage('Vehicle type must be a string'),
    body('brand').optional().isString().withMessage('Brand must be a string'),
    body('registration_year').optional().isInt().withMessage('Registration year must be an integer'),
    body('kilometer_driven').optional().isInt().withMessage('Kilometer driven must be an integer'),
    body('title').optional().isString().withMessage('Ad title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('price').optional().isInt().withMessage('Price must be a decimal'),
    // body('map_location').optional().isString().withMessage('Map location must be a string'),
    // body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
    // body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),

    body('street').optional().isString().withMessage('Street must be a string'),
    body('locality').optional().isString().withMessage('Address must be a string'),
    body('city').optional().isString().withMessage('City must be a string'),
    body('state').optional().isString().withMessage('State must be a string'),
    body('pincode').optional().isInt().withMessage('Pincode must be an integer').notEmpty().withMessage('Pincode is required'),
  ];
};



export const validationMiddlewarePost = async (req, res, next) => {
  const rules = vehiclesValidationRules();
  await Promise.all(rules.map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      await deleteFiles(req.files)
    }
    return res.status(400).json({
      message: errors.array()[0].msg,
      status: "failed",
      http_status_code: 400,
    });
  }
  next();
};

export const validationMiddlewarePut = async (req, res, next) => {
  console.log("inside edit vehiclkes", req.body)

  const rules = editVehiclesValidationRules();
  await Promise.all(rules.map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      await deleteFiles(req.files)
    }
    return res.status(400).json({
      message: errors.array()[0].msg,
      status: "failed",
      http_status_code: 400,
    });
  }
  next();
};

const imageUpload = () => {
  return [
    body('images').custom(validateImagesArray),
  ]
}
const videoUpload = () => {
  return [
    body('video').custom(validateImagesArray),
  ]
}
export const imageValidator = async (req, res, next) => {
  const rules = imageUpload();
  await Promise.all(rules.map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await deleteFiles(req.files)
    return res.status(400).json({
      message: errors.array()[0].msg,
      status: "failed",
      http_status_code: 400,
    });
  }
  next();
};

export const videoValidator = async (req, res, next) => {
  const rules = videoUpload();
  await Promise.all(rules.map(rule => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await deleteFiles(req.files)
    return res.status(400).json({
      message: errors.array()[0].msg,
      status: "failed",
      http_status_code: 400,
    });
  }
  next();
};