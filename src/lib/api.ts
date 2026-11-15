import { APP_CONFIG } from './config';

const API_BASE_URL = APP_CONFIG.apiUrl;

export interface RegisterAgencyPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  password: string;
  role?: 'admin' | 'owner';
  city?: string;
  unitRange?: string;
  paymentMethods?: string[];
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      organizationId?: string;
    };
    organization?: {
      id: string;
      name: string;
      plan: string;
    };
  };
}

export async function registerAgency(payload: RegisterAgencyPayload): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      organizationName: payload.organizationName.trim(),
      password: payload.password,
      role: payload.role || 'admin',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : 'Erreur lors de la création du compte agence.');
    throw new Error(errorMsg);
  }

  return data;
}
