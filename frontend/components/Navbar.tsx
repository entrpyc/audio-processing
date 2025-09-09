'use client';

import { useState } from 'react';
import {
  IconFolder,
  IconUpload,
  IconSettings,
  IconFileTextAi,
  IconAdjustmentsAlt,
  IconLogout,
  IconUsers,
  IconUserCircle,
} from '@tabler/icons-react';
import classes from '@/styles/Navbar.module.css';
import { UserButton } from './UserButton';
import { Group } from '@mantine/core';

export const linksData = [
  { link: '', label: 'New Submission', icon: IconUpload },
  { link: '', label: 'Recordings (WIP)', icon: IconFolder },
  { link: '', label: 'Knowledge Hub (WIP)', icon: IconFileTextAi },
  { link: '', label: 'Features (WIP)', icon: IconAdjustmentsAlt },
  { link: '', label: 'Members (WIP)', icon: IconUsers },
  { link: '', label: 'Source Configuration (WIP)', icon: IconSettings },
];

export const mobileLinks = [
  { link: '', label: 'New Submission', icon: IconUpload },
  { link: '', label: 'Recordings (WIP)', icon: IconFolder },
  { link: '', label: 'Knowledge Hub (WIP)', icon: IconFileTextAi },
  { link: '', label: 'User (WIP)', icon: IconUserCircle },
];

type NavbarProps = {
  variant?: 'desktop' | 'mobile';
};

export function Navbar({ variant = 'desktop' }: NavbarProps) {
  const [active, setActive] = useState(linksData[0].label);

  const links = (variant === 'desktop' ? linksData : mobileLinks).map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      {variant === 'desktop' && <span>{item.label}</span>}
    </a>
  ));

  if (variant === 'mobile') {
    return (
      <Group justify="space-between" w="100%" maw={350} mx="auto">
        {links}
      </Group>
    );
  }

  return (
    <nav className={classes.navbar}>
      <div>
        <UserButton />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
