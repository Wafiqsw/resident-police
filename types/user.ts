export type UserRole = 'resident' | 'committee';

export interface Child {
    name: string;
    age: number;
}

export interface HouseDetails {
    block: string;
    floor: string;
    houseNo: string;
}

export interface CommitteeMember {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    role: 'committee';
}

export interface ResidentProfile {
    id: string;
    fullName: string;
    policeId: string;
    rank: string;
    contactNumber: string;
    email: string;
    houseNumber: HouseDetails;
    maritalStatus: string;
    role: 'resident';
    password?: string;
    spouseName?: string;
    spouseContact?: string;
    spouseOccupation?: string;
    numberOfChildren?: number;
    children?: Child[];
}

export type User = ResidentProfile | CommitteeMember;
