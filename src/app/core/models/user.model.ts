import {Role} from './role.model';
import {CompanyRole} from './company-role.model';

export interface User {
    token: string;    
    name?: string;    
    email?: string;
    isActive?: boolean;
    role?: Role;
    companyRoles: CompanyRole[]
}
