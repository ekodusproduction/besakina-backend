import { body } from 'express-validator';
import { validateImagesArray } from './image.validation.js';

export const vehiclesValidationRules = () => {
  return [
    body('plan_id').isInt().withMessage('Plan ID must be an integer').notEmpty().withMessage('Plan ID is required'),
    body('vehicle_type').isString().withMessage('Vehicle type must be a string').notEmpty().withMessage('Vehicle type is required'),
    body('brand').isString().withMessage('Brand must be a string').notEmpty().withMessage('Brand is required'),
    body('registration_year').isInt().withMessage('Registration year must be an integer').notEmpty().withMessage('Registration year is required'),
    body('kilometer_driven').isInt().withMessage('Kilometer driven must be an integer').notEmpty().withMessage('Kilometer driven is required'),
    body('ad_title').isString().withMessage('Ad title must be a string').notEmpty().withMessage('Ad title is required'),
    body('description').isString().withMessage('Description must be a string').notEmpty().withMessage('Description is required'),
    body('price').isDecimal().withMessage('Price must be a decimal').notEmpty().withMessage('Price is required'),
    body('photos').custom(validateImagesArray),
    body('map_location').isString().withMessage('Map location must be a string').notEmpty().withMessage('Map location is required'),
    body('longitude').isDecimal().withMessage('Longitude must be a decimal').notEmpty().withMessage('Longitude is required'),
    body('latitude').isDecimal().withMessage('Latitude must be a decimal').notEmpty().withMessage('Latitude is required'),
  ];
};


export const editVehiclesValidationRules = () => {
  return [
    body('vehicle_type').optional().isString().withMessage('Vehicle type must be a string'),
    body('brand').optional().isString().withMessage('Brand must be a string'),
    body('registration_year').optional().isInt().withMessage('Registration year must be an integer'),
    body('kilometer_driven').optional().isInt().withMessage('Kilometer driven must be an integer'),
    body('ad_title').optional().isString().withMessage('Ad title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('price').optional().isDecimal().withMessage('Price must be a decimal'),
    body('map_location').optional().isString().withMessage('Map location must be a string'),
    body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal'),
    body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal'),
  ];
};
