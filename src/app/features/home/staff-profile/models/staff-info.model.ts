import { UserGeneral } from "@core/models/user-general.model";

export interface StaffInfo extends UserGeneral {
        
    birthDate?: string;

    identityDocument?: string;

    jobTitle?: string;

    address?: string;

    phone?: string;
    
    gender?: string; 
}