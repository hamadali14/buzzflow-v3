'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

const TEAM_MEMBERS = [
  { name: 'Alex', role: 'admin', scope: 'Full workspace access, builder publishing, automation, and finance approvals.' },
  { name: 'Sarah', role: 'sales', scope: 'Leads, customers, communication, and outbound activity.' },
  { name: 'Mika', role: 'ops', scope: 'Tasks, delivery, files, and customer operations.' },
  { name: 'Noah', role: 'finance', scope: 'Invoices, payment follow-up, and billing controls.' },
  { name: 'Emma', role: 'support', scope: 'Support tasks, communication notes, and customer follow-up.' },
];

const ROLE_OPTIONS = TEAM_MEMBERS.map((member) => ({ value: member.role, label: `${member.role}` }));

function scopeByRole(role, item) {
  if (role === 'admin') return true;
  if (role === 'sales') return ['lead', 'customer', 'communication', 'task'].includes(item);
  if (role === 'ops') return ['customer', 'task', 'form', 'file'].includes(item);
  if (role === 'finance') return ['invoice', 'customer', 'task', 'communication'].includes(item);
  if (role === 'support') return ['customer', 'task', 'communication', 'file'].includes(item);
  return true;
}

const COMMAND_STORAGE_KEY = 'buzzflow-command-pins-v1';

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

function SmartEmptyState({ title, detail, actionLabel, actionHref, secondaryLabel, secondaryHref }) {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.6 }}>{detail}</div>
      {(actionLabel || secondaryLabel) ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {actionLabel ? <Button href={actionHref} variant="primary">{actionLabel}</Button> : null}
          {secondaryLabel ? <Button href={secondaryHref}>{secondaryLabel}</Button> : null}
        </div>
      ) : null}
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

function TextAreaField({ label, value, onChange, placeholder = '', rows = 4 }) {
  return (
    <div>
      <Label style={{ marginBottom: 6 }}>{label}</Label>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ width: '100%', padding: '10px 14px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10, color: 'var(--text)', outline: 'none', resize: 'vertical', minHeight: rows * 24 }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <Label style={{ marginBottom: 6 }}>{label}</Label>
      <select value={value} onChange={onChange} style={{ width: '100%', padding: '10px 14px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10, color: 'var(--text)', outline: 'none' }}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, checked, onChange, hint }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{label}</div>
        {hint ? <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{hint}</div> : null}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 16, height: 16, accentColor: 'var(--primary)', marginTop: 2 }} />
    </label>
  );
}

function InlineEditor({ editing, onEditToggle, onSave, children, actions }) {
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        {editing ? (
          <>
            <Button onClick={onEditToggle}>Cancel</Button>
            <Button variant="primary" onClick={onSave}>Save</Button>
          </>
        ) : (
          <Button onClick={onEditToggle}><Icon d={ICONS.edit} size={13} />Edit</Button>
        )}
        {actions}
      </div>
      {children}
    </Card>
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
    failed: 'red',
    blocked: 'red',
    done: 'green',
    'in progress': 'cyan',
    partial: 'yellow',
    review: 'yellow',
    'at risk': 'red',
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

const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TASK_TYPE_OPTIONS = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'internal', label: 'Internal' },
];

const TASK_REMINDER_OPTIONS = [
  { value: '15m', label: '15 minutes before' },
  { value: '1h', label: '1 hour before' },
  { value: '1d', label: '1 day before' },
];

const TASK_RECURRING_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const CUSTOMER_HEALTH_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'stable', label: 'Stable' },
  { value: 'at risk', label: 'At Risk' },
];

const CUSTOMER_SIZE_OPTIONS = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '200+', label: '200+' },
];

const COMMUNICATION_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'queued', label: 'Queued' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' },
];

const COMMUNICATION_TEMPLATE_OPTIONS = [
  { value: 'blank', label: 'Blank' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'check-in', label: 'Check-in' },
  { value: 'internal-update', label: 'Internal Update' },
];

const COMMUNICATION_TEMPLATES = {
  blank: { subject: '', body: '' },
  'follow-up': { subject: 'Quick follow-up', body: 'Hi,\n\nJust following up on the conversation and next step. Let me know what timing works best.\n\nBest,\nBuzzFlow' },
  proposal: { subject: 'Proposal and next steps', body: 'Hi,\n\nHere is the proposal draft with scope, timing, and pricing. Reply with feedback and we can lock the next meeting.\n\nBest,\nBuzzFlow' },
  'check-in': { subject: 'Checking in', body: 'Hi,\n\nWanted to check in and see where things stand on your side. Happy to help move this forward.\n\nBest,\nBuzzFlow' },
  'internal-update': { subject: 'Internal update', body: 'Internal note:\n\nStatus update, blockers, owner handoff, and next action.' },
};

function recordPathFromTask(task) {
  if (task.related?.type === 'lead' && task.related.id) return `/leads/${task.related.id}`;
  if (task.related?.type === 'customer' && task.related.id) return `/customers/${task.related.id}`;
  if (task.related?.type === 'entry' && task.related.id) return `/entries/${task.related.id}`;
  if (task.related?.type === 'form' && task.related.id) return `/forms/${task.related.id}`;
  if (task.related?.type === 'invoice' && task.related.id) return `/invoices/${task.related.id}`;
  if (task.related?.type === 'file' && task.related.id) return `/files/${task.related.id}`;
  return '/tasks';
}

function isTodayDate(value) {
  if (!value) return false;
  const today = new Date().toISOString().slice(0, 10);
  return String(value).slice(0, 10) === today;
}

function isOverdueTask(task) {
  if (String(task.due).toLowerCase() === 'late') return true;
  if (!task.dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today && task.status !== 'done';
}

function recordPathFromCommunication(item) {
  if (item.related?.type === 'lead' && item.related.id) return `/leads/${item.related.id}`;
  if (item.related?.type === 'customer' && item.related.id) return `/customers/${item.related.id}`;
  if (item.related?.type === 'task' && item.related.id) return `/tasks/${item.related.id}`;
  if (item.related?.type === 'form' && item.related.id) return `/forms/${item.related.id}`;
  if (String(item.linked || '').startsWith('Lead ')) return `/leads/${String(item.linked).replace('Lead ', '')}`;
  if (String(item.linked || '').startsWith('Customer ')) return `/customers/${String(item.linked).replace('Customer ', '')}`;
  if (String(item.linked || '').startsWith('Task ')) return `/tasks/${String(item.linked).replace('Task ', '')}`;
  return `/communication/${item.id}`;
}

function recordPathFromActivity(item) {
  if (item.type === 'email' || item.type === 'note') return '/communication';
  if (item.type === 'lead') return '/leads';
  if (item.type === 'invoice') return '/invoices';
  if (item.type === 'task') return '/tasks';
  if (item.type === 'customer') return '/customers';
  return '/activity';
}

function commandMatches(item, query) {
  if (!query) return true;
  const haystack = [item.label, item.sub, item.kind, ...(item.keywords || [])].join(' ').toLowerCase();
  return haystack.includes(query);
}

function CommandPalette({ query, onQueryChange, actions, records, pinned, onTogglePin, onClose, onSelect, selectedId }) {
  return (
    <Modal
      title="Command Palette"
      subtitle="Search records or jump to a quick action."
      onClose={onClose}
      actions={<Button onClick={onClose}>Close</Button>}
    >
      <div style={{ position: 'relative' }}>
        <Icon d={ICONS.search} size={14} color="var(--text-3)" style={{ position: 'absolute', left: 12, top: 12 }} />
        <input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search forms, leads, customers, tasks, invoices, files, communication..." style={{ width: '100%', height: 40, padding: '0 12px 0 34px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 10, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gap: 14, maxHeight: '60vh', overflow: 'auto' }}>
        {pinned.length ? (
          <div>
            <Label style={{ marginBottom: 8 }}>Pinned</Label>
            <div style={{ display: 'grid', gap: 8 }}>
              {pinned.map((item) => (
                <button key={item.id} type="button" onClick={() => onSelect(item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, border: selectedId === item.id ? `1px solid var(--primary)` : `1px solid ${UI.border}`, background: UI.panelSoft, textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Badge color="yellow">Pinned</Badge>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <Label style={{ marginBottom: 8 }}>Quick Actions</Label>
          <div style={{ display: 'grid', gap: 8 }}>
            {actions.length ? actions.map((item) => (
              <button key={item.id} type="button" onClick={() => onSelect(item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, border: selectedId === item.id ? `1px solid var(--primary)` : `1px solid ${UI.border}`, background: UI.panelSoft, textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button type="button" onClick={(event) => { event.stopPropagation(); onTogglePin(item); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>Pin</button>
                  <Badge color="purple">{item.kind}</Badge>
                </div>
              </button>
            )) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No matching actions.</div>}
          </div>
        </div>
        <div>
          <Label style={{ marginBottom: 8 }}>Records</Label>
          <div style={{ display: 'grid', gap: 8 }}>
            {records.length ? records.map((item) => (
              <button key={item.id} type="button" onClick={() => onSelect(item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, border: selectedId === item.id ? `1px solid var(--primary)` : `1px solid ${UI.border}`, background: UI.panel, textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button type="button" onClick={(event) => { event.stopPropagation(); onTogglePin(item); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>Pin</button>
                  <Badge color="gray">{item.kind}</Badge>
                </div>
              </button>
            )) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No matching records.</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function eventTone(event = '') {
  if (/paid|healthy|assigned|published|emailed|created|submitted|completed|converted/i.test(event)) return 'green';
  if (/overdue|late|failed|blocked|at risk/i.test(event)) return 'red';
  if (/updated|edited|changed|note/i.test(event)) return 'yellow';
  return 'gray';
}

function TimelineList({ items, emptyTitle, emptyDetail, actionLabel, actionHref }) {
  if (!items.length) {
    return <SmartEmptyState title={emptyTitle} detail={emptyDetail} actionLabel={actionLabel} actionHref={actionHref} />;
  }
  return (
    <Card style={{ padding: 18 }}>
      <Label style={{ marginBottom: 12 }}>Timeline</Label>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 110px', gap: 12, alignItems: 'start', paddingBottom: 10, borderBottom: `1px solid ${UI.border}` }}>
            <Badge color={eventTone(item.title)}>{item.time || 'Now'}</Badge>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{item.detail}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 700, textAlign: 'right' }}>{item.actor}</div>
          </div>
        ))}
      </div>
    </Card>
  );
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

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
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
    showWhen: field.showWhen?.fieldId ? { fieldId: field.showWhen.fieldId, value: field.showWhen.value || '' } : null,
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

function shouldDisplayField(field, values) {
  if (!field?.showWhen?.fieldId) return true;
  const sourceValue = values[field.showWhen.fieldId];
  if (Array.isArray(sourceValue)) return sourceValue.includes(field.showWhen.value);
  if (typeof sourceValue === 'boolean') return String(sourceValue) === String(field.showWhen.value);
  return String(sourceValue || '') === String(field.showWhen.value || '');
}

function buildFormSteps(fields, multiStepEnabled) {
  if (!multiStepEnabled) return [{ id: 'step-all', label: 'All Fields', fields }];
  const sections = [];
  let current = { id: 'step-1', label: 'Step 1', fields: [] };
  fields.forEach((field) => {
    if (field.type === 'section') {
      if (current.fields.length) sections.push(current);
      current = { id: field.id, label: field.label || `Step ${sections.length + 1}`, fields: [] };
      return;
    }
    current.fields.push(field);
  });
  if (current.fields.length) sections.push(current);
  return sections.length ? sections : [{ id: 'step-all', label: 'All Fields', fields: fields.filter((field) => field.type !== 'section') }];
}

function entryValueForField(entry, field) {
  if (!entry || !field) return '';
  return entry.raw?.[field.label];
}

function buildFieldAnalytics(entries, fields) {
  const liveFields = fields.filter((field) => !['section', 'hidden'].includes(field.type));
  const total = entries.length || 1;
  return liveFields.map((field) => {
    const filled = entries.filter((entry) => {
      const value = entryValueForField(entry, field);
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      return String(value || '').trim().length > 0;
    }).length;
    const fillRate = Math.round((filled / total) * 100);
    return {
      id: field.id,
      label: field.label,
      fillRate,
      dropoff: Math.max(0, 100 - fillRate),
      required: field.required,
    };
  });
}

function buildStepAnalytics(entries, steps) {
  const total = entries.length || 1;
  return steps.map((step) => {
    const stepFields = (step.fields || []).filter((field) => !['section', 'hidden'].includes(field.type));
    const completed = entries.filter((entry) => stepFields.every((field) => {
      const value = entryValueForField(entry, field);
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value || !field.required;
      return String(value || '').trim().length > 0 || !field.required;
    })).length;
    const completionRate = Math.round((completed / total) * 100);
    return {
      id: step.id,
      label: step.label,
      completionRate,
      dropoff: Math.max(0, 100 - completionRate),
    };
  });
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

export function TopBar({ onOpenCommandPalette }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="buzz-topbar" style={{ height: 52, borderBottom: `1px solid ${UI.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10, background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(16px)', flexShrink: 0, position: 'relative', zIndex: 50 }}>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
        <button type="button" onClick={onOpenCommandPalette} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 10, background: UI.panelSoft, border: `1px solid ${UI.border}` }}>
          <Icon d={ICONS.search} size={14} color="var(--text-2)" />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>Search</span>
          <Badge color="gray">⌘K</Badge>
        </button>
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
  const { activity, builderSession, clearBuilderSession, commitBuilderSession, communications, customers, entries, files, forms, invoices, leads, tasks } = useBuzzStore();
  const [pendingNavigation, setPendingNavigation] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [pinnedCommands, setPinnedCommands] = useState([]);
  const [selectedCommandId, setSelectedCommandId] = useState('');

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

  const openCommandPalette = useCallback(() => {
    setCommandQuery('');
    setCommandOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandOpen(false);
    setCommandQuery('');
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COMMAND_STORAGE_KEY);
      if (raw) {
        setPinnedCommands(JSON.parse(raw));
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(COMMAND_STORAGE_KEY, JSON.stringify(pinnedCommands));
    } catch (error) {}
  }, [pinnedCommands]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((current) => !current);
        setCommandQuery('');
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const actionItems = useMemo(() => {
    const base = [
      { id: 'action-dashboard', label: 'Open dashboard', sub: 'Jump back to the main workspace view.', kind: 'action', href: '/dashboard', keywords: ['home summary overview'] },
      { id: 'action-forms', label: 'Open forms', sub: 'Review published and draft forms.', kind: 'action', href: '/forms', keywords: ['builder form registry'] },
      { id: 'action-new-lead', label: 'Create lead', sub: 'Open the lead creation flow.', kind: 'action', href: '/leads/new', keywords: ['new lead add lead sales'] },
      { id: 'action-new-customer', label: 'Create customer', sub: 'Open the customer creation flow.', kind: 'action', href: '/customers/new', keywords: ['new customer account'] },
      { id: 'action-new-task', label: 'Create task', sub: 'Open the task creation flow.', kind: 'action', href: '/tasks/new', keywords: ['new task follow-up assign'] },
      { id: 'action-new-communication', label: 'Compose message', sub: 'Open the communication composer.', kind: 'action', href: '/communication/new', keywords: ['email note message mail'] },
      { id: 'action-new-invoice', label: 'Create invoice', sub: 'Open the invoice creation flow.', kind: 'action', href: '/invoices/new', keywords: ['billing finance payment'] },
      { id: 'action-upload-file', label: 'Upload file', sub: 'Attach a file to a record.', kind: 'action', href: '/files/new', keywords: ['attachment document upload'] },
    ];
    const query = commandQuery.trim().toLowerCase();
    return base.filter((item) => commandMatches(item, query)).slice(0, 8);
  }, [commandQuery]);

  const recordItems = useMemo(() => {
    const records = [
      ...forms.map((item) => ({ id: `form-${item.id}`, label: item.name, sub: `${item.status} · ${item.fields || 0} fields`, kind: 'form', href: `/forms/${item.id}`, keywords: [item.code || '', item.endpoint || ''] })),
      ...entries.map((item) => ({ id: `entry-${item.id}`, label: item.contact || item.email || item.id, sub: `${item.state} · ${item.form}`, kind: 'entry', href: `/entries/${item.id}`, keywords: [item.email || '', item.phone || ''] })),
      ...leads.map((item) => ({ id: `lead-${item.id}`, label: item.name, sub: `${item.company} · ${item.status} · score ${item.score}`, kind: 'lead', href: `/leads/${item.id}`, keywords: [item.email || '', item.source || '', item.owner || ''] })),
      ...customers.map((item) => ({ id: `customer-${item.id}`, label: item.companyName || item.name, sub: `${item.owner} · ${item.stage} · ${item.health}`, kind: 'customer', href: `/customers/${item.id}`, keywords: [item.contactPerson || '', item.email || '', ...(item.tags || [])] })),
      ...tasks.map((item) => ({ id: `task-${item.id}`, label: item.title, sub: `${item.status} · ${item.owner} · ${item.link}`, kind: 'task', href: `/tasks/${item.id}`, keywords: [item.type || '', item.priority || '', item.owner || ''] })),
      ...invoices.map((item) => ({ id: `invoice-${item.id}`, label: item.id, sub: `${item.customer} · ${item.amount} · ${item.status}`, kind: 'invoice', href: `/invoices/${item.id}`, keywords: [item.customer || '', item.status || '', item.due || ''] })),
      ...files.map((item) => ({ id: `file-${item.id}`, label: item.name, sub: `${item.type} · ${item.linked}`, kind: 'file', href: `/files/${item.id}`, keywords: [item.linked || '', item.type || ''] })),
      ...communications.map((item) => ({ id: `communication-${item.id}`, label: item.title, sub: `${item.status} · ${item.type} · ${item.linked}`, kind: 'communication', href: `/communication/${item.id}`, keywords: [item.owner || '', item.template || '', item.linked || ''] })),
      ...activity.map((item) => ({ id: `activity-${item.id}`, label: `${item.form}`, sub: `${item.type} · ${item.user}`, kind: 'activity', href: recordPathFromActivity(item), keywords: [item.user || '', item.type || ''] })),
    ];
    const query = commandQuery.trim().toLowerCase();
    return records.filter((item) => commandMatches(item, query)).slice(0, 14);
  }, [activity, commandQuery, communications, customers, entries, files, forms, invoices, leads, tasks]);

  const visiblePinned = useMemo(() => pinnedCommands.filter((item) => commandMatches(item, commandQuery.trim().toLowerCase())).slice(0, 6), [commandQuery, pinnedCommands]);
  const navigableCommands = useMemo(() => [...visiblePinned, ...actionItems, ...recordItems], [actionItems, recordItems, visiblePinned]);

  const runCommand = useCallback((item) => {
    closeCommandPalette();
    if (item.href) {
      requestNavigation(item.href);
    }
  }, [closeCommandPalette, requestNavigation]);

  const togglePinCommand = useCallback((item) => {
    setPinnedCommands((current) => (
      current.some((row) => row.id === item.id)
        ? current.filter((row) => row.id !== item.id)
        : [item, ...current].slice(0, 8)
    ));
  }, []);

  useEffect(() => {
    setSelectedCommandId(navigableCommands[0]?.id || '');
  }, [commandOpen, navigableCommands]);

  useEffect(() => {
    if (!commandOpen) return;
    const handlePaletteKeys = (event) => {
      if (!navigableCommands.length) return;
      const currentIndex = Math.max(0, navigableCommands.findIndex((item) => item.id === selectedCommandId));
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedCommandId(navigableCommands[(currentIndex + 1) % navigableCommands.length].id);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedCommandId(navigableCommands[(currentIndex - 1 + navigableCommands.length) % navigableCommands.length].id);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        runCommand(navigableCommands[currentIndex]);
      }
    };
    window.addEventListener('keydown', handlePaletteKeys);
    return () => window.removeEventListener('keydown', handlePaletteKeys);
  }, [commandOpen, navigableCommands, runCommand, selectedCommandId]);

  return (
    <AppChromeContext.Provider value={{ requestNavigation }}>
      <div className="buzz-shell" style={{ display: 'flex', minHeight: '100vh' }}>
        <AppSidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <TopBar onOpenCommandPalette={openCommandPalette} />
          <main className="buzz-main" style={{ display: 'flex' }}>{children}</main>
        </div>
      </div>
      {commandOpen ? (
        <CommandPalette
          query={commandQuery}
          onQueryChange={setCommandQuery}
          actions={actionItems}
          records={recordItems}
          pinned={visiblePinned}
          onTogglePin={togglePinCommand}
          onClose={closeCommandPalette}
          onSelect={runCommand}
          selectedId={selectedCommandId}
        />
      ) : null}
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

function buildTimelineEntries({ logs = [], communications = [], tasks = [], invoices = [], entries = [], forms = [], matchObject = () => false, matchCommunication = () => false, matchTask = () => false, matchInvoice = () => false, matchEntry = () => false, matchForm = () => false }) {
  return [
    ...logs.filter((item) => matchObject(item.object) || matchObject(item.what)).map((item) => ({ id: `log-${item.id}`, title: item.what, detail: item.object, actor: item.actor, time: item.time })),
    ...communications.filter((item) => matchCommunication(item)).map((item) => ({ id: `com-${item.id}`, title: item.title, detail: item.detail, actor: item.owner, time: item.status || 'draft' })),
    ...tasks.filter((item) => matchTask(item)).map((item) => ({ id: `task-${item.id}`, title: item.status === 'done' ? 'Task completed' : item.status === 'blocked' ? 'Task blocked' : 'Task assigned', detail: `${item.title} · ${item.type}`, actor: item.owner, time: item.due || 'Scheduled' })),
    ...invoices.filter((item) => matchInvoice(item)).map((item) => ({ id: `invoice-${item.id}`, title: item.status === 'paid' ? 'Invoice paid' : 'Invoice created', detail: `${item.id} · ${item.amount}`, actor: 'Finance', time: item.due })),
    ...entries.filter((item) => matchEntry(item)).map((item) => ({ id: `entry-${item.id}`, title: 'Form submitted', detail: `${item.form} · ${item.contact}`, actor: item.email || 'Public form', time: item.submitted })),
    ...forms.filter((item) => matchForm(item)).map((item) => ({ id: `form-${item.id}`, title: item.status === 'active' ? 'Form published' : 'Form updated', detail: `${item.name} · ${item.status}`, actor: 'Alex', time: item.updated })),
  ].slice(0, 12);
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
  const highIntentLeads = leads.filter((lead) => lead.priority === 'high' || lead.score >= 80).slice(0, 3);
  const atRiskForms = forms.filter((form) => (form.status === 'active' && form.conversion < 45) || form.status === 'paused').slice(0, 4);
  const overdueTasks = entries.filter((entry) => entry.state === 'unread' || /Missing|Urgent|Duplicate/.test(entry.quality)).slice(0, 4);
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

      <div className="buzz-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <PanelTitle title="Actionable Dashboard" right={<Badge color="purple">live</Badge>} />
          <div style={{ display: 'grid', gap: 10 }}>
            {highIntentLeads.length ? highIntentLeads.map((lead) => (
              <button key={lead.id} type="button" onClick={() => router.push(`/leads/${lead.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: `1px solid ${UI.border}`, background: UI.panelSoft, borderRadius: 10, padding: '12px 12px', textAlign: 'left' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: lead.priority === 'high' ? '#10B981' : '#F59E0B', boxShadow: `0 0 10px ${lead.priority === 'high' ? '#10B981' : '#F59E0B'}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{lead.name} · {lead.company}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Score {lead.score} · {lead.owner} · {lead.next}</div>
                </div>
                <Badge color={badgeColor(lead.priority)}>{lead.priority}</Badge>
              </button>
            )) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No high-intent leads waiting right now.</div>}
          </div>
        </Card>
        <Card style={{ padding: 18 }}>
          <PanelTitle title="Forms At Risk" right={<Badge color="yellow">{atRiskForms.length}</Badge>} />
          <div style={{ display: 'grid', gap: 10 }}>
            {atRiskForms.length ? atRiskForms.map((form) => (
              <button key={form.id} type="button" onClick={() => router.push(`/forms/${form.id}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%', border: `1px solid ${UI.border}`, background: UI.panelSoft, borderRadius: 10, padding: '12px 12px', textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{form.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{form.status} · {form.conversion}% conversion</div>
              </button>
            )) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>All active forms are within healthy conversion ranges.</div>}
          </div>
        </Card>
        <Card style={{ padding: 18 }}>
          <PanelTitle title="Inbox Pressure" right={<Badge color="red">{overdueTasks.length}</Badge>} />
          <div style={{ display: 'grid', gap: 10 }}>
            {overdueTasks.length ? overdueTasks.map((entry) => (
              <button key={entry.id} type="button" onClick={() => router.push(`/entries/${entry.id}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%', border: `1px solid ${UI.border}`, background: UI.panelSoft, borderRadius: 10, padding: '12px 12px', textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{entry.contact}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{entry.form} · {entry.quality}</div>
              </button>
            )) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No unread or risky submissions in the inbox.</div>}
          </div>
        </Card>
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
      {forms.length ? <TableCard
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
      /> : <SmartEmptyState title="Publish a form to start collecting leads" detail="Your first live form unlocks submissions, lead scoring, communication, tasks, files, and timeline history." actionLabel="New Form" actionHref="/forms" secondaryLabel="Open Dashboard" secondaryHref="/dashboard" />}
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
  const { leads, workspace } = useBuzzStore();
  const role = workspace?.currentRole || 'admin';
  const [search, setSearch] = useState('');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [sortByScore, setSortByScore] = useState(true);
  const rows = [...leads]
    .filter((lead) => scopeByRole(role, 'lead') && (role === 'admin' || role === 'sales' ? true : lead.owner === 'Alex'))
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
  const { customers, workspace } = useBuzzStore();
  const role = workspace?.currentRole || 'admin';
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [sortByBilling, setSortByBilling] = useState(false);
  const rows = [...customers]
    .filter((customer) => scopeByRole(role, 'customer') && (role === 'admin' || role === 'finance' ? true : customer.owner === 'Alex' || (customer.team || []).includes('Alex')))
    .filter((customer) => `${customer.name} ${customer.companyName} ${customer.contactPerson || customer.contact} ${customer.status} ${customer.owner} ${(customer.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (!activeOnly || customer.status === 'active'))
    .sort((left, right) => (sortByBilling ? right.total.localeCompare(left.total) : left.name.localeCompare(right.name)));

  return (
    <>
      <PageShell title="Customers" subtitle="Customer records keep lead origin, communication, tasks, invoices, files, and lifecycle together." action={<Button variant="primary" href="/customers/new"><Icon d={ICONS.plus} size={14} />New Customer</Button>}>
        <SearchStrip placeholder="Search customers by company, contact, status..." search={search} onSearch={setSearch} filterLabel={activeOnly ? 'Active' : 'All'} sortLabel={sortByBilling ? 'Billing' : 'Name'} onFilter={() => setActiveOnly((current) => !current)} onSort={() => setSortByBilling((current) => !current)} />
        {rows.length ? <TableCard title="Customer Accounts" headers={[{ label: 'Customer', w: '1fr' }, { label: 'Owner', w: '90px' }, { label: 'Health', w: '110px' }, { label: 'Stage', w: '130px' }, { label: 'Total Billing', w: '130px' }, { label: 'Latest Activity', w: '180px' }]} rows={rows.map((customer) => <ClickableRow key={customer.id} href={`/customers/${customer.id}`} columns={[{ w: '1fr', node: <PrimaryText title={customer.companyName || customer.name} sub={`${customer.contactPerson || customer.contact} · ${customer.id} · ${customer.industry}`} /> }, { w: '90px', node: <Avatar name={customer.owner} size={24} /> }, { w: '110px', node: <Badge color={customer.health === 'at risk' ? 'red' : customer.health === 'healthy' ? 'green' : 'yellow'}>{customer.health}</Badge> }, { w: '130px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{customer.stage}</div> }, { w: '130px', node: <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 700 }}>{customer.total}</div> }, { w: '180px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{customer.activity}</div> }]} />)} /> : <SmartEmptyState title="Create your first customer" detail="Customers become the anchor for invoices, files, communication, tasks, and account health automation." actionLabel="New Customer" actionHref="/customers/new" secondaryLabel="Open Leads" secondaryHref="/leads" />}
      </PageShell>
    </>
  );
}

export function CommunicationPage() {
  const router = useRouter();
  const { communications, workspace } = useBuzzStore();
  const role = workspace?.currentRole || 'admin';
  const [mode, setMode] = useState('all');
  const rows = communications.filter((item) => {
    if (!scopeByRole(role, 'communication')) return false;
    if (role !== 'admin' && role !== 'finance' && item.owner !== 'Alex' && !item.internal) return false;
    if (mode === 'internal') return item.internal;
    if (mode === 'external') return !item.internal;
    if (mode === 'queued') return item.status === 'queued';
    if (mode === 'sent') return item.status === 'sent';
    if (mode === 'failed') return item.status === 'failed';
    return true;
  });
  return (
    <>
      <PageShell title="Communication" subtitle="Email composer, templates, scheduling, internal notes, threads, status, attachments, and record links live in one center." action={<Button variant="primary" href="/communication/new"><Icon d={ICONS.plus} size={14} />Compose</Button>}>
        <Card style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['all', 'All'],
            ['internal', 'Internal'],
            ['external', 'External'],
            ['queued', 'Queued'],
            ['sent', 'Sent'],
            ['failed', 'Failed'],
          ].map(([key, label]) => <Button key={key} size="sm" variant={mode === key ? 'primary' : 'default'} onClick={() => setMode(key)}>{label}</Button>)}
        </Card>
        <Card style={{ padding: 18 }}>
          <Label style={{ marginBottom: 10 }}>Template Library</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{COMMUNICATION_TEMPLATE_OPTIONS.filter((item) => item.value !== 'blank').map((item) => <Badge key={item.value} color="purple">{item.label}</Badge>)}</div>
        </Card>
        {rows.length ? <TableCard title="Communication Center" headers={[{ label: 'Message', w: '1fr' }, { label: 'Status', w: '90px' }, { label: 'Type', w: '110px' }, { label: 'Thread', w: '100px' }, { label: 'Linked To', w: '160px' }, { label: 'Owner', w: '90px' }]} rows={rows.map((item) => <ClickableRow key={item.id} href={`/communication/${item.id}`} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.internal ? `Internal · ${item.detail}` : `${item.template} · ${item.detail}`} /> }, { w: '90px', node: <Badge color={item.status === 'sent' ? 'green' : item.status === 'failed' ? 'red' : item.status === 'queued' ? 'yellow' : 'gray'}>{item.status}</Badge> }, { w: '110px', node: <Badge color="cyan">{item.type}</Badge> }, { w: '100px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.threadId}</div> }, { w: '160px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push(recordPathFromCommunication(item)); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{item.related?.label || item.linked}</button> }, { w: '90px', node: <Avatar name={item.owner} size={24} /> }]} />)} /> : <SmartEmptyState title="Connect SMTP to start email outreach" detail="Compose your first outbound message, save templates, and start building threads tied to leads and customers." actionLabel="Compose Message" actionHref="/communication/new" secondaryLabel="Open Customers" secondaryHref="/customers" />}
      </PageShell>
    </>
  );
}

export function TasksPage() {
  const router = useRouter();
  const { tasks, workspace } = useBuzzStore();
  const role = workspace?.currentRole || 'admin';
  const [view, setView] = useState('all');
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const blockedCount = tasks.filter((task) => task.status === 'blocked').length;
  const highPriorityCount = tasks.filter((task) => task.priority === 'high').length;
  const visibleTasks = tasks.filter((task) => {
    if (!scopeByRole(role, 'task')) return false;
    if (role === 'finance' && task.related?.type !== 'invoice' && task.owner !== 'Noah') return false;
    if (role !== 'admin' && role !== 'finance' && task.owner !== 'Alex' && !(task.watchers || []).includes('Alex') && !(task.collaborators || []).includes('Alex')) return false;
    if (view === 'my') return task.owner === 'Alex';
    if (view === 'today') return isTodayDate(task.dueDate);
    if (view === 'overdue') return isOverdueTask(task);
    if (view === 'assigned') return task.assignedBy === 'Alex';
    if (view === 'blocked') return task.status === 'blocked';
    return true;
  });
  return (
    <>
      <PageShell title="Tasks" subtitle="Tasks can be linked to leads, customers, entries, invoices, and communication records." action={<Button variant="primary" href="/tasks/new"><Icon d={ICONS.plus} size={14} />New Task</Button>}>
        <StatBand items={[{ label: 'Todo', value: String(todoCount), note: 'queued', color: 'gray' }, { label: 'High Priority', value: String(highPriorityCount), note: 'urgent', color: 'red' }, { label: 'Blocked', value: String(blockedCount), note: 'needs input', color: 'yellow' }]} />
        <Card style={{ padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['all', 'All tasks'],
            ['my', 'My tasks'],
            ['today', 'Due today'],
            ['overdue', 'Overdue'],
            ['assigned', 'Assigned by me'],
            ['blocked', 'Blocked tasks'],
          ].map(([key, label]) => <Button key={key} size="sm" variant={view === key ? 'primary' : 'default'} onClick={() => setView(key)}>{label}</Button>)}
        </Card>
        {visibleTasks.length ? <TableCard title="Task Queue" headers={[{ label: 'Task', w: '1fr' }, { label: 'Type', w: '120px' }, { label: 'Status', w: '110px' }, { label: 'Owner', w: '90px' }, { label: 'Due', w: '150px' }]} rows={visibleTasks.map((task) => <ClickableRow key={task.id} href={`/tasks/${task.id}`} columns={[{ w: '1fr', node: <PrimaryText title={task.title} sub={`${task.id} · ${task.related?.type || 'record'} · ${task.related?.label || task.link} · assigned by ${task.assignedBy || 'Alex'}`} /> }, { w: '120px', node: <Badge color="cyan">{task.type}</Badge> }, { w: '110px', node: <Badge color={badgeColor(task.status)}>{task.status}</Badge> }, { w: '90px', node: <Avatar name={task.owner} size={24} /> }, { w: '150px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push(recordPathFromTask(task)); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: task.due === 'Late' ? '#F87171' : 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{task.due}</button> }]} />)} /> : <SmartEmptyState title="Assign your first follow-up task" detail="Tasks become more useful when every lead, customer, invoice, and file has a clear next action and owner." actionLabel="Create Task" actionHref="/tasks/new" secondaryLabel="Open Leads" secondaryHref="/leads" />}
      </PageShell>
    </>
  );
}

export function InvoicesPage() {
  const router = useRouter();
  const { customers, invoices, workspace } = useBuzzStore();
  const role = workspace?.currentRole || 'admin';
  const visibleInvoices = invoices.filter((invoice) => scopeByRole(role, 'invoice'));
  const unpaidInvoices = visibleInvoices.filter((invoice) => invoice.status !== 'paid');
  const lateInvoices = visibleInvoices.filter((invoice) => invoice.status === 'late');
  return (
    <>
      <PageShell title="Invoices" subtitle="Create, send, mark paid, log partial payments, and keep every invoice tied to a customer." action={<Button variant="primary" href="/invoices/new"><Icon d={ICONS.plus} size={14} />New Invoice</Button>}><StatBand items={[{ label: 'Unpaid', value: String(unpaidInvoices.length), note: 'open invoices', color: 'yellow' }, { label: 'Late', value: String(lateInvoices.length), note: 'overdue', color: 'red' }, { label: 'Paid', value: String(visibleInvoices.filter((invoice) => invoice.status === 'paid').length), note: 'settled', color: 'green' }]} /><TableCard title="Invoice Register" headers={[{ label: 'Invoice', w: '1fr' }, { label: 'Customer', w: '170px' }, { label: 'Status', w: '100px' }, { label: 'Due', w: '110px' }, { label: 'Paid', w: '110px' }]} rows={visibleInvoices.map((invoice) => { const customer = customers.find((item) => item.name === invoice.customer); return <ClickableRow key={invoice.id} href={`/invoices/${invoice.id}`} columns={[{ w: '1fr', node: <PrimaryText title={`${invoice.id} · ${invoice.amount}`} sub="Number generated internally" /> }, { w: '170px', node: <button type="button" onClick={(event) => { event.stopPropagation(); router.push(customer ? `/customers/${customer.id}` : '/customers'); }} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: 'var(--text-2)', fontWeight: 700, textAlign: 'left' }}>{invoice.customer}</button> }, { w: '100px', node: <Badge color={badgeColor(invoice.status)}>{invoice.status}</Badge> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{invoice.due}</div> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 700 }}>{invoice.paid}</div> }]} />; })} /></PageShell>
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
  const { reset, setWorkspaceRole, workspace } = useBuzzStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, flash] = useFlashMessage();
  return (
    <>
      <PageShell title="Settings" subtitle="Roles, permissions, validation rules, statuses, form publishing, and internal system controls." action={<div style={{ display: 'flex', gap: 8 }}><Button onClick={() => setConfirmReset(true)}><Icon d={ICONS.undo} size={14} />Reset Data</Button><Button variant="primary" onClick={() => flash('Settings saved.') }><Icon d={ICONS.check} size={14} />Save Changes</Button></div>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          ['Roles & Permissions', 'Admin sees everything. Sales handles leads and outbound. Ops handles tasks and delivery. Finance handles invoices. Support handles follow-up and notes.', 'admin · sales · ops · finance · support'],
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
        <Card style={{ padding: 18, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14, marginBottom: 16 }}>
            <SelectField label="Active Role Filter" value={workspace?.currentRole || 'admin'} onChange={(event) => setWorkspaceRole(event.target.value)} options={ROLE_OPTIONS} />
            <div style={{ alignSelf: 'end', fontSize: 12, color: 'var(--text-2)' }}>Use this to simulate what each team role sees across customers, communication, tasks, and invoices.</div>
          </div>
          <Label style={{ marginBottom: 12 }}>Team Layer</Label>
          <div style={{ display: 'grid', gap: 10 }}>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} style={{ display: 'grid', gridTemplateColumns: '180px 120px 1fr', gap: 12, alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${UI.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={member.name} size={24} /><span style={{ fontSize: 12, fontWeight: 700 }}>{member.name}</span></div>
                <Badge color="purple">{member.role}</Badge>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{member.scope}</div>
              </div>
            ))}
          </div>
        </Card>
      </PageShell>
      {confirmReset ? <Modal title="Reset Workspace Data" subtitle="This resets forms, entries, leads, customers, tasks, invoices, files, communication, and activity back to demo seed data in this browser only." onClose={() => setConfirmReset(false)} actions={<><Button onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={() => { reset(); setConfirmReset(false); flash('Workspace reset to seed data.'); }}>Reset Data</Button></>}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>The reset does not affect code or any other browser. It only clears the current local BuzzFlow workspace state.</div>
      </Modal> : null}
      <Toast message={toast} />
    </>
  );
}

export function FormBuilderPage({ id }) {
  const { forms, updateForm, setBuilderSession, setFormStatus, defaultNotificationEmail } = useBuzzStore();
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
  const [description, setDescription] = useState(savedForm?.description || '');
  const [submitLabel, setSubmitLabel] = useState(savedForm?.submitLabel || 'Submit');
  const [successMessage, setSuccessMessage] = useState(savedForm?.successMessage || 'Thanks. We received your submission and will follow up shortly.');
  const [thankYouTitle, setThankYouTitle] = useState(savedForm?.thankYouTitle || 'Submission received');
  const [thankYouBody, setThankYouBody] = useState(savedForm?.thankYouBody || 'Thanks. We received your submission and will review it shortly.');
  const [redirectUrl, setRedirectUrl] = useState(savedForm?.redirectUrl || '');
  const [publicDomain, setPublicDomain] = useState(savedForm?.publicDomain || '');
  const [notifyEmail, setNotifyEmail] = useState(savedForm?.notifyEmail || defaultNotificationEmail);
  const [ownerRotation, setOwnerRotation] = useState((savedForm?.owners || ['Alex', 'Sarah', 'Mika']).join(', '));
  const [automation, setAutomation] = useState(savedForm?.automation || {});
  const [automationRules, setAutomationRules] = useState(savedForm?.automationRules || []);
  const [integrations, setIntegrations] = useState(savedForm?.integrations || {});
  const [multiStepEnabled, setMultiStepEnabled] = useState(Boolean(savedForm?.multiStepEnabled));
  const [dragFieldId, setDragFieldId] = useState(null);
  const [autosaveState, setAutosaveState] = useState('Saved');
  const autosaveInitializedRef = useRef(false);
  const [history, setHistory] = useState([]);

  const tabs = useMemo(() => [{ id: 'design', label: 'Design', icon: ICONS.palette }, { id: 'automation', label: 'Automation', icon: ICONS.brain }, { id: 'embed', label: 'Embed', icon: ICONS.code }], []);
  const components = useMemo(() => [{ type: 'text', label: 'Single line text', icon: ICONS.text }, { type: 'textarea', label: 'Multi-line text', icon: ICONS.edit }, { type: 'email', label: 'Email', icon: ICONS.mail }, { type: 'phone', label: 'Phone', icon: ICONS.phone }, { type: 'number', label: 'Number', icon: ICONS.hash }, { type: 'dropdown', label: 'Dropdown', icon: ICONS.chevronDown }, { type: 'multiselect', label: 'Multi-select', icon: ICONS.layers }, { type: 'checkbox', label: 'Checkbox', icon: ICONS.check }, { type: 'hidden', label: 'Hidden field', icon: ICONS.eye }], []);
  const published = savedForm?.status === 'active';
  const selectedField = fields.find((field) => field.id === selectedFieldId) || null;
  const sectionLabel = fields.find((field) => field.type === 'section')?.label || 'Contact Details';
  const parsedOwners = useMemo(() => ownerRotation.split(',').map((item) => item.trim()).filter(Boolean), [ownerRotation]);
  const publicSlug = useMemo(() => slugify(publicDomain || title || savedForm?.publicSlug || savedForm?.id), [publicDomain, title, savedForm?.id, savedForm?.publicSlug]);
  const builderDirty = title !== savedForm?.name
    || primaryColor !== savedColor
    || JSON.stringify(fields) !== JSON.stringify(normalizedSavedFields)
    || submitLabel !== (savedForm?.submitLabel || 'Submit')
    || successMessage !== (savedForm?.successMessage || 'Thanks. We received your submission and will follow up shortly.')
    || thankYouTitle !== (savedForm?.thankYouTitle || 'Submission received')
    || thankYouBody !== (savedForm?.thankYouBody || 'Thanks. We received your submission and will review it shortly.')
    || redirectUrl !== (savedForm?.redirectUrl || '')
    || publicDomain !== (savedForm?.publicDomain || '')
    || description !== (savedForm?.description || '')
    || notifyEmail !== (savedForm?.notifyEmail || defaultNotificationEmail)
    || ownerRotation !== (savedForm?.owners || ['Alex', 'Sarah', 'Mika']).join(', ')
    || multiStepEnabled !== Boolean(savedForm?.multiStepEnabled)
    || JSON.stringify(automation || {}) !== JSON.stringify(savedForm?.automation || {})
    || JSON.stringify(automationRules || []) !== JSON.stringify(savedForm?.automationRules || [])
    || JSON.stringify(integrations || {}) !== JSON.stringify(savedForm?.integrations || {});

  useEffect(() => {
    setTitle(savedForm?.name || 'Contact Inquiry');
    setFields(normalizedSavedFields);
    setPrimaryColor(savedColor);
    setSelectedFieldId(normalizedSavedFields.find((field) => field.type !== 'section')?.id || normalizedSavedFields[0]?.id || null);
    setDescription(savedForm?.description || '');
    setSubmitLabel(savedForm?.submitLabel || 'Submit');
    setSuccessMessage(savedForm?.successMessage || 'Thanks. We received your submission and will follow up shortly.');
    setThankYouTitle(savedForm?.thankYouTitle || 'Submission received');
    setThankYouBody(savedForm?.thankYouBody || 'Thanks. We received your submission and will review it shortly.');
    setRedirectUrl(savedForm?.redirectUrl || '');
    setPublicDomain(savedForm?.publicDomain || '');
    setNotifyEmail(savedForm?.notifyEmail || defaultNotificationEmail);
    setOwnerRotation((savedForm?.owners || ['Alex', 'Sarah', 'Mika']).join(', '));
    setAutomation(savedForm?.automation || {});
    setAutomationRules(savedForm?.automationRules || []);
    setIntegrations(savedForm?.integrations || {});
    setMultiStepEnabled(Boolean(savedForm?.multiStepEnabled));
    setAutosaveState('Saved');
    autosaveInitializedRef.current = false;
    setHistory([]);
  }, [defaultNotificationEmail, savedForm?.id]);

  useEffect(() => {
    if (!savedForm?.id) return;
    setBuilderSession({
      formId: savedForm.id,
      title,
      fields,
      color: primaryColor,
      published,
      dirty: builderDirty,
      description,
      submitLabel,
      successMessage,
      thankYouTitle,
      thankYouBody,
      redirectUrl,
      publicDomain,
      publicSlug,
      notifyEmail,
      owners: parsedOwners,
      defaultOwner: parsedOwners[0] || 'Alex',
      automation,
      automationRules,
      integrations,
      multiStepEnabled,
    });
  }, [automation, automationRules, builderDirty, description, fields, integrations, multiStepEnabled, notifyEmail, parsedOwners, primaryColor, publicDomain, published, redirectUrl, savedForm, setBuilderSession, submitLabel, successMessage, thankYouBody, thankYouTitle, title]);

  useEffect(() => {
    if (!savedForm?.id) return;
    if (!autosaveInitializedRef.current) {
      autosaveInitializedRef.current = true;
      return;
    }
    if (!builderDirty) {
      setAutosaveState('Saved');
      return;
    }
    setAutosaveState('Saving...');
    const timer = window.setTimeout(() => {
      updateForm({
        id: savedForm.id,
        title,
        fields,
        published,
        color: primaryColor,
        automation,
        submitLabel,
        successMessage,
        thankYouTitle,
        thankYouBody,
        redirectUrl,
        publicDomain,
        publicSlug,
        description,
        notifyEmail,
        owners: parsedOwners,
        defaultOwner: parsedOwners[0] || 'Alex',
        multiStepEnabled,
        automationRules,
        integrations,
      });
      if (savedForm.status && !['active', 'draft'].includes(savedForm.status)) {
        setFormStatus(savedForm.id, savedForm.status);
      }
      setAutosaveState('Saved');
    }, 900);
    return () => window.clearTimeout(timer);
  }, [automation, automationRules, builderDirty, description, fields, integrations, multiStepEnabled, notifyEmail, parsedOwners, primaryColor, publicDomain, published, redirectUrl, savedForm?.id, savedForm?.status, submitLabel, successMessage, thankYouBody, thankYouTitle, title, updateForm, setFormStatus]);

  const rememberState = (nextFields, nextTitle = title, nextColor = primaryColor, nextSelectedId = selectedFieldId) => {
    setHistory((current) => [...current.slice(-29), { title, fields, primaryColor, selectedFieldId }]);
    setTitle(typeof nextTitle === 'string' ? nextTitle : title);
    setFields(nextFields);
    setPrimaryColor(nextColor);
    setSelectedFieldId(nextSelectedId || nextFields.find((field) => field.type !== 'section')?.id || nextFields[0]?.id || null);
  };

  const saveDraft = () => {
    if (!savedForm?.id) return;
    updateForm({ id: savedForm.id, title, fields, published, color: primaryColor, automation, submitLabel, successMessage, thankYouTitle, thankYouBody, redirectUrl, publicDomain, publicSlug, description, notifyEmail, owners: parsedOwners, defaultOwner: parsedOwners[0] || 'Alex', multiStepEnabled, automationRules, integrations });
    if (savedForm.status && !['active', 'draft'].includes(savedForm.status)) {
      setFormStatus(savedForm.id, savedForm.status);
    }
    flash(savedForm?.status === 'active' ? 'Live form updated.' : 'Draft saved.');
  };

  const changeStatus = (status) => {
    if (!savedForm?.id) return;
    if (status === 'active') {
      updateForm({ id: savedForm.id, title, fields, published: true, color: primaryColor, automation, submitLabel, successMessage, thankYouTitle, thankYouBody, redirectUrl, publicDomain, publicSlug, description, notifyEmail, owners: parsedOwners, defaultOwner: parsedOwners[0] || 'Alex', multiStepEnabled, automationRules, integrations });
      flash('Form published.');
    } else {
      updateForm({ id: savedForm.id, title, fields, published: false, color: primaryColor, automation, submitLabel, successMessage, thankYouTitle, thankYouBody, redirectUrl, publicDomain, publicSlug, description, notifyEmail, owners: parsedOwners, defaultOwner: parsedOwners[0] || 'Alex', multiStepEnabled, automationRules, integrations });
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

  const moveField = (fieldId, direction) => {
    const index = fields.findIndex((field) => field.id === fieldId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= fields.length) return;
    const nextFields = [...fields];
    const [moved] = nextFields.splice(index, 1);
    nextFields.splice(targetIndex, 0, moved);
    rememberState(nextFields, title, primaryColor, fieldId);
  };

  const handleDropField = (targetFieldId) => {
    if (!dragFieldId || dragFieldId === targetFieldId) return;
    const fromIndex = fields.findIndex((field) => field.id === dragFieldId);
    const toIndex = fields.findIndex((field) => field.id === targetFieldId);
    if (fromIndex < 0 || toIndex < 0) return;
    const nextFields = [...fields];
    const [moved] = nextFields.splice(fromIndex, 1);
    nextFields.splice(toIndex, 0, moved);
    rememberState(nextFields, title, primaryColor, dragFieldId);
    setDragFieldId(null);
    flash('Field moved.');
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
            <Badge color={autosaveState === 'Saving...' ? 'yellow' : 'green'}>{autosaveState}</Badge>
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
            {multiStepEnabled ? <Badge color="purple">Multi-step</Badge> : null}
            <button type="button" onClick={addSection} style={{ marginLeft: 'auto', fontSize: 11, color: primaryColor, background: 'transparent', border: 'none', fontWeight: 700 }}>+ Add Section</button>
          </div>

          <div style={{ padding: '18px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflow: 'auto', flex: 1 }}>
            {fields.map((field) => (
              field.type === 'section' ? (
                <button type="button" draggable key={field.id} onDragStart={() => setDragFieldId(field.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDropField(field.id)} onClick={() => setSelectedFieldId(field.id)} style={{ gridColumn: 'span 2', padding: '12px 14px', borderRadius: 9, border: `1px dashed ${selectedFieldId === field.id ? primaryColor : UI.borderStrong}`, background: selectedFieldId === field.id ? hexToRgba(primaryColor, 0.06) : UI.panelSoft, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon d={ICONS.drag} size={12} color="var(--text-3)" />
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{field.label}</div>
                  </div>
                </button>
              ) : (
                <button type="button" draggable key={field.id} onDragStart={() => setDragFieldId(field.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => handleDropField(field.id)} onClick={() => setSelectedFieldId(field.id)} style={{ gridColumn: field.half ? 'span 1' : 'span 2', padding: '10px 12px', borderRadius: 9, border: `1px solid ${selectedFieldId === field.id ? primaryColor : UI.border}`, background: selectedFieldId === field.id ? hexToRgba(primaryColor, 0.04) : UI.panel, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Icon d={ICONS.drag} size={12} color="var(--text-3)" />
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{field.label}{field.required ? <span style={{ color: primaryColor, marginLeft: 3 }}>*</span> : null}</label>
                    {field.showWhen?.fieldId ? <Badge color="cyan">Conditional</Badge> : null}
                  </div>
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
            <button type="button" onClick={() => flash('Submit button selected for configuration.')} style={{ height: 40, background: `linear-gradient(135deg, ${primaryColor}, ${hexToRgba(primaryColor, 0.72)})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', maxWidth: 180, boxShadow: `0 4px 20px ${hexToRgba(primaryColor, 0.35)}`, border: 'none', width: '100%' }}>{submitLabel || 'Submit'} →</button>
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
            <Label>Form Copy</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              <div>
                <Label style={{ marginBottom: 6 }}>Intro text</Label>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} style={{ width: '100%', minHeight: 72, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Submit button</Label>
                <input value={submitLabel} onChange={(event) => setSubmitLabel(event.target.value)} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Success state</Label>
                <textarea value={successMessage} onChange={(event) => setSuccessMessage(event.target.value)} style={{ width: '100%', minHeight: 72, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Thank-you title</Label>
                <input value={thankYouTitle} onChange={(event) => setThankYouTitle(event.target.value)} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Thank-you body</Label>
                <textarea value={thankYouBody} onChange={(event) => setThankYouBody(event.target.value)} style={{ width: '100%', minHeight: 72, padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Redirect URL</Label>
                <input value={redirectUrl} onChange={(event) => setRedirectUrl(event.target.value)} placeholder="https://example.com/thanks" style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Custom domain</Label>
                <input value={publicDomain} onChange={(event) => setPublicDomain(event.target.value)} placeholder="forms.yourbrand.com" style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
                Public slug: <span style={{ fontWeight: 700, color: 'var(--text)' }}>{publicSlug || savedForm?.id}</span>
              </div>
            </Card>
            <Label>Flow</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              <button type="button" onClick={() => setMultiStepEnabled((current) => !current)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${multiStepEnabled ? primaryColor : UI.border}`, background: multiStepEnabled ? hexToRgba(primaryColor, 0.08) : UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700, textAlign: 'left' }}>
                Multi-step forms: {multiStepEnabled ? 'On' : 'Off'}
              </button>
              <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>When enabled, each section becomes a step in preview and public embed. Use sections to control step breaks.</div>
            </Card>
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
                {selectedField.type !== 'section' ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <Label>Conditional Logic</Label>
                    <select value={selectedField.showWhen?.fieldId || ''} onChange={(event) => updateField(selectedField.id, { showWhen: event.target.value ? { fieldId: event.target.value, value: selectedField.showWhen?.value || '' } : null })} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }}>
                      <option value="">Always show</option>
                      {fields.filter((field) => !['section', 'hidden'].includes(field.type) && field.id !== selectedField.id).map((field) => <option key={field.id} value={field.id}>{field.label}</option>)}
                    </select>
                    {selectedField.showWhen?.fieldId ? <input value={selectedField.showWhen?.value || ''} onChange={(event) => updateField(selectedField.id, { showWhen: { fieldId: selectedField.showWhen.fieldId, value: event.target.value } })} placeholder="Show when value equals..." style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} /> : null}
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
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => moveField(selectedField.id, -1)} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${UI.border}`, background: UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Move Up</button>
                      <button type="button" onClick={() => moveField(selectedField.id, 1)} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${UI.border}`, background: UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Move Down</button>
                    </div>
                    <button type="button" onClick={() => removeField(selectedField.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Remove Field</button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => moveField(selectedField.id, -1)} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${UI.border}`, background: UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Move Up</button>
                      <button type="button" onClick={() => moveField(selectedField.id, 1)} style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1px solid ${UI.border}`, background: UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }}>Move Down</button>
                    </div>
                    <button type="button" onClick={() => removeField(selectedField.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Remove Section</button>
                  </>
                )}
              </Card>
            ) : (
              <Card style={{ padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Select a field in the canvas to edit its label, required state, width, placeholder, and options.</div></Card>
            )}
          </>}
          {tab === 'automation' && <>
            <Label>Submission to Lead</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              {[
                ['autoCreateLead', 'Auto-create lead'],
                ['autoAssignOwner', 'Auto-assign owner'],
                ['createFollowUpTask', 'Create follow-up task'],
                ['sendInternalEmail', 'Queue SMTP email'],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => setAutomation((current) => ({ ...current, [key]: !current?.[key] }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${automation?.[key] ? primaryColor : UI.border}`, background: automation?.[key] ? hexToRgba(primaryColor, 0.08) : UI.panel, color: 'var(--text-2)', fontSize: 12, fontWeight: 700, textAlign: 'left' }}>
                  {label}: {automation?.[key] ? 'On' : 'Off'}
                </button>
              ))}
              <div>
                <Label style={{ marginBottom: 6 }}>Notification email</Label>
                <input value={notifyEmail} onChange={(event) => setNotifyEmail(event.target.value)} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Owner rotation</Label>
                <input value={ownerRotation} onChange={(event) => setOwnerRotation(event.target.value)} style={{ width: '100%', padding: '10px 12px', background: UI.input, border: `1px solid ${UI.inputBorder}`, borderRadius: 9, color: 'var(--text)', fontSize: 12, outline: 'none' }} />
              </div>
            </Card>
            <Label>Rule Builder</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              {automationRules.map((rule, index) => (
                <div key={rule.id || index} style={{ padding: 12, borderRadius: 12, border: `1px solid ${UI.border}`, background: UI.panel }}>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <SelectField label="Field" value={rule.field} onChange={(event) => setAutomationRules((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, field: event.target.value } : item))} options={[{ value: 'budget', label: 'Budget' }, { value: 'score', label: 'Score' }, { value: 'urgency', label: 'Urgency' }, { value: 'phonePresent', label: 'Phone Present' }]} />
                      <SelectField label="Operator" value={rule.operator} onChange={(event) => setAutomationRules((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, operator: event.target.value } : item))} options={[{ value: 'gte', label: 'Greater than or equal' }, { value: 'contains', label: 'Contains' }, { value: 'equals', label: 'Equals' }, { value: 'exists', label: 'Exists' }]} />
                    </div>
                    <Field label="Value" value={rule.value || ''} onChange={(event) => setAutomationRules((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="50000" />
                    <SelectField label="Action" value={rule.action} onChange={(event) => setAutomationRules((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, action: event.target.value } : item))} options={[{ value: 'createUrgentTask', label: 'Create urgent task' }, { value: 'queueEmail', label: 'Queue email' }, { value: 'tagLeadHot', label: 'Tag lead hot' }]} />
                    <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
                      If <strong>{rule.field}</strong> {rule.operator} <strong>{rule.value || '...'}</strong> then <strong>{rule.action}</strong>.
                    </div>
                    <button type="button" onClick={() => setAutomationRules((current) => current.filter((_, itemIndex) => itemIndex !== index))} style={{ height: 38, padding: '0 10px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#DC2626', fontSize: 12, fontWeight: 700 }}>Remove Rule</button>
                  </div>
                </div>
              ))}
              <Button size="sm" onClick={() => setAutomationRules((current) => [...current, { id: `rule-${Date.now()}`, field: 'budget', operator: 'gte', value: '50000', action: 'createUrgentTask', enabled: true }])}><Icon d={ICONS.plus} size={12} />Add Rule</Button>
            </Card>
            <Label>Outbound Integrations</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              <ToggleField label="Slack webhook" checked={Boolean(integrations?.slackEnabled)} onChange={() => setIntegrations((current) => ({ ...current, slackEnabled: !current?.slackEnabled }))} hint="Queue Slack payloads when entries are submitted." />
              <Field label="Slack webhook URL" value={integrations?.slackWebhook || ''} onChange={(event) => setIntegrations((current) => ({ ...current, slackWebhook: event.target.value }))} placeholder="https://hooks.slack.com/..." />
              <ToggleField label="CRM webhook" checked={Boolean(integrations?.crmEnabled)} onChange={() => setIntegrations((current) => ({ ...current, crmEnabled: !current?.crmEnabled }))} hint="Queue CRM sync events from new leads." />
              <Field label="CRM endpoint" value={integrations?.crmWebhook || ''} onChange={(event) => setIntegrations((current) => ({ ...current, crmWebhook: event.target.value }))} placeholder="https://crm.example.com/webhook" />
              <ToggleField label="Supabase table sync" checked={Boolean(integrations?.supabaseEnabled)} onChange={() => setIntegrations((current) => ({ ...current, supabaseEnabled: !current?.supabaseEnabled }))} hint="Queue row sync events to Supabase." />
              <Field label="Supabase table" value={integrations?.supabaseTable || ''} onChange={(event) => setIntegrations((current) => ({ ...current, supabaseTable: event.target.value }))} placeholder="public.form_entries_live" />
            </Card>
            <Label>SMTP</Label>
            <Card style={{ padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Internal alerts are prepared for SMTP delivery from `ahmadlarin14@gmail.com`. Add the app password later in `.env.local` to activate live sending.</div></Card>
          </>}
          {tab === 'embed' && <>
            <Label>Public Form</Label>
            <Card style={{ padding: 14, display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Public route: <span style={{ fontWeight: 700 }}>/f/{publicSlug || savedForm?.id}</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Custom domain: <span style={{ fontWeight: 700 }}>{publicDomain || 'Not configured'}</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Redirect after submit: <span style={{ fontWeight: 700 }}>{redirectUrl || 'Stay on thank-you page'}</span></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button size="sm" href={`/f/${publicSlug || savedForm?.id}`}><Icon d={ICONS.eye} size={12} />Open Public Form</Button>
                <Button size="sm" onClick={() => { if (!published) { flash('Publish the form before copying the public link.'); return; } try { navigator.clipboard.writeText(`${window.location.origin}/f/${publicSlug || savedForm?.id}`); } catch (error) {} flash('Public form link copied.'); }}><Icon d={ICONS.copy} size={12} />Copy Public Link</Button>
              </div>
            </Card>
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
  const { communications, entries, forms, leads, logs, setFormStatus, updateForm } = useBuzzStore();
  const form = forms.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  const [editingAutomation, setEditingAutomation] = useState(false);
  const [automationDraft, setAutomationDraft] = useState(form?.automation || {});
  const [notifyEmailDraft, setNotifyEmailDraft] = useState(form?.notifyEmail || '');
  const [ownerDraft, setOwnerDraft] = useState((form?.owners || []).join(', '));
  useEffect(() => {
    if (form) {
      setAutomationDraft(form.automation || {});
      setNotifyEmailDraft(form.notifyEmail || '');
      setOwnerDraft((form.owners || []).join(', '));
    }
  }, [form]);
  if (!form) {
    return <PageShell title="Form not found" subtitle="This form is missing from the current local workspace."><EmptyState title="No form record available" detail="The URL is valid only if the record exists in the current browser workspace." /></PageShell>;
  }
  const relatedEntries = entries.filter((entry) => entry.formId === form.id);
  const relatedAutomation = communications.filter((item) => item.title?.includes(form.name) || item.detail?.includes(form.notifyEmail || ''));
  const normalizedFields = normalizeBuilderFields(form.field_schema);
  const stepAnalytics = buildStepAnalytics(relatedEntries, buildFormSteps(normalizedFields, Boolean(form.multiStepEnabled)));
  const fieldAnalytics = buildFieldAnalytics(relatedEntries, normalizedFields).sort((a, b) => b.dropoff - a.dropoff);
  const timelineItems = buildTimelineEntries({
    logs,
    communications,
    entries,
    forms,
    matchObject: (value) => String(value || '').includes(form.name) || String(value || '').includes(form.code),
    matchCommunication: (item) => item.title?.includes(form.name) || item.detail?.includes(form.name),
    matchEntry: (entry) => entry.formId === form.id,
    matchForm: (item) => item.id === form.id,
  });
  return (
    <>
      <DetailLayout
        eyebrow="Form Overview"
        title={form.name}
        subtitle={`${form.code} · ${form.status} · ${form.fields} fields · ${form.rules} rules`}
        actions={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button href={`/forms/builder/${form.id}`} variant="primary"><Icon d={ICONS.edit} size={14} />Open Builder</Button><Button href={`/f/${form.publicSlug || form.id}`}><Icon d={ICONS.eye} size={14} />Open Public Form</Button><Button onClick={() => { if (form.status !== 'active') { flash('Publish the form before copying the public link.'); return; } try { navigator.clipboard.writeText(`${window.location.origin}/f/${form.publicSlug || form.id}`); } catch (error) {} flash('Public form link copied.'); }}><Icon d={ICONS.copy} size={14} />Copy Public Link</Button><Button onClick={() => { if (form.status !== 'active') { flash('Publish the form before copying the live embed script.'); return; } try { navigator.clipboard.writeText(`<script src="https://cdn.buzzflow.io/widget.js" data-form="${form.code}" async></script>`); } catch (error) {} flash('Live embed script copied.'); }}><Icon d={ICONS.code} size={14} />Copy Embed Script</Button>{form.status !== 'active' ? <Button onClick={() => { updateForm({ id: form.id, title: form.name, fields: form.field_schema || [], published: true, automation: form.automation, notifyEmail: form.notifyEmail, owners: form.owners, defaultOwner: form.defaultOwner, multiStepEnabled: form.multiStepEnabled, description: form.description, submitLabel: form.submitLabel, successMessage: form.successMessage, thankYouTitle: form.thankYouTitle, thankYouBody: form.thankYouBody, redirectUrl: form.redirectUrl, publicDomain: form.publicDomain, publicSlug: form.publicSlug, automationRules: form.automationRules, integrations: form.integrations, color: form.color }); flash('Form published.'); }}><Icon d={ICONS.zap} size={14} />Publish</Button> : null}{form.status === 'active' ? <Button onClick={() => { setFormStatus(form.id, 'paused'); flash('Form paused.'); }}>Pause</Button> : null}{form.status !== 'draft' ? <Button variant="danger" onClick={() => { setFormStatus(form.id, 'draft'); flash('Form unpublished.'); }}>Unpublish</Button> : null}</div>}
        side={{
          main: <><StatBand items={[{ label: 'Submissions', value: String(form.submissions), note: 'live', color: 'purple' }, { label: 'Conversion', value: `${form.conversion}%`, note: 'entry to lead', color: 'cyan' }, { label: 'Rules', value: String((form.automationRules || []).filter((rule) => rule.enabled).length || form.rules), note: 'active', color: 'green' }]} /><InlineEditor editing={editingAutomation} onEditToggle={() => setEditingAutomation((current) => !current)} onSave={() => { const parsedOwners = ownerDraft.split(',').map((item) => item.trim()).filter(Boolean); updateForm({ id: form.id, title: form.name, fields: form.field_schema || [], published: form.status === 'active', automation: automationDraft, notifyEmail: notifyEmailDraft, owners: parsedOwners, defaultOwner: parsedOwners[0] || form.defaultOwner || 'Alex', multiStepEnabled: form.multiStepEnabled, description: form.description, submitLabel: form.submitLabel, successMessage: form.successMessage, thankYouTitle: form.thankYouTitle, thankYouBody: form.thankYouBody, redirectUrl: form.redirectUrl, publicDomain: form.publicDomain, automationRules: form.automationRules, integrations: form.integrations, color: form.color }); setEditingAutomation(false); flash('Automation settings updated.'); }}><Label style={{ marginBottom: 10 }}>Automation Pipeline</Label>{editingAutomation ? <div style={{ display: 'grid', gap: 10 }}><ToggleField label="Auto-create lead" checked={Boolean(automationDraft?.autoCreateLead)} onChange={() => setAutomationDraft((current) => ({ ...current, autoCreateLead: !current?.autoCreateLead }))} /><ToggleField label="Auto-assign owner" checked={Boolean(automationDraft?.autoAssignOwner)} onChange={() => setAutomationDraft((current) => ({ ...current, autoAssignOwner: !current?.autoAssignOwner }))} /><ToggleField label="Create follow-up task" checked={Boolean(automationDraft?.createFollowUpTask)} onChange={() => setAutomationDraft((current) => ({ ...current, createFollowUpTask: !current?.createFollowUpTask }))} /><ToggleField label="Queue SMTP email" checked={Boolean(automationDraft?.sendInternalEmail)} onChange={() => setAutomationDraft((current) => ({ ...current, sendInternalEmail: !current?.sendInternalEmail }))} /><Field label="Notification email" value={notifyEmailDraft} onChange={(event) => setNotifyEmailDraft(event.target.value)} /><Field label="Owner rotation" value={ownerDraft} onChange={(event) => setOwnerDraft(event.target.value)} placeholder="Alex, Sarah, Mika" /></div> : <div style={{ display: 'grid', gap: 8 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Auto-create lead: {form.automation?.autoCreateLead ? 'On' : 'Off'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Auto-assign owner: {form.automation?.autoAssignOwner ? 'On' : 'Off'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Follow-up task: {form.automation?.createFollowUpTask ? 'On' : 'Off'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>SMTP target: {form.notifyEmail || 'Not set'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Owner rotation: {(form.owners || []).join(', ') || 'Not set'}</div></div>}</InlineEditor><TableCard title="Step Analytics" headers={[{ label: 'Step', w: '1fr' }, { label: 'Completion', w: '120px' }, { label: 'Drop-off', w: '120px' }]} rows={stepAnalytics.map((step) => <Row key={step.id} columns={[{ w: '1fr', node: <PrimaryText title={step.label} sub="step completion across submissions" /> }, { w: '120px', node: <Badge color={step.completionRate >= 70 ? 'green' : step.completionRate >= 40 ? 'yellow' : 'red'}>{step.completionRate}%</Badge> }, { w: '120px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{step.dropoff}%</div> }]} />)} /><TableCard title="Field Drop-off" headers={[{ label: 'Field', w: '1fr' }, { label: 'Fill Rate', w: '110px' }, { label: 'Drop-off', w: '110px' }]} rows={fieldAnalytics.slice(0, 6).map((field) => <Row key={field.id} columns={[{ w: '1fr', node: <PrimaryText title={field.label} sub={field.required ? 'required' : 'optional'} /> }, { w: '110px', node: <Badge color={field.fillRate >= 70 ? 'green' : field.fillRate >= 40 ? 'yellow' : 'red'}>{field.fillRate}%</Badge> }, { w: '110px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{field.dropoff}%</div> }]} />)} />{relatedEntries.length ? <TableCard title="Latest Entries" headers={[{ label: 'Contact', w: '1fr' }, { label: 'State', w: '110px' }, { label: 'Result', w: '140px' }, { label: 'Lead', w: '120px' }]} rows={relatedEntries.map((entry) => { const linkedLead = leads.find((lead) => lead.entryId === entry.id); return <ClickableRow key={entry.id} href={`/entries/${entry.id}`} columns={[{ w: '1fr', node: <PrimaryText title={entry.contact} sub={`${entry.email} · ${entry.submitted}`} /> }, { w: '110px', node: <Badge color={badgeColor(entry.state)}>{entry.state}</Badge> }, { w: '140px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{entry.result}</div> }, { w: '120px', node: linkedLead ? <div onClick={(event) => event.stopPropagation()}><Button href={`/leads/${linkedLead.id}`} size="sm">Open Lead</Button></div> : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>No lead</span> }]} />; })} /> : <SmartEmptyState title="Publish a form to start collecting leads" detail="A live form starts the full chain: submission, lead qualification, communication, tasks, and activity." actionLabel="Open Builder" actionHref={`/forms/builder/${form.id}`} secondaryLabel="Open Public Form" secondaryHref={`/f/${form.id}`} /> }<TimelineList items={timelineItems} emptyTitle="No form timeline yet" emptyDetail="Publish or edit this form to start building a visible operational history." actionLabel="Open Builder" actionHref={`/forms/builder/${form.id}`} /></>,
          aside: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Publishing</Label><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><Badge color={badgeColor(form.status)}>{form.status}</Badge><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Public route: /f/{form.publicSlug || form.id}</div><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Custom domain: {form.publicDomain || 'Not configured'}</div><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Redirect: {form.redirectUrl || 'Stay on thank-you page'}</div><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>Internal endpoint: {form.endpoint}</div></div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Thank-you</Label><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{form.thankYouTitle || 'Submission received'}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.7 }}>{form.thankYouBody || 'Thanks. We received your submission and will review it shortly.'}</div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Embed</Label><pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 10, color: '#7C3AED', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8 }}>{`<script src="https://cdn.buzzflow.io/widget.js" data-form="${form.code}" async></script>`}</pre></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Integrations</Label><div style={{ display: 'grid', gap: 8 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Slack: {form.integrations?.slackEnabled ? 'Queued' : 'Off'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>CRM: {form.integrations?.crmEnabled ? 'Queued' : 'Off'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Supabase: {form.integrations?.supabaseEnabled ? (form.integrations?.supabaseTable || 'Configured') : 'Off'}</div></div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Automation Activity</Label>{relatedAutomation.length ? relatedAutomation.slice(0, 4).map((item) => <div key={item.id} style={{ padding: '10px 0', borderBottom: `1px solid ${UI.border}` }}><div style={{ fontSize: 12, fontWeight: 700 }}>{item.title}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.detail}</div></div>) : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No automation mail or follow-up events logged yet.</div>}</Card></>,
        }}
      />
      <Toast message={toast} />
    </>
  );
}

export function LeadDetailPage({ id }) {
  const router = useRouter();
  const { communications, customers, entries, leads, tasks, convertLeadToCustomer, forms, files, createTask, logCommunication, logs, uploadFile, updateLead } = useBuzzStore();
  const lead = leads.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (lead) {
      setDraft({
        source: lead.source || '',
        owner: lead.owner || 'Alex',
        status: lead.status || 'new',
        priority: lead.priority || 'medium',
        urgency: lead.urgency || 'normal',
        budget: lead.budget || '',
        expectedValue: lead.expectedValue || '',
        next: lead.next || '',
        qualificationStatus: lead.qualificationStatus || '',
        disqualificationReason: lead.disqualificationReason || '',
        nextFollowUpDate: lead.nextFollowUpDate || '',
        notes: lead.notes || '',
      });
    }
  }, [lead]);
  if (!lead) {
    return <PageShell title="Lead not found" subtitle="This lead is missing from the current local workspace."><EmptyState title="No lead record available" detail="Create the lead again or open it from the current browser session where it was created." /></PageShell>;
  }
  const customer = customers.find((item) => item.leadId === lead.id);
  const relatedEntry = entries.find((item) => item.id === lead.entryId);
  const sourceForm = forms.find((item) => item.name === lead.source);
  const relatedTasks = tasks.filter((task) => task.related?.id === lead.id || task.related?.label === lead.name);
  const relatedFiles = files.filter((file) => file.linked === `Lead ${lead.id}` || file.linked?.includes(lead.name));
  const relatedCommunications = communications.filter((item) => item.related?.id === lead.id || item.linked === `Lead ${lead.id}` || item.linked?.includes(lead.name));
  const timelineItems = buildTimelineEntries({
    logs,
    communications,
    tasks,
    entries,
    matchObject: (value) => String(value || '').includes(lead.name) || String(value || '').includes(lead.id),
    matchCommunication: (item) => item.related?.id === lead.id || item.linked === `Lead ${lead.id}` || item.linked?.includes(lead.name),
    matchTask: (task) => task.related?.id === lead.id || task.related?.label === lead.name,
    matchEntry: (entry) => entry.id === lead.entryId,
  });
  return (
    <>
      <DetailLayout
      eyebrow="Lead Record"
      title={`${lead.name} · ${lead.company}`}
      subtitle={`${lead.id} · ${lead.status} · ${lead.priority} priority · score ${lead.score}`}
      actions={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button variant="primary" onClick={() => { if (customer) { flash('Lead is already converted.'); return; } convertLeadToCustomer(lead.id); flash('Customer created from lead.'); }}><Icon d={ICONS.check} size={14} />Convert to Customer</Button><Button onClick={() => { const taskId = createTask({ title: `Follow up ${lead.name}`, owner: lead.owner, assignedBy: 'Alex', priority: lead.priority, related: { type: 'lead', id: lead.id, label: lead.name }, type: 'follow-up', notes: 'Created from lead quick action.' }); flash('Task created for lead.'); router.push(`/tasks/${taskId}`); }}><Icon d={ICONS.check} size={14} />Create Task</Button><Button onClick={() => { const id = logCommunication({ title: `Email to ${lead.name}`, linked: `Lead ${lead.id}`, detail: 'Created from lead record.', body: `Subject: Follow-up for ${lead.name}`, owner: lead.owner, type: 'email', status: 'draft', internal: false, template: 'follow-up', related: { type: 'lead', id: lead.id, label: lead.name }, threadId: lead.id }); flash('Draft email created.'); router.push(`/communication/${id}`); }}><Icon d={ICONS.mail} size={14} />Send Email</Button><Button onClick={() => { logCommunication({ title: `Follow-up for ${lead.name}`, linked: `Lead ${lead.id}`, detail: 'Added from lead record.', owner: lead.owner, type: 'note', status: 'sent', internal: true, related: { type: 'lead', id: lead.id, label: lead.name }, threadId: lead.id }); flash('New note added to lead.'); }}><Icon d={ICONS.plus} size={14} />Attach Note</Button><Button onClick={() => { uploadFile({ name: `${lead.name.toLowerCase().replace(/\s+/g, '-')}-brief.pdf`, linked: `Lead ${lead.id}` }); flash('File attached to lead.'); }}><Icon d={ICONS.link} size={14} />Attach File</Button></div>}
      side={{
        main: <><InlineEditor editing={editing} onEditToggle={() => setEditing((current) => !current)} onSave={() => { updateLead(lead.id, draft); setEditing(false); flash('Lead updated.'); }}><Label style={{ marginBottom: 12 }}>Lead Qualification</Label>{editing ? <div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><Field label="Source" value={draft.source || ''} onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value }))} /><SelectField label="Owner" value={draft.owner || 'Alex'} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} options={TEAM_MEMBERS.map((member) => ({ value: member.name, label: member.name }))} /><SelectField label="Status" value={draft.status || 'new'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} options={[{ value: 'new', label: 'New' }, { value: 'warm', label: 'Warm' }, { value: 'qualified', label: 'Qualified' }, { value: 'cold', label: 'Cold' }, { value: 'archived', label: 'Archived' }]} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><SelectField label="Priority" value={draft.priority || 'medium'} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))} options={TASK_PRIORITY_OPTIONS} /><Field label="Urgency" value={draft.urgency || ''} onChange={(event) => setDraft((current) => ({ ...current, urgency: event.target.value }))} /><Field label="Qualification" value={draft.qualificationStatus || ''} onChange={(event) => setDraft((current) => ({ ...current, qualificationStatus: event.target.value }))} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><Field label="Budget" value={draft.budget || ''} onChange={(event) => setDraft((current) => ({ ...current, budget: event.target.value }))} /><Field label="Expected Value" value={draft.expectedValue || ''} onChange={(event) => setDraft((current) => ({ ...current, expectedValue: event.target.value }))} /><Field label="Next Follow-up" value={draft.nextFollowUpDate || ''} onChange={(event) => setDraft((current) => ({ ...current, nextFollowUpDate: event.target.value }))} placeholder="2026-04-30" /></div><Field label="Next Step" value={draft.next || ''} onChange={(event) => setDraft((current) => ({ ...current, next: event.target.value }))} /><Field label="Disqualification Reason" value={draft.disqualificationReason || ''} onChange={(event) => setDraft((current) => ({ ...current, disqualificationReason: event.target.value }))} /><TextAreaField label="Notes" value={draft.notes || ''} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} rows={4} /></div> : <><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Source</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.source}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Owner</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.owner}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Urgency</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.urgency}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Budget</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.budget}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Expected Value</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.expectedValue}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Next Step</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.next}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Qualification</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.qualificationStatus}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Last Contacted</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.lastContacted}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Next Follow-up</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.nextFollowUpDate || 'Not set'}</div></div><div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Disqualification Reason</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{lead.disqualificationReason || 'None'}</div></div></div><div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{lead.notes}</div></>}</InlineEditor><TableCard title="Communication Timeline" headers={[{ label: 'Event', w: '1fr' }, { label: 'Owner', w: '100px' }, { label: 'Type', w: '120px' }]} rows={relatedCommunications.map((item) => <Row key={item.id} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.detail} /> }, { w: '100px', node: <Avatar name={item.owner} size={24} /> }, { w: '120px', node: <Badge color="cyan">{item.type}</Badge> }]} />)} /><TimelineList items={timelineItems} emptyTitle="No lead history yet" emptyDetail="Contact the lead, create a task, or attach a note to start building a visible timeline." actionLabel="Open Communication" actionHref="/communication/new" /></>,
        aside: <><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Connected Records</Label><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Entry: {relatedEntry?.id || 'None'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Customer: {customer?.id || 'Not converted'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Source form: {sourceForm?.name || lead.source}</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{lead.tags.map((tag) => <Badge key={tag} color="purple">{tag}</Badge>)}</div></div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Automation Summary</Label><div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{lead.automationSummary || `Score ${lead.score}. Priority ${lead.priority}. Routed from ${lead.source}.`}</div></Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Open Tasks</Label>{(relatedTasks.length ? relatedTasks : [{ id: 'empty', title: 'No open tasks', due: 'N/A' }]).map((task) => <div key={task.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 12, fontWeight: 700 }}>{task.title}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{task.due}</div></div>)}</Card><Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Attached Files</Label>{(relatedFiles.length ? relatedFiles : [{ id: 'file-empty', name: 'No files attached', size: '' }]).map((file) => <div key={file.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 12, fontWeight: 700 }}>{file.name}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{file.size}</div></div>)}</Card></>,
      }}
      />
      <Toast message={toast} />
    </>
  );
}

export function CustomerDetailPage({ id }) {
  const { communications, customers, entries, files, forms, invoices, logs, tasks, createInvoice, uploadFile, updateCustomer } = useBuzzStore();
  const customer = customers.find((item) => item.id === id);
  const [toast, flash] = useFlashMessage();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (customer) {
      setDraft({
        companyName: customer.companyName || customer.name || '',
        contactPerson: customer.contactPerson || customer.contact || '',
        email: customer.email || '',
        phone: customer.phone || '',
        website: customer.website || '',
        organizationNumber: customer.organizationNumber || '',
        billingAddress: customer.billingAddress || '',
        owner: customer.owner || 'Alex',
        stage: customer.stage || '',
        industry: customer.industry || '',
        companySize: customer.companySize || '1-10',
        health: customer.health || 'stable',
        healthScore: String(customer.healthScore || ''),
        tags: (customer.tags || []).join(', '),
        notes: customer.notes || '',
      });
    }
  }, [customer]);
  if (!customer) {
    return <PageShell title="Customer not found" subtitle="This customer is missing from the current local workspace."><EmptyState title="No customer record available" detail="Open the customer from the list or recreate it in this browser workspace." /></PageShell>;
  }
  const relatedInvoices = invoices.filter((invoice) => invoice.customer === customer.name || invoice.customer === customer.companyName);
  const relatedFiles = files.filter((file) => file.linked === `Customer ${customer.id}` || file.linked === `Lead ${customer.sourceLeadId}` || file.linked?.includes(customer.name));
  const relatedTasks = tasks.filter((task) => task.related?.id === customer.id || task.related?.id === customer.sourceLeadId || task.related?.label === customer.name || task.related?.label === customer.companyName);
  const relatedCommunications = communications.filter((item) => item.linked === `Customer ${customer.id}` || item.linked === `Lead ${customer.sourceLeadId}` || item.linked?.includes(customer.name));
  const relatedEntries = entries.filter((entry) => entry.formId === customer.sourceFormId || entry.contact === (customer.contactPerson || customer.contact) || entry.email === customer.email);
  const sourceForm = forms.find((form) => form.id === customer.sourceFormId);
  const teamMembers = Array.from(new Set([customer.owner, ...(customer.team || []), ...relatedTasks.map((task) => task.owner)].filter(Boolean)));
  const timelineItems = buildTimelineEntries({
    logs,
    communications,
    tasks,
    invoices,
    entries,
    matchObject: (value) => String(value || '').includes(customer.companyName || customer.name) || String(value || '').includes(customer.id),
    matchCommunication: (item) => item.linked === `Customer ${customer.id}` || item.linked === `Lead ${customer.sourceLeadId}` || item.linked?.includes(customer.name),
    matchTask: (task) => task.related?.id === customer.id || task.related?.id === customer.sourceLeadId || task.related?.label === customer.name || task.related?.label === customer.companyName,
    matchInvoice: (invoice) => invoice.customerId === customer.id || invoice.customer === customer.name || invoice.customer === customer.companyName,
    matchEntry: (entry) => entry.formId === customer.sourceFormId || entry.contact === (customer.contactPerson || customer.contact) || entry.email === customer.email,
  });
  return (
    <>
      <DetailLayout
      eyebrow="Customer Account"
      title={customer.companyName || customer.name}
      subtitle={`${customer.id} · ${customer.status} · ${customer.lifecycle}`}
      actions={<div style={{ display: 'flex', gap: 8 }}><Button variant="primary" onClick={() => { createInvoice({ customer: customer.name, amount: 'SEK 12,000' }); flash('Invoice draft created for customer.'); }}><Icon d={ICONS.hash} size={14} />Create Invoice</Button><Button onClick={() => { uploadFile({ name: `${customer.name.toLowerCase().replace(/\s+/g, '-')}-brief.pdf`, linked: `Customer ${customer.id}` }); flash('File uploaded for customer.'); }}><Icon d={ICONS.plus} size={14} />Add File</Button></div>}
      side={{
        main: <>
          <StatBand items={[{ label: 'Total Billing', value: customer.total, note: 'lifetime', color: 'green' }, { label: 'Health', value: String(customer.healthScore || 0), note: customer.health, color: customer.health === 'at risk' ? 'red' : customer.health === 'healthy' ? 'green' : 'yellow' }, { label: 'Open Tasks', value: String(relatedTasks.filter((task) => task.status !== 'done').length), note: customer.stage, color: 'purple' }]} />
          <InlineEditor editing={editing} onEditToggle={() => setEditing((current) => !current)} onSave={() => { updateCustomer(customer.id, { ...draft, name: draft.companyName, tags: String(draft.tags || '').split(',').map((item) => item.trim()).filter(Boolean), healthScore: Number(draft.healthScore) || 0 }); setEditing(false); flash('Customer updated.'); }} actions={<Badge color={customer.health === 'at risk' ? 'red' : customer.health === 'healthy' ? 'green' : 'yellow'}>{customer.health}</Badge>}>
            <Label style={{ marginBottom: 12 }}>Customer Profile</Label>
            {editing ? <div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Field label="Company Name" value={draft.companyName || ''} onChange={(event) => setDraft((current) => ({ ...current, companyName: event.target.value }))} /><Field label="Contact Person" value={draft.contactPerson || ''} onChange={(event) => setDraft((current) => ({ ...current, contactPerson: event.target.value }))} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Field label="Email" value={draft.email || ''} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /><Field label="Phone" value={draft.phone || ''} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><Field label="Website" value={draft.website || ''} onChange={(event) => setDraft((current) => ({ ...current, website: event.target.value }))} /><Field label="Org Number" value={draft.organizationNumber || ''} onChange={(event) => setDraft((current) => ({ ...current, organizationNumber: event.target.value }))} /><SelectField label="Owner" value={draft.owner || 'Alex'} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} options={TEAM_MEMBERS.map((member) => ({ value: member.name, label: member.name }))} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><Field label="Stage" value={draft.stage || ''} onChange={(event) => setDraft((current) => ({ ...current, stage: event.target.value }))} /><Field label="Industry" value={draft.industry || ''} onChange={(event) => setDraft((current) => ({ ...current, industry: event.target.value }))} /><SelectField label="Company Size" value={draft.companySize || '1-10'} onChange={(event) => setDraft((current) => ({ ...current, companySize: event.target.value }))} options={CUSTOMER_SIZE_OPTIONS} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><SelectField label="Health" value={draft.health || 'stable'} onChange={(event) => setDraft((current) => ({ ...current, health: event.target.value }))} options={CUSTOMER_HEALTH_OPTIONS} /><Field label="Health Score" value={draft.healthScore || ''} onChange={(event) => setDraft((current) => ({ ...current, healthScore: event.target.value }))} /><Field label="Tags" value={draft.tags || ''} onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))} /></div><TextAreaField label="Billing Address" value={draft.billingAddress || ''} onChange={(event) => setDraft((current) => ({ ...current, billingAddress: event.target.value }))} rows={3} /><TextAreaField label="Internal Notes" value={draft.notes || ''} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} rows={4} /></div> : <><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Contact</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.contactPerson || customer.contact}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Owner</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.owner}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Email</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.email || 'Not set'}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Phone</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.phone || 'Not set'}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Website</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.website || 'Not set'}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Org Number</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.organizationNumber || 'Not set'}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Industry</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.industry}</div></div>
              <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Company Size</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{customer.companySize}</div></div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>{customer.notes || customer.activity}</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>{(customer.tags || []).map((tag) => <Badge key={tag} color="purple">{tag}</Badge>)}</div></>}
          </InlineEditor>
          <TimelineList items={timelineItems.length ? timelineItems : [{ id: 'timeline-empty', title: customer.activity, detail: customer.lifecycle, actor: customer.owner, time: 'Now' }]} emptyTitle="No customer history yet" emptyDetail="Create an invoice, task, or internal note to start a real account timeline." actionLabel="Create Invoice" actionHref="/invoices/new" />
          <TableCard title="Communication History" headers={[{ label: 'Event', w: '1fr' }, { label: 'Status', w: '100px' }, { label: 'Owner', w: '100px' }]} rows={(relatedCommunications.length ? relatedCommunications : [{ id: 'com-empty', title: 'No communication yet', status: 'draft', owner: customer.owner, detail: 'Start with an internal note or outbound email.' }]).map((item) => <Row key={item.id} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.detail} /> }, { w: '100px', node: <Badge color={badgeColor(item.status)}>{item.status}</Badge> }, { w: '100px', node: <Avatar name={item.owner} size={24} /> }]} />)} />
          <TableCard title="Open Tasks" headers={[{ label: 'Task', w: '1fr' }, { label: 'Status', w: '110px' }, { label: 'Due', w: '120px' }]} rows={(relatedTasks.length ? relatedTasks : [{ id: 'task-empty', title: 'No linked tasks yet', status: 'done', due: 'N/A' }]).map((task) => <Row key={task.id} columns={[{ w: '1fr', node: <PrimaryText title={task.title} sub={task.type || 'task'} /> }, { w: '110px', node: <Badge color={badgeColor(task.status)}>{task.status}</Badge> }, { w: '120px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{task.due}</div> }]} />)} />
          <TableCard title="Invoices" headers={[{ label: 'Invoice', w: '1fr' }, { label: 'Status', w: '120px' }, { label: 'Due', w: '120px' }]} rows={relatedInvoices.map((invoice) => <Row key={invoice.id} columns={[{ w: '1fr', node: <PrimaryText title={invoice.id} sub={invoice.amount} /> }, { w: '120px', node: <Badge color={badgeColor(invoice.status)}>{invoice.status}</Badge> }, { w: '120px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{invoice.due}</div> }]} />)} />
          <TableCard title="Open Deals / Leads" headers={[{ label: 'Record', w: '1fr' }, { label: 'Status', w: '110px' }, { label: 'Source', w: '140px' }]} rows={[(customer.sourceLeadId ? { id: customer.sourceLeadId, title: customer.contactPerson || customer.contact, status: customer.stage, source: sourceForm?.name || customer.sourceLabel } : { id: 'lead-empty', title: 'No open linked lead', status: 'stable', source: customer.sourceLabel || 'Manual' })].map((item) => <Row key={item.id} columns={[{ w: '1fr', node: <PrimaryText title={item.title} sub={item.id} /> }, { w: '110px', node: <Badge color={badgeColor(item.status)}>{item.status}</Badge> }, { w: '140px', node: <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.source}</div> }]} />)} />
        </>,
        aside: <>
          <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Assigned Team</Label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{teamMembers.map((member) => <div key={member} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={member} size={24} /><span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 700 }}>{member}</span></div>)}</div></Card>
          <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Source</Label><div style={{ display: 'grid', gap: 8 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Source lead: {customer.sourceLeadId || 'None'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Source form: {sourceForm?.name || customer.sourceLabel || 'Manual'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Billing address: {customer.billingAddress || 'Not set'}</div></div></Card>
          <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Recent Files</Label>{(relatedFiles.length ? relatedFiles : files.slice(0, 1)).map((file) => <div key={file.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><div style={{ fontSize: 12, fontWeight: 700 }}>{file.name}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{file.size}</div></div>)}</Card>
          <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Forms Submitted</Label><div style={{ display: 'grid', gap: 8 }}>{(relatedEntries.length ? relatedEntries : [{ id: 'entry-empty', form: sourceForm?.name || customer.sourceLabel || 'Manual', submitted: 'No submissions yet' }]).map((entry) => <div key={entry.id} style={{ fontSize: 12, color: 'var(--text-2)' }}>{entry.form} · {entry.submitted}</div>)}</div></Card>
          <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Automation Status</Label><div style={{ display: 'grid', gap: 8 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Health automation: {customer.health}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Retention trigger: {customer.lastActiveDate ? `last active ${customer.lastActiveDate}` : 'not tracked'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Open automated tasks: {relatedTasks.filter((task) => String(task.assignedBy).toLowerCase() === 'system').length}</div></div></Card>
        </>,
      }}
      />
      <Toast message={toast} />
    </>
  );
}

export function PublicEmbedPage({ id, mode = 'live' }) {
  const { forms, submitEntry } = useBuzzStore();
  const form = forms.find((item) => item.id === id || item.publicSlug === id);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const fields = useMemo(() => normalizeBuilderFields(form?.field_schema), [form?.field_schema]);
  const accentColor = form?.color || BUILDER_COLORS[0];
  const steps = useMemo(() => buildFormSteps(fields, Boolean(form?.multiStepEnabled)), [fields, form?.multiStepEnabled]);
  const [values, setValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const initialValues = {};
    fields.forEach((field) => {
      if (field.type === 'section') return;
      initialValues[field.id] = field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : '';
    });
    setValues(initialValues);
    setSubmitted(false);
    setError('');
    setCurrentStep(0);
  }, [fields, form?.id]);
  useEffect(() => {
    if (!submitted || mode === 'draft') return undefined;
    const target = form?.redirectUrl || `/thanks/${form?.publicSlug || form?.id}`;
    if (!target) return undefined;
    const timer = window.setTimeout(() => {
      window.location.assign(target);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [form?.id, form?.publicSlug, form?.redirectUrl, mode, submitted]);
  if (!form) {
    return <div className="buzz-scroll buzz-fadein" style={{ flex: 1, padding: '48px 20px' }}><div style={{ maxWidth: 640, margin: '0 auto' }}><EmptyState title="Form unavailable" detail="This form is not available in the current browser workspace." /></div></div>;
  }
  const isDraftPreview = mode === 'draft';
  const canSubmit = !isDraftPreview && form.status === 'active';
  const activeStep = steps[currentStep] || steps[0];
  const visibleStepFields = (activeStep?.fields || []).filter((field) => shouldDisplayField(field, values));
  const validateVisibleRequiredFields = () => {
    const missingFields = visibleStepFields.filter((field) => {
      if (field.type === 'hidden' || !field.required) return false;
      const value = values[field.id];
      if (field.type === 'multiselect') return !Array.isArray(value) || value.length === 0;
      if (field.type === 'checkbox') return !value;
      return !String(value || '').trim();
    });
    return missingFields;
  };
  return (
    <div className="buzz-scroll buzz-fadein" style={{ flex: 1, padding: '48px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Card style={{ padding: 28, borderRadius: 22, boxShadow: UI.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg, ${accentColor}, ${hexToRgba(accentColor, 0.72)})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICONS.zap} size={18} color="#fff" /></div>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${accentColor}, #22D3EE)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BuzzFlow</span>
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>{form.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, marginBottom: 26 }}>{form.description || (isDraftPreview ? 'Draft preview. This route never creates a live submission.' : 'Public embedded form preview. Published status, validation shell, and submission endpoint are controlled internally.')}</p>
          {form.publicDomain ? <div style={{ marginTop: -14, marginBottom: 18, fontSize: 12, color: 'var(--text-3)' }}>Custom domain: {form.publicDomain}</div> : null}
          {form.multiStepEnabled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {steps.map((step, index) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 999, background: index === currentStep ? accentColor : hexToRgba(accentColor, 0.08), color: index === currentStep ? '#fff' : accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{index + 1}</div>
                  <div style={{ fontSize: 12, color: index === currentStep ? 'var(--text)' : 'var(--text-3)', fontWeight: 700 }}>{step.label}</div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="buzz-embed-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            {visibleStepFields.map((field) => {
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
            {!form.multiStepEnabled || currentStep === steps.length - 1 ? (
              <Button variant="primary" onClick={async () => {
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
              const missingFields = validateVisibleRequiredFields();
              if (missingFields.length) {
                setError(`${missingFields[0].label} is required.`);
                setSubmitted(false);
                return;
              }
              submitEntry({ formId: form.id, ...deriveEntryPayload(fields, values) });
              if (form.automation?.sendInternalEmail) {
                try {
                  const response = await fetch('/api/automation/mail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      to: form.notifyEmail,
                      subject: `New ${form.name} submission`,
                      replyTo: deriveEntryPayload(fields, values).email,
                      text: `${deriveEntryPayload(fields, values).contact} submitted ${form.name}.`,
                      html: `<h2>${form.name}</h2><p><strong>Contact:</strong> ${deriveEntryPayload(fields, values).contact}</p><p><strong>Email:</strong> ${deriveEntryPayload(fields, values).email}</p><pre>${JSON.stringify(deriveEntryPayload(fields, values).raw, null, 2)}</pre>`,
                    }),
                  });
                  const payload = await response.json();
                  setMailMessage(payload?.skipped ? 'SMTP configured later. Notification queued locally.' : 'Internal email sent.');
                } catch (mailError) {
                  setMailMessage('SMTP request failed, but the submission was saved.');
                }
              } else {
                setMailMessage('');
              }
              setSubmitted(true);
              setError('');
              const resetValues = {};
              fields.forEach((field) => {
                if (field.type === 'section') return;
                resetValues[field.id] = field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : '';
              });
              setValues(resetValues);
              }}>
                <Icon d={ICONS.check} size={14} />{form.submitLabel || 'Submit'}
              </Button>
            ) : null}
            <Badge color={badgeColor(form.status)}>{form.status}</Badge>
          </div>
          {form.multiStepEnabled ? (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button onClick={() => setCurrentStep((current) => Math.max(0, current - 1))}><Icon d={ICONS.arrowLeft} size={12} />Previous</Button>
              {currentStep < steps.length - 1 ? (
                <Button variant="primary" onClick={() => {
                  const missingFields = validateVisibleRequiredFields();
                  if (missingFields.length) {
                    setError(`${missingFields[0].label} is required.`);
                    return;
                  }
                  setError('');
                  setCurrentStep((current) => Math.min(steps.length - 1, current + 1));
                }}>Next Step</Button>
              ) : null}
            </div>
          ) : null}
          {error ? <div style={{ marginTop: 14, fontSize: 12, color: '#EF4444', fontWeight: 700 }}>{error}</div> : null}
          {submitted ? <div style={{ marginTop: 14, fontSize: 12, color: '#10B981', fontWeight: 700 }}>{isDraftPreview ? 'Draft preview submitted successfully. No production entry was created.' : (form.thankYouTitle || form.successMessage || 'Submission received')}</div> : null}
          {submitted && !isDraftPreview ? <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>{form.thankYouBody || 'Thanks. We received your submission and will review it shortly.'} Redirecting to {form.redirectUrl || `/thanks/${form.publicSlug || form.id}`}...</div> : null}
          {mailMessage ? <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{mailMessage}</div> : null}
        </Card>
      </div>
    </div>
  );
}

export function ThankYouPage({ slug }) {
  const { forms } = useBuzzStore();
  const form = forms.find((item) => item.publicSlug === slug || item.id === slug);
  return (
    <div className="buzz-scroll buzz-fadein" style={{ flex: 1, padding: '48px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Card style={{ padding: 32, borderRadius: 22, boxShadow: UI.shadow }}>
          <Badge color="green">Submission received</Badge>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 18, marginBottom: 10 }}>{form?.thankYouTitle || 'Thanks, you are all set.'}</h1>
          <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>{form?.thankYouBody || 'Your submission is in the queue. We will review it and follow up shortly.'}</div>
          <div style={{ marginTop: 18, fontSize: 12, color: 'var(--text-3)' }}>Reference: {form?.name || slug}</div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button href={`/f/${form?.publicSlug || form?.id || slug}`}><Icon d={ICONS.eye} size={12} />Open Form Again</Button>
            <Button href="/dashboard" variant="primary"><Icon d={ICONS.arrowLeft} size={12} />Back to BuzzFlow</Button>
          </div>
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
  const { createCustomer, forms, leads } = useBuzzStore();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [organizationNumber, setOrganizationNumber] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [tags, setTags] = useState('');
  const [owner, setOwner] = useState('Alex');
  const [stage, setStage] = useState('active onboarding');
  const [sourceLeadId, setSourceLeadId] = useState('');
  const [sourceFormId, setSourceFormId] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [health, setHealth] = useState('stable');
  const [healthScore, setHealthScore] = useState('60');
  const [notes, setNotes] = useState('');
  return (
    <PageShell title="New Customer" subtitle="Manual customer creation">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Company Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Northstar Studio" />
          <Field label="Contact Person" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Nora Lind" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nora@northstar.se" />
          <Field label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+46 70 118 22 14" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Website" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://northstar.se" />
          <Field label="Organization Number" value={organizationNumber} onChange={(event) => setOrganizationNumber(event.target.value)} placeholder="559188-4211" />
        </div>
        <TextAreaField label="Billing Address" value={billingAddress} onChange={(event) => setBillingAddress(event.target.value)} placeholder="Street, postal code, city" rows={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="premium, design, retainer" />
          <SelectField label="Owner / Account Manager" value={owner} onChange={(event) => setOwner(event.target.value)} options={['Alex', 'Sarah', 'Mika'].map((value) => ({ value, label: value }))} />
          <Field label="Pipeline Stage" value={stage} onChange={(event) => setStage(event.target.value)} placeholder="active onboarding" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SelectField label="Source Lead" value={sourceLeadId} onChange={(event) => setSourceLeadId(event.target.value)} options={[{ value: '', label: 'None' }, ...leads.map((lead) => ({ value: lead.id, label: `${lead.name} · ${lead.company}` }))]} />
          <SelectField label="Source Form" value={sourceFormId} onChange={(event) => setSourceFormId(event.target.value)} options={[{ value: '', label: 'None' }, ...forms.map((form) => ({ value: form.id, label: `${form.name} · ${form.code}` }))]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Industry" value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Design Studio" />
          <SelectField label="Company Size" value={companySize} onChange={(event) => setCompanySize(event.target.value)} options={CUSTOMER_SIZE_OPTIONS} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SelectField label="Customer Health" value={health} onChange={(event) => setHealth(event.target.value)} options={CUSTOMER_HEALTH_OPTIONS} />
            <Field label="Health Score" value={healthScore} onChange={(event) => setHealthScore(event.target.value)} placeholder="60" />
          </div>
        </div>
        <TextAreaField label="Internal Notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Context, risks, onboarding state, and internal handling notes." rows={5} />
      </Card>
      <SaveBar primaryLabel="Create Customer" onSave={() => {
        const sourceForm = forms.find((form) => form.id === sourceFormId);
        const id = createCustomer({
          name,
          companyName: name,
          contact,
          contactPerson: contact,
          email,
          phone,
          website,
          organizationNumber,
          billingAddress,
          tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          owner,
          stage,
          sourceLeadId,
          leadId: sourceLeadId || null,
          sourceFormId,
          sourceLabel: sourceForm?.name || 'Created manually',
          industry,
          companySize,
          health,
          healthScore: Number(healthScore) || 0,
          notes,
          team: [owner],
        });
        router.push(`/customers/${id}`);
      }} />
    </PageShell>
  );
}

export function NewTaskPage() {
  const router = useRouter();
  const { createTask, leads, customers, forms, invoices, files } = useBuzzStore();
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Alex');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [relatedType, setRelatedType] = useState('lead');
  const [relatedId, setRelatedId] = useState('');
  const [type, setType] = useState('follow-up');
  const [status, setStatus] = useState('todo');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderOffset, setReminderOffset] = useState('1h');
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringRule, setRecurringRule] = useState('weekly');
  const [watchers, setWatchers] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const relatedCollections = {
    lead: leads.map((item) => ({ value: item.id, label: `${item.name} · ${item.company}` })),
    customer: customers.map((item) => ({ value: item.id, label: `${item.name} · ${item.contact}` })),
    form: forms.map((item) => ({ value: item.id, label: `${item.name} · ${item.code}` })),
    invoice: invoices.map((item) => ({ value: item.id, label: `${item.id} · ${item.customer}` })),
    file: files.map((item) => ({ value: item.id, label: `${item.name} · ${item.type}` })),
  };
  const relatedOptions = relatedCollections[relatedType] || [];
  return (
    <PageShell title="New Task" subtitle="Create task">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Task Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Follow up proposal" />
          <SelectField label="Task Type" value={type} onChange={(event) => setType(event.target.value)} options={TASK_TYPE_OPTIONS} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <SelectField label="Owner" value={owner} onChange={(event) => setOwner(event.target.value)} options={['Alex', 'Sarah', 'Mika'].map((value) => ({ value, label: value }))} />
          <SelectField label="Priority" value={priority} onChange={(event) => setPriority(event.target.value)} options={TASK_PRIORITY_OPTIONS} />
          <SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value)} options={TASK_STATUS_OPTIONS} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <SelectField label="Related Record Type" value={relatedType} onChange={(event) => { setRelatedType(event.target.value); setRelatedId(''); }} options={[{ value: 'lead', label: 'Lead' }, { value: 'customer', label: 'Customer' }, { value: 'form', label: 'Form' }, { value: 'invoice', label: 'Invoice' }, { value: 'file', label: 'File' }]} />
          <SelectField label="Related Record" value={relatedId} onChange={(event) => setRelatedId(event.target.value)} options={[{ value: '', label: `Select ${relatedType}` }, ...relatedOptions]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Due Date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} placeholder="2026-04-25" />
            <Field label="Due Time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} placeholder="14:30" />
          </div>
        </div>
        <TextAreaField label="Notes / Instructions" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What needs to happen, constraints, expected outcome, and handoff notes." rows={5} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Watchers" value={watchers} onChange={(event) => setWatchers(event.target.value)} placeholder="Sarah, Mika" />
          <Field label="Collaborators" value={collaborators} onChange={(event) => setCollaborators(event.target.value)} placeholder="Alex, Sarah" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <ToggleField label="Reminder" checked={reminderEnabled} onChange={(event) => setReminderEnabled(event.target.checked)} hint="Send a reminder before the due time." />
            <SelectField label="Reminder Offset" value={reminderOffset} onChange={(event) => setReminderOffset(event.target.value)} options={TASK_REMINDER_OPTIONS} />
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <ToggleField label="Recurring Task" checked={recurringEnabled} onChange={(event) => setRecurringEnabled(event.target.checked)} hint="Create a repeating follow-up rhythm." />
            <SelectField label="Recurring Rule" value={recurringRule} onChange={(event) => setRecurringRule(event.target.value)} options={TASK_RECURRING_OPTIONS} />
          </div>
        </div>
      </Card>
      <SaveBar primaryLabel="Create Task" onSave={() => {
        const relatedRecord = relatedOptions.find((item) => item.value === relatedId);
        const id = createTask({
          title,
          owner,
          priority,
          due: dueDate ? `${dueDate}${dueTime ? ` ${dueTime}` : ''}` : 'Tomorrow',
          dueDate,
          dueTime,
          related: { type: relatedType, id: relatedId, label: relatedRecord?.label || `${relatedType} record` },
          type,
          status,
          notes,
          reminder: { enabled: reminderEnabled, offset: reminderOffset },
          recurring: { enabled: recurringEnabled, rule: recurringRule },
          watchers: watchers.split(',').map((item) => item.trim()).filter(Boolean),
          collaborators: collaborators.split(',').map((item) => item.trim()).filter(Boolean),
        });
        router.push(`/tasks/${id}`);
      }} />
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
  const { customers, forms, leads, logCommunication, tasks } = useBuzzStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('email');
  const [status, setStatus] = useState('draft');
  const [internal, setInternal] = useState(false);
  const [template, setTemplate] = useState('blank');
  const [scheduledFor, setScheduledFor] = useState('');
  const [relatedType, setRelatedType] = useState('lead');
  const [relatedId, setRelatedId] = useState('');
  const [attachments, setAttachments] = useState('');
  const relatedCollections = {
    lead: leads.map((item) => ({ value: item.id, label: `${item.name} · ${item.company}` })),
    customer: customers.map((item) => ({ value: item.id, label: `${item.companyName || item.name} · ${item.contactPerson || item.contact}` })),
    task: tasks.map((item) => ({ value: item.id, label: `${item.title} · ${item.owner}` })),
    form: forms.map((item) => ({ value: item.id, label: `${item.name} · ${item.code}` })),
  };
  const relatedOptions = relatedCollections[relatedType] || [];
  useEffect(() => {
    if (!template || template === 'blank') return;
    const preset = COMMUNICATION_TEMPLATES[template];
    if (!preset) return;
    setTitle((current) => current || preset.subject);
    setBody((current) => current || preset.body);
    if (template === 'internal-update') {
      setInternal(true);
      setType('note');
    } else {
      setType('email');
    }
  }, [template]);
  return (
    <PageShell title="New Communication" subtitle="Compose a message, internal note, or scheduled send">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Title / Subject" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Proposal follow-up note" />
          <SelectField label="Template" value={template} onChange={(event) => setTemplate(event.target.value)} options={COMMUNICATION_TEMPLATE_OPTIONS} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <SelectField label="Type" value={type} onChange={(event) => setType(event.target.value)} options={[{ value: 'email', label: 'Email' }, { value: 'call', label: 'Call' }, { value: 'meeting', label: 'Meeting' }, { value: 'note', label: 'Note' }, { value: 'comment', label: 'Comment' }, { value: 'follow_up', label: 'Follow-up' }]} />
          <SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value)} options={COMMUNICATION_STATUS_OPTIONS} />
          <Field label="Scheduled Send" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} placeholder="2026-04-23 09:00" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SelectField label="Related Entity" value={relatedType} onChange={(event) => { setRelatedType(event.target.value); setRelatedId(''); }} options={[{ value: 'lead', label: 'Lead' }, { value: 'customer', label: 'Customer' }, { value: 'task', label: 'Task' }, { value: 'form', label: 'Form' }]} />
          <SelectField label="Linked Record" value={relatedId} onChange={(event) => setRelatedId(event.target.value)} options={[{ value: '', label: `Select ${relatedType}` }, ...relatedOptions]} />
        </div>
        <ToggleField label="Internal Note" checked={internal} onChange={(event) => setInternal(event.target.checked)} hint="Use internal for notes/comments and external for customer-facing messages." />
        {template !== 'blank' ? <Card style={{ padding: 14, background: UI.panelSoft }}><Label style={{ marginBottom: 8 }}>Template Preview</Label><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{COMMUNICATION_TEMPLATES[template]?.subject}</div><div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{COMMUNICATION_TEMPLATES[template]?.body}</div></Card> : null}
        <Field label="Attachments" value={attachments} onChange={(event) => setAttachments(event.target.value)} placeholder="proposal.pdf, brief.docx" />
        <TextAreaField label="Message Body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write the message, thread context, or internal note here." rows={6} />
      </Card>
      <SaveBar primaryLabel="Save Communication" onSave={() => {
        const relatedRecord = relatedOptions.find((item) => item.value === relatedId);
        const id = logCommunication({
          title,
          detail: body || 'Created from communication center',
          body,
          type,
          status,
          internal,
          template,
          scheduledFor,
          related: { type: relatedType, id: relatedId, label: relatedRecord?.label || `${relatedType} record` },
          linked: relatedRecord?.label || `${relatedType} record`,
          attachments: attachments.split(',').map((item) => item.trim()).filter(Boolean),
          threadId: relatedId || `thread-${Date.now()}`,
        });
        router.push(`/communication/${id}`);
      }} />
    </PageShell>
  );
}

export function NewFilePage() {
  const router = useRouter();
  const { customers, forms, invoices, leads, tasks, uploadFile } = useBuzzStore();
  const [name, setName] = useState('');
  const [fileBlob, setFileBlob] = useState(null);
  const [relatedType, setRelatedType] = useState('lead');
  const [relatedId, setRelatedId] = useState('');
  const relatedCollections = {
    lead: leads.map((item) => ({ value: item.id, label: `Lead ${item.id}` })),
    customer: customers.map((item) => ({ value: item.id, label: `Customer ${item.id}` })),
    task: tasks.map((item) => ({ value: item.id, label: `Task ${item.id}` })),
    invoice: invoices.map((item) => ({ value: item.id, label: `Invoice ${item.id}` })),
    form: forms.map((item) => ({ value: item.id, label: `Form ${item.id}` })),
  };
  const relatedOptions = relatedCollections[relatedType] || [];
  return (
    <PageShell title="Upload File" subtitle="Upload and link a file">
      <Card style={{ padding: 18, display: 'grid', gap: 12 }}>
        <Field label="Filename" value={name} onChange={(event) => setName(event.target.value)} placeholder="northstar-proposal.pdf" />
        <div>
          <Label style={{ marginBottom: 6 }}>Real file</Label>
          <input type="file" onChange={(event) => { const selected = event.target.files?.[0] || null; setFileBlob(selected); if (selected?.name) setName(selected.name); }} />
          {fileBlob ? <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>{fileBlob.name} · {fileBlob.type || 'application/octet-stream'} · {Math.max(1, Math.round(fileBlob.size / 1024))} KB</div> : null}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SelectField label="Related Record Type" value={relatedType} onChange={(event) => { setRelatedType(event.target.value); setRelatedId(''); }} options={[{ value: 'lead', label: 'Lead' }, { value: 'customer', label: 'Customer' }, { value: 'task', label: 'Task' }, { value: 'invoice', label: 'Invoice' }, { value: 'form', label: 'Form' }]} />
          <SelectField label="Related Record" value={relatedId} onChange={(event) => setRelatedId(event.target.value)} options={[{ value: '', label: `Select ${relatedType}` }, ...relatedOptions]} />
        </div>
      </Card>
      <SaveBar primaryLabel="Upload File" onSave={async () => {
        const relatedRecord = relatedOptions.find((item) => item.value === relatedId);
        let contentUrl = '';
        if (fileBlob) {
          contentUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.readAsDataURL(fileBlob);
          });
        }
        const id = uploadFile({
          name: name || fileBlob?.name,
          linked: relatedRecord?.label || 'Lead L-1048',
          type: fileBlob?.type || 'File',
          mimeType: fileBlob?.type || 'application/octet-stream',
          sizeBytes: fileBlob?.size || 0,
          contentUrl,
        });
        router.push(`/files/${id}`);
      }} />
    </PageShell>
  );
}

export function CommunicationDetailPage({ id }) {
  const [toast, flash] = useFlashMessage();
  const { communications, retryCommunication } = useBuzzStore();
  const item = communications.find((row) => row.id === id);
  if (!item) return <PageShell title="Communication not found" subtitle="The selected communication record could not be found."><EmptyState title="Missing communication" detail="Open the record again from the communication page." /></PageShell>;
  const thread = communications.filter((row) => row.threadId === item.threadId);
  return <><PageShell title={item.title} subtitle={`${item.type} · ${item.linked}`} action={item.status === 'failed' ? <Button variant="primary" onClick={() => { retryCommunication(item.id); flash('Communication retry queued.'); }}><Icon d={ICONS.undo} size={14} />Retry</Button> : null}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
      <Card style={{ padding: 18 }}>
        <Label style={{ marginBottom: 10 }}>Conversation Thread</Label>
        <div style={{ display: 'grid', gap: 12 }}>
          {thread.map((message) => <div key={message.id} style={{ padding: 12, borderRadius: 10, background: UI.panelSoft, border: `1px solid ${UI.border}` }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{message.title}</div><Badge color={message.status === 'sent' ? 'green' : message.status === 'failed' ? 'red' : message.status === 'queued' ? 'yellow' : 'gray'}>{message.status}</Badge></div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{message.internal ? 'Internal' : 'External'} · {message.template}</div><div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.7 }}>{message.body || message.detail}</div></div>)}
        </div>
      </Card>
      <div style={{ display: 'grid', gap: 16 }}>
        <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Message Settings</Label><div style={{ display: 'grid', gap: 8 }}><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Type: {item.type}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Status: {item.status}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Scheduled: {item.scheduledFor || 'Not scheduled'}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Owner: {item.owner}</div></div></Card>
        <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Related Record</Label><div style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.related?.label || item.linked}</div><div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{item.related?.type || 'record'} · {item.related?.id || 'manual'}</div></Card>
        <Card style={{ padding: 18 }}><Label style={{ marginBottom: 10 }}>Attachments</Label><div style={{ display: 'grid', gap: 8 }}>{(item.attachments?.length ? item.attachments : ['No attachments']).map((attachment) => <div key={attachment} style={{ fontSize: 12, color: 'var(--text-2)' }}>{attachment}</div>)}</div></Card>
      </div>
    </div>
  </PageShell><Toast message={toast} /></>;
}

export function TaskDetailPage({ id }) {
  const router = useRouter();
  const { communications, logs, tasks, updateTask } = useBuzzStore();
  const task = tasks.find((row) => row.id === id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  useEffect(() => {
    if (task) {
      setDraft({
        owner: task.owner || 'Alex',
        type: task.type || 'follow-up',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate || '',
        dueTime: task.dueTime || '',
        notes: task.notes || '',
      });
    }
  }, [task]);
  if (!task) return <PageShell title="Task not found" subtitle="The selected task could not be found."><EmptyState title="Missing task" detail="Open the task again from the task list." /></PageShell>;
  const timelineItems = buildTimelineEntries({
    logs,
    communications,
    tasks,
    matchObject: (value) => String(value || '').includes(task.title) || String(value || '').includes(task.id),
    matchCommunication: (item) => item.related?.id === task.id || item.linked === `Task ${task.id}` || item.linked?.includes(task.title),
    matchTask: (row) => row.id === task.id,
  });
  return (
    <PageShell title={task.title} subtitle={`${task.id} · ${task.status} · ${task.due}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
        <InlineEditor editing={editing} onEditToggle={() => setEditing((current) => !current)} onSave={() => { updateTask(task.id, draft); setEditing(false); }}>
          <Label style={{ marginBottom: 12 }}>Execution</Label>
          {editing ? <div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><SelectField label="Owner" value={draft.owner || 'Alex'} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} options={TEAM_MEMBERS.map((member) => ({ value: member.name, label: member.name }))} /><SelectField label="Type" value={draft.type || 'follow-up'} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))} options={TASK_TYPE_OPTIONS} /><SelectField label="Priority" value={draft.priority || 'medium'} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))} options={TASK_PRIORITY_OPTIONS} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><SelectField label="Status" value={draft.status || 'todo'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} options={TASK_STATUS_OPTIONS} /><Field label="Due Date" value={draft.dueDate || ''} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} placeholder="2026-04-30" /><Field label="Due Time" value={draft.dueTime || ''} onChange={(event) => setDraft((current) => ({ ...current, dueTime: event.target.value }))} placeholder="14:30" /></div><TextAreaField label="Notes / Instructions" value={draft.notes || ''} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} rows={4} /></div> : <><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Owner</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{task.owner}</div></div>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Type</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{task.type}</div></div>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Priority</div><div style={{ marginTop: 4 }}><Badge color={badgeColor(task.priority)}>{task.priority}</Badge></div></div>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Status</div><div style={{ marginTop: 4 }}><Badge color={badgeColor(task.status)}>{task.status}</Badge></div></div>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Due Date</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{task.dueDate || 'Not set'}</div></div>
            <div><div style={{ fontSize: 12, color: 'var(--text-3)' }}>Due Time</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{task.dueTime || 'Not set'}</div></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Label style={{ marginBottom: 8 }}>Notes / Instructions</Label>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>{task.notes || 'No instructions added yet.'}</div>
          </div></>}
        </InlineEditor>
        <div style={{ display: 'grid', gap: 16 }}>
          <TimelineList items={timelineItems} emptyTitle="No task history yet" emptyDetail="Assign, comment, or complete this task to make the execution trail visible." actionLabel="Open Communication" actionHref="/communication" />
          <Card style={{ padding: 18 }}>
            <Label style={{ marginBottom: 12 }}>Linked Record</Label>
            <button type="button" onClick={() => router.push(recordPathFromTask(task))} style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{task.related?.label || task.link}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{task.related?.type || 'record'} · {task.related?.id || 'manual link'}</div>
            </button>
          </Card>
          <Card style={{ padding: 18 }}>
            <Label style={{ marginBottom: 12 }}>Coordination</Label>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Reminder: {task.reminder?.enabled ? `On · ${task.reminder.offset}` : 'Off'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Recurring: {task.recurring?.enabled ? `On · ${task.recurring.rule}` : 'Off'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Watchers: {task.watchers?.length ? task.watchers.join(', ') : 'None'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Collaborators: {task.collaborators?.length ? task.collaborators.join(', ') : 'None'}</div>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export function InvoiceDetailPage({ id }) {
  const { communications, invoices, logs, tasks, setInvoiceStatus, updateInvoice } = useBuzzStore();
  const invoice = invoices.find((row) => row.id === id);
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [partialAmount, setPartialAmount] = useState('');
  useEffect(() => {
    if (invoice) {
      setAmount(invoice.amount || '');
      setDue(invoice.due || '');
      setPartialAmount(invoice.paid === 'SEK 0' ? '' : invoice.paid || '');
    }
  }, [invoice]);
  if (!invoice) return <PageShell title="Invoice not found" subtitle="The selected invoice could not be found."><EmptyState title="Missing invoice" detail="Open the invoice again from the invoice list." /></PageShell>;
  const timelineItems = buildTimelineEntries({
    logs,
    communications,
    tasks,
    invoices,
    matchObject: (value) => String(value || '').includes(invoice.id) || String(value || '').includes(invoice.customer),
    matchCommunication: (item) => item.linked === `Invoice ${invoice.id}` || item.detail?.includes(invoice.id),
    matchTask: (task) => task.related?.id === invoice.id || task.related?.label === invoice.id,
    matchInvoice: (row) => row.id === invoice.id,
  });
  return <PageShell title={invoice.id} subtitle={`${invoice.customer} · ${invoice.status}`}><div style={{ display: 'grid', gap: 16 }}><InlineEditor editing={editing} onEditToggle={() => setEditing((current) => !current)} onSave={() => { updateInvoice(invoice.id, { amount, due }); setEditing(false); }} actions={<><Button variant="subtle" onClick={() => setInvoiceStatus(invoice.id, 'paid')}>Mark Paid</Button><Button variant="subtle" onClick={() => setInvoiceStatus(invoice.id, 'partial', partialAmount || 'SEK 5,000')}>Mark Partial</Button><Button variant="danger" onClick={() => setInvoiceStatus(invoice.id, 'failed')}>Mark Failed</Button></>}><Label style={{ marginBottom: 10 }}>Invoice Status Actions</Label>{editing ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Field label="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} /><Field label="Due Date" value={due} onChange={(event) => setDue(event.target.value)} placeholder="2026-04-30" /></div> : <><div style={{ fontSize: 13, color: 'var(--text-2)' }}>{invoice.amount} · due {invoice.due}</div><div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}><Badge color={badgeColor(invoice.status)}>{invoice.status}</Badge><Badge color="gray">Paid {invoice.paid}</Badge></div><div style={{ marginTop: 12, maxWidth: 220 }}><Field label="Partial Amount" value={partialAmount} onChange={(event) => setPartialAmount(event.target.value)} placeholder="SEK 5,000" /></div></>}</InlineEditor><TimelineList items={timelineItems} emptyTitle="No invoice history yet" emptyDetail="Invoice reminders, payment events, and finance tasks will appear here." actionLabel="Open Invoices" actionHref="/invoices" /></div></PageShell>;
}

export function FileDetailPage({ id }) {
  const { files } = useBuzzStore();
  const file = files.find((row) => row.id === id);
  if (!file) return <PageShell title="File not found" subtitle="The selected file could not be found."><EmptyState title="Missing file" detail="Open the file again from the file list." /></PageShell>;
  return <PageShell title={file.name} subtitle={`${file.type} · ${file.size}`}><Card style={{ padding: 18, display: 'grid', gap: 10 }}><div style={{ fontSize: 13, color: 'var(--text-2)' }}>Linked object: {file.linked}</div><div style={{ fontSize: 13, color: 'var(--text-2)' }}>Mime type: {file.mimeType || file.type}</div><div style={{ fontSize: 13, color: 'var(--text-2)' }}>Exact size: {file.sizeBytes || 0} bytes</div>{file.contentUrl ? <a href={file.contentUrl} download={file.name} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>Download file</a> : <div style={{ fontSize: 12, color: 'var(--text-3)' }}>No binary payload stored for this seeded file.</div>}</Card></PageShell>;
}
