export const columns = [
  {
    key: 'description',
    name: 'Description',
    renderCell: ({ row }) => {
      return row.description;
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
    name: 'Event type',
    renderCell: ({ row }) => {
      return row.CRName;
    },
  },
  {
    key: 'caregiver',
    name: 'Event type',
    renderCell: ({ row }) => {
      return row.CGName;
    },
  },
];
