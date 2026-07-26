export interface Address {
  id: string;
  userId?: string;
  title: string;
  city: string;
  street: string;
  phone: string;
  isPrimary?: boolean;
  latitude?: string;
  longitude?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  title: string;
  city: string;
  street: string;
  phone: string;
  isPrimary?: boolean;
  latitude?: number;
  longitude?: number;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface AddressListResponse {
  status: boolean;
  code: number;
  payload: {
    addresses: Address[];
  };
}

export interface AddressResponse {
  status: boolean;
  code: number;
  payload: {
    address: Address;
  };
}
