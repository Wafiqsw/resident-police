export type UserType = 'committee' | 'resident';

export interface NavigationItem {
    label: string;
    href: string;
    icon: string;
}

export const committeeNavigation: NavigationItem[] = [
    {
        label: 'Dashboard',
        href: '/committee',
        icon: 'dashboard',
    },
    {
        label: 'Residents',
        href: '/committee/residents',
        icon: 'people',
    },
    {
        label: 'Announcements',
        href: '/committee/announcement',
        icon: 'announcement',
    },
    {
        label: 'Complaints',
        href: '/committee/complaints',
        icon: 'complaint',
    },
];

export const residentNavigation: NavigationItem[] = [
    {
        label: 'Dashboard',
        href: '/resident',
        icon: 'dashboard',
    },
    {
        label: 'My Profile',
        href: '/resident/account',
        icon: 'profile',
    },
    {
        label: 'Announcements',
        href: '/resident/announcements',
        icon: 'announcement',
    },
    {
        label: 'Complaints',
        href: '/resident/complaint',
        icon: 'complaint',
    },
];

export const getNavigationByUserType = (userType: UserType): NavigationItem[] => {
    return userType === 'committee' ? committeeNavigation : residentNavigation;
};
