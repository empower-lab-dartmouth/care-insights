import {
  AppShell,
  Avatar,
  Burger,
  Divider,
  UnstyledButton,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import Nav from '../screens/nav/NavBar';

import { FileQuestion, LogOut, SquarePlay, UsersRound } from 'lucide-react';
import { primaryColor } from '../constants';
import { useContext } from 'react';
import { AuthContext } from '../state/context/auth-context';

const MenuButton = ({
  children,
  path,
  icon,
}: {
  children: React.ReactNode;
  path: string;
  icon: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  return (
    <Link to={path}>
      <UnstyledButton
        className={`px-2 py-3 hover:bg-slate-100 rounded-md w-full flex items-center gap-2 text-sm font-semibold`}
        style={{
          backgroundColor: pathname === path ? '#e7f5ff' : 'transparent',
          color: pathname === path ? '#1971c2' : 'inherit',
        }}
      >
        {icon}
        <div>{children}</div>
      </UnstyledButton>
    </Link>
  );
};

const UserShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { currentUser } = useContext(AuthContext);

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
        <div className='flex justify-between items-center h-full px-3'>
          <div>Logo</div>
          <div className='flex items-center gap-2'>
            <Text>{currentUser!.email}</Text>
            <Avatar radius='xl' size='md' color='blue'>
              M
            </Avatar>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p='sm'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col gap-2'>
            <MenuButton
              path='/summaryInsights'
              icon={<FileQuestion size={18} />}
            >
              Summary Insights
            </MenuButton>
            <MenuButton path='/videoAnalysis' icon={<SquarePlay size={18} />}>
              Program Events
            </MenuButton>
            <MenuButton path='/careTeam' icon={<UsersRound size={18} />}>
              Care Team
            </MenuButton>
          </div>
          <div className='pb-3'>
            <Divider className='pb-4' />
            <UnstyledButton className='pl-2 flex gap-2 text-sm font-semibold text-red-500 items-center'>
              {' '}
              <LogOut size={18} /> Sign Out
            </UnstyledButton>
          </div>
        </div>
      </AppShell.Navbar>

      <AppShell.Main className='mx-10'>{children}</AppShell.Main>
    </AppShell>
  );
};

export default UserShell;
