import { EngagementLevel, RedirectionLevel } from '../../../state/types';
import dayjs from 'dayjs';
import { Row } from './ProgramEventsTable';

const Label = ({ children }) => {
  return (
    <div className='border border-blue-200 text-primary font-bold rounded-md px-2 py-1 inline text-xs'>
      {children}
    </div>
  );
};

export const columns = [
  {
    key: 'description',
    name: 'Description',
    renderCell: ({ row }) => {
      return row.description;
    },
  },
  {
    key: 'date',
    name: 'Datetime',
    width: 200,
    renderCell: ({ row }) => {
      return dayjs(row.date).format('MMM D, YYYY h:mm A');
    },
  },
  {
    key: 'engagement-level',
    name: 'Engagement level',
    renderCell: ({ row }) => {
      return <Label>{engagementLevelLabel(row.engagement)}</Label>;
    },
  },
  {
    key: 'redirections',
    name: 'Redirections',
    renderCell: ({ row }) => {
      return <Label>{redirectionLevelLabel(row.redirection)}</Label>;
    },
  },
  {
    key: 'event-type',
    name: 'Event type',
    renderCell: ({ row }) => {
      return row.label;
    },
  },
  {
    key: 'care-recipient',
    name: 'Care Recipient',
    renderCell: ({ row }) => {
      return row.CRName;
    },
  },
  {
    key: 'caregiver',
    name: 'Caregiver',
    renderCell: ({ row }) => {
      return row.CGName;
    },
  },
];

const engagementLevelLabel = (engagmentLevel: EngagementLevel) => {
  switch (engagmentLevel) {
    case 'average':
      return 'Average';
    case 'high':
      return 'Above Average';
    case 'low':
      return 'Low';
    case 'na':
      return 'N/A';
    case 'none':
      return 'None';
  }
};

const redirectionLevelLabel = (redirectionLevel: RedirectionLevel) => {
  switch (redirectionLevel) {
    case 'na':
      return 'N/A';
    case 'success':
      return 'Success';
    case 'none':
      return 'None';
    case 'unsuccessful':
      return 'Unsuccessful';
  }
};
