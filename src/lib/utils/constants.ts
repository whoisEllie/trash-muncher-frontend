import type { Variables } from '$lib/interfaces/variables.interface';

const BASE_API_URI: string = import.meta.env.DEV ? import.meta.env.VITE_BASE_API_URI_DEV : import.meta.env.VITE_BASE_API_URI_PROD;

export const variables: Variables = { BASE_API_URI: BASE_API_URI };

// Exports and returns localhost copy of backend or production url for backend
