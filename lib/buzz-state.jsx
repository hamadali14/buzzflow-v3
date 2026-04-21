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

const BuzzStateContext = createContext(null);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function createInitialState() {
  return {
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
  };
}

function prepend(list, item, limit = 24) {
  return [item, ...list].slice(0, limit);
}

function buildRelativeTime() {
  return 'Just now';
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

export function BuzzProvider({ children }) {
  const [state, setState] = useState(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [builderSession, setBuilderSessionState] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState({ ...createInitialState(), ...JSON.parse(raw) });
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
        };
        let nextState = { ...current, forms: prepend(current.forms, nextForm, 100) };
        nextState = withAudit(nextState, { what: 'Form created', object: nextForm.name, old: '-', next: 'draft', actor: 'Alex' });
        return nextState;
      });
      return id;
    };

    const createLead = ({ name, company, source = 'Manual', entryId = null }) => {
      const id = `L-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const nextLead = {
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
        };
        let nextState = { ...current, leads: prepend(current.leads, nextLead) };
        nextState = withAudit(nextState, { what: 'Lead created', object: nextLead.name, next: nextLead.status, actor: 'Alex' });
        return nextState;
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
        return nextState;
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
          const newLead = {
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
          };
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
        return nextState;
      });
      return leadId;
    };

    const mergeEntry = (entryId) => {
      updateEntry(entryId, { state: 'handled', result: 'Merged with existing record' }, 'Entry merged');
    };

    const markEntrySpam = (entryId) => {
      updateEntry(entryId, { state: 'spam', result: 'Marked as spam' }, 'Entry marked spam');
    };

    const createCustomer = ({ name, contact, leadId = null }) => {
      const id = `C-${Date.now().toString().slice(-5)}`;
      setState((current) => {
        const nextCustomer = {
          id,
          leadId,
          name: name || 'New Customer',
          contact: contact || 'Primary Contact',
          status: 'active',
          total: 'SEK 0',
          invoices: 'None',
          activity: 'Created just now',
          lifecycle: 'Created manually',
        };
        let nextState = { ...current, customers: prepend(current.customers, nextCustomer) };
        nextState = withAudit(nextState, { what: 'Customer created', object: nextCustomer.name, old: '-', next: nextCustomer.status, actor: 'Alex' });
        return nextState;
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
          customers: prepend(current.customers, {
            id: customerId,
            leadId,
            name: lead.company,
            contact: lead.name,
            status: 'active',
            total: lead.value,
            invoices: 'None',
            activity: 'Converted from lead just now',
            lifecycle: `Lead converted ${new Date().toISOString().slice(0, 10)}`,
          }),
          leads: current.leads.map((item) => (
            item.id === leadId ? { ...item, status: 'qualified', stage: 'won', next: 'Customer onboarding', time: buildRelativeTime() } : item
          )),
        };
        nextState = withAudit(nextState, { what: 'Lead converted', object: lead.name, old: lead.status, next: 'customer', actor: 'Alex' });
        return nextState;
      });
      return customerId;
    };

    const createTask = ({ title, link = 'Lead L-1048', owner = 'Alex', priority = 'medium', due = 'Tomorrow' }) => {
      const id = `T-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const nextTask = {
          id,
          title: title || 'New Task',
          link,
          status: 'todo',
          priority,
          owner,
          due,
        };
        let nextState = { ...current, tasks: prepend(current.tasks, nextTask) };
        nextState = withAudit(nextState, { what: 'Task created', object: nextTask.title, old: '-', next: nextTask.status, actor: owner });
        return nextState;
      });
      return id;
    };

    const createInvoice = ({ customer, amount, due = '2026-04-30' }) => {
      const id = `INV-${new Date().getFullYear()}-${String(state.invoices.length + 15).padStart(3, '0')}`;
      setState((current) => {
        const nextInvoice = {
          id,
          customer: customer || 'New Customer',
          amount: moneyValue(amount),
          status: 'draft',
          due,
          paid: 'SEK 0',
        };
        let nextState = { ...current, invoices: prepend(current.invoices, nextInvoice) };
        nextState = withAudit(nextState, { what: 'Invoice created', object: nextInvoice.id, old: '-', next: nextInvoice.status, actor: 'Alex' });
        return nextState;
      });
      return id;
    };

    const uploadFile = ({ name, linked = 'Lead L-1048', type = 'PDF', size = '0.4 MB' }) => {
      const id = `F-${Date.now().toString().slice(-6)}`;
      setState((current) => {
        const nextFile = {
          id,
          name: name || 'new-file.pdf',
          type,
          size,
          linked,
          uploaded: buildRelativeTime(),
        };
        let nextState = { ...current, files: prepend(current.files, nextFile) };
        nextState = withAudit(nextState, { what: 'File uploaded', object: nextFile.name, old: '-', next: linked, actor: 'Alex' });
        return nextState;
      });
      return id;
    };

    const logCommunication = ({ title, linked = 'Lead L-1048', detail = 'Added manually from communication center', owner = 'Alex', type = 'note' }) => {
      const id = `COM-${Date.now()}`;
      setState((current) => {
        let nextState = addCommunication(current, {
          id,
          title: title || 'New internal note',
          type,
          linked,
          owner,
          detail,
        });
        nextState = withAudit(nextState, { what: 'Communication logged', object: title || 'New internal note', old: '-', next: type, actor: owner });
        return nextState;
      });
      return id;
    };

    const updateForm = ({ id, title, fields, published, color }) => {
      setState((current) => {
        const existing = current.forms.find((item) => item.id === id);
        const nextFields = fields || existing?.field_schema || [];
        const nextForm = {
          id: id || `form-${Date.now()}`,
          code: existing?.code || `BF-${String(current.forms.length + 1).padStart(3, '0')}`,
          name: title || existing?.name || 'Untitled Form',
          status: published ? 'active' : 'draft',
          submissions: existing?.submissions || 0,
          conversion: existing?.conversion || 0,
          updated: buildRelativeTime(),
          fields: nextFields.filter((field) => field.type !== 'section').length || existing?.fields || 0,
          field_schema: nextFields,
          color: color || existing?.color || '#7C3AED',
          rules: existing?.rules || 1,
          endpoint: existing?.endpoint || `/embed/${id || `form-${Date.now()}`}`,
        };
        const forms = existing
          ? current.forms.map((item) => (item.id === existing.id ? nextForm : item))
          : prepend(current.forms, nextForm);
        let nextState = { ...current, forms };
        nextState = withAudit(nextState, {
          what: existing ? 'Form updated' : 'Form created',
          object: nextForm.name,
          old: existing?.status || '-',
          next: nextForm.status,
          actor: 'Alex',
        });
        return nextState;
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
        return nextState;
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
      });
      setBuilderSessionState((current) => (current ? { ...current, dirty: false } : current));
      return true;
    };

    const submitEntry = ({ formId, contact, email, phone, raw }) => {
      setState((current) => {
        const form = current.forms.find((item) => item.id === formId);
        if (!form) return current;
        const nextEntry = {
          id: `E-${Date.now().toString().slice(-6)}`,
          formId,
          form: form.name,
          contact: contact || 'Anonymous',
          email: email || 'unknown@example.com',
          phone: phone || '',
          state: 'unread',
          result: 'Needs review',
          quality: phone ? 'High score' : 'Missing phone',
          submitted: buildRelativeTime(),
          raw: raw || {},
        };
        let nextState = {
          ...current,
          entries: prepend(current.entries, nextEntry),
          forms: current.forms.map((item) => (
            item.id === formId ? { ...item, submissions: item.submissions + 1, updated: buildRelativeTime() } : item
          )),
        };
        nextState = addActivity(nextState, { form: form.name, type: 'submission', user: nextEntry.email });
        nextState = withAudit(nextState, { what: 'Entry received', object: form.name, old: '-', next: nextEntry.id, actor: 'Public form' });
        return nextState;
      });
    };

    return {
      ...state,
      hydrated,
      reset,
      createForm,
      createLead,
      updateEntry,
      convertEntryToLead,
      mergeEntry,
      markEntrySpam,
      createCustomer,
      convertLeadToCustomer,
      createTask,
      createInvoice,
      uploadFile,
      logCommunication,
      updateForm,
      setFormStatus,
      submitEntry,
      builderSession,
      setBuilderSession,
      clearBuilderSession,
      commitBuilderSession,
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
