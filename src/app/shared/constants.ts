import {environment} from '../../environments/environment';

export const API_URL = environment.apiUrl;

export const CUI_REGEXP = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;

export const EMAIL_REGEXP = '^[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9]' +
  '(?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$';

export const GENDER_LIST = [
  {code: 'M', description: 'Masculino'},
  {code: 'F', description: 'Femenino'},
];

