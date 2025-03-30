import { Role } from "./role.model";

export interface Staff {
    
    firstName: string;
    
    familyName: string;

    email: string;

    password?: string;

    companyRole?: Role;

    birthDate?: string;

    identityDocument?: string;

    jobTitle?: string;

    address?: string;

    phone?: string;

    taxIdentificationNumber?: string;
}