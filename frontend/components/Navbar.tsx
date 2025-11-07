'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  IconSettings,
  IconFileTextAi,
  IconAdjustmentsAlt,
  IconLogout,
  IconUsers,
  IconUserCircle,
  IconMicrophone2,
  IconCloud,
  IconTextScan2,
} from '@tabler/icons-react';
import classes from '@/styles/Navbar.module.css';
import { UserButton } from './UserButton';
import { Group } from '@mantine/core';

export const linksData = [
  { link: '/cloud-recordings', label: 'Cloud Recordings', icon: IconCloud },
  { link: '/clear-speech', label: 'Clear speech', icon: IconMicrophone2 },
  { link: 'https://transcribe.indepthwebsolutions.com/', label: 'Transcribe Audio', icon: IconTextScan2 },
  { link: '', label: 'Knowledge Hub (WIP)', icon: IconFileTextAi },
  { link: '', label: 'Features (WIP)', icon: IconAdjustmentsAlt },
  { link: '', label: 'Members (WIP)', icon: IconUsers },
  { link: '', label: 'Source Configuration (WIP)', icon: IconSettings },
];

export const mobileLinks = [
  { link: '/cloud-recordings', label: 'Cloud Recordings', icon: IconCloud },
  { link: '/clear-speech', label: 'Clear speech', icon: IconMicrophone2 },
  { link: 'https://transcribe.indepthwebsolutions.com/', label: 'Transcribe Audio', icon: IconTextScan2 },
  { link: '', label: 'User (WIP)', icon: IconUserCircle },
];

type NavbarProps = {
  variant?: 'desktop' | 'mobile';
};

export function Navbar({ variant = 'desktop' }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState('');

  // Automatically set active link based on current path
  useEffect(() => {
  const currentLinks = variant === 'desktop' ? linksData : mobileLinks;

  // Match only exact internal routes (ignore external links)
  const matched = currentLinks.find(
    (l) => l.link && !l.link.startsWith('http') && l.link === pathname
  );

  if (matched) setActive(matched.label);
  else setActive('');
}, [pathname, variant]);

  const links = (variant === 'desktop' ? linksData : mobileLinks).map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();

        if (!item.link) return; // do nothing for WIP links
        setActive(item.label);

        if (item.link.startsWith('http')) {
          // open external link in same tab
          window.location.href = item.link;
        } else {
          // use Next.js router for internal navigation
          router.push(item.link);
        }
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
