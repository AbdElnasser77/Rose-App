export interface Address {
  id: string;
  city: string;
  street: string;
  phone: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  city: string;
  street: string;
  phone: string;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface AddressListResponse {
  status: boolean;
  code: number;
  payload: {
    data?: Address[];
    addresses?: Address[];
  };
}

export interface AddressResponse {
  status: boolean;
  code: number;
  payload: {
    address?: Address;
    data?: Address;
  };
}
