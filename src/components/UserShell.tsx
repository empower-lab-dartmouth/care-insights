import { AppShell, Burger, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import Nav from '../screens/nav/NavBar';

import { FileQuestion, SquarePlay, UsersRound } from 'lucide-react';

const MenuButton = ({
  children,
  path,
  icon,
}: {
  children: React.ReactNode;
  path: string;
  icon: React.ReactNode;
}) => (
  <Link to={path}>
    <UnstyledButton className='px-2 py-3 hover:bg-slate-100 rounded-lg w-full flex items-center gap-2 text-sm font-semibold'>
      {icon}
      <div>{children}</div>
    </UnstyledButton>
  </Link>
);

const UserShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{
        height: 50,
      }}
      navbar={{
        width: 220,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p='sm'>
        <div className='flex flex-col gap-2'>
          <MenuButton path='/summaryInsights' icon={<FileQuestion size={18} />}>
            Care Insights
          </MenuButton>
          <MenuButton path='/videoAnalysis' icon={<SquarePlay size={18} />}>
            Program Events
          </MenuButton>
          <MenuButton path='/careTeam' icon={<UsersRound size={18} />}>
            Care Team
          </MenuButton>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default UserShell;
