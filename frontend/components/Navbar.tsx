import { useState } from 'react';
import {
  IconFolder,
  IconUpload,
  IconSettings,
  IconFileTextAi,
  IconAdjustmentsAlt,
  IconLogout,
  IconSwitchHorizontal,
  IconUsers,
} from '@tabler/icons-react';
import classes from '@/styles/Navbar.module.css';
import { UserButton } from './UserButton';

const linksData = [
  { link: '', label: 'New Submission', icon: IconUpload },
  { link: '', label: 'Recordings (WIP)', icon: IconFolder },
  { link: '', label: 'Knowledge Hub (WIP)', icon: IconFileTextAi },
  { link: '', label: 'Features (WIP)', icon: IconAdjustmentsAlt },
  { link: '', label: 'Members (WIP)', icon: IconUsers },
  { link: '', label: 'Source Configuration (WIP)', icon: IconSettings },
]

export function Navbar() {
  const [active, setActive] = useState(linksData[0].label);

  const links = linksData.map((item) => (
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
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <UserButton />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}