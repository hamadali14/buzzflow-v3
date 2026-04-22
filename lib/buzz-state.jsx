'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  activity as initialActivity,
  communications as initialCommunications,
  customers as initialCustomers,
  entries as initialEntries,
  files as initialFiles,
  forms as initialForms,
  invoices as initialInvoices,
  leads as initialLeads,
  logs as initialLogs,
  tasks as initialTasks,
} from '@/lib/demo-data';

const STORAGE_KEY = 'buzzflow-state-v1';
const DEFAULT_NOTIFY_EMAIL = 'ahmadlarin14@gmail.com';
const DEFAULT_OWNERS = ['Alex', 'Sarah', 'Mika'];
const TASK_STATUSES = ['todo', 'in progress', 'blocked', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];
const TASK_TYPES = ['call', 'email', 'follow-up', 'meeting', 'internal'];

const BuzzStateContext = createContext(null);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `form-${Date.now()}`;
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function createInitialState() {
  return finalizeState({
    workspace: { currentRole: 'admin' },
    forms: clone(initialForms),
    entries: clone(initialEntries),
    leads: clone(initialLeads),
    customers: clone(initialCustomers),
    tasks: clone(initialTasks),
    invoices: clone(initialInvoices),
    files: clone(initialFiles),
    communications: clone(initialCommunications),
    logs: clone(initialLogs),
    activity: clone(initialActivity),
  });
}

function prepend(list, item, limit = 24) {
  return [item, ...list].slice(0, limit);
}

function buildRelativeTime() {
  return 'Just now';
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function withAudit(state, event) {
  const nextLogId = Math.max(0, ...state.logs.map((item) => Number(item.id) || 0)) + 1;
  return {
    ...state,
    logs: prepend(state.logs, {
      id: nextLogId,
      what: event.what,
      object: event.object,
      actor: event.actor || 'Alex',
      old: event.old ?? '-',
      next: event.next ?? '-',
      time: buildRelativeTime(),
    }),
  };
}

function addActivity(state, item) {
  const nextId = Math.max(0, ...state.activity.map((row) => Number(row.id) || 0)) + 1;
  return {
    ...state,
    activity: prepend(state.activity, {
      id: nextId,
      form: item.form,
      type: item.type,
      time: buildRelativeTime(),
      user: item.user,
    }),
  };
}

function addCommunication(state, item) {
  return {
    ...state,
    communications: prepend(state.communications, item),
  };
}

function moneyValue(amount) {
  if (!amount) return 'SEK 0';
  return String(amount).startsWith('SEK') ? amount : `SEK ${amount}`;
}

function defaultFormAutomation(form = {}, index = 0) {
  return {
    autoCreateLead: true,
    autoAssignOwner: true,
    createFollowUpTask: true,
    sendInternalEmail: true,
    notifyEmail: form.notifyEmail || DEFAULT_NOTIFY_EMAIL,
    owners: Array.isArray(form.owners) && form.owners.length ? form.owners : DEFAULT_OWNERS,
    defaultOwner: form.defaultOwner || DEFAULT_OWNERS[index % DEFAULT_OWNERS.length],
    scoreModel: 'balanced',
    sla: form.status === 'active' ? '5m' : 'Manual',
  };
}

function defaultFormPresentation(form = {}) {
  return {
    submitLabel: form.submitLabel || 'Submit',
    successMessage: form.successMessage || 'Thanks. We received your submission and will follow up shortly.',
    description: form.description || '',
    thankYouTitle: form.thankYouTitle || 'Submission received',
    thankYouBody: form.thankYouBody || 'Thanks. We received your submission and will review it shortly.',
    redirectUrl: form.redirectUrl || '',
    publicDomain: form.publicDomain || '',
  };
}

function defaultAutomationRules() {
  return [
    { id: 'rule-budget-high', field: 'budget', operator: 'gte', value: '50000', action: 'createUrgentTask', enabled: true },
    { id: 'rule-score-hot', field: 'score', operator: 'gte', value: '80', action: 'tagLeadHot', enabled: true },
    { id: 'rule-urgency-fast', field: 'urgency', operator: 'contains', value: 'urgent', action: 'queueEmail', enabled: true },
  ];
}

function defaultFormIntegrations(form = {}) {
  return {
    slackEnabled: Boolean(form.integrations?.slackEnabled),
    crmEnabled: Boolean(form.integrations?.crmEnabled),
    supabaseEnabled: Boolean(form.integrations?.supabaseEnabled),
    slackWebhook: form.integrations?.slackWebhook || '',
    crmWebhook: form.integrations?.crmWebhook || '',
    supabaseTable: form.integrations?.supabaseTable || '',
  };
}

function countAutomationRules(form = {}) {
  const automation = { ...defaultFormAutomation(form), ...(form.automation || {}) };
  return [
    automation.autoCreateLead,
    automation.autoAssignOwner,
    automation.createFollowUpTask,
    automation.sendInternalEmail,
  ].filter(Boolean).length;
}

function normalizeCustomer(customer = {}, index = 0) {
  const owner = customer.owner || DEFAULT_OWNERS[index % DEFAULT_OWNERS.length] || 'Alex';
  const tags = Array.isArray(customer.tags) ? customer.tags : [];
  const team = Array.isArray(customer.team) && customer.team.length ? customer.team : [owner];
  return {
    ...customer,
    name: customer.name || customer.companyName || 'New Customer',
    companyName: customer.companyName || customer.name || 'New Customer',
    contact: customer.contact || customer.contactPerson || 'Primary Contact',
    contactPerson: customer.contactPerson || customer.contact || 'Primary Contact',
    email: customer.email || '',
    phone: customer.phone || '',
    website: customer.website || '',
    organizationNumber: customer.organizationNumber || '',
    billingAddress: customer.billingAddress || '',
    tags,
    owner,
    stage: customer.stage || 'active onboarding',
    sourceLeadId: customer.sourceLeadId || customer.leadId || '',
    sourceFormId: customer.sourceFormId || '',
    sourceLabel: customer.sourceLabel || customer.lifecycle || 'Created manually',
    industry: customer.industry || 'General',
    companySize: customer.companySize || '1-10',
    health: customer.health || 'stable',
    healthScore: Number.isFinite(Number(customer.healthScore)) ? Number(customer.healthScore) : 50,
    notes: customer.notes || '',
    team,
    total: customer.total || 'SEK 0',
    invoices: customer.invoices || 'None',
    activity: customer.activity || 'Created just now',
    lifecycle: customer.lifecycle || 'Created manually',
    lastActiveDate: customer.lastActiveDate || todayIso(),
  };
}

function normalizeLead(lead = {}, index = 0) {
  const owner = lead.owner || DEFAULT_OWNERS[index % DEFAULT_OWNERS.length] || 'Alex';
  const score = Number.isFinite(Number(lead.score)) ? Number(lead.score) : 0;
  const urgency = lead.urgency || (lead.priority === 'high' ? 'high' : lead.priority === 'medium' ? 'normal' : 'low');
  return {
    ...lead,
    source: lead.source || 'Manual',
    owner,
    score,
    urgency,
    budget: lead.budget || lead.value || 'SEK 0',
    expectedValue: lead.expectedValue || lead.value || 'SEK 0',
    next: lead.next || 'Review lead',
    qualificationStatus: lead.qualificationStatus || lead.status || 'new',
    disqualificationReason: lead.disqualificationReason || '',
    lastContacted: lead.lastContacted || 'Not contacted',
    nextFollowUpDate: lead.nextFollowUpDate || '',
    tags: Array.isArray(lead.tags) ? lead.tags : [],
    notes: lead.notes || '',
  };
}

function normalizeCommunication(item = {}, index = 0) {
  const owner = item.owner || DEFAULT_OWNERS[index % DEFAULT_OWNERS.length] || 'Alex';
  const related = item.related || {
    type: 'lead',
    id: '',
    label: item.linked || 'Lead record',
  };
  return {
    ...item,
    title: item.title || 'New message',
    detail: item.detail || item.body || 'Added manually from communication center',
    body: item.body || item.detail || '',
    owner,
    type: item.type || 'note',
    status: item.status || 'draft',
    internal: typeof item.internal === 'boolean' ? item.internal : item.type === 'note' || item.type === 'comment',
    template: item.template || 'blank',
    scheduledFor: item.scheduledFor || '',
    related,
    linked: item.linked || related.label || 'Lead record',
    attachments: Array.isArray(item.attachments) ? item.attachments : [],
    threadId: item.threadId || item.id || `thread-${index}`,
  };
}

function normalizeTask(task = {}, index = 0) {
  const owner = task.owner || DEFAULT_OWNERS[index % DEFAULT_OWNERS.length] || 'Alex';
  const related = task.related || {
    type: 'lead',
    id: '',
    label: task.link || 'Lead record',
  };
  const reminder = task.reminder || { enabled: false, offset: '1h' };
  return {
    ...task,
    title: task.title || 'New Task',
    status: TASK_STATUSES.includes(task.status) ? task.status : 'todo',
    priority: TASK_PRIORITIES.includes(task.priority) ? task.priority : 'medium',
    type: TASK_TYPES.includes(task.type) ? task.type : 'follow-up',
    owner,
    assignedBy: task.assignedBy || 'Alex',
    due: task.due || 'Tomorrow',
    dueDate: task.dueDate || '',
    dueTime: task.dueTime || '',
    notes: task.notes || '',
    reminder,
    recurring: task.recurring || { enabled: false, rule: 'weekly' },
    watchers: Array.isArray(task.watchers) ? task.watchers : [],
    collaborators: Array.isArray(task.collaborators) ? task.collaborators : [],
    related,
    link: task.link || related.label || 'Lead record',
  };
}

function normalizeInvoice(invoice = {}, index = 0) {
  return {
    ...invoice,
    id: invoice.id || `INV-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`,
    customer: invoice.customer || 'New Customer',
    customerId: invoice.customerId || '',
    amount: moneyValue(invoice.amount),
    status: invoice.status || 'draft',
    due: invoice.due || new Date().toISOString().slice(0, 10),
    paid: invoice.paid || 'SEK 0',
  };
}

function formatFileSize(bytes = 0) {
  const size = Number(bytes) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

function normalizeFile(file = {}, index = 0) {
  const bytes = Number(file.sizeBytes) || 0;
  return {
    ...file,
    id: file.id || `F-${String(index + 1).padStart(3, '0')}`,
    name: file.name || file.fileName || 'untitled-file',
    type: file.type || file.mimeType || 'File',
    mimeType: file.mimeType || file.type || 'application/octet-stream',
    sizeBytes: bytes,
    size: file.size || formatFileSize(bytes),
    linked: file.linked || 'Lead L-1048',
    uploaded: file.uploaded || buildRelativeTime(),
    contentUrl: file.contentUrl || '',
  };
}

function deriveCustomerHealth(customer, state) {
  const invoices = (state.invoices || []).filter((invoice) => invoice.customerId === customer.id || invoice.customer === customer.name || invoice.customer === customer.companyName);
  const tasks = (state.tasks || []).filter((task) => task.related?.id === customer.id || task.related?.id === customer.sourceLeadId || task.related?.label === customer.name || task.related?.label === customer.companyName);
  const overdueInvoices = invoices.filter((invoice) => invoice.status === 'late').length;
  const unpaidInvoices = invoices.filter((invoice) => invoice.status !== 'paid').length;
  const blockedTasks = tasks.filter((task) => task.status === 'blocked').length;
  const openTasks = tasks.filter((task) => task.status !== 'done').length;
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length;
  let healthScore = 78;
  healthScore -= overdueInvoices * 24;
  healthScore -= blockedTasks * 16;
  healthScore -= Math.max(0, unpaidInvoices - paidInvoices) * 6;
  healthScore -= Math.max(0, openTasks - 2) * 4;
  const nextHealth = overdueInvoices || blockedTasks ? 'at risk' : paidInvoices > unpaidInvoices ? 'healthy' : 'stable';
  return {
    ...customer,
    health: nextHealth,
    healthScore: Math.max(18, Math.min(96, healthScore)),
  };
}

function applyAutomations(state) {
  let nextState = { ...state };
  const existingTaskIds = new Set((nextState.tasks || []).map((task) => task.id));
  const today = todayIso();

  const addAutoTask = (task) => {
    if (existingTaskIds.has(task.id)) return;
    existingTaskIds.add(task.id);
    nextState = { ...nextState, tasks: prepend(nextState.tasks, normalizeTask(task, nextState.tasks.length)) };
  };

  (nextState.leads || []).forEach((lead) => {
    if ((lead.priority === 'high' || Number(lead.score) >= 80) && lead.id) {
      addAutoTask({
        id: `AUTO-LEAD-${lead.id}`,
        title: `Follow up high-intent lead ${lead.name}`,
        related: { type: 'lead', id: lead.id, label: lead.name },
        link: lead.name,
        type: 'call',
        status: 'todo',
        priority: 'high',
        owner: lead.owner || 'Alex',
        assignedBy: 'System',
        due: lead.nextFollowUpDate || 'Today',
        dueDate: lead.nextFollowUpDate || today,
        notes: `Auto-created because ${lead.name} is high-intent with score ${lead.score}.`,
        watchers: [lead.owner || 'Alex'],
        collaborators: [],
      });
    }
  });

  (nextState.invoices || []).forEach((invoice) => {
    const overdue = invoice.status === 'late' || (invoice.status !== 'paid' && invoice.due && invoice.due < today);
    if (overdue) {
      addAutoTask({
        id: `AUTO-INVOICE-${invoice.id}`,
        title: `Finance follow-up ${invoice.id}`,
        related: { type: 'invoice', id: invoice.id, label: invoice.id },
        link: invoice.id,
        type: 'internal',
        status: 'todo',
        priority: 'high',
        owner: 'Noah',
        assignedBy: 'System',
        due: 'Late',
        dueDate: invoice.due,
        notes: `Auto-created because ${invoice.id} is overdue or late.`,
        watchers: ['Alex'],
        collaborators: ['Noah'],
      });
    }
  });

  (nextState.customers || []).forEach((customer) => {
    const lastActive = customer.lastActiveDate || today;
    const inactiveDays = Math.floor((new Date(`${today}T00:00:00`).getTime() - new Date(`${lastActive}T00:00:00`).getTime()) / 86400000);
    if (inactiveDays >= 14) {
      addAutoTask({
        id: `AUTO-RETENTION-${customer.id}`,
        title: `Retention check for ${customer.companyName || customer.name}`,
        related: { type: 'customer', id: customer.id, label: customer.companyName || customer.name },
        link: customer.companyName || customer.name,
        type: 'follow-up',
        status: 'todo',
        priority: customer.health === 'at risk' ? 'high' : 'medium',
        owner: customer.owner || 'Alex',
        assignedBy: 'System',
        due: 'Today',
        dueDate: today,
        notes: `Auto-created because the customer has been inactive for ${inactiveDays} days.`,
        watchers: customer.team || [customer.owner || 'Alex'],
        collaborators: [],
      });
    }
  });

  (nextState.entries || []).forEach((entry) => {
    const budget = Number(String(entry.raw?.budget || entry.raw?.Budget || '').replace(/[^\d]/g, '')) || 0;
    if ((budget >= 50000 || Number(entry.score) >= 80) && entry.id) {
      addAutoTask({
        id: `AUTO-ENTRY-${entry.id}`,
        title: `Urgent call for ${entry.contact}`,
        related: { type: 'entry', id: entry.id, label: entry.contact },
        link: entry.contact,
        type: 'call',
        status: 'todo',
        priority: 'high',
        owner: entry.owner || 'Alex',
        assignedBy: 'System',
        due: 'Today',
        dueDate: today,
        notes: `Auto-created because ${entry.form} was submitted with high budget or high score.`,
        watchers: [entry.owner || 'Alex'],
        collaborators: [],
      });
    }
  });

  return nextState;
}

function withFormDefaults(form, index = 0) {
  const automation = { ...defaultFormAutomation(form, index), ...(form.automation || {}) };
  const presentation = defaultFormPresentation(form);
  return {
    ...form,
    field_schema: Array.isArray(form.field_schema) ? form.field_schema : [],
    color: form.color || '#7C3AED',
    submitLabel: presentation.submitLabel,
    successMessage: presentation.successMessage,
    description: presentation.description,
    thankYouTitle: presentation.thankYouTitle,
    thankYouBody: presentation.thankYouBody,
    redirectUrl: presentation.redirectUrl,
    publicDomain: presentation.publicDomain,
    publicSlug: form.publicSlug || slugify(form.publicDomain || form.name || form.id || `form-${index + 1}`),
    notifyEmail: form.notifyEmail || automation.notifyEmail || DEFAULT_NOTIFY_EMAIL,
    owners: Array.isArray(form.owners) && form.owners.length ? form.owners : automation.owners,
    defaultOwner: form.defaultOwner || automation.defaultOwner,
    automationRules: Array.isArray(form.automationRules) && form.automationRules.length ? form.automationRules : defaultAutomationRules(),
    integrations: defaultFormIntegrations(form),
    automation,
    rules: form.rules || countAutomationRules({ ...form, automation }),
  };
}

function normalizeStateShape(nextState) {
  const normalized = {
    ...nextState,
    workspace: nextState.workspace || { currentRole: 'admin' },
    forms: (nextState.forms || []).map((form, index) => withFormDefaults(form, index)),
    leads: (nextState.leads || []).map((lead, index) => normalizeLead(lead, index)),
    customers: (nextState.customers || []).map((customer, index) => normalizeCustomer(customer, index)),
    tasks: (nextState.tasks || []).map((task, index) => normalizeTask(task, index)),
    invoices: (nextState.invoices || []).map((invoice, index) => normalizeInvoice(invoice, index)),
    communications: (nextState.communications || []).map((item, index) => normalizeCommunication(item, index)),
    files: (nextState.files || []).map((file, index) => normalizeFile(file, index)),
  };
  return {
    ...normalized,
    customers: normalized.customers.map((customer) => deriveCustomerHealth(customer, normalized)),
  };
}

function finalizeState(nextState) {
  return applyAutomations(normalizeStateShape(nextState));
}

function parseBudgetValue(raw = {}) {
  const candidates = [raw.budget, raw.Budget, raw.value, raw.Value];
  const match = candidates.find(Boolean);
  if (!match) return 0;
  const digits = Number(String(match).replace(/[^\d]/g, ''));
  return Number.isFinite(digits) ? digits : 0;
}

function submissionUrgency(raw = {}) {
  const candidates = [raw.urgency, raw.Urgency, raw.priority, raw.Priority];
  return String(candidates.find(Boolean) || '').toLowerCase();
}

function computeLeadScore({ email, phone, raw = {} }) {
  let score = 30;
  if (email) score += 15;
  if (phone) score += 20;
  const budget = parseBudgetValue(raw);
  if (budget >= 100000) score += 25;
  else if (budget >= 50000) score += 18;
  else if (budget >= 20000) score += 10;
  const urgency = submissionUrgency(raw);
  if (/acute|asap|today|this week|urgent/.test(urgency)) score += 20;
  else if (/normal|soon/.test(urgency)) score += 8;
  return Math.max(5, Math.min(98, score));
}

function scorePriority(score, urgency = '') {
  if (score >= 82 || /acute|urgent|today|asap/.test(urgency)) return 'high';
  if (score >= 58) return 'medium';
  return 'low';
}

function buildLeadValue(raw = {}, score = 0) {
  const budget = parseBudgetValue(raw);
  const value = budget || Math.round(score * 950);
  return moneyValue(value.toLocaleString('en-US'));
}

function evaluateRule(fieldValue, operator, expectedValue) {
  if (operator === 'gte') return Number(fieldValue || 0) >= Number(expectedValue || 0);
  if (operator === 'contains') return String(fieldValue || '').toLowerCase().includes(String(expectedValue || '').toLowerCase());
  if (operator === 'equals') return String(fieldValue || '') === String(expectedValue || '');
  if (operator === 'exists') return Array.isArray(fieldValue) ? fieldValue.length > 0 : Boolean(fieldValue);
  return false;
}

function applySubmissionAutomationRules({ form, raw = {}, score, priority, leadId, leadName, owner, state }) {
  const budget = parseBudgetValue(raw);
  const urgency = submissionUrgency(raw);
  const metrics = {
    budget,
    score,
    urgency,
    phonePresent: Boolean(raw.phone || raw.Phone || raw['Phone Number']),
  };
  let nextState = state;
  const rules = Array.isArray(form.automationRules) ? form.automationRules.filter((rule) => rule?.enabled) : [];

  rules.forEach((rule, index) => {
    if (!evaluateRule(metrics[rule.field], rule.operator, rule.value)) return;

    if (rule.action === 'createUrgentTask') {
      nextState = {
        ...nextState,
        tasks: prepend(nextState.tasks, normalizeTask({
          id: `RULE-T-${Date.now()}-${index}`,
          title: `Urgent review for ${leadName}`,
          related: { type: 'lead', id: leadId, label: leadName },
          link: leadName,
          type: 'call',
          status: 'todo',
          priority: 'high',
          owner,
          assignedBy: 'Rule engine',
          due: 'Today',
          dueDate: todayIso(),
          notes: `Triggered by automation rule: ${rule.field} ${rule.operator} ${rule.value}.`,
          watchers: [owner],
          collaborators: [],
        }, nextState.tasks.length)),
      };
      nextState = withAudit(nextState, { what: 'Rule task created', object: leadName, old: '-', next: 'todo', actor: 'Rule engine' });
    }

    if (rule.action === 'queueEmail') {
      nextState = addCommunication(nextState, normalizeCommunication({
        id: `RULE-COM-${Date.now()}-${index}`,
        title: `${form.name} automation email`,
        detail: `Queued from automation rule on ${rule.field}.`,
        body: `Automation email queued for ${leadName}. Priority ${priority}.`,
        owner,
        type: 'email',
        status: 'queued',
        internal: false,
        template: 'follow-up',
        scheduledFor: '',
        related: { type: 'lead', id: leadId, label: leadName },
        linked: `Lead ${leadId}`,
        threadId: leadId,
      }, nextState.communications.length));
      nextState = withAudit(nextState, { what: 'Rule email queued', object: leadName, old: '-', next: rule.field, actor: 'Rule engine' });
    }

    if (rule.action === 'tagLeadHot') {
      nextState = {
        ...nextState,
        leads: nextState.leads.map((lead) => (
          lead.id === leadId
            ? {
                ...lead,
                tags: Array.from(new Set([...(lead.tags || []), 'hot'])),
                qualificationStatus: lead.qualificationStatus === 'new' ? 'qualified' : lead.qualificationStatus,
              }
            : lead
        )),
      };
      nextState = withAudit(nextState, { what: 'Lead tagged hot', object: leadName, old: '-', next: 'hot', actor: 'Rule engine' });
    }
  });

  if (form.integrations?.slackEnabled && form.integrations?.slackWebhook) {
    nextState = addCommunication(nextState, normalizeCommunication({
      id: `INT-SLACK-${Date.now()}`,
      title: `${form.name} Slack webhook queued`,
      detail: `Outbound event prepared for Slack webhook.`,
      body: `Lead ${leadName} queued for Slack webhook delivery.`,
      owner,
      type: 'note',
      status: 'queued',
      internal: true,
      template: 'internal-update',
      related: { type: 'lead', id: leadId, label: leadName },
      linked: `Lead ${leadId}`,
      threadId: leadId,
    }, nextState.communications.length));
  }

  if (form.integrations?.crmEnabled && form.integrations?.crmWebhook) {
    nextState = addCommunication(nextState, normalizeCommunication({
      id: `INT-CRM-${Date.now()}`,
      title: `${form.name} CRM sync queued`,
      detail: `Outbound event prepared for CRM webhook.`,
      body: `Lead ${leadName} queued for CRM sync.`,
      owner,
      type: 'note',
      status: 'queued',
      internal: true,
      template: 'internal-update',
      related: { type: 'lead', id: leadId, label: leadName },
      linked: `Lead ${leadId}`,
      threadId: leadId,
    }, nextState.communications.length));
  }

  if (form.integrations?.supabaseEnabled && form.integrations?.supabaseTable) {
    nextState = addCommunication(nextState, normalizeCommunication({
      id: `INT-SUPABASE-${Date.now()}`,
      title: `${form.name} Supabase sync queued`,
      detail: `Outbound row prepared for ${form.integrations.supabaseTable}.`,
      body: `Lead ${leadName} queued for Supabase table sync.`,
      owner,
      type: 'note',
      status: 'queued',
      internal: true,
      template: 'internal-update',
      related: { type: 'lead', id: leadId, label: leadName },
      linked: `Lead ${leadId}`,
      threadId: leadId,
    }, nextState.communications.length));
  }

  return nextState;
}

function pickOwner(leads = [], owners = DEFAULT_OWNERS, fallback = 'Alex') {
  const safeOwners = Array.isArray(owners) && owners.length ? owners : [fallback];
  return safeOwners[leads.length % safeOwners.length] || fallback;
}

function buildEntryQuality({ duplicate, score, phone, urgency }) {
  if (duplicate) return 'Duplicate email';
  if (/acute|urgent|today|asap/.test(urgency)) return 'Urgent';
  if (!phone) return 'Missing phone';
  if (score >= 82) return 'High score';
  return 'Needs review';
}

export function BuzzProvider({ children }) {
  const [state, setState] = useState(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [builderSession, setBuilderSessionState] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(finalizeState({ ...createInitialState(), ...JSON.parse(raw) }));
      }
    } catch (error) {
      console.error('Failed to restore BuzzFlow state', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist BuzzFlow state', error);
    }
  }, [hydrated, state]);

  const setBuilderSession = useCallback((patch) => {
    setBuilderSessionState((current) => {
      const next = { ...(current || {}), ...patch };
      return sameJson(current, next) ? current : next;
    });
  }, []);

  const clearBuilderSession = useCallback(() => {
    setBuilderSessionState(null);
  }, []);

  const value = useMemo(() => {
    const reset = () => setState(createInitialState());

    const createForm = ({ name }) => {
      const id = `form-${Date.now()}`;
      const code = `BF-${String(state.forms.length + 1).padStart(3, '0')}`;
      setState((current) => {
        const nextForm = {
          id,
          code,
          name: name || 'Untitled Form',
          status: 'draft',
          submissions: 0,
          conversion: 0,
          updated: buildRelativeTime(),
          fields: 0,
          field_schema: [],
          color: '#7C3AED',
          rules: 0,
          endpoint: `/embed/${id}`,
          notifyEmail: DEFAULT_NOTIFY_EMAIL,
          owners: DEFAULT_OWNERS,
          defaultOwner: DEFAULT_OWNERS[state.forms.length % DEFAULT_OWNERS.length],
          submitLabel: 'Submit',
          successMessage: 'Thanks. We received your submission and will follow up shortly.',
          thankYouTitle: 'Submission received',
          thankYouBody: 'Thanks. We received your submission and will review it shortly.',
          redirectUrl: '',
          publicDomain: '',
          description: '',
          automationRules: defaultAutomationRules(),
          integrations: defaultFormIntegrations(),
          publicSlug: slugify(name || id),
          automation: defaultFormAutomation({}, state.forms.length),
        };
        let nextState = { ...current, forms: prepend(current.forms, withFormDefaults(nextForm, current.forms.length), 100) };
        nextState = withAudit(nextState, { what: 'Form created', object: nextForm.name, old: '-', next: 'draft', actor: 'Alex' });
        return finalizeState(nextState);
      });
      return id;
    };

    const createLead = ({ name, company, source = 'Manual', entryId = null }) => {
      const id = `L-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const nextLead = normalizeLead({
          id,
          entryId,
          name: name || 'New Lead',
          company: company || 'New Company',
          email: '',
          phone: '',
          source,
          status: 'new',
          priority: 'medium',
          score: 50,
          value: 'SEK 0',
          owner: 'Alex',
          next: 'Initial contact',
          time: buildRelativeTime(),
          tags: ['manual'],
          stage: 'incoming',
          notes: 'Created manually from the CRM workspace.',
          budget: 'SEK 0',
          expectedValue: 'SEK 0',
          qualificationStatus: 'new',
          disqualificationReason: '',
          lastContacted: 'Not contacted',
          nextFollowUpDate: '',
        }, current.leads.length);
        let nextState = { ...current, leads: prepend(current.leads, nextLead) };
        nextState = withAudit(nextState, { what: 'Lead created', object: nextLead.name, next: nextLead.status, actor: 'Alex' });
        return finalizeState(nextState);
      });
      return id;
    };

    const updateEntry = (id, patch, auditWhat) => {
      setState((current) => {
        const existing = current.entries.find((entry) => entry.id === id);
        if (!existing) return current;
        let nextState = {
          ...current,
          entries: current.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
        };
        if (auditWhat) {
          nextState = withAudit(nextState, {
            what: auditWhat,
            object: existing.contact,
            old: existing.state,
            next: patch.state || existing.state,
            actor: 'Alex',
          });
        }
        return finalizeState(nextState);
      });
    };

    const convertEntryToLead = (entryId) => {
      const leadId = `L-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const entry = current.entries.find((item) => item.id === entryId);
        if (!entry) return current;
        const existingLead = current.leads.find((item) => item.entryId === entryId);
        let nextState = current;
        if (!existingLead) {
          const newLead = normalizeLead({
            id: leadId,
            entryId: entry.id,
            name: entry.contact,
            company: entry.email.split('@')[1]?.split('.')[0]?.replace(/^\w/, (char) => char.toUpperCase()) || 'New Company',
            email: entry.email,
            phone: entry.phone,
            source: entry.form,
            status: 'new',
            priority: entry.phone ? 'high' : 'medium',
            score: entry.phone ? 78 : 58,
            value: 'SEK 18,000',
            owner: 'Alex',
            next: 'Call requested',
            time: buildRelativeTime(),
            tags: ['converted entry'],
            stage: 'incoming',
            notes: 'Created automatically from a form entry.',
            budget: 'SEK 18,000',
            expectedValue: 'SEK 18,000',
            qualificationStatus: 'new',
            disqualificationReason: '',
            lastContacted: 'Not contacted',
            nextFollowUpDate: '',
          }, nextState.leads.length);
          nextState = { ...nextState, leads: prepend(nextState.leads, newLead) };
        }
        nextState = {
          ...nextState,
          entries: nextState.entries.map((item) => (
            item.id === entryId ? { ...item, state: 'handled', result: 'Lead created' } : item
          )),
        };
        nextState = withAudit(nextState, {
          what: 'Lead created',
          object: entry.contact,
          old: '-',
          next: 'new',
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
      return leadId;
    };

    const mergeEntry = (entryId) => {
      updateEntry(entryId, { state: 'handled', result: 'Merged with existing record' }, 'Entry merged');
    };

    const markEntrySpam = (entryId) => {
      updateEntry(entryId, { state: 'spam', result: 'Marked as spam' }, 'Entry marked spam');
    };

    const createCustomer = ({
      name,
      companyName,
      contact,
      contactPerson,
      email = '',
      phone = '',
      website = '',
      organizationNumber = '',
      billingAddress = '',
      tags = [],
      owner = 'Alex',
      stage = 'active onboarding',
      leadId = null,
      sourceLeadId = null,
      sourceFormId = '',
      sourceLabel = 'Created manually',
      industry = 'General',
      companySize = '1-10',
      health = 'stable',
      healthScore = 60,
      notes = '',
      team = [],
    }) => {
      const id = `C-${Date.now().toString().slice(-5)}`;
      setState((current) => {
        const nextCustomer = normalizeCustomer({
          id,
          leadId: leadId || sourceLeadId,
          sourceLeadId: sourceLeadId || leadId,
          sourceFormId,
          sourceLabel,
          name: name || companyName || 'New Customer',
          companyName: companyName || name || 'New Customer',
          contact: contact || contactPerson || 'Primary Contact',
          contactPerson: contactPerson || contact || 'Primary Contact',
          email,
          phone,
          website,
          organizationNumber,
          billingAddress,
          tags,
          owner,
          stage,
          industry,
          companySize,
          health,
          healthScore,
          notes,
          team: team.length ? team : [owner],
          status: 'active',
          total: 'SEK 0',
          invoices: 'None',
          activity: 'Created just now',
          lifecycle: 'Created manually',
        }, current.customers.length);
        let nextState = { ...current, customers: prepend(current.customers, nextCustomer) };
        const onboardingTask = normalizeTask({
          id: `T-${Date.now().toString().slice(-6)}`,
          title: `Onboard ${nextCustomer.companyName}`,
          related: { type: 'customer', id, label: nextCustomer.companyName },
          link: nextCustomer.companyName,
          type: 'follow-up',
          status: 'todo',
          priority: nextCustomer.health === 'at risk' ? 'high' : 'medium',
          owner,
          assignedBy: 'Alex',
          due: 'Tomorrow',
          notes: `Kick off onboarding for ${nextCustomer.contactPerson || nextCustomer.companyName}.`,
          watchers: team.length ? team : [owner],
          collaborators: team.length ? team : [owner],
        }, current.tasks.length);
        nextState = { ...nextState, tasks: prepend(nextState.tasks, onboardingTask) };
        nextState = addCommunication(nextState, normalizeCommunication({
          id: `COM-${Date.now()}`,
          title: `Customer created: ${nextCustomer.companyName}`,
          detail: `Customer workspace opened with owner ${owner}.`,
          body: notes || `Customer workspace opened with owner ${owner}.`,
          owner,
          type: 'note',
          status: 'sent',
          internal: true,
          template: 'internal-update',
          related: { type: 'customer', id, label: nextCustomer.companyName },
          linked: `Customer ${id}`,
          threadId: id,
        }, current.communications.length));
        nextState = addActivity(nextState, { form: nextCustomer.companyName, type: 'customer', user: owner });
        nextState = withAudit(nextState, { what: 'Customer created', object: nextCustomer.name, old: '-', next: nextCustomer.status, actor: 'Alex' });
        return finalizeState(nextState);
      });
      return id;
    };

    const convertLeadToCustomer = (leadId) => {
      const customerId = `C-${Date.now().toString().slice(-5)}`;
      setState((current) => {
        const lead = current.leads.find((item) => item.id === leadId);
        if (!lead) return current;
        const existingCustomer = current.customers.find((item) => item.leadId === leadId);
        if (existingCustomer) return current;
        let nextState = {
          ...current,
          customers: prepend(current.customers, normalizeCustomer({
            id: customerId,
            leadId,
            sourceLeadId: leadId,
            sourceLabel: `Converted from ${lead.source}`,
            name: lead.company,
            companyName: lead.company,
            contact: lead.name,
            contactPerson: lead.name,
            email: lead.email,
            phone: lead.phone,
            website: '',
            organizationNumber: '',
            billingAddress: '',
            tags: lead.tags || [],
            owner: lead.owner,
            stage: 'customer onboarding',
            sourceFormId: current.forms.find((form) => form.name === lead.source)?.id || '',
            industry: 'General',
            companySize: '11-50',
            health: 'healthy',
            healthScore: Math.min(100, lead.score || 70),
            notes: lead.notes || 'Converted from lead.',
            team: [lead.owner],
            status: 'active',
            total: lead.value,
            invoices: 'None',
            activity: 'Converted from lead just now',
            lifecycle: `Lead converted ${new Date().toISOString().slice(0, 10)}`,
          }, current.customers.length)),
          leads: current.leads.map((item) => (
            item.id === leadId ? { ...item, status: 'qualified', stage: 'won', next: 'Customer onboarding', time: buildRelativeTime() } : item
          )),
        };
        nextState = {
          ...nextState,
          tasks: prepend(nextState.tasks, normalizeTask({
            id: `T-${Date.now().toString().slice(-6)}`,
            title: `Welcome ${lead.company}`,
            related: { type: 'customer', id: customerId, label: lead.company },
            link: lead.company,
            type: 'meeting',
            status: 'todo',
            priority: lead.priority === 'high' ? 'high' : 'medium',
            owner: lead.owner,
            assignedBy: 'Alex',
            due: 'Tomorrow',
            notes: `Run customer onboarding after lead conversion from ${lead.id}.`,
            watchers: [lead.owner],
            collaborators: [lead.owner],
          }, nextState.tasks.length)),
        };
        nextState = addCommunication(nextState, normalizeCommunication({
          id: `COM-${Date.now()}`,
          title: `Lead converted: ${lead.name}`,
          detail: `${lead.company} moved into customer onboarding.`,
          body: `${lead.company} moved into customer onboarding.`,
          owner: lead.owner,
          type: 'note',
          status: 'sent',
          internal: true,
          template: 'internal-update',
          related: { type: 'customer', id: customerId, label: lead.company },
          linked: `Customer ${customerId}`,
          threadId: customerId,
        }, nextState.communications.length));
        nextState = addActivity(nextState, { form: lead.company, type: 'customer', user: lead.owner });
        nextState = withAudit(nextState, { what: 'Lead converted', object: lead.name, old: lead.status, next: 'customer', actor: 'Alex' });
        return finalizeState(nextState);
      });
      return customerId;
    };

    const createTask = ({
      title,
      owner = 'Alex',
      assignedBy = 'Alex',
      priority = 'medium',
      due = 'Tomorrow',
      dueDate = '',
      dueTime = '',
      related = { type: 'lead', id: '', label: 'Lead L-1048' },
      type = 'follow-up',
      status = 'todo',
      notes = '',
      reminder = { enabled: false, offset: '1h' },
      recurring = { enabled: false, rule: 'weekly' },
      watchers = [],
      collaborators = [],
    }) => {
      const id = `T-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const dueLabel = dueDate ? `${dueDate}${dueTime ? ` ${dueTime}` : ''}` : due;
        const nextTask = normalizeTask({
          id,
          title: title || 'New Task',
          related,
          link: related?.label || 'Lead L-1048',
          type,
          status,
          priority,
          owner,
          assignedBy,
          due: dueLabel,
          dueDate,
          dueTime,
          notes,
          reminder,
          recurring,
          watchers,
          collaborators,
        }, current.tasks.length);
        let nextState = { ...current, tasks: prepend(current.tasks, nextTask) };
        nextState = withAudit(nextState, { what: 'Task created', object: nextTask.title, old: '-', next: nextTask.status, actor: owner });
        return finalizeState(nextState);
      });
      return id;
    };

    const createInvoice = ({ customer, amount, due = '2026-04-30' }) => {
      const id = `INV-${new Date().getFullYear()}-${String(state.invoices.length + 15).padStart(3, '0')}`;
      setState((current) => {
        const customerRecord = current.customers.find((item) => item.name === customer || item.companyName === customer);
        const numericAmount = Number(String(amount || 0).replace(/[^\d.]/g, '')) || 0;
        const today = new Date().toISOString().slice(0, 10);
        const daysUntilDue = due ? Math.ceil((new Date(`${due}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000) : 30;
        const nextInvoice = normalizeInvoice({
          id,
          customer: customer || 'New Customer',
          customerId: customerRecord?.id || '',
          amount: moneyValue(amount),
          status: 'draft',
          due,
          paid: 'SEK 0',
        }, current.invoices.length);
        let nextState = { ...current, invoices: prepend(current.invoices, nextInvoice) };
        if (customerRecord) {
          nextState = {
            ...nextState,
            customers: nextState.customers.map((item) => (
              item.id === customerRecord.id
                ? {
                    ...item,
                    total: moneyValue(numericAmount + Number(String(item.total || 0).replace(/[^\d.]/g, ''))),
                    invoices: nextInvoice.id,
                    activity: `Invoice ${nextInvoice.id} created ${buildRelativeTime().toLowerCase()}`,
                  }
                : item
            )),
          };
        }
        if (numericAmount >= 25000 || due <= new Date().toISOString().slice(0, 10)) {
          nextState = {
            ...nextState,
            tasks: prepend(nextState.tasks, normalizeTask({
              id: `T-${Date.now().toString().slice(-6)}`,
              title: due <= today ? `Collect payment for ${nextInvoice.id}` : `Review invoice ${nextInvoice.id}`,
              related: { type: 'invoice', id: nextInvoice.id, label: nextInvoice.id },
              link: nextInvoice.id,
              type: 'internal',
              status: 'todo',
              priority: numericAmount >= 50000 ? 'high' : 'medium',
              owner: customerRecord?.owner || 'Alex',
              assignedBy: 'Alex',
              due: due <= new Date().toISOString().slice(0, 10) ? 'Late' : due,
              dueDate: due,
              notes: `Finance follow-up for ${nextInvoice.customer} on invoice ${nextInvoice.id}.`,
              watchers: customerRecord?.team || [customerRecord?.owner || 'Alex'],
              collaborators: customerRecord?.team || [customerRecord?.owner || 'Alex'],
            }, nextState.tasks.length)),
          };
        }
        if (daysUntilDue <= 3) {
          nextState = addCommunication(nextState, normalizeCommunication({
            id: `COM-${Date.now()}-reminder`,
            title: `Payment reminder queued for ${nextInvoice.id}`,
            detail: `Reminder scheduled ${daysUntilDue <= 0 ? 'immediately' : `${daysUntilDue} day(s) before due date`}.`,
            body: `Queued payment reminder for ${nextInvoice.customer} regarding ${nextInvoice.id}.`,
            owner: customerRecord?.owner || 'Alex',
            type: 'email',
            status: 'queued',
            internal: false,
            template: 'follow-up',
            scheduledFor: due,
            related: customerRecord ? { type: 'customer', id: customerRecord.id, label: customerRecord.companyName } : { type: 'invoice', id: nextInvoice.id, label: nextInvoice.id },
            linked: customerRecord ? `Customer ${customerRecord.id}` : `Invoice ${nextInvoice.id}`,
            threadId: customerRecord?.id || nextInvoice.id,
          }, nextState.communications.length));
          nextState = withAudit(nextState, { what: 'Payment reminder queued', object: nextInvoice.id, old: '-', next: due, actor: customerRecord?.owner || 'Alex' });
        }
        nextState = addCommunication(nextState, normalizeCommunication({
          id: `COM-${Date.now()}`,
          title: `Invoice created: ${nextInvoice.id}`,
          detail: `Draft invoice prepared for ${nextInvoice.customer}.`,
          body: `Draft invoice prepared for ${nextInvoice.customer} with due date ${nextInvoice.due}.`,
          owner: customerRecord?.owner || 'Alex',
          type: 'note',
          status: 'queued',
          internal: true,
          template: 'internal-update',
          scheduledFor: nextInvoice.due,
          related: customerRecord ? { type: 'customer', id: customerRecord.id, label: customerRecord.companyName } : { type: 'invoice', id: nextInvoice.id, label: nextInvoice.id },
          linked: customerRecord ? `Customer ${customerRecord.id}` : `Invoice ${nextInvoice.id}`,
          threadId: customerRecord?.id || nextInvoice.id,
        }, nextState.communications.length));
        nextState = addActivity(nextState, { form: nextInvoice.customer, type: 'invoice', user: customerRecord?.owner || 'Alex' });
        nextState = withAudit(nextState, { what: 'Invoice created', object: nextInvoice.id, old: '-', next: nextInvoice.status, actor: 'Alex' });
        return finalizeState(nextState);
      });
      return id;
    };

    const uploadFile = ({ name, linked = 'Lead L-1048', type = 'File', size = '', sizeBytes = 0, mimeType = '', contentUrl = '' }) => {
      const id = `F-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const nextFile = normalizeFile({
          id,
          name: name || 'new-file.pdf',
          type,
          size,
          sizeBytes,
          mimeType,
          contentUrl,
          linked,
          uploaded: buildRelativeTime(),
        }, current.files.length);
        let nextState = { ...current, files: prepend(current.files, nextFile) };
        nextState = withAudit(nextState, { what: 'File uploaded', object: nextFile.name, old: '-', next: linked, actor: 'Alex' });
        return finalizeState(nextState);
      });
      return id;
    };

    const logCommunication = ({
      title,
      linked = 'Lead L-1048',
      detail = 'Added manually from communication center',
      body = '',
      owner = 'Alex',
      type = 'note',
      status = 'draft',
      internal = true,
      template = 'blank',
      scheduledFor = '',
      related = { type: 'lead', id: '', label: linked },
      attachments = [],
      threadId = '',
    }) => {
      const id = `COM-${Date.now()}`;
      setState((current) => {
        const nextItem = normalizeCommunication({
          id,
          title: title || 'New internal note',
          type,
          linked,
          owner,
          detail,
          body: body || detail,
          status,
          internal,
          template,
          scheduledFor,
          related,
          attachments,
          threadId: threadId || related?.id || id,
        }, current.communications.length);
        let nextState = addCommunication(current, nextItem);
        if (!internal && related?.type === 'lead' && related?.id) {
          nextState = {
            ...nextState,
            leads: nextState.leads.map((lead) => (
              lead.id === related.id
                ? {
                    ...lead,
                    lastContacted: scheduledFor || buildRelativeTime(),
                    nextFollowUpDate: lead.nextFollowUpDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                  }
                : lead
            )),
          };
        }
        nextState = withAudit(nextState, { what: 'Communication logged', object: title || 'New internal note', old: '-', next: type, actor: owner });
        nextState = addActivity(nextState, { form: nextItem.related?.label || nextItem.linked, type: internal ? 'note' : 'email', user: owner });
        return finalizeState(nextState);
      });
      return id;
    };

    const updateLead = (id, patch) => {
      setState((current) => {
        const existing = current.leads.find((item) => item.id === id);
        if (!existing) return current;
        let nextState = {
          ...current,
          leads: current.leads.map((item) => (item.id === id ? normalizeLead({ ...item, ...patch }, 0) : item)),
        };
        nextState = withAudit(nextState, {
          what: 'Lead updated',
          object: existing.name,
          old: existing.status,
          next: patch.status || existing.status,
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const updateCustomer = (id, patch) => {
      setState((current) => {
        const existing = current.customers.find((item) => item.id === id);
        if (!existing) return current;
        let nextState = {
          ...current,
          customers: current.customers.map((item) => (
            item.id === id
              ? normalizeCustomer({ ...item, ...patch, activity: 'Updated just now', lastActiveDate: patch.lastActiveDate || todayIso() }, 0)
              : item
          )),
        };
        nextState = withAudit(nextState, {
          what: 'Customer updated',
          object: existing.companyName || existing.name,
          old: existing.stage,
          next: patch.stage || existing.stage,
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const updateTask = (id, patch) => {
      setState((current) => {
        const existing = current.tasks.find((item) => item.id === id);
        if (!existing) return current;
        const nextDue = patch.dueDate ? `${patch.dueDate}${patch.dueTime ? ` ${patch.dueTime}` : ''}` : patch.due || existing.due;
        let nextState = {
          ...current,
          tasks: current.tasks.map((item) => (item.id === id ? normalizeTask({ ...item, ...patch, due: nextDue }, 0) : item)),
        };
        nextState = withAudit(nextState, {
          what: patch.status === 'done' ? 'Task completed' : 'Task updated',
          object: existing.title,
          old: existing.status,
          next: patch.status || existing.status,
          actor: patch.owner || existing.owner || 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const updateInvoice = (id, patch) => {
      setState((current) => {
        const existing = current.invoices.find((item) => item.id === id);
        if (!existing) return current;
        let nextState = {
          ...current,
          invoices: current.invoices.map((item) => (item.id === id ? normalizeInvoice({ ...item, ...patch }, 0) : item)),
        };
        nextState = withAudit(nextState, {
          what: 'Invoice updated',
          object: existing.id,
          old: existing.status,
          next: patch.status || existing.status,
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const setInvoiceStatus = (id, status, paidAmount = '') => {
      setState((current) => {
        const existing = current.invoices.find((item) => item.id === id);
        if (!existing) return current;
        const paid = status === 'paid'
          ? existing.amount
          : status === 'partial'
            ? (paidAmount || existing.paid || 'SEK 0')
            : 'SEK 0';
        let nextState = {
          ...current,
          invoices: current.invoices.map((item) => (item.id === id ? normalizeInvoice({ ...item, status, paid }, 0) : item)),
        };
        nextState = addCommunication(nextState, normalizeCommunication({
          id: `COM-${Date.now()}`,
          title: `Invoice ${status}: ${existing.id}`,
          detail: `${existing.id} marked ${status}.`,
          body: `${existing.id} for ${existing.customer} marked ${status}.`,
          owner: 'Noah',
          type: 'note',
          status: 'sent',
          internal: true,
          template: 'internal-update',
          related: { type: 'invoice', id: existing.id, label: existing.id },
          linked: `Invoice ${existing.id}`,
          threadId: existing.id,
        }, current.communications.length));
        nextState = addActivity(nextState, { form: existing.customer, type: 'invoice', user: `Invoice ${status}` });
        nextState = withAudit(nextState, {
          what: status === 'paid' ? 'Invoice paid' : status === 'partial' ? 'Invoice partial payment' : 'Invoice failed',
          object: existing.id,
          old: existing.status,
          next: status,
          actor: 'Noah',
        });
        return finalizeState(nextState);
      });
    };

    const setWorkspaceRole = (role) => {
      setState((current) => finalizeState({
        ...current,
        workspace: { ...(current.workspace || {}), currentRole: role || 'admin' },
      }));
    };

    const updateForm = ({ id, title, fields, published, color, automation, submitLabel, successMessage, thankYouTitle, thankYouBody, redirectUrl, publicDomain, publicSlug, description, notifyEmail, owners, defaultOwner, multiStepEnabled, automationRules, integrations }) => {
      setState((current) => {
        const existing = current.forms.find((item) => item.id === id);
        const nextFields = fields || existing?.field_schema || [];
        const nextForm = withFormDefaults({
          id: id || `form-${Date.now()}`,
          code: existing?.code || `BF-${String(current.forms.length + 1).padStart(3, '0')}`,
          name: title || existing?.name || 'Untitled Form',
          status: typeof published === 'boolean' ? (published ? 'active' : 'draft') : (existing?.status || 'draft'),
          submissions: existing?.submissions || 0,
          conversion: existing?.conversion || 0,
          updated: buildRelativeTime(),
          fields: nextFields.filter((field) => field.type !== 'section').length || existing?.fields || 0,
          field_schema: nextFields,
          color: color || existing?.color || '#7C3AED',
          rules: existing?.rules || 1,
          endpoint: existing?.endpoint || `/embed/${id || `form-${Date.now()}`}`,
          submitLabel: submitLabel || existing?.submitLabel,
          successMessage: successMessage || existing?.successMessage,
          thankYouTitle: typeof thankYouTitle === 'string' ? thankYouTitle : existing?.thankYouTitle,
          thankYouBody: typeof thankYouBody === 'string' ? thankYouBody : existing?.thankYouBody,
          redirectUrl: typeof redirectUrl === 'string' ? redirectUrl : existing?.redirectUrl,
          publicDomain: typeof publicDomain === 'string' ? publicDomain : existing?.publicDomain,
          publicSlug: typeof publicSlug === 'string' && publicSlug ? slugify(publicSlug) : slugify((typeof publicDomain === 'string' ? publicDomain : existing?.publicDomain) || title || existing?.name || id),
          description: typeof description === 'string' ? description : existing?.description,
          notifyEmail: notifyEmail || existing?.notifyEmail || DEFAULT_NOTIFY_EMAIL,
          owners: owners || existing?.owners || DEFAULT_OWNERS,
          defaultOwner: defaultOwner || existing?.defaultOwner || 'Alex',
          multiStepEnabled: typeof multiStepEnabled === 'boolean' ? multiStepEnabled : Boolean(existing?.multiStepEnabled),
          automationRules: Array.isArray(automationRules) ? automationRules : existing?.automationRules,
          integrations: integrations || existing?.integrations,
          automation: { ...(existing?.automation || defaultFormAutomation(existing || {}, current.forms.length)), ...(automation || {}) },
        }, current.forms.findIndex((item) => item.id === id));
        const forms = existing
          ? current.forms.map((item) => (item.id === existing.id ? nextForm : item))
          : prepend(current.forms, nextForm);
        let nextState = finalizeState({ ...current, forms });
        nextState = withAudit(nextState, {
          what: existing ? 'Form updated' : 'Form created',
          object: nextForm.name,
          old: existing?.status || '-',
          next: nextForm.status,
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const setFormStatus = (id, status) => {
      setState((current) => {
        const existing = current.forms.find((item) => item.id === id);
        if (!existing || existing.status === status) return current;
        let nextState = {
          ...current,
          forms: current.forms.map((item) => (
            item.id === id ? { ...item, status, updated: buildRelativeTime() } : item
          )),
        };
        nextState = withAudit(nextState, {
          what: 'Form status changed',
          object: existing.name,
          old: existing.status,
          next: status,
          actor: 'Alex',
        });
        return finalizeState(nextState);
      });
    };

    const commitBuilderSession = () => {
      if (!builderSession?.formId) return false;
      updateForm({
        id: builderSession.formId,
        title: builderSession.title,
        fields: builderSession.fields,
        published: builderSession.published,
        color: builderSession.color,
        automation: builderSession.automation,
        submitLabel: builderSession.submitLabel,
        successMessage: builderSession.successMessage,
        description: builderSession.description,
        thankYouTitle: builderSession.thankYouTitle,
        thankYouBody: builderSession.thankYouBody,
        redirectUrl: builderSession.redirectUrl,
        publicDomain: builderSession.publicDomain,
        publicSlug: builderSession.publicSlug,
        notifyEmail: builderSession.notifyEmail,
        owners: builderSession.owners,
        defaultOwner: builderSession.defaultOwner,
        multiStepEnabled: builderSession.multiStepEnabled,
        automationRules: builderSession.automationRules,
        integrations: builderSession.integrations,
      });
      setBuilderSessionState((current) => (current ? { ...current, dirty: false } : current));
      return true;
    };

    const submitEntry = ({ formId, contact, email, phone, raw }) => {
      setState((current) => {
        const existingForm = current.forms.find((item) => item.id === formId);
        if (!existingForm) return current;
        const form = withFormDefaults(existingForm);
        const urgency = submissionUrgency(raw);
        const duplicate = Boolean(
          email && (
            current.entries.some((item) => item.email?.toLowerCase() === email.toLowerCase()) ||
            current.leads.some((item) => item.email?.toLowerCase() === email.toLowerCase())
          )
        );
        const score = computeLeadScore({ email, phone, raw });
        const priority = scorePriority(score, urgency);
        const owner = form.automation.autoAssignOwner
          ? pickOwner(current.leads, form.owners || form.automation.owners, form.defaultOwner || 'Alex')
          : (form.defaultOwner || 'Alex');
        const nextEntry = {
          id: `E-${Date.now().toString().slice(-6)}`,
          formId,
          form: form.name,
          contact: contact || 'Anonymous',
          email: email || 'unknown@example.com',
          phone: phone || '',
          state: duplicate ? 'duplicate' : form.automation.autoCreateLead ? 'handled' : 'unread',
          result: duplicate ? 'Merge pending' : form.automation.autoCreateLead ? 'Lead created' : 'Needs review',
          quality: buildEntryQuality({ duplicate, score, phone, urgency }),
          submitted: buildRelativeTime(),
          raw: raw || {},
          score,
          priority,
          owner,
        };
        let nextState = {
          ...current,
          entries: prepend(current.entries, nextEntry),
          forms: current.forms.map((item) => (
            item.id === formId ? { ...item, submissions: item.submissions + 1, updated: buildRelativeTime(), conversion: Number(Math.min(99.9, (item.conversion || 0) + (duplicate ? 0 : 0.2)).toFixed(1)) } : item
          )),
        };
        nextState = addActivity(nextState, { form: form.name, type: 'submission', user: nextEntry.email });
        nextState = withAudit(nextState, { what: 'Entry received', object: form.name, old: '-', next: nextEntry.id, actor: 'Public form' });
        if (!duplicate && form.automation.autoCreateLead) {
          const leadId = `L-${Date.now().toString().slice(-6)}`;
          const nextLead = normalizeLead({
            id: leadId,
            entryId: nextEntry.id,
            name: nextEntry.contact,
            company: nextEntry.email.split('@')[1]?.split('.')[0]?.replace(/^\w/, (char) => char.toUpperCase()) || 'New Company',
            email: nextEntry.email,
            phone: nextEntry.phone,
            source: form.name,
            status: score >= 80 ? 'qualified' : score >= 58 ? 'warm' : 'new',
            priority,
            score,
            value: buildLeadValue(raw, score),
            owner,
            next: priority === 'high' ? 'Call within 5 minutes' : 'Review submission',
            time: buildRelativeTime(),
            tags: [priority, score >= 80 ? 'high value' : 'new submission', phone ? 'call ready' : 'missing phone'],
            stage: priority === 'high' ? 'contacted' : 'incoming',
            notes: `Created automatically from ${form.name}.`,
            automationSummary: `Score ${score}. Assigned to ${owner}.`,
            urgency,
            budget: buildLeadValue(raw, score),
            expectedValue: buildLeadValue(raw, score),
            qualificationStatus: score >= 80 ? 'qualified' : score >= 58 ? 'review' : 'new',
            disqualificationReason: '',
            lastContacted: 'Not contacted',
            nextFollowUpDate: priority === 'high' ? new Date().toISOString().slice(0, 10) : '',
          }, nextState.leads.length);
          nextState = { ...nextState, leads: prepend(nextState.leads, nextLead) };
          nextState = addActivity(nextState, { form: form.name, type: 'automation', user: `${owner} assigned` });
          nextState = withAudit(nextState, { what: 'Lead created', object: nextLead.name, old: '-', next: nextLead.status, actor: 'Rule engine' });
          if (form.automation.createFollowUpTask) {
            const nextTask = normalizeTask({
              id: `T-${Date.now().toString().slice(-6)}`,
              title: `${priority === 'high' ? 'Call immediately' : 'Review'} ${form.name} lead`,
              related: { type: 'lead', id: leadId, label: nextLead.name },
              link: nextLead.name,
              type: priority === 'high' ? 'call' : 'follow-up',
              status: 'todo',
              priority,
              owner,
              due: priority === 'high' ? 'Today 17:00' : 'Tomorrow',
              dueDate: '',
              dueTime: '',
              notes: `Auto-created from ${form.name} submission.`,
              reminder: { enabled: priority === 'high', offset: '15m' },
              recurring: { enabled: false, rule: 'weekly' },
              watchers: [],
              collaborators: [],
            }, nextState.tasks.length);
            nextState = { ...nextState, tasks: prepend(nextState.tasks, nextTask) };
            nextState = withAudit(nextState, { what: 'Task created', object: nextTask.title, old: '-', next: nextTask.status, actor: owner });
          }
          if (form.automation.sendInternalEmail) {
            const nextCommunication = normalizeCommunication({
              id: `COM-${Date.now()}`,
              title: `${form.name} submission routed`,
              type: 'email',
              linked: `Lead ${leadId}`,
              owner,
              detail: `SMTP delivery prepared for ${form.notifyEmail || DEFAULT_NOTIFY_EMAIL}.`,
              body: `SMTP delivery prepared for ${form.notifyEmail || DEFAULT_NOTIFY_EMAIL}.`,
              status: 'queued',
              internal: false,
              template: 'new-lead-alert',
              scheduledFor: '',
              related: { type: 'lead', id: leadId, label: nextLead.name },
              attachments: [],
              threadId: leadId,
            }, nextState.communications.length);
            nextState = addCommunication(nextState, nextCommunication);
            nextState = withAudit(nextState, { what: 'Automation email queued', object: nextCommunication.title, old: '-', next: form.notifyEmail || DEFAULT_NOTIFY_EMAIL, actor: owner });
          }
          nextState = applySubmissionAutomationRules({
            form,
            raw: raw || {},
            score,
            priority,
            leadId,
            leadName: nextLead.name,
            owner,
            state: nextState,
          });
        }
        return finalizeState(nextState);
      });
    };

    const retryCommunication = (id) => {
      setState((current) => {
        const existing = current.communications.find((item) => item.id === id);
        if (!existing) return current;
        let nextState = {
          ...current,
          communications: current.communications.map((item) => (
            item.id === id
              ? {
                  ...item,
                  status: 'queued',
                  scheduledFor: item.scheduledFor || new Date().toISOString(),
                  detail: `${item.detail} Retry queued.`,
                }
              : item
          )),
        };
        nextState = withAudit(nextState, { what: 'Communication retried', object: existing.title, old: existing.status, next: 'queued', actor: 'Alex' });
        return finalizeState(nextState);
      });
    };

    return {
      ...state,
      hydrated,
      reset,
      createForm,
      createLead,
      updateLead,
      updateEntry,
      convertEntryToLead,
      mergeEntry,
      markEntrySpam,
      createCustomer,
      updateCustomer,
      convertLeadToCustomer,
      createTask,
      updateTask,
      createInvoice,
      updateInvoice,
      setInvoiceStatus,
      uploadFile,
      logCommunication,
      retryCommunication,
      updateForm,
      setFormStatus,
      submitEntry,
      setWorkspaceRole,
      builderSession,
      setBuilderSession,
      clearBuilderSession,
      commitBuilderSession,
      defaultNotificationEmail: DEFAULT_NOTIFY_EMAIL,
    };
  }, [builderSession, hydrated, state]);

  return <BuzzStateContext.Provider value={value}>{children}</BuzzStateContext.Provider>;
}

export function useBuzzStore() {
  const context = useContext(BuzzStateContext);
  if (!context) {
    throw new Error('useBuzzStore must be used within BuzzProvider');
  }
  return context;
}
