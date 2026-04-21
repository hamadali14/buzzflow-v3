'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/navigation';
import { useBuzzStore } from '@/lib/buzz-state';

const AppChromeContext = createContext(null);

export const ICONS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  chart: 'M3 3v18h18M8 17V9m4 8V5m4 12v-4',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  plus: 'M12 5v14M5 12h14',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  copy: 'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  duplicate: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M8 2h8a2 2 0 010 4H8a2 2 0 010-4z',
  bolt: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  brain: 'M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 000 4h.5A2.5 2.5 0 017 13.5v4a2 2 0 002 2h6a2 2 0 002-2v-4A2.5 2.5 0 0119.5 11H20a2 2 0 000-4h-.5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  drag: 'M9 5h.01M9 9h.01M9 13h.01M9 17h.01M15 5h.01M15 9h.01M15 13h.01M15 17h.01',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3zM19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  palette: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.6 0 1-.4 1-1v-1.5c0-.28-.11-.53-.29-.71-.18-.18-.43-.29-.71-.29H10c-1.1 0-2-.9-2-2 0-.53.21-1.04.59-1.41.38-.38.89-.59 1.41-.59H14c2.21 0 4-1.79 4-4 0-3.86-3.58-7-8-7z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  formIcon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  undo: 'M3 7v6h6M3 13A9 9 0 1021 12',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  hash: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  text: 'M17 6H3M21 12H3M17 18H3',
};

const UI = {
  panel: 'var(--surface)',
  panelAlt: 'var(--surface-2)',
  panelSoft: 'var(--surface-3)',
  border: 'var(--border)',
  borderStrong: 'var(--border-2)',
  shadow: 'var(--shadow-lg)',
  input: 'rgba(124,58,237,0.04)',
  inputBorder: 'rgba(20,20,43,0.08)',
  muted: 'rgba(124,58,237,0.06)',
  overlay: 'var(--overlay)',
};

function useFlashMessage() {
  const [message, setMessage] = useState('');

  const flash = (next) => {
    setMessage(next);
    window.clearTimeout(window.__buzzToastTimeout);
    window.__buzzToastTimeout = window.setTimeout(() => setMessage(''), 2400);
  };

  return [message, flash];
}

function useAppChrome() {
  const context = useContext(AppChromeContext);
  if (!context) {
    throw new Error('useAppChrome must be used within AppLayout');
  }
  return context;
}

function EmptyState({ title, detail }) {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.6 }}>{detail}</div>
    </Card>
  );
}

function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 300, padding: '12px 14px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', color: 'var(--text)', fontSize: 12, fontWeight: 700 }} className="buzz-fadein">
      {message}
    </div>
  );
}

function Modal({ title, subtitle, children, onClose, actions }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: UI.overlay, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }}>
      <div style={{ width: 520, maxWidth: 'calc(100vw - 32px)', background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 20, boxShadow: UI.shadow, overflow: 'hidden' }} className="buzz-fadein">
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${UI.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</div>
            {subtitle ? <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{subtitle}</div> : null}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${UI.border}`, background: UI.panelSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.x} size={13} color="var(--text-2)" />
          </button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
        {actions ? <div style={{ padding: '0 22px 22px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{actions}</div> : null}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = '' }) {
  return (
    <div>
      <Label style={{ marginBottom: 6 }}>{label}</Label>
      <input value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10, color: 'var(--text)', outline: 'none' }} />
    </div>
  );
}

export function Icon({ d, size = 16, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
}

export function Label({ children, style = {} }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', ...style }}>
      {children}
    </div>
  );
}

export function Badge({ children, color = 'purple' }) {
  const colors = {
    purple: { bg: 'rgba(124,58,237,0.15)', text: '#A78BFA', border: 'rgba(124,58,237,0.25)' },
    cyan: { bg: 'rgba(34,211,238,0.1)', text: '#22D3EE', border: 'rgba(34,211,238,0.2)' },
    green: { bg: 'rgba(16,185,129,0.1)', text: '#34D399', border: 'rgba(16,185,129,0.2)' },
    yellow: { bg: 'rgba(245,158,11,0.1)', text: '#FCD34D', border: 'rgba(245,158,11,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#F87171', border: 'rgba(239,68,68,0.2)' },
    gray: { bg: 'rgba(20,20,43,0.04)', text: 'var(--text-3)', border: 'var(--border)' },
  };
  const current = colors[color] || colors.gray;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: current.bg, color: current.text, border: `1px solid ${current.border}` }}>{children}</span>;
}

export function Button({ children, variant = 'default', size = 'md', href, style = {}, ...props }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    transition: 'all 0.15s ease',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '5px 11px', fontSize: 12 },
    md: { padding: '8px 16px', fontSize: 13 },
  };
  const variants = {
    default: { background: hover ? 'rgba(124,58,237,0.08)' : UI.panel, color: 'var(--text-2)', border: '1px solid var(--border)', boxShadow: hover ? '0 8px 24px rgba(124,58,237,0.08)' : 'none' },
    primary: { background: 'linear-gradient(135deg, var(--primary) 0%, #5B21B6 100%)', color: '#fff', border: 'none', boxShadow: hover ? '0 0 28px var(--primary-glow)' : '0 0 16px var(--primary-glow)' },
    subtle: { background: hover ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' },
    danger: { background: hover ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' },
    ghost: { background: 'transparent', color: hover ? 'var(--text)' : 'var(--text-2)', border: '1px solid transparent' },
  };
  const ui = { ...base, ...sizes[size], ...variants[variant], ...style };
  const common = { ...props, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };

  if (href) {
    return <Link href={href} style={ui} {...common}>{children}</Link>;
  }

  return <button type="button" style={ui} {...common}>{children}</button>;
}

export function Card({ children, style = {} }) {
  return <div style={{ background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 14, boxShadow: '0 14px 44px rgba(37,43,73,0.06)', ...style }}>{children}</div>;
}

export function Avatar({ name, size = 32 }) {
  const initials = name ? name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase() : '?';
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.34, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>;
}

function badgeColor(value) {
  return ({
    active: 'green',
    paid: 'green',
    handled: 'green',
    qualified: 'green',
    warm: 'yellow',
    high: 'red',
    late: 'red',
    blocked: 'red',
    duplicate: 'yellow',
    unread: 'purple',
    sent: 'cyan',
    doing: 'cyan',
    waiting: 'yellow',
    todo: 'gray',
    paused: 'yellow',
    new: 'purple',
    medium: 'yellow',
    low: 'gray',
  }[String(value).toLowerCase()] || 'gray');
}

const BUILDER_COLORS = ['#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706', '#DB2777', '#0891B2'];

function hexToRgba(hex, alpha) {
  const cleaned = String(hex || '').replace('#', '');
  if (cleaned.length !== 6) return `rgba(124,58,237,${alpha})`;
  const value = Number.parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function defaultBuilderFields() {
  return [
    { id: 'section-contact', type: 'section', label: 'Contact Details', required: false, half: false },
    { id: 'f1', type: 'text', label: 'First Name', required: true, half: true },
    { id: 'f2', type: 'text', label: 'Last Name', required: false, half: true },
    { id: 'f3', type: 'email', label: 'Email Address', required: true, half: false },
    { id: 'f4', type: 'phone', label: 'Phone Number', required: false, half: false },
    { id: 'f5', type: 'textarea', label: 'Your Message', required: true, half: false },
  ];
}

function normalizeBuilderFields(schema) {
  const source = Array.isArray(schema) && schema.length ? schema : defaultBuilderFields();
  return source.map((field, index) => ({
    id: field.id || `${field.type || 'field'}-${index + 1}`,
    type: field.type || 'text',
    label: field.label || 'Untitled field',
    required: Boolean(field.required),
    half: Boolean(field.half),
    placeholder: field.placeholder || '',
    options: Array.isArray(field.options) ? field.options : [],
  }));
}

function fieldTypeLabel(type) {
  return ({
    text: 'Single line text',
    textarea: 'Multi-line text',
    email: 'Email',
    phone: 'Phone',
    number: 'Number',
    dropdown: 'Dropdown',
    multiselect: 'Multi-select',
    checkbox: 'Checkbox',
    hidden: 'Hidden field',
    section: 'Section',
  }[type] || 'Field');
}

function extractFieldOptions(field) {
  if (Array.isArray(field.options) && field.options.length) return field.options;
  if (field.type === 'checkbox') return ['Checked'];
  if (field.type === 'dropdown') return ['Option 1', 'Option 2', 'Option 3'];
  if (field.type === 'multiselect') return ['Choice 1', 'Choice 2', 'Choice 3'];
  return [];
}

function deriveEntryPayload(fields, values) {
  const visibleFields = fields.filter((field) => field.type !== 'section' && field.type !== 'hidden');
  const firstText = visibleFields.find((field) => field.type === 'text');
  const secondText = visibleFields.filter((field) => field.type === 'text')[1];
  const emailField = visibleFields.find((field) => field.type === 'email');
  const phoneField = visibleFields.find((field) => field.type === 'phone');
  const contact = [values[firstText?.id], values[secondText?.id]].filter(Boolean).join(' ').trim();
  const raw = {};
  visibleFields.forEach((field) => {
    raw[field.label] = values[field.id];
  });
  return {
    contact: contact || values[emailField?.id] || 'Anonymous',
    email: values[emailField?.id] || 'unknown@example.com',
    phone: values[phoneField?.id] || '',
    raw,
  };
}

function topBarButton(active) {
  return {
    padding: '5px 11px',
    background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
    border: 'none',
    color: active ? 'var(--text)' : 'var(--text-3)',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  };
}

function SidebarButton({ item, active, expanded, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.href)}
      style={{
        width: '100%',
        minHeight: 42,
        padding: expanded ? '10px 12px' : '10px 0',
        background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
        border: 'none',
        borderRadius: 12,
        color: active ? 'var(--text)' : 'var(--text-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 10,
      }}
    >
      <Icon d={ICONS[item.icon]} size={15} />
      {expanded ? <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span> : null}
    </button>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const { requestNavigation } = useAppChrome();
  const primaryItems = NAV_ITEMS.filter((item) => item.href !== '/settings');

  return (
    <aside className="buzz-sidebar" style={{ width: expanded ? 240 : 86, transition: 'width 0.18s ease', flexShrink: 0, padding: 16, borderRight: `1px solid ${UI.border}`, background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: expanded ? 'space-between' : 'center' }}>
        <button type="button" onClick={() => requestNavigation('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: expanded ? 10 : 0, background: 'transparent', border: 'none', padding: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(34,211,238,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#B45309' }}>N</div>
          {expanded ? <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text)' }}>BuzzFlow</span> : null}
        </button>
        {expanded ? (
          <button type="button" onClick={() => setExpanded(false)} style={{ width: 30, height: 30, borderRadius: 10, border: `1px solid ${UI.border}`, background: UI.panelSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.chevronRight} size={14} color="var(--text-2)" />
          </button>
        ) : null}
      </div>
      {!expanded ? (
        <button type="button" onClick={() => setExpanded(true)} style={{ width: 42, height: 42, alignSelf: 'center', borderRadius: 14, border: 'none', background: 'rgba(245,158,11,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ICONS.grid} size={16} color="#8A5A00" />
        </button>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {primaryItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return <SidebarButton key={item.href} item={item} active={active} expanded={expanded} onNavigate={requestNavigation} />;
        })}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, borderTop: `1px solid ${UI.border}` }}>
        <SidebarButton item={{ href: '/settings', label: 'Settings', icon: 'settings' }} active={pathname.startsWith('/settings')} expanded={expanded} onNavigate={requestNavigation} />
      </div>
    </aside>
  );
}

export function TopBar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="buzz-topbar" style={{ height: 52, borderBottom: `1px solid ${UI.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10, background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(16px)', flexShrink: 0, position: 'relative', zIndex: 50 }}>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
        <button type="button" onClick={() => setNotificationsOpen((current) => !current)} style={{ width: 32, height: 32, borderRadius: 8, background: UI.panelSoft, border: `1px solid ${UI.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon d={ICONS.bell} size={14} color="var(--text-2)" />
          <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #fff' }} />
        </button>
        <button type="button" onClick={() => setProfileOpen((current) => !current)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 6px', borderRadius: 10, background: UI.panelSoft, border: `1px solid ${UI.border}` }}>
          <Avatar name="Alex Morgan" size={22} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>Alex</span>
          <Icon d={ICONS.chevronDown} size={11} color="var(--text-3)" />
        </button>
        {notificationsOpen ? (
          <Card style={{ position: 'absolute', top: 42, right: 118, width: 260, padding: 14, zIndex: 80 }}>
            <Label style={{ marginBottom: 10 }}>Notifications</Label>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>2 unpaid invoices need attention and 1 new form entry arrived just now.</div>
          </Card>
        ) : null}
        {profileOpen ? (
          <Card style={{ position: 'absolute', top: 42, right: 0, width: 220, padding: 14, zIndex: 80 }}>
            <Label style={{ marginBottom: 10 }}>Workspace</Label>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Alex Morgan is signed in as admin. Navigation, records, and builder changes are stored locally in this browser.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

export function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { builderSession, clearBuilderSession, commitBuilderSession } = useBuzzStore();
  const [pendingNavigation, setPendingNavigation] = useState('');

  const requestNavigation = (href) => {
    if (!href || href === pathname) return;
    if (builderSession?.dirty && pathname.startsWith('/forms/builder/')) {
      setPendingNavigation(href);
      return;
    }
    router.push(href);
  };

  const continueEditing = () => setPendingNavigation('');
  const leaveWithoutSaving = () => {
    const href = pendingNavigation;
    clearBuilderSession();
    setPendingNavigation('');
    router.push(href);
  };
  const saveAndLeave = () => {
    const href = pendingNavigation;
    commitBuilderSession();
    setPendingNavigation('');
    router.push(href);
  };

  return (
    <AppChromeContext.Provider value={{ requestNavigation }}>
      <div className="buzz-shell" style={{ display: 'flex', minHeight: '100vh' }}>
        <AppSidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <main className="buzz-main" style={{ display: 'flex' }}>{children}</main>
        </div>
      </div>
      {pendingNavigation ? (
        <Modal
          title="Unsaved Changes"
          subtitle="You have unsaved form builder changes."
          onClose={continueEditing}
          actions={
            <>
              <Button onClick={continueEditing}>Stay on page</Button>
              <Button variant="danger" onClick={leaveWithoutSaving}>Leave without saving</Button>
              <Button variant="primary" onClick={saveAndLeave}>Save and leave</Button>
            </>
          }
        >
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Navigation is blocked until you choose how to handle the current draft.
          </div>
        </Modal>
      ) : null}
    </AppChromeContext.Provider>
  );
}

export function PageShell({ title, subtitle, action, children }) {
  return (
    <div className="buzz-scroll buzz-fadein buzz-page-shell" style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="buzz-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0 }}>{title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function PanelTitle({ title, right }) {
  return <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${UI.border}` }}><div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>{right}</div>;
}

function SearchStrip({ placeholder, search, onSearch, filterLabel = 'All', sortLabel = 'Newest', onFilter, onSort }) {
  return (
    <div className="buzz-search-strip" style={{ display: 'flex', gap: 10 }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Icon d={ICONS.search} size={14} color="var(--text-3)" style={{ position: 'absolute', left: 12, top: 11 }} />
        <input value={search} onChange={(event) => onSearch?.(event.target.value)} placeholder={placeholder} style={{ width: '100%', height: 36, padding: '0 12px 0 34px', background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
      </div>
      <Button size="sm" onClick={onFilter}>Filter: {filterLabel}</Button>
      <Button size="sm" onClick={onSort}>Sort: {sortLabel}</Button>
    </div>
  );
}

function Row({ columns }) {
  return <div className="buzz-table-row" style={{ display: 'grid', gridTemplateColumns: columns.map((c) => c.w || '1fr').join(' '), alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${UI.border}` }}>{columns.map((c, index) => <div key={index}>{c.node}</div>)}</div>;
}

function ClickableRow({ columns, href }) {
  const router = useRouter();
  return (
    <div
      role="link"
      tabIndex={0}
      className="buzz-table-row"
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(href);
        }
      }}
      style={{ display: 'grid', gridTemplateColumns: columns.map((c) => c.w || '1fr').join(' '), alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${UI.border}`, cursor: 'pointer' }}
    >
      {columns.map((c, index) => <div key={index}>{c.node}</div>)}
    </div>
  );
}

function TableCard({ title, headers, rows, right }) {
  return (
    <Card className="buzz-table-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <PanelTitle title={title} right={right} />
      <div className="buzz-table-head" style={{ display: 'grid', gridTemplateColumns: headers.map((header) => header.w || '1fr').join(' '), padding: '8px 16px', borderBottom: `1px solid ${UI.border}`, gap: 12 }}>
        {headers.map((header) => <Label key={header.label}>{header.label}</Label>)}
      </div>
      <div>{rows}</div>
    </Card>
  );
}

function PrimaryText({ title, sub }) {
  return <div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{title}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div></div>;
}

function StatBand({ items }) {
  return (
    <div className="buzz-stat-band" style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 14 }}>
      {items.map((item) => (
        <Card key={item.label} style={{ padding: '16px 18px' }}>
          <Label style={{ marginBottom: 9 }}>{item.label}</Label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{item.value}</div>
            <Badge color={item.color}>{item.note}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MetricCard({ label, value, change, icon, color }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: '20px 22px', background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 14, boxShadow: '0 14px 44px rgba(37,43,73,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Label style={{ marginBottom: 10 }}>{label}</Label>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>{value}</div>
          <div style={{ fontSize: 11, color: change >= 0 ? '#34D399' : '#F87171', marginTop: 5, fontWeight: 600 }}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={icon} size={17} color={color} />
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const { createForm, forms, activity, customers, entries, invoices, leads } = useBuzzStore();
  const [showTopForms, setShowTopForms] = useState(true);
  const [sortByConversion, setSortByConversion] = useState(false);
  const visibleForms = [...forms]
    .sort((left, right) => (sortByConversion ? right.conversion - left.conversion : right.submissions - left.submissions))
    .slice(0, showTopForms ? 5 : forms.length);
  const unpaidTotal = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + Number(String(invoice.amount).replace(/[^\d]/g, '')), 0);
  const startCreateForm = () => {
    const name = window.prompt('Form name');
    if (!name) return;
    const formId = createForm({ name });
    router.push(`/forms/builder/${formId}`);
  };

  return (
    <PageShell title="Good morning, Alex" subtitle="Forms, leads, customers, invoices, tasks, and activity in one workspace." action={<Button variant="primary" onClick={startCreateForm}><Icon d={ICONS.plus} size={14} />New Form</Button>}>
      <div className="buzz-metric-grid" style={{ display: 'flex', gap: 14 }}>
        <MetricCard label="Form Entries" value={entries.length.toLocaleString()} change={12.4} icon={ICONS.activity} color="#7C3AED" />
        <MetricCard label="New Leads" value={String(leads.length)} change={8.3} icon={ICONS.bolt} color="#22D3EE" />
        <MetricCard label="Active Customers" value={String(customers.length)} change={4.8} icon={ICONS.user} color="#10B981" />
        <MetricCard label="Unpaid Invoices" value={`SEK ${unpaidTotal.toLocaleString()}`} change={-2.1} icon={ICONS.hash} color="#F59E0B" />
      </div>

      <div className="buzz-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 288px', gap: 18, flex: 1, minHeight: 0 }}>
        <Card style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <PanelTitle title="Your Forms" right={<div style={{ display: 'flex', gap: 6 }}><Button size="sm" onClick={() => setShowTopForms((current) => !current)}>{showTopForms ? 'Top 5' : 'Show less'}</Button><Button size="sm" onClick={() => setSortByConversion((current) => !current)}>{sortByConversion ? 'By conversion' : 'By volume'}</Button></div>} />
          <div className="buzz-table-head" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 100px 120px', padding: '8px 16px', borderBottom: `1px solid ${UI.border}`, gap: 12 }}>{['Form', 'Status', 'Submissions', 'Conversion', ''].map((header) => <Label key={header}>{header}</Label>)}</div>
          <div style={{ flex: 1, overflow: 'auto', padding: '6px 4px' }}>
            {visibleForms.map((form) => (
              <Link key={form.id} href={`/forms/${form.id}`} className="buzz-table-row" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 100px 120px', alignItems: 'center', padding: '11px 16px', gap: 12, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${form.color}18`, border: `1px solid ${form.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={ICONS.formIcon} size={13} color={form.color} />
                  </div>
                  <PrimaryText title={form.name} sub={`${form.fields} fields · ${form.updated}`} />
                </div>
                <Badge color={badgeColor(form.status)}>{form.status}</Badge>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{form.submissions.toLocaleString()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.conversion > 50 ? '#34D399' : 'var(--text-2)' }}>{form.conversion}%</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ padding: '5px 12px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>Open</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <PanelTitle title="Activity" right={<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399' }} /><span style={{ fontSize: 10, color: '#34D399', fontWeight: 700 }}>LIVE</span></div>} />
            <div style={{ flex: 1, overflow: 'auto' }}>
              {activity.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${UI.border}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: item.type === 'ai_response' ? 'rgba(245,158,11,0.12)' : 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={item.type === 'ai_response' ? ICONS.bolt : ICONS.formIcon} size={12} color={item.type === 'ai_response' ? '#FCD34D' : '#A78BFA'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{item.form}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{item.user}</div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', paddingTop: 2 }}>{item.time}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 14 }}>
            <Label style={{ marginBottom: 12 }}>Quick Actions</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Create new form', icon: ICONS.plus, href: null, color: 'var(--primary)', onClick: startCreateForm },
                { label: 'Create lead', icon: ICONS.bolt, href: '/leads/new', color: '#22D3EE' },
                { label: 'Create customer', icon: ICONS.user, href: '/customers/new', color: '#10B981' },
                { label: 'Create invoice', icon: ICONS.hash, href: '/invoices/new', color: '#F59E0B' },
                { label: 'Create task', icon: ICONS.check, href: '/tasks/new', color: '#A78BFA' },
              ].map((item) => (
                <button key={item.label} type="button" onClick={() => item.onClick ? item.onClick() : router.push(item.href)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${item.color}18`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={item.icon} size={12} color={item.color} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{item.label}</span>
                  <Icon d={ICONS.chevronRight} size={12} color="var(--text-3)" style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export function FormsPage() {
  const router = useRouter();
  const { createForm, forms } = useBuzzStore();
  const startCreateForm = () => {
    const name = window.prompt('Form name');
    if (!name) return;
    const formId = createForm({ name });
    router.push(`/forms/builder/${formId}`);
  };
  return (
    <PageShell title="Forms" subtitle="Draft, publish, preview, duplicate, archive, and embed every form." action={<Button variant="primary" onClick={startCreateForm}><Icon d={ICONS.plus} size={14} />New Form</Button>}>
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
          All forms in one place. Open a form to edit, preview, publish, or copy its embed script.
        </div>
      </Card>
      <TableCard
        title="Form Registry"
        headers={[
          { label: 'Form', w: '1fr' },
          { label: 'Status', w: '100px' },
          { label: 'Fields', w: '80px' },
          { label: 'Rules', w: '80px' },
          { label: 'Updated', w: '120px' },
          { label: '', w: '100px' },
        ]}
        rows={forms.map((form) => (
          <ClickableRow
            key={form.id}
            href={`/forms/${form.id}`}
            columns={[
              { w: '1fr', node: <PrimaryText title={form.name} sub={form.code} /> },
              { w: '100px', node: <Badge color={badgeColor(form.status)}>{form.status}</Badge> },
              { w: '80px', node: <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{form.fields}</div> },
              { w: '80px', node: <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{form.rules}</div> },
              { w: '120px', node: <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{form.updated}</div> },
              { w: '100px', node: <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ padding: '5px 12px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>Open</span></div> },
            ]}
          />
        ))}
      />
    </PageShell>
  );
}

export function EntriesPage() {
  const router = useRouter();
  const { entries, convertEntryToLead, mergeEntry, markEntrySpam } = useBuzzStore();
  const [search, setSearch] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [sortByState, setSortByState] = useState(false);
  const [toast, flash] = useFlashMessage();
  const rows = [...entries]
    .filter((entry) => {
      const haystack = `${entry.contact} ${entry.form} ${entry.email} ${entry.state}`.toLowerCase();
      return haystack.includes(search.toLowerCase()) && (!onlyUnread || entry.state === 'unread');
    })
    .sort((left, right) => (sortByState ? left.state.localeCompare(right.state) : right.id.localeCompare(left.id)));

  return (
    <>
      <PageShell title="Entries Inbox" subtitle="Incoming submissions stay linked to their form, lead, customer, files, and audit trail." action={<Button variant="primary" onClick={() => { const firstUnread = rows.find((entry) => entry.state === 'unread'); if (!firstUnread) { flash('No pending entries left.'); return; } router.push(`/entries/${firstUnread.id}`); }}><Icon d={ICONS.check} size={14} />Convert Next</Button>}>
        <SearchStrip placeholder="Search entries by form, email, raw field value, status..." search={search} onSearch={setSearch} filterLabel={onlyUnread ? 'Unread' : 'All'} sortLabel={sortByState ? 'State' : 'Newest'} onFilter={() => setOnlyUnread((current) => !current)} onSort={() => setSortByState((current) => !current)} />
        <TableCard
          title="Incoming Form Entries"
          headers={[{ label: 'Entry', w: '1fr' }, { label: 'State', w: '95px' }, { label: 'Quality', w: '130px' }, { label: 'Result', w: '140px' }, { label: 'Actions', w: '220px' }]}
          rows={rows.map((entry) => (
            <ClickableRow
              key={entry.id}
              href={`/entries/${entry.id}`}
              columns={[
                { w: '1fr', node: <PrimaryText title={`${entry.contact} · ${entry.form}`} sub={`${entry.email} · submitted ${entry.submitted}`} /> },
                { w: '95px', node: <Badge color={badgeColor(entry.state)}>{entry.state}</Badge> },
                { w: '130px', node: <Badge color={entry.quality.includes('Duplicate') ? 'yellow' : entry.quality.includes('Missing') ? 'gray' : 'green'}>{entry.quality}</Badge> },
                { w: '140px', node: <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>{entry.result}</div> },
                {
                  w: '220px',
                  node: (
                    <div style={{ display: 'flex', gap: 6 }} onClick={(event) => event.stopPropagation()}>
                      <Button size="sm" variant="subtle" onClick={() => { const leadId = convertEntryToLead(entry.id); flash(`${entry.contact} converted to lead.`); router.push(`/leads/${leadId}`); }}>Create lead</Button>
                      <Button size="sm" onClick={() => router.push(`/entries/${entry.id}/merge`)}>Merge</Button>
                      <Button size="sm" variant="danger" onClick={() => { markEntrySpam(entry.id); flash(`${entry.contact} marked as spam.`); }}>Spam</Button>
                    </div>
                  ),
                },
              ]}
            />
          ))}
        />
      </PageShell>
      <Toast message={toast} />
    </>
  );
}

export function LeadsPage() {
  const router = useRouter();
  const { leads } = useBuzzStore();
  const [search, setSearch] = useState('');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [sortByScore, setSortByScore] = useState(true);
  const rows = [...leads]
    .filter((lead) => {
      const haystack = `${lead.name} ${lead.company} ${lead.source} ${lead.owner} ${lead.tags.join(' ')}`.toLowerCase();
      return haystack.includes(search.toLowerCase()) && (!highPriorityOnly || lead.priority === 'high');
    })
    .sort((left, right) => (sortByScore ? right.score - left.score : left.name.localeCompare(right.name)));

  return (
    <>
      <PageShell title="Leads" subtitle="Qualify, score, assign, follow up, merge duplicates, and convert leads into customers." action={<Button variant="primary" href="/leads/new"><Icon d={ICONS.plus} size={14} />New Lead</Button>}>
        <SearchStrip placeholder="Search leads by name, company, source, owner, tag..." search={search} onSearch={setSearch} filterLabel={highPriorityOnly ? 'High only' : 'All'} sortLabel={sortByScore ? 'Score' : 'Name'} onFilter={() => setHighPriorityOnly((current) => !current)} onSort={() => setSortByScore((current) => !current)} />
        <TableCard title="Lead List" headers={[{ label: 'Lead', w: '1.2fr' }, { label: 'Status', w: '115px' }, { label: 'Priority', w: '95px' }, { label: 'Score', w: '80px' }, { label: 'Value', w: '110px' }, { label: 'Next Step', w: '150px' }]} rows={rows.map((lead) => <ClickableRow key={lead.id} href={`/leads/${lead.id}`} columns={[{ w: '1.2fr', node: <PrimaryText title={`${lead.name} · ${lead.company}`} sub={`${lead.email || 'no email'} · ${lead.source} · ${lead.time}`} /> }, { w: '115px', node: <Badge color={badgeColor(lead.status)}>{lead.status}</Badge> }, { w: '95px', node: <Badge color={badgeColor(lead.priority)}>{lead.priority}</Badge> }, { w: '80px', node: <div style={{ fontSize: 13, fontWeight: 800, color: lead.score > 80 ? '#34D399' : 'var(--text-2)' }}>{lead.score}</div> }, { w: '110px', node: <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 700 }}>{lead.value}</div> }, { w: '150px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push(`/leads/${lead.id}`); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', textAlign: 'left' }}>{lead.next}</button> }]} />)} />
      </PageShell>
    </>
  );
}

export function PipelinePage() {
  const { leads } = useBuzzStore();
  const stages = [['incoming', 'Incoming'], ['review', 'Review'], ['contacted', 'Contacted'], ['offer', 'Offer'], ['won', 'Won'], ['lost', 'Lost']];
  return (
    <PageShell title="Pipeline" subtitle="Move leads through controlled stages with value, owner, and status history preserved." action={<Button variant="primary" href="/leads"><Icon d={ICONS.plus} size={14} />Manage Leads</Button>}>
      <div className="buzz-pipeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(180px, 1fr))', gap: 12, minWidth: 980 }}>
        {stages.map(([id, label]) => {
          const cards = leads.filter((lead) => lead.stage === id);
          return (
            <Card key={id} style={{ overflow: 'hidden', minHeight: 420 }}>
              <PanelTitle title={label} right={<Badge color="gray">{cards.length}</Badge>} />
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {(cards.length ? cards : [{ empty: true, name: 'No leads', company: 'Hidden until used', value: '-' }]).map((lead, index) => (
                  <div key={lead.id || index} style={{ padding: 12, borderRadius: 10, background: UI.panelSoft, border: `1px solid ${UI.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: lead.empty ? 'var(--text-3)' : 'var(--text)' }}>{lead.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{lead.company}</div>
                    {!lead.empty && <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}><Badge color={badgeColor(lead.priority)}>{lead.priority}</Badge><span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 700 }}>{lead.value}</span></div>}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

export function CustomersPage() {
  const { customers } = useBuzzStore();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [sortByBilling, setSortByBilling] = useState(false);
  const rows = [...customers]
    .filter((customer) => `${customer.name} ${customer.contact} ${customer.status}`.toLowerCase().includes(search.toLowerCase()) && (!activeOnly || customer.status === 'active'))
    .sort((left, right) => (sortByBilling ? right.total.localeCompare(left.total) : left.name.localeCompare(right.name)));

  return (
    <>
      <PageShell title="Customers" subtitle="Customer records keep lead origin, communication, tasks, invoices, files, and lifecycle together." action={<Button variant="primary" href="/customers/new"><Icon d={ICONS.plus} size={14} />New Customer</Button>}>
        <SearchStrip placeholder="Search customers by company, contact, status..." search={search} onSearch={setSearch} filterLabel={activeOnly ? 'Active' : 'All'} sortLabel={sortByBilling ? 'Billing' : 'Name'} onFilter={() => setActiveOnly((current) => !current)} onSort={() => setSortByBilling((current) => !current)} />
        <TableCard title="Customer Accounts" headers={[{ label: 'Customer', w: '1fr' }, { label: 'Status', w: '100px' }, { label: 'Total Billing', w: '130px' }, { label: 'Invoices', w: '120px' }, { label: 'Latest Activity', w: '180px' }]} rows={rows.map((customer) => <ClickableRow key={customer.id} href={`/customers/${customer.id}`} columns={[{ w: '1fr', node: <PrimaryText title={customer.name} sub={`${customer.contact} · ${customer.id}`} /> }, { w: '100px', node: <Badge color={badgeColor(customer.status)}>{customer.status}</Badge> }, { w: '130px', node: <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 700 }}>{customer.total}</div> }, { w: '120px', node: <Badge color={customer.invoices.includes('late') ? 'red' : customer.invoices.includes('unpaid') ? 'yellow' : 'green'}>{customer.invoices}</Badge> }, { w: '180px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{customer.activity}</div> }]} />)} />
      </PageShell>
    </>
  );
}

export function CommunicationPage() {
  const router = useRouter();
  const { communications } = useBuzzStore();
  return (
    <>
      <PageShell title="Communication" subtitle="Manual emails, calls, meetings, notes, comments, and follow-ups stay attached to records." action={<Button variant="primary" href="/communication/new"><Icon d={ICONS.plus} size={14} />New Note</Button>}><TableCard title="Timeline" headers={[{ label: 'Communication', w: '1fr' }, { label: 'Type', w: '120px' }, { label: 'Linked To', w: '160px' }, { label: 'Owner', w: '90px' }]} rows={communications.map((item) => <ClickableRow key={item.id} href={`/communication/${item.id}`} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.detail} /> }, { w: '120px', node: <Badge color="cyan">{item.type}</Badge> }, { w: '160px', node: <button type="button" onClick={(event) => { event.stopPropagation(); const path = item.linked?.startsWith('Lead') ? `/leads/${item.linked.replace('Lead ', '')}` : item.linked?.startsWith('Customer') ? `/customers/${item.linked.replace('Customer ', '')}` : item.linked?.startsWith('Task') ? `/tasks/${item.linked.replace('Task ', '')}` : `/communication/${item.id}`; router.push(path); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{item.linked}</button> }, { w: '90px', node: <button type="button" onClick={(event) => { event.stopPropagation(); }} style={{ background: 'transparent', border: 'none', padding: 0 }}><Avatar name={item.owner} size={24} /></button> }]} />)} /></PageShell>
    </>
  );
}

export function TasksPage() {
  const { tasks } = useBuzzStore();
  return (
    <>
      <PageShell title="Tasks" subtitle="Tasks can be linked to leads, customers, entries, invoices, and communication records." action={<Button variant="primary" href="/tasks/new"><Icon d={ICONS.plus} size={14} />New Task</Button>}><TableCard title="Task Queue" headers={[{ label: 'Task', w: '1fr' }, { label: 'Status', w: '100px' }, { label: 'Priority', w: '95px' }, { label: 'Owner', w: '80px' }, { label: 'Due', w: '130px' }]} rows={tasks.map((task) => <ClickableRow key={task.id} href={`/tasks/${task.id}`} columns={[{ w: '1fr', node: <PrimaryText title={task.title} sub={`${task.id} · linked to ${task.link}`} /> }, { w: '100px', node: <Badge color={badgeColor(task.status)}>{task.status}</Badge> }, { w: '95px', node: <Badge color={badgeColor(task.priority)}>{task.priority}</Badge> }, { w: '80px', node: <Avatar name={task.owner} size={24} /> }, { w: '130px', node: <div style={{ fontSize: 12, color: task.due === 'Late' ? '#F87171' : 'var(--text-2)', fontWeight: 700 }}>{task.due}</div> }]} />)} /></PageShell>
    </>
  );
}

export function InvoicesPage() {
  const router = useRouter();
  const { customers, invoices } = useBuzzStore();
  const unpaidInvoices = invoices.filter((invoice) => invoice.status !== 'paid');
  const lateInvoices = invoices.filter((invoice) => invoice.status === 'late');
  return (
    <>
      <PageShell title="Invoices" subtitle="Create, send, mark paid, log partial payments, and keep every invoice tied to a customer." action={<Button variant="primary" href="/invoices/new"><Icon d={ICONS.plus} size={14} />New Invoice</Button>}><StatBand items={[{ label: 'Unpaid', value: String(unpaidInvoices.length), note: 'open invoices', color: 'yellow' }, { label: 'Late', value: String(lateInvoices.length), note: 'overdue', color: 'red' }, { label: 'Paid', value: String(invoices.filter((invoice) => invoice.status === 'paid').length), note: 'settled', color: 'green' }]} /><TableCard title="Invoice Register" headers={[{ label: 'Invoice', w: '1fr' }, { label: 'Customer', w: '170px' }, { label: 'Status', w: '100px' }, { label: 'Due', w: '110px' }, { label: 'Paid', w: '110px' }]} rows={invoices.map((invoice) => { const customer = customers.find((item) => item.name === invoice.customer); return <ClickableRow key={invoice.id} href={`/invoices/${invoice.id}`} columns={[{ w: '1fr', node: <PrimaryText title={`${invoice.id} · ${invoice.amount}`} sub="Number generated internally" /> }, { w: '170px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push(customer ? `/customers/${customer.id}` : '/customers'); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{invoice.customer}</button> }, { w: '100px', node: <Badge color={badgeColor(invoice.status)}>{invoice.status}</Badge> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{invoice.due}</div> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 700 }}>{invoice.paid}</div> }]} />; })} /></PageShell>
    </>
  );
}

export function FilesPage() {
  const router = useRouter();
  const { files } = useBuzzStore();
  return (
    <>
      <PageShell title="Files" subtitle="Uploaded files are stored with type, size, date, and a required linked object." action={<Button variant="primary" href="/files/new"><Icon d={ICONS.plus} size={14} />Upload File</Button>}><TableCard title="File Library" headers={[{ label: 'File', w: '1fr' }, { label: 'Type', w: '90px' }, { label: 'Size', w: '90px' }, { label: 'Linked Object', w: '180px' }, { label: 'Uploaded', w: '110px' }]} rows={files.map((file) => <ClickableRow key={file.id} href={`/files/${file.id}`} columns={[{ w: '1fr', node: <PrimaryText title={file.name} sub={file.id} /> }, { w: '90px', node: <Badge color="cyan">{file.type}</Badge> }, { w: '90px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{file.size}</div> }, { w: '180px', node: <button type="button" onClick={(event) => { event.stopPropagation(); const path = file.linked?.startsWith('Lead') ? `/leads/${file.linked.replace('Lead ', '')}` : file.linked?.startsWith('Customer') ? `/customers/${file.linked.replace('Customer ', '')}` : file.linked?.startsWith('Invoice') ? `/invoices/${file.linked.replace('Invoice ', '')}` : `/files/${file.id}`; router.push(path); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{file.linked}</button> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{file.uploaded}</div> }]} />)} /></PageShell>
    </>
  );
}

export function ActivityPage() {
  const router = useRouter();
  const { logs } = useBuzzStore();
  const [showConversionsOnly, setShowConversionsOnly] = useState(false);
  const [toast, flash] = useFlashMessage();
  const visibleLogs = logs.filter((item) => !showConversionsOnly || /created|converted|paid/i.test(item.what));
  return <>
    <PageShell title="Activity History" subtitle="Every create, update, conversion, payment, task, file, status, and owner change is audit logged." action={<Button onClick={() => { setShowConversionsOnly((current) => !current); flash(showConversionsOnly ? 'Showing all audit events.' : 'Showing high-signal conversion events.'); }}><Icon d={ICONS.search} size={14} />{showConversionsOnly ? 'Show All' : 'Show Conversions'}</Button>}><TableCard title="Audit Log" headers={[{ label: 'Event', w: '1fr' }, { label: 'Object', w: '160px' }, { label: 'Actor', w: '130px' }, { label: 'Old', w: '100px' }, { label: 'New', w: '110px' }, { label: 'Time', w: '95px' }]} rows={visibleLogs.map((item) => <ClickableRow key={item.id} href={/lead/i.test(item.what) ? '/leads' : /invoice/i.test(item.what) ? '/invoices' : /communication/i.test(item.what) ? '/communication' : '/entries'} columns={[{ w: '1fr', node: <PrimaryText title={item.what} sub="Immutable system event" /> }, { w: '160px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.object}</div> }, { w: '130px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push('/activity'); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{item.actor}</button> }, { w: '100px', node: <Badge color="gray">{item.old}</Badge> }, { w: '110px', node: <Badge color="purple">{item.next}</Badge> }, { w: '95px', node: <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.time}</div> }]} />)} /></PageShell>
    <Toast message={toast} />
  </>;
}

export function SettingsPage() {
  const { reset } = useBuzzStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, flash] = useFlashMessage();
  return (
    <>
      <PageShell title="Settings" subtitle="Roles, permissions, validation rules, statuses, form publishing, and internal system controls." action={<div style={{ display: 'flex', gap: 8 }}><Button onClick={() => setConfirmReset(true)}><Icon d={ICONS.undo} size={14} />Reset Data</Button><Button variant="primary" onClick={() => flash('Settings saved.') }><Icon d={ICONS.check} size={14} />Save Changes</Button></div>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          ['Roles & Permissions', 'Admin sees everything. Staff only sees assigned leads, relevant customers, notes, tasks, and allowed entries.', 'admin · staff'],
          ['Validation Rules', 'Reject empty submissions, block unpublished form entries, require valid structures before publishing.', 'always on'],
          ['Lead Qualification', 'Budget, urgency, contactability, duplicates, spam rate, and product interest can set score and priority.', 'rule engine'],
          ['Status Controls', 'Lead, customer, invoice, and task statuses use fixed valid transitions with activity logging.', 'locked'],
        ].map((section) => (
          <Card key={section[0]} style={{ padding: 18 }}>
            <Label style={{ marginBottom: 10 }}>{section[0]}</Label>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)' }}>{section[1]}</div>
            <div style={{ marginTop: 14 }}><Badge color="purple">{section[2]}</Badge></div>
          </Card>
        ))}
        </div>
      </PageShell>
      {confirmReset ? <Modal title="Reset Workspace Data" subtitle="This resets forms, entries, leads, customers, tasks, invoices, files, communication, and activity back to demo seed data in this browser only." onClose={() => setConfirmReset(false)} actions={<><Button onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={() => { reset(); setConfirmReset(false); flash('Workspace reset to seed data.'); }}>Reset Data</Button></>}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>The reset does not affect code or any other browser. It only clears the current local BuzzFlow workspace state.</div>
      </Modal> : null}
      <Toast message={toast} />
    </>
  );
}

export function FormBuilderPage({ id }) {
  const { forms, updateForm, setBuilderSession, setFormStatus } = useBuzzStore();
  const { requestNavigation } = useAppChrome();
  const savedForm = forms.find((item) => item.id === id) || forms[0];
  const normalizedSavedFields = useMemo(() => normalizeBuilderFields(savedForm?.field_schema), [savedForm?.field_schema]);
  const savedColor = savedForm?.color || BUILDER_COLORS[0];
  const [title, setTitle] = useState(savedForm?.name || 'Contact Inquiry');
  const [tab, setTab] = useState('design');
  const [showEmbed, setShowEmbed] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [toast, flash] = useFlashMessage();
  const [fields, setFields] = useState(normalizedSavedFields);
  const [primaryColor, setPrimaryColor] = useState(savedColor);
  const [selectedFieldId, setSelectedFieldId] = useState(normalizedSavedFields.find((field) => field.type !== 'section')?.id || normalizedSavedFields[0]?.id || null);
  const [history, setHistory] = useState([]);

  const tabs = useMemo(() => [{ id: 'design', label: 'Design', icon: ICONS.palette }, { id: 'automation', label: 'Automation', icon: ICONS.brain }, { id: 'embed', label: 'Embed', icon: ICONS.code }], []);
  const components = useMemo(() => [{ type: 'text', label: 'Single line text', icon: ICONS.text }, { type: 'textarea', label: 'Multi-line text', icon: ICONS.edit }, { type: 'email', label: 'Email', icon: ICONS.mail }, { type: 'phone', label: 'Phone', icon: ICONS.phone }, { type: 'number', label: 'Number', icon: ICONS.hash }, { type: 'dropdown', label: 'Dropdown', icon: ICONS.chevronDown }, { type: 'multiselect', label: 'Multi-select', icon: ICONS.layers }, { type: 'checkbox', label: 'Checkbox', icon: ICONS.check }, { type: 'hidden', label: 'Hidden field', icon: ICONS.eye }], []);
  const published = savedForm?.status === 'active';
  const selectedField = fields.find((field) => field.id === selectedFieldId) || null;
  const sectionLabel = fields.find((field) => field.type === 'section')?.label || 'Contact Details';

  useEffect(() => {
    setTitle(savedForm?.name || 'Contact Inquiry');
    setFields(normalizedSavedFields);
    setPrimaryColor(savedColor);
    setSelectedFieldId(normalizedSavedFields.find((field) => field.type !== 'section')?.id || normalizedSavedFields[0]?.id || null);
    setHistory([]);
  }, [normalizedSavedFields, savedColor, savedForm?.id, savedForm?.name]);

  useEffect(() => {
    if (!savedForm?.id) return;
    const dirty = title !== savedForm.name || primaryColor !== savedColor || JSON.stringify(fields) !== JSON.stringify(normalizedSavedFields);
    setBuilderSession({
      formId: savedForm.id,
      title,
      fields,
      color: primaryColor,
      published,
      dirty,
    });
  }, [fields, normalizedSavedFields, primaryColor, published, savedColor, savedForm, setBuilderSession, title]);

  const rememberState = (nextFields, nextTitle = title, nextColor = primaryColor, nextSelectedId = selectedFieldId) => {
    setHistory((current) => [...current.slice(-29), { title, fields, primaryColor, selectedFieldId }]);
    setTitle(typeof nextTitle === 'string' ? nextTitle : title);
    setFields(nextFields);
    setPrimaryColor(nextColor);
    setSelectedFieldId(nextSelectedId || nextFields.find((field) => field.type !== 'section')?.id || nextFields[0]?.id || null);
  };

  const saveDraft = () => {
    if (!savedForm?.id) return;
    updateForm({ id: savedForm.id, title, fields, published, color: primaryColor });
    if (savedForm.status && !['active', 'draft'].includes(savedForm.status)) {
      setFormStatus(savedForm.id, savedForm.status);
    }
    flash(savedForm?.status === 'active' ? 'Live form updated.' : 'Draft saved.');
  };

  const changeStatus = (status) => {
    if (!savedForm?.id) return;
    if (status === 'active') {
      updateForm({ id: savedForm.id, title, fields, published: true, color: primaryColor });
      flash('Form published.');
    } else {
      updateForm({ id: savedForm.id, title, fields, published: false, color: primaryColor });
      setFormStatus(savedForm.id, status);
      flash(status === 'paused' ? 'Form paused.' : status === 'archived' ? 'Form archived.' : 'Form unpublished.');
    }
    setShowStatusMenu(false);
  };

  const handleUndo = () => {
    setHistory((current) => {
      const previous = current[current.length - 1];
      if (!previous) {
        flash('Nothing to undo.');
        return current;
      }
      setTitle(previous.title);
      setFields(previous.fields);
      setPrimaryColor(previous.primaryColor);
      setSelectedFieldId(previous.selectedFieldId);
      flash('Last builder change reverted.');
      return current.slice(0, -1);
    });
  };

  const addField = (item) => {
    const nextField = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      label: item.label,
      required: false,
      half: false,
      placeholder: '',
      options: extractFieldOptions({ type: item.type }),
    };
    rememberState([...fields, nextField], title, primaryColor, nextField.id);
    flash(`${item.label} added.`);
  };

  const addSection = () => {
    const nextSection = { id: `section-${Date.now()}`, type: 'section', label: 'New Section', required: false, half: false, placeholder: '', options: [] };
    rememberState([...fields, nextSection], title, primaryColor, nextSection.id);
    flash('Section added to draft.');
  };

  const updateField = (fieldId, patch) => {
    const nextFields = fields.map((field) => (
      field.id === fieldId ? { ...field, ...patch } : field
    ));
    rememberState(nextFields, title, primaryColor, fieldId);
  };

  const removeField = (fieldId) => {
    const nextFields = fields.filter((field) => field.id !== fieldId);
    rememberState(nextFields, title, primaryColor, nextFields.find((field) => field.type !== 'section')?.id || nextFields[0]?.id || null);
    flash('Field removed.');
  };

  return (
    <div className="buzz-fadein buzz-builder-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <div className="buzz-scroll buzz-builder-sidebar" style={{ width: 192, borderRight: `1px solid ${UI.border}`, padding: '16px 10px', flexShrink: 0, background: UI.panelSoft }}>
        <Label style={{ marginBottom: 12, paddingLeft: 6 }}>Components</Label>
        {components.map((item) => (
          <button type="button" key={item.type} onClick={() => addField(item)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 8px', borderRadius: 8, background: 'transparent', border: '1px solid transparent', marginBottom: 2, color: 'var(--text-2)', textAlign: 'left' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={item.icon} size={12} color="#A78BFA" /></div>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="buzz-scroll" style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="buzz-builder-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="buzz-builder-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button onClick={() => requestNavigation(`/forms/${savedForm?.id}`)} size="sm"><Icon d={ICONS.arrowLeft} size={14} /></Button>
            <input value={title} onChange={(event) => setTitle(event.target.value)} style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', background: 'transparent', border: 'none', outline: 'none', letterSpacing: '-0.02em' }} />
            <button type="button" onClick={() => setShowStatusMenu((current) => !current)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <Badge color={savedForm?.status === 'active' ? 'green' : savedForm?.status === 'paused' ? 'yellow' : savedForm?.status === 'archived' ? 'red' : 'gray'}>{savedForm?.status || 'draft'}</Badge>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" variant="ghost" onClick={handleUndo}><Icon d={ICONS.undo} size={13} />Undo</Button>
            <Button size="sm" variant="ghost" href={`/forms/${savedForm?.id}/preview?mode=draft`}><Icon d={ICONS.eye} size={13} />Preview</Button>
          </div>
        </div>
        {showStatusMenu ? (
          <Card style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" onClick={() => changeStatus('active')}>Publish</Button>
            <Button size="sm" onClick={() => changeStatus('paused')}>Pause</Button>
            <Button size="sm" onClick={() => changeStatus('draft')}>Unpublish</Button>
            <Button size="sm" variant="danger" onClick={() => changeStatus('archived')}>Archive</Button>
          </Card>
        ) : null}

        <div style={{ background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 16, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 14px 44px rgba(37,43,73,0.06)' }}>
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${UI.border}`, display: 'flex', alignItems: 'center', gap: 10, background: hexToRgba(primaryColor, 0.08) }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 8px ${primaryColor}` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>Section: {sectionLabel}</span>
            <button type="button" onClick={addSection} style={{ marginLeft: 'auto', fontSize: 11, color: primaryColor, background: 'transparent', border: 'none', fontWeight: 700 }}>+ Add Section</button>
          </div>

          <div style={{ padding: '18px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflow: 'auto', flex: 1 }}>
            {fields.map((field) => (
              field.type === 'section' ? (
                <button type="button" key={field.id} onClick={() => setSelectedFieldId(field.id)} style={{ gridColumn: 'span 2', padding: '12px 14px', borderRadius: 9, border: `1px dashed ${selectedFieldId === field.id ? primaryColor : UI.borderStrong}`, background: selectedFieldId === field.id ? hexToRgba(primaryColor, 0.06) : UI.panelSoft, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{field.label}</div>
                </button>
              ) : (
                <button type="button" key={field.id} onClick={() => setSelectedFieldId(field.id)} style={{ gridColumn: field.half ? 'span 1' : 'span 2', padding: '10px 12px', borderRadius: 9, border: `1px solid ${selectedFieldId === field.id ? primaryColor : UI.border}`, background: selectedFieldId === field.id ? hexToRgba(primaryColor, 0.04) : UI.panel, textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{field.label}{field.required ? <span style={{ color: primaryColor, marginLeft: 3 }}>*</span> : null}</label>
                  {field.type === 'dropdown' ? <div style={{ height: 32, background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 7, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', color: 'var(--text-3)', fontSize: 12 }}><span>{field.placeholder || 'Select an option'}</span><Icon d={ICONS.chevronDown} size={12} color="var(--text-3)" /></div> : null}
                  {field.type === 'multiselect' ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{extractFieldOptions(field).map((option) => <span key={option} style={{ padding: '5px 8px', borderRadius: 999, background: UI.input, border: `1px solid ${UI.inputBorder}`, fontSize: 11, color: 'var(--text-2)' }}>{option}</span>)}</div> : null}
                  {field.type === 'checkbox' ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32, color: 'var(--text-2)', fontSize: 12 }}><div style={{ width: 16, height: 16, borderRadius: 5, border: `1px solid ${UI.inputBorder}`, background: UI.input }} />{extractFieldOptions(field)[0] || 'Checkbox option'}</div> : null}
                  {!['dropdown', 'multiselect', 'checkbox'].includes(field.type) ? <div style={{ height: field.type === 'textarea' ? 56 : 32, background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 7, width: '100%' }} /> : null}
                </button>
              )
            ))}
            <div style={{ gridColumn: 'span 2', padding: '16px', border: '2px dashed rgba(124,58,237,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-3)', fontSize: 12 }}>
              <Icon d={ICONS.plus} size={14} color="var(--text-3)" />
              Click or drag to add a field
            </div>
          </div>

          <div style={{ padding: '0 20px 18px' }}>
            <button type="button" onClick={() => flash('Submit button selected for configuration.')} style={{ height: 40, background: `linear-gradient(135deg, ${primaryColor}, ${hexToRgba(primaryColor, 0.72)})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', maxWidth: 180, boxShadow: `0 4px 20px ${hexToRgba(primaryColor, 0.35)}`, border: 'none', width: '100%' }}>Submit →</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" href={`/forms/${savedForm?.id}/preview?mode=draft`}><Icon d={ICONS.eye} size={12} />Preview</Button>
          <Button variant="primary" onClick={saveDraft}><Icon d={ICONS.zap} size={13} />Update Form</Button>
          <Button onClick={() => { if (!published) { flash('Publish the form before copying the live embed script.'); return; } setShowEmbed(true); }}><Icon d={ICONS.code} size={13} />Copy Embed Script</Button>
        </div>
      </div>

      <div className="buzz-scroll buzz-builder-sidebar" style={{ width: 268, borderLeft: `1px solid ${UI.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, background: UI.panelSoft }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${UI.border}` }}>
          {tabs.map((item) => <button type="button" key={item.id} onClick={() => setTab(item.id)} style={{ flex: 1, padding: '11px 4px', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === item.id ? 'var(--primary)' : 'transparent'}`, color: tab === item.id ? 'var(--text)' : 'var(--text-3)', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', letterSpacing: '0.04em', textTransform: 'uppercase' }}><Icon d={item.icon} size={12} />{item.label}</button>)}
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'design' && <>
            <Label>Primary Color</Label>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {BUILDER_COLORS.map((color) => (
                <button key={color} type="button" onClick={() => rememberState(fields, title, color, selectedFieldId)} style={{ width: 24, height: 24, borderRadius: 7, background: color, border: `2px solid ${primaryColor === color ? '#fff' : 'transparent'}`, boxShadow: primaryColor === color ? `0 0 0 2px ${color}` : 'none' }} />
              ))}
            </div>
            <Label>Selected Field</Label>
            {selectedField ? (
              <Card style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{fieldTypeLabel(selectedField.type)}</div>
                <div>
                  <Label style={{ marginBottom: 6 }}>Label</Label>
                  <input value={selectedField.label} onChange={(event) => updateField(selectedField.id, { label: event.target.value })} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
                </div>
                {selectedField.type !== 'section' ? (
                  <div>
                    <Label style={{ marginBottom: 6 }}>Placeholder</Label>
                    <input value={selectedField.placeholder || ''} onChange={(event) => updateField(selectedField.id, { placeholder: event.target.value })} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
                  </div>
                ) : null}
                {['dropdown', 'multiselect', 'checkbox'].includes(selectedField.type) ? (
                  <div>
                    <Label style={{ marginBottom: 6 }}>Options</Label>
                    <textarea value={extractFieldOptions(selectedField).join('\n')} onChange={(event) => updateField(selectedField.id, { options: event.target.value.split('\n').map((option) => option.trim()).filter(Boolean) })} style={{ width: '100%', minHeight: 96, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
                  </div>
                ) : null}
                {selectedField.type !== 'section' ? (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => updateField(selectedField.id, { required: !selectedField.required })} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${selectedField.required ? primaryColor : UI.border}`, background: selectedField.required ? hexToRgba(primaryColor, 0.08) : UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Required: {selectedField.required ? 'Yes' : 'No'}</button>
                      <button type="button" onClick={() => updateField(selectedField.id, { half: !selectedField.half })} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${selectedField.half ? primaryColor : UI.border}`, background: selectedField.half ? hexToRgba(primaryColor, 0.08) : UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Width: {selectedField.half ? 'Half' : 'Full'}</button>
                    </div>
                    <button type="button" onClick={() => removeField(selectedField.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Remove Field</button>
                  </>
                ) : (
                  <button type="button" onClick={() => removeField(selectedField.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Remove Section</button>
                )}
              </Card>
            ) : (
              <Card style={{ padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Select a field in the canvas to edit its label, required state, width, placeholder, and options.</div></Card>
            )}
          </>}
          {tab === 'automation' && <>
            <Label>Rule Engine</Label>
            <Card style={{ padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Budget &gt; 50 000 → set lead priority high. Acute response → create task instantly. Missing phone → flag low contactability.</div></Card>
            <Label>AI Prompt</Label>
            <textarea defaultValue="You are a helpful support assistant for BuzzFlow. Use form answers to qualify the lead and draft the follow-up." style={{ width: '100%', minHeight: 120, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none', resize: 'vertical', lineHeight: 1.65 }} />
          </>}
          {tab === 'embed' && <>
            <Label>Embed Script</Label>
            <pre style={{ padding: 12, background: '#f6f2ff', border: `1px solid ${UI.border}`, borderRadius: 9, fontSize: 10, color: '#7C3AED', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8, overflow: 'auto', margin: 0 }}>{`<script
  src="https://cdn.buzzflow.io/widget.js"
  data-form="BF-001"
  async>
</script>
<div id="buzzflow-container"></div>`}</pre>
          </>}
        </div>
      </div>

      {showEmbed && <EmbedModal snippet={`<script\n  src="https://cdn.buzzflow.io/widget.js"\n  data-form="${savedForm?.code || 'BF-001'}"\n  async>\n</script>\n<div id="buzzflow-container"></div>`} onClose={() => { setShowEmbed(false); flash('Embed script copied.'); }} />}
      <Toast message={toast} />
    </div>
  );
}

function EmbedModal({ onClose, snippet }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: UI.overlay, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ width: 500, background: UI.panel, border: `1px solid ${UI.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: UI.shadow }} className="buzz-fadein">
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${UI.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>Embed Your Form</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Paste this into your website body tag.</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 28, height: 28, background: UI.panelSoft, border: `1px solid ${UI.border}`, borderRadius: 7 }}><Icon d={ICONS.x} size={13} color="var(--text-2)" /></button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#f6f2ff', border: `1px solid ${UI.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: `1px solid ${UI.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} /><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} /><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /></div>
              <Badge color="green">Ready to deploy</Badge>
            </div>
            <pre style={{ padding: '16px', fontSize: 12, color: '#7C3AED', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8, overflow: 'auto', margin: 0 }}>{snippet}</pre>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { try { navigator.clipboard.writeText(snippet); } catch (error) {} onClose(); }}><Icon d={ICONS.copy} size={14} />Copy Script</Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailLayout({ eyebrow, title, subtitle, actions, side }) {
  return (
    <PageShell title={title} subtitle={subtitle} action={actions}>
      <div className="buzz-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 18 }}>
            <Label style={{ marginBottom: 10 }}>{eyebrow}</Label>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>Everything below stays connected: form entry, lead qualification, communication, tasks, files, invoices, and immutable activity.</div>
          </Card>
          {side?.main}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{side?.aside}</div>
      </div>
    </PageShell>
  );
}

export function FormDetailPage({ id }) {
  const { entries, forms, leads, setFormStatus, updateForm } = useBuzzStore();
  const form = forms.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  if (!form) {
    return <PageShell title="Form not found" subtitle="This form is missing from the current local workspace."><EmptyState title="No form record available" detail="The URL is valid only if the record exists in the current browser workspace." /></PageShell>;
  }
  const relatedEntries = entries.filter((entry) => entry.formId === form.id);
  return (
    <>
      <DetailLayout
        eyebrow="Form Overview"
        title={form.name}
        subtitle={`${form.code} · ${form.status} · ${form.fields} fields · ${form.rules} rules`}
        actions={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button href={`/forms/builder/${form.id}`} variant="primary"><Icon d={ICONS.edit} size={14} />Open Builder</Button><Button href={`/forms/${form.id}/preview`}><Icon d={ICONS.eye} size={14} />Public Preview</Button><Button onClick={() => { if (form.status !== 'active') { flash('Publish the form before copying the live embed script.'); return; } try { navigator.clipboard.writeText(`<script src="https://cdn.buzzflow.io/widget.js" data-form="${form.code}" async></script>`); } catch (error) {} flash('Live embed script copied.'); }}><Icon d={ICONS.copy} size={14} />Copy Embed Script</Button>{form.status !== 'active' ? <Button onClick={() => { updateForm({ id: form.id, title: form.name, fields: form.field_schema || [], published: true }); flash('Form published.'); }}><Icon d={ICONS.zap} size={14} />Publish</Button> : null}{form.status === 'active' ? <Button onClick={() => { setFormStatus(form.id, 'paused'); flash('Form paused.'); }}>Pause</Button> : null}{form.status !== 'draft' ? <Button variant="danger" onClick={() => { setFormStatus(form.id, 'draft'); flash('Form unpublished.'); }}>Unpublish</Button> : null}</div>}
        side={{
          main: <><StatBand items={[{ label: 'Submissions', value: String(form.submissions), note: 'live', color: 'purple' }, { label: 'Conversion', value: `${form.conversion}%`, note: 'entry to lead', color: 'cyan' }, { label: 'Rules', value: String(form.rules), note: 'active', color: 'green' }]} /><TableCard title="Latest Entries" headers={[{ label: 'Contact', w: '1fr' }, { label: 'State', w: '110px' }, { label: 'Result', w: '140px' }, { label: 'Lead', w: '120px' }]} rows={relatedEntries.map((entry) => { const linkedLead = leads.find((lead) => lead.entryId === entry.id); return <ClickableRow key={entry.id} href={`/entries/${entry.id}`} columns={[{ w: '1fr', node: <PrimaryText title={entry.contact} sub={`${entry.email} · ${entry.submitted}`} /> }, { w: '110px', node: <Badge color={badgeColor(entry.state)}>{entry.state}</Badge> }, { w: '140px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{entry.result}</div> }, { w: '120px', node: linkedLead ? <div onClick={(event) => event.stopPropagation()}><Button href={`/leads/${linkedLead.id}`} size="sm">Open Lead</Button></div> : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>No lead</span> }]} />; })} /></>,
          aside: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Publishing</Label><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><Badge color={badgeColor(form.status)}>{form.status}</Badge><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Internal endpoint: {form.endpoint}</div></div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Embed</Label><pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 10, color: '#7C3AED', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8 }}>{`<script src="https://cdn.buzzflow.io/widget.js" data-form="${form.code}" async></script>`}</pre></Card></>,
        }}
      />
      <Toast message={toast} />
    </>
  );
}

export function LeadDetailPage({ id }) {
  const { communications, customers, entries, leads, tasks, convertLeadToCustomer, logCommunication } = useBuzzStore();
  const lead = leads.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  if (!lead) {
    return <PageShell title="Lead not found" subtitle="This lead is missing from the current local workspace."><EmptyState title="No lead record available" detail="Create the lead again or open it from the current browser session where it was created." /></PageShell>;
  }
  const customer = customers.find((item) => item.leadId === lead.id);
  const relatedEntry = entries.find((item) => item.id === lead.entryId);
  return (
    <>
      <DetailLayout
      eyebrow="Lead Record"
      title={`${lead.name} · ${lead.company}`}
      subtitle={`${lead.id} · ${lead.status} · ${lead.priority} priority · score ${lead.score}`}
      actions={<div style={{ display: 'flex', gap: 8 }}><Button variant="primary" onClick={() => { if (customer) { flash('Lead is already converted.'); return; } convertLeadToCustomer(lead.id); flash('Customer created from lead.'); }}><Icon d={ICONS.check} size={14} />Convert to Customer</Button><Button onClick={() => { logCommunication({ title: `Follow-up for ${lead.name}`, linked: lead.id, detail: 'Added from lead record.' }); flash('New note added to lead.'); }}><Icon d={ICONS.plus} size={14} />New Note</Button></div>}
      side={{
        main: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 12 }}>Lead Intelligence</Label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Source</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.source}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Owner</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.owner}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Value</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.value}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Next Step</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.next}</div></div></div><div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{lead.notes}</div></Card><TableCard title="Communication Timeline" headers={[{ label: 'Event', w: '1fr' }, { label: 'Owner', w: '100px' }, { label: 'Type', w: '120px' }]} rows={communications.slice(0, 3).map((item) => <Row key={item.id} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.detail} /> }, { w: '100px', node: <Avatar name={item.owner} size={24} /> }, { w: '120px', node: <Badge color="cyan">{item.type}</Badge> }]} />)} /></>,
        aside: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Connected Records</Label><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Entry: {relatedEntry?.id || 'None'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Customer: {customer?.id || 'Not converted'}</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{lead.tags.map((tag) => <Badge key={tag} color="purple">{tag}</Badge>)}</div></div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Open Tasks</Label>{tasks.slice(0, 2).map((task) => <div key={task.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 12, fontWeight: 700 }}>{task.title}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{task.due}</div></div>)}</Card></>,
      }}
      />
      <Toast message={toast} />
    </>
  );
}

export function CustomerDetailPage({ id }) {
  const { customers, files, invoices, createInvoice, uploadFile } = useBuzzStore();
  const customer = customers.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  if (!customer) {
    return <PageShell title="Customer not found" subtitle="This customer is missing from the current local workspace."><EmptyState title="No customer record available" detail="Open the customer from the list or recreate it in this browser workspace." /></PageShell>;
  }
  const relatedInvoices = invoices.filter((invoice) => invoice.customer === customer.name);
  return (
    <>
      <DetailLayout
      eyebrow="Customer Account"
      title={customer.name}
      subtitle={`${customer.id} · ${customer.status} · ${customer.lifecycle}`}
      actions={<div style={{ display: 'flex', gap: 8 }}><Button variant="primary" onClick={() => { createInvoice({ customer: customer.name, amount: 'SEK 12,000' }); flash('Invoice draft created for customer.'); }}><Icon d={ICONS.hash} size={14} />Create Invoice</Button><Button onClick={() => { uploadFile({ name: `${customer.name.toLowerCase().replace(/\s+/g, '-')}-brief.pdf`, linked: `Customer ${customer.id}` }); flash('File uploaded for customer.'); }}><Icon d={ICONS.plus} size={14} />Add File</Button></div>}
      side={{
        main: <><StatBand items={[{ label: 'Total Billing', value: customer.total, note: 'lifetime', color: 'green' }, { label: 'Invoices', value: String(relatedInvoices.length), note: customer.invoices, color: 'yellow' }, { label: 'Status', value: customer.status, note: 'lifecycle', color: badgeColor(customer.status) }]} /><TableCard title="Invoices" headers={[{ label: 'Invoice', w: '1fr' }, { label: 'Status', w: '120px' }, { label: 'Due', w: '120px' }]} rows={relatedInvoices.map((invoice) => <Row key={invoice.id} columns={[{ w: '1fr', node: <PrimaryText title={invoice.id} sub={invoice.amount} /> }, { w: '120px', node: <Badge color={badgeColor(invoice.status)}>{invoice.status}</Badge> }, { w: '120px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{invoice.due}</div> }]} />)} /></>,
        aside: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Customer Snapshot</Label><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{customer.activity}</div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Recent Files</Label>{files.slice(0, 2).map((file) => <div key={file.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 12, fontWeight: 700 }}>{file.name}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{file.size}</div></div>)}</Card></>,
      }}
      />
      <Toast message={toast} />
    </>
  );
}

export function PublicEmbedPage({ id, mode = 'live' }) {
  const { forms, submitEntry } = useBuzzStore();
  const form = forms.find((item) => item.id === id);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fields = useMemo(() => normalizeBuilderFields(form?.field_schema), [form?.field_schema]);
  const accentColor = form?.color || BUILDER_COLORS[0];
  const [values, setValues] = useState({});
  useEffect(() => {
    const initialValues = {};
    fields.forEach((field) => {
      if (field.type === 'section') return;
      initialValues[field.id] = field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : '';
    });
    setValues(initialValues);
    setSubmitted(false);
    setError('');
  }, [fields, form?.id]);
  if (!form) {
    return <div className="buzz-scroll buzz-fadein" style={{ flex: 1, padding: '48px 20px' }}><div style={{ maxWidth: 640, margin: '0 auto' }}><EmptyState title="Form unavailable" detail="This form is not available in the current browser workspace." /></div></div>;
  }
  const isDraftPreview = mode === 'draft';
  const canSubmit = !isDraftPreview && form.status === 'active';
  return (
    <div className="buzz-scroll buzz-fadein" style={{ flex: 1, padding: '48px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Card style={{ padding: 28, borderRadius: 22, boxShadow: UI.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg, ${accentColor}, ${hexToRgba(accentColor, 0.72)})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICONS.zap} size={18} color="#fff" /></div>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${accentColor}, #22D3EE)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BuzzFlow</span>
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>{form.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, marginBottom: 26 }}>{isDraftPreview ? 'Draft preview. This route never creates a live submission.' : 'Public embedded form preview. Published status, validation shell, and submission endpoint are controlled internally.'}</p>
          <div className="buzz-embed-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            {fields.map((field) => {
              if (field.type === 'section') {
                return (
                  <div key={field.id} style={{ gridColumn: 'span 2', paddingTop: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>{field.label}</div>
                  </div>
                );
              }
              if (field.type === 'hidden') {
                return null;
              }
              const sharedStyle = { width: '100%', padding: '10px 14px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10, color: 'var(--text)', outline: 'none' };
              const label = `${field.label}${field.required ? ' *' : ''}`;
              if (field.type === 'textarea') {
                return <div key={field.id} style={{ gridColumn: 'span 2' }}><Label style={{ marginBottom: 6 }}>{label}</Label><textarea value={values[field.id] || ''} placeholder={field.placeholder || ''} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} style={{ ...sharedStyle, minHeight: 120, resize: 'vertical' }} /></div>;
              }
              if (field.type === 'dropdown') {
                return <div key={field.id} style={{ gridColumn: field.half ? 'span 1' : 'span 2' }}><Label style={{ marginBottom: 6 }}>{label}</Label><select value={values[field.id] || ''} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} style={sharedStyle}><option value="">{field.placeholder || 'Select an option'}</option>{extractFieldOptions(field).map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
              }
              if (field.type === 'multiselect') {
                const selected = Array.isArray(values[field.id]) ? values[field.id] : [];
                return (
                  <div key={field.id} style={{ gridColumn: 'span 2' }}>
                    <Label style={{ marginBottom: 6 }}>{label}</Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {extractFieldOptions(field).map((option) => {
                        const active = selected.includes(option);
                        return (
                          <button key={option} type="button" onClick={() => setValues((current) => ({ ...current, [field.id]: active ? selected.filter((item) => item !== option) : [...selected, option] }))} style={{ padding: '8px 10px', borderRadius: 999, border: `1px solid ${active ? accentColor : UI.inputBorder}`, background: active ? hexToRgba(accentColor, 0.08) : UI.input, color: 'var(--text-2)', fontSize: 12, fontWeight: 600 }}>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              if (field.type === 'checkbox') {
                return (
                  <div key={field.id} style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>
                      <input type="checkbox" checked={Boolean(values[field.id])} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.checked }))} />
                      {label}
                    </label>
                  </div>
                );
              }
              return <div key={field.id} style={{ gridColumn: field.half ? 'span 1' : 'span 2' }}><Label style={{ marginBottom: 6 }}>{label}</Label><input type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'phone' ? 'tel' : 'text'} value={values[field.id] || ''} placeholder={field.placeholder || ''} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} style={sharedStyle} /></div>;
            })}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <Button variant="primary" onClick={() => {
              if (isDraftPreview) {
                setSubmitted(true);
                setError('');
                return;
              }
              if (form.status === 'paused') {
                setError('This form is paused and is not accepting submissions.');
                setSubmitted(false);
                return;
              }
              if (form.status !== 'active') {
                setError('This form is not published and cannot accept submissions.');
                setSubmitted(false);
                return;
              }
              const missingFields = fields.filter((field) => {
                if (field.type === 'section' || field.type === 'hidden' || !field.required) return false;
                const value = values[field.id];
                if (field.type === 'multiselect') return !Array.isArray(value) || value.length === 0;
                if (field.type === 'checkbox') return !value;
                return !String(value || '').trim();
              });
              if (missingFields.length) {
                setError(`${missingFields[0].label} is required.`);
                setSubmitted(false);
                return;
              }
              submitEntry({ formId: form.id, ...deriveEntryPayload(fields, values) });
              setSubmitted(true);
              setError('');
              const resetValues = {};
              fields.forEach((field) => {
                if (field.type === 'section') return;
                resetValues[field.id] = field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : '';
              });
              setValues(resetValues);
            }}><Icon d={ICONS.check} size={14} />Submit Entry</Button>
            <Badge color={badgeColor(form.status)}>{form.status}</Badge>
          </div>
          {error ? <div style={{ marginTop: 14, fontSize: 12, color: '#EF4444', fontWeight: 700 }}>{error}</div> : null}
          {submitted ? <div style={{ marginTop: 14, fontSize: 12, color: '#10B981', fontWeight: 700 }}>{isDraftPreview ? 'Draft preview submitted successfully. No production entry was created.' : 'Entry submitted successfully. Qualification, task creation, and activity logging would run next.'}</div> : null}
        </Card>
      </div>
    </div>
  );
}

function SaveBar({ primaryLabel, onSave }) {
  return <div style={{ display: 'flex', gap: 8 }}><Button onClick={onSave} variant="primary"><Icon d={ICONS.check} size={14} />{primaryLabel}</Button></div>;
}

export function FormPreviewPage({ id }) {
  return <PublicEmbedPage id={id} mode="draft" />;
}

export function EntryDetailPage({ id }) {
  const { entries } = useBuzzStore();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return <PageShell title="Entry not found" subtitle="The selected entry could not be found."><EmptyState title="Missing entry" detail="Open the entry again from the inbox." /></PageShell>;
  return (
    <PageShell title={entry.contact} subtitle={`${entry.id} · ${entry.form} · ${entry.state}`}>
      <Card style={{ padding: 18 }}>
        <Label style={{ marginBottom: 10 }}>Raw Payload</Label>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--text-2)' }}>{JSON.stringify(entry.raw, null, 2)}</pre>
      </Card>
    </PageShell>
  );
}

export function EntryMergePage({ id }) {
  const router = useRouter();
  const { customers, leads, mergeEntry } = useBuzzStore();
  const [target, setTarget] = useState(leads[0]?.id || customers[0]?.id || '');
  return (
    <PageShell title="Merge Entry" subtitle={`${id} · choose an existing target`}>
      <Card style={{ padding: 18 }}>
        <Field label="Target Record Id" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="L-1048" />
      </Card>
      <SaveBar primaryLabel="Merge Entry" onSave={() => { mergeEntry(id); router.push('/entries'); }} />
    </PageShell>
  );
}

export function NewLeadPage() {
  const router = useRouter();
  const { createLead } = useBuzzStore();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  return (
    <PageShell title="New Lead" subtitle="Manual lead creation">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <Field label="Lead Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nora Lind" />
        <Field label="Company" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Northstar Studio" />
      </Card>
      <SaveBar primaryLabel="Create Lead" onSave={() => { const id = createLead({ name, company }); router.push(`/leads/${id}`); }} />
    </PageShell>
  );
}

export function NewCustomerPage() {
  const router = useRouter();
  const { createCustomer } = useBuzzStore();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  return (
    <PageShell title="New Customer" subtitle="Manual customer creation">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <Field label="Customer Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Northstar Studio" />
        <Field label="Primary Contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Nora Lind" />
      </Card>
      <SaveBar primaryLabel="Create Customer" onSave={() => { const id = createCustomer({ name, contact }); router.push(`/customers/${id}`); }} />
    </PageShell>
  );
}

export function NewTaskPage() {
  const router = useRouter();
  const { createTask } = useBuzzStore();
  const [title, setTitle] = useState('');
  return (
    <PageShell title="New Task" subtitle="Create task">
      <Card style={{ padding: 18 }}>
        <Field label="Task Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Follow up proposal" />
      </Card>
      <SaveBar primaryLabel="Create Task" onSave={() => { const id = createTask({ title }); router.push(`/tasks/${id}`); }} />
    </PageShell>
  );
}

export function NewInvoicePage() {
  const router = useRouter();
  const { createInvoice } = useBuzzStore();
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <PageShell title="New Invoice" subtitle="Create invoice">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <Field label="Customer" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Northstar Studio" />
        <Field label="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="SEK 12,000" />
      </Card>
      <SaveBar primaryLabel="Create Invoice" onSave={() => { const id = createInvoice({ customer, amount }); router.push(`/invoices/${id}`); }} />
    </PageShell>
  );
}

export function NewCommunicationPage() {
  const router = useRouter();
  const { logCommunication } = useBuzzStore();
  const [title, setTitle] = useState('');
  return (
    <PageShell title="New Note" subtitle="Create communication item">
      <Card style={{ padding: 18 }}>
        <Field label="Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Proposal follow-up note" />
      </Card>
      <SaveBar primaryLabel="Save Note" onSave={() => { const id = logCommunication({ title }); router.push(`/communication/${id}`); }} />
    </PageShell>
  );
}

export function NewFilePage() {
  const router = useRouter();
  const { uploadFile } = useBuzzStore();
  const [name, setName] = useState('');
  return (
    <PageShell title="Upload File" subtitle="Upload and link a file">
      <Card style={{ padding: 18 }}>
        <Field label="Filename" value={name} onChange={(event) => setName(event.target.value)} placeholder="northstar-proposal.pdf" />
      </Card>
      <SaveBar primaryLabel="Upload File" onSave={() => { const id = uploadFile({ name }); router.push(`/files/${id}`); }} />
    </PageShell>
  );
}

export function CommunicationDetailPage({ id }) {
  const { communications } = useBuzzStore();
  const item = communications.find((row) => row.id === id);
  if (!item) return <PageShell title="Communication not found" subtitle="The selected communication record could not be found."><EmptyState title="Missing communication" detail="Open the record again from the communication page." /></PageShell>;
  return <PageShell title={item.title} subtitle={`${item.type} · ${item.linked}`}><Card style={{ padding: 18 }}><div style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.detail}</div></Card></PageShell>;
}

export function TaskDetailPage({ id }) {
  const { tasks } = useBuzzStore();
  const task = tasks.find((row) => row.id === id);
  if (!task) return <PageShell title="Task not found" subtitle="The selected task could not be found."><EmptyState title="Missing task" detail="Open the task again from the task list." /></PageShell>;
  return <PageShell title={task.title} subtitle={`${task.id} · ${task.status} · ${task.due}`}><Card style={{ padding: 18 }}><div style={{ fontSize: 13, color: 'var(--text-2)' }}>Linked to {task.link}</div></Card></PageShell>;
}

export function InvoiceDetailPage({ id }) {
  const { invoices } = useBuzzStore();
  const invoice = invoices.find((row) => row.id === id);
  if (!invoice) return <PageShell title="Invoice not found" subtitle="The selected invoice could not be found."><EmptyState title="Missing invoice" detail="Open the invoice again from the invoice list." /></PageShell>;
  return <PageShell title={invoice.id} subtitle={`${invoice.customer} · ${invoice.status}`}><Card style={{ padding: 18 }}><div style={{ fontSize: 13, color: 'var(--text-2)' }}>{invoice.amount} · due {invoice.due}</div></Card></PageShell>;
}

export function FileDetailPage({ id }) {
  const { files } = useBuzzStore();
  const file = files.find((row) => row.id === id);
  if (!file) return <PageShell title="File not found" subtitle="The selected file could not be found."><EmptyState title="Missing file" detail="Open the file again from the file list." /></PageShell>;
  return <PageShell title={file.name} subtitle={`${file.type} · ${file.size}`}><Card style={{ padding: 18 }}><div style={{ fontSize: 13, color: 'var(--text-2)' }}>Linked object: {file.linked}</div></Card></PageShell>;
}
