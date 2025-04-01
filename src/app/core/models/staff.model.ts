import { Role } from "./role.model";
import { UserGeneral } from "./user-general.model";

export interface Staff extends UserGeneral {
    
    email: string;

    password?: string;

    companyRole?: Role;

    birthDate?: string;

    identityDocument?: string;

    jobTitle?: string;

    address?: string;

    phone?: string;

    taxIdentificationNumber?: string;

    gender?: string; 
}