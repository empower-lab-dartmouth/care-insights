import { AppShell, Avatar, UnstyledButton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';

import { FileQuestion, SquarePlay, UsersRound, Info } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../state/context/auth-context';
import { IconLogout, IconMenu2, IconX } from '@tabler/icons-react';

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
        className={`px-2 py-3 hover:bg-slate-100 rounded-md w-full flex items-center gap-2 text-sm`}
        style={{
          backgroundColor: pathname === path ? '#e7f5ff' : 'transparent',
          color: pathname === path ? 'black' : 'white',
          fontWeight: pathname === path ? 'bold' : '500',
        }}
      >
        {icon}
        <div>{children}</div>
      </UnstyledButton>
    </Link>
  );
};

const MenuButtons = () => {
  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex flex-col gap-2'>
        <MenuButton path='/info' icon={<Info size={18} />}>
          Snapshot
        </MenuButton>
        <MenuButton path='/questions' icon={<FileQuestion size={18} />}>
          Tell me more
        </MenuButton>
        <MenuButton path='/program-events' icon={<SquarePlay size={18} />}>
          Program Events
        </MenuButton>
        <MenuButton path='/care-team' icon={<UsersRound size={18} />}>
          Care Team
        </MenuButton>
      </div>
    </div>
  );
};

const UserShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const { currentUser, signOut } = useContext(AuthContext);

  return (
    <div>
      <AppShell
        header={{
          height: 50,
        }}
        navbar={{
          width: 220,
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
        padding='md'
      >
        <AppShell.Header>
          <div className='flex justify-between items-center h-full px-3'>
            <div className='flex gap-2 items-center'>
              <UnstyledButton className='flex lg:hidden' onClick={toggle}>
                {opened ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </UnstyledButton>
              <div className='hidden lg:flex gap-2 items-center'>
                <img src='logo-circle.svg' />
                <h1 id='logo'>Care Insights</h1>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Text>{currentUser!.email}</Text>
              <Avatar radius='xl' size='md' color='blue'>
                {currentUser?.email ? currentUser.email[0].toUpperCase() : ''}
              </Avatar>
              <UnstyledButton color='red' onClick={signOut}>
                <IconLogout size={24} color='	#db2b29' />
              </UnstyledButton>
            </div>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p='sm' className='bg-primary z-inherit z-1 xl:z-0'>
          <MenuButtons />
        </AppShell.Navbar>

        <AppShell.Main className=' bg-gray-50'>
          <div className='px-8 z-10'>{children}</div>
        </AppShell.Main>
      </AppShell>
    </div>
  );
};

export default UserShell;
