export const forms = [
  { id: 'form-contact-inquiry', code: 'BF-001', name: 'Contact Inquiry', status: 'active', submissions: 847, conversion: 38.2, updated: '2m ago', fields: 6, color: '#7C3AED', rules: 4, endpoint: '/embed/form-contact-inquiry' },
  { id: 'form-newsletter-signup', code: 'BF-002', name: 'Newsletter Signup', status: 'active', submissions: 1203, conversion: 52.1, updated: '15m ago', fields: 3, color: '#22D3EE', rules: 1, endpoint: '/embed/form-newsletter-signup' },
  { id: 'form-website-audit', code: 'BF-003', name: 'Website Audit', status: 'active', submissions: 511, conversion: 45.7, updated: '24m ago', fields: 11, color: '#10B981', rules: 8, endpoint: '/embed/form-website-audit' },
  { id: 'form-support-request', code: 'BF-004', name: 'Support Request', status: 'draft', submissions: 376, conversion: 71.3, updated: '3h ago', fields: 5, color: '#F59E0B', rules: 3, endpoint: '/embed/form-support-request' },
  { id: 'form-emergency', code: 'BF-005', name: 'Emergency Form', status: 'paused', submissions: 94, conversion: 63.4, updated: 'Yesterday', fields: 9, color: '#EF4444', rules: 7, endpoint: '/embed/form-emergency' },
];

export const entries = [
  { id: 'E-8821', formId: 'form-website-audit', form: 'Website Audit', contact: 'Nora Lind', email: 'nora@northstar.se', phone: '+46 70 118 22 14', state: 'unread', result: 'Lead created', quality: 'High score', submitted: '12m ago', raw: { budget: '80 000', urgency: 'This week', service: 'Audit' } },
  { id: 'E-8820', formId: 'form-contact-inquiry', form: 'Contact Inquiry', contact: 'Erik Wall', email: 'erik@wallco.se', phone: '', state: 'unread', result: 'Needs review', quality: 'Missing phone', submitted: '38m ago', raw: { budget: '25 000', urgency: 'Normal', service: 'Consulting' } },
  { id: 'E-8819', formId: 'form-emergency', form: 'Emergency Form', contact: 'Maja Berg', email: 'maja@bergdental.se', phone: '+46 73 440 90 11', state: 'handled', result: 'Task created', quality: 'Urgent', submitted: '1h ago', raw: { budget: '52 000', urgency: 'Acute', service: 'Emergency' } },
  { id: 'E-8818', formId: 'form-newsletter-signup', form: 'Newsletter Signup', contact: 'Jonas Ek', email: 'jonas@eklogistics.se', phone: '', state: 'duplicate', result: 'Merge pending', quality: 'Duplicate email', submitted: '3h ago', raw: { tags: ['newsletter'] } },
];

export const leads = [
  { id: 'L-1048', entryId: 'E-8821', name: 'Nora Lind', company: 'Northstar Studio', email: 'nora@northstar.se', phone: '+46 70 118 22 14', source: 'Website Audit', status: 'qualified', priority: 'high', score: 92, value: 'SEK 86,000', owner: 'Alex', next: 'Proposal review', time: '12m ago', tags: ['high value', 'strong contactability'], stage: 'offer', notes: 'Budget and timeline both fit premium segment.', urgency: 'high', budget: 'SEK 80,000', expectedValue: 'SEK 86,000', qualificationStatus: 'qualified', disqualificationReason: '', lastContacted: '10m ago', nextFollowUpDate: '2026-04-23' },
  { id: 'L-1047', entryId: 'E-8820', name: 'Erik Wall', company: 'Wall & Co', email: 'erik@wallco.se', phone: '', source: 'Contact Inquiry', status: 'new', priority: 'medium', score: 54, value: 'SEK 24,000', owner: 'Sarah', next: 'Call requested', time: '38m ago', tags: ['missing phone'], stage: 'incoming', notes: 'Incomplete contactability. Manual follow-up needed.', urgency: 'normal', budget: 'SEK 25,000', expectedValue: 'SEK 24,000', qualificationStatus: 'review', disqualificationReason: '', lastContacted: 'Not contacted', nextFollowUpDate: '2026-04-23' },
  { id: 'L-1046', entryId: 'E-8819', name: 'Maja Berg', company: 'Berg Dental', email: 'maja@bergdental.se', phone: '+46 73 440 90 11', source: 'Emergency Form', status: 'warm', priority: 'high', score: 88, value: 'SEK 52,000', owner: 'Alex', next: 'Book meeting', time: '1h ago', tags: ['urgent', 'auto task'], stage: 'contacted', notes: 'Auto-qualified due to acute need and full contact info.', urgency: 'urgent', budget: 'SEK 52,000', expectedValue: 'SEK 52,000', qualificationStatus: 'qualified', disqualificationReason: '', lastContacted: '1h ago', nextFollowUpDate: '2026-04-22' },
  { id: 'L-1045', entryId: 'E-8818', name: 'Jonas Ek', company: 'Ek Logistics', email: 'jonas@eklogistics.se', phone: '+46 76 120 44 31', source: 'Service A', status: 'waiting reply', priority: 'low', score: 41, value: 'SEK 12,000', owner: 'Mika', next: 'Follow up', time: '3h ago', tags: ['cold'], stage: 'review', notes: 'Low urgency and repeat contact pattern.', urgency: 'low', budget: 'SEK 12,000', expectedValue: 'SEK 12,000', qualificationStatus: 'review', disqualificationReason: '', lastContacted: 'Yesterday', nextFollowUpDate: '2026-04-25' },
];

export const customers = [
  {
    id: 'C-314',
    leadId: 'L-1048',
    sourceLeadId: 'L-1048',
    sourceFormId: 'form-website-audit',
    sourceLabel: 'Website Audit',
    name: 'Northstar Studio',
    companyName: 'Northstar Studio',
    contact: 'Nora Lind',
    contactPerson: 'Nora Lind',
    email: 'nora@northstar.se',
    phone: '+46 70 118 22 14',
    website: 'https://northstar.se',
    organizationNumber: '559188-4211',
    billingAddress: 'Kungsgatan 12, 111 35 Stockholm',
    tags: ['premium', 'design', 'retainer'],
    owner: 'Alex',
    stage: 'expansion',
    industry: 'Design Studio',
    companySize: '11-50',
    health: 'healthy',
    healthScore: 91,
    notes: 'High-value account with strong response times and clear upsell potential.',
    team: ['Alex', 'Sarah'],
    status: 'active',
    total: 'SEK 184,000',
    invoices: '2 unpaid',
    activity: 'Proposal won today',
    lifecycle: 'Lead won and converted 2026-04-21',
  },
  {
    id: 'C-313',
    leadId: 'L-1046',
    sourceLeadId: 'L-1046',
    sourceFormId: 'form-emergency',
    sourceLabel: 'Emergency Form',
    name: 'Berg Dental',
    companyName: 'Berg Dental',
    contact: 'Maja Berg',
    contactPerson: 'Maja Berg',
    email: 'maja@bergdental.se',
    phone: '+46 73 440 90 11',
    website: 'https://bergdental.se',
    organizationNumber: '556901-7712',
    billingAddress: 'Storgatan 44, 411 31 Göteborg',
    tags: ['urgent', 'healthcare'],
    owner: 'Alex',
    stage: 'delivery',
    industry: 'Dental Clinic',
    companySize: '11-50',
    health: 'healthy',
    healthScore: 84,
    notes: 'Fast-moving operational account with strong payment behavior.',
    team: ['Alex', 'Mika'],
    status: 'active',
    total: 'SEK 72,500',
    invoices: 'Paid',
    activity: 'Invoice paid yesterday',
    lifecycle: 'Customer since 2026-04-03',
  },
  {
    id: 'C-312',
    leadId: 'L-1045',
    sourceLeadId: 'L-1045',
    sourceFormId: 'form-newsletter-signup',
    sourceLabel: 'Newsletter Signup',
    name: 'Ek Logistics',
    companyName: 'Ek Logistics',
    contact: 'Jonas Ek',
    contactPerson: 'Jonas Ek',
    email: 'jonas@eklogistics.se',
    phone: '+46 76 120 44 31',
    website: 'https://eklogistics.se',
    organizationNumber: '559044-1299',
    billingAddress: 'Skeppsbron 8, 211 20 Malmö',
    tags: ['ops', 'overdue'],
    owner: 'Mika',
    stage: 'recovery',
    industry: 'Logistics',
    companySize: '51-200',
    health: 'at risk',
    healthScore: 42,
    notes: 'Account is paused until overdue invoice and follow-up backlog are resolved.',
    team: ['Mika', 'Sarah'],
    status: 'paused',
    total: 'SEK 41,200',
    invoices: '1 late',
    activity: 'Follow-up task open',
    lifecycle: 'Paused due to overdue invoice',
  },
];

export const tasks = [
  {
    id: 'T-770',
    title: 'Follow up Website Audit lead',
    link: 'Nora Lind',
    related: { type: 'lead', id: 'L-1048', label: 'Nora Lind' },
    type: 'call',
    status: 'todo',
    priority: 'high',
    owner: 'Alex',
    assignedBy: 'Alex',
    due: '2026-04-21 14:00',
    dueDate: '2026-04-21',
    dueTime: '14:00',
    notes: 'Call within the SLA window and confirm proposal scope before pricing.',
    reminder: { enabled: true, offset: '15m' },
    recurring: { enabled: false, rule: 'weekly' },
    watchers: ['Sarah'],
    collaborators: ['Mika'],
  },
  {
    id: 'T-769',
    title: 'Send proposal draft',
    link: 'Northstar Studio',
    related: { type: 'customer', id: 'C-314', label: 'Northstar Studio' },
    type: 'email',
    status: 'in progress',
    priority: 'high',
    owner: 'Sarah',
    assignedBy: 'Alex',
    due: '2026-04-21 16:30',
    dueDate: '2026-04-21',
    dueTime: '16:30',
    notes: 'Attach revised scope and mention payment milestone split.',
    reminder: { enabled: true, offset: '1h' },
    recurring: { enabled: false, rule: 'weekly' },
    watchers: ['Alex'],
    collaborators: ['Mika'],
  },
  {
    id: 'T-768',
    title: 'Complete missing contact data',
    link: 'Erik Wall',
    related: { type: 'lead', id: 'L-1047', label: 'Erik Wall' },
    type: 'follow-up',
    status: 'todo',
    priority: 'medium',
    owner: 'Mika',
    assignedBy: 'Sarah',
    due: '2026-04-22',
    dueDate: '2026-04-22',
    dueTime: '',
    notes: 'Get direct phone number and verify best callback window.',
    reminder: { enabled: true, offset: '1d' },
    recurring: { enabled: true, rule: 'weekly' },
    watchers: ['Alex'],
    collaborators: [],
  },
  {
    id: 'T-767',
    title: 'Archive spam entry batch',
    link: 'Emergency Form',
    related: { type: 'form', id: 'form-emergency', label: 'Emergency Form' },
    type: 'internal',
    status: 'blocked',
    priority: 'low',
    owner: 'Alex',
    assignedBy: 'Alex',
    due: 'Late',
    dueDate: '',
    dueTime: '',
    notes: 'Blocked until duplicate review rule is confirmed by operations.',
    reminder: { enabled: false, offset: '1h' },
    recurring: { enabled: false, rule: 'weekly' },
    watchers: ['Sarah'],
    collaborators: [],
  },
];

export const invoices = [
  { id: 'INV-2026-014', customer: 'Northstar Studio', amount: 'SEK 48,000', status: 'sent', due: '2026-04-28', paid: 'SEK 0' },
  { id: 'INV-2026-013', customer: 'Ek Logistics', amount: 'SEK 12,400', status: 'late', due: '2026-04-12', paid: 'SEK 0' },
  { id: 'INV-2026-012', customer: 'Berg Dental', amount: 'SEK 32,000', status: 'paid', due: '2026-04-18', paid: 'SEK 32,000' },
];

export const files = [
  { id: 'F-221', name: 'northstar-brief.pdf', type: 'PDF', size: '1.8 MB', linked: 'Lead L-1048', uploaded: '12m ago' },
  { id: 'F-220', name: 'signed-agreement.png', type: 'Image', size: '640 KB', linked: 'Customer C-314', uploaded: 'Today' },
  { id: 'F-219', name: 'invoice-2026-013.pdf', type: 'PDF', size: '92 KB', linked: 'Invoice INV-2026-013', uploaded: 'Apr 12' },
];

export const communications = [
  { id: 'COM-1', title: 'Call logged', type: 'call', linked: 'Lead L-1048', owner: 'Alex', detail: 'Strong contactability confirmed', body: 'Qualified the budget range and secured proposal review on the next call.', status: 'sent', internal: false, template: 'follow-up', scheduledFor: '', related: { type: 'lead', id: 'L-1048', label: 'Nora Lind' }, attachments: [], threadId: 'L-1048' },
  { id: 'COM-2', title: 'Proposal email sent', type: 'email', linked: 'Customer C-314', owner: 'Sarah', detail: 'Visible in linked record history', body: 'Sent proposal draft with milestone breakdown and scope recap.', status: 'sent', internal: false, template: 'proposal', scheduledFor: '', related: { type: 'customer', id: 'C-314', label: 'Northstar Studio' }, attachments: ['proposal-v2.pdf'], threadId: 'C-314' },
  { id: 'COM-3', title: 'Internal comment added', type: 'comment', linked: 'Task T-768', owner: 'Mika', detail: 'Manual review requested', body: 'Need sales input before we attempt another follow-up.', status: 'draft', internal: true, template: 'internal-update', scheduledFor: '', related: { type: 'task', id: 'T-768', label: 'Complete missing contact data' }, attachments: [], threadId: 'T-768' },
  { id: 'COM-4', title: 'Discovery meeting booked', type: 'meeting', linked: 'Lead L-1046', owner: 'Alex', detail: 'Meeting scheduled for tomorrow', body: 'Booked discovery session for 10:00 and shared agenda.', status: 'queued', internal: false, template: 'check-in', scheduledFor: '2026-04-22 10:00', related: { type: 'lead', id: 'L-1046', label: 'Maja Berg' }, attachments: ['agenda.pdf'], threadId: 'L-1046' },
];

export const logs = [
  { id: 1, what: 'Entry received', object: 'Website Audit', actor: 'Public form', old: '-', next: 'E-8821', time: '12m ago' },
  { id: 2, what: 'Lead created', object: 'Nora Lind', actor: 'Rule engine', old: '-', next: 'qualified', time: '12m ago' },
  { id: 3, what: 'Priority changed', object: 'Lead L-1048', actor: 'Rule engine', old: 'medium', next: 'high', time: '12m ago' },
  { id: 4, what: 'Task created', object: 'Follow up lead', actor: 'Alex', old: '-', next: 'todo', time: '10m ago' },
  { id: 5, what: 'Invoice marked paid', object: 'INV-2026-012', actor: 'Sarah', old: 'sent', next: 'paid', time: 'Yesterday' },
];

export const activity = [
  { id: 1, form: 'Contact Inquiry', type: 'submission', time: '2m ago', user: 'sarah@acme.com' },
  { id: 2, form: 'Newsletter Signup', type: 'submission', time: '8m ago', user: 'john.d@gmail.com' },
  { id: 3, form: 'Website Audit', type: 'submission', time: '12m ago', user: 'nora@northstar.se' },
  { id: 4, form: 'Product Feedback', type: 'submission', time: '23m ago', user: 'mike@startup.io' },
  { id: 5, form: 'Contact Inquiry', type: 'ai_response', time: '24m ago', user: 'AI responded' },
  { id: 6, form: 'Support Request', type: 'submission', time: '2h ago', user: 'emma@corp.com' },
];

export function getForm(id) {
  return forms.find((item) => item.id === id);
}

export function getLead(id) {
  return leads.find((item) => item.id === id);
}

export function getCustomer(id) {
  return customers.find((item) => item.id === id);
}
