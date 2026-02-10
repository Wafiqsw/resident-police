import { ResidentProfile, CommitteeMember } from './user';

export type ComplaintStatus = 'pending' | 'accepted' | 'resolved' | 'rejected';

export interface Complaint {
    id: string;
    // Link to the resident who created it
    creator: ResidentProfile;
    issue: string;
    category: string;
    seriesNumber: string;
    lastUser?: string;
    dateBroken: string;
    brokenDetails: string;
    dateSubmitted: string;
    proofPicture?: string;
    status: ComplaintStatus;

    // Link to the committee member who handled/evaluated it
    handledBy?: CommitteeMember;
    handledAt?: string;
    rejectionReason?: string;
    resolutionDetails?: string;
}
