'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import nlp from 'compromise';
import { useTranslation } from 'next-i18next';
import CryptoJS from 'crypto-js';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Analytics as AnalyticsIcon,
  Science as ScienceIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// セキュリティのための型定義
interface NavigationItem {
  path: string;
  label: string;
  icon: JSX.Element;
  description: string;
}

// カスタム辞書の定義
const customDictionary = {
  terms: {
    'logical analysis': 'Analysis of propositions and arguments',
    'thought experiment': 'Philosophical methodology using hypothetical scenarios',
    'concept database': 'Structured collection of philosophical concepts',
  },
};

// スタイル付きコンポーネントの定義
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [encryptedPath, setEncryptedPath] = useState('');

  // ナビゲーション項目の定義
  const navigationItems: NavigationItem[] = [
    {
      path: '/analysis',
      label: t('navigation.analysis'),
      icon: <AnalyticsIcon />,
      description: t('navigation.analysisDescription'),
    },
    {
      path: '/experiments',
      label: t('navigation.experiments'),
      icon: <ScienceIcon />,
      description: t('navigation.experimentsDescription'),
    },
    {
      path: '/database',
      label: t('navigation.database'),
      icon: <StorageIcon />,
      description: t('navigation.databaseDescription'),
    },
    {
      path: '/settings',
      label: t('navigation.settings'),
      icon: <SettingsIcon />,
      description: t('navigation.settingsDescription'),
    },
  ];

  // 自然言語処理の最適化
  useEffect(() => {
    nlp.extend(customDictionary);
  }, []);

  // パスの暗号化（セキュリティ対策）
  useEffect(() => {
    const encrypted = CryptoJS.AES.encrypt(
      pathname || '',
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY || ''
    ).toString();
    setEncryptedPath(encrypted);
  }, [pathname]);

  // XSS対策
  const sanitizeString = (str: string) => {
    return str.replace(/[&<>"']/g, (match) => {
      const escape: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return escape[match];
    });
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationList = (
    <List>
      {navigationItems.map((item) => (
        <ListItem
          button
          key={item.path}
          component={Link}
          href={item.path}
          selected={pathname === item.path}
          onClick={() => isMobile && setDrawerOpen(false)}
          aria-label={sanitizeString(item.label)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={sanitizeString(item.label)}
            secondary={sanitizeString(item.description)}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Desktop Navigation */}
          <div style={{ display: { xs: 'none', sm: 'block' } }}>
            {navigationList}
          </div>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Navigation */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        {navigationList}
      </Drawer>
    </>
  );
};

export default Navigation;