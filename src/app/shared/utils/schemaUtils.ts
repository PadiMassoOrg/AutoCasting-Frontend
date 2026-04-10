export const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Permite nombres con espacios y caracteres comunes en nombres comerciales y artísticos
export const NAME_RX = /^[A-Za-zÀ-ÿ0-9\s\-\&'.,()\/#+]+$/;

// Casi todos los formatos de CUIT/CUIL/RUC tienen dígitos, guiones y/o espacios
export const TAX_NUMBER_RX = /^[A-Za-z0-9\-\s]+$/;
