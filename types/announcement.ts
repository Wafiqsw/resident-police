import { CommitteeMember } from './user';

export interface Announcement {
    id: string;
    title: string;
    details: string;
    image?: string;
    expirationDate?: string;
    createdAt: string;
    // Link to the committee member who created it
    createdBy: CommitteeMember;
}
