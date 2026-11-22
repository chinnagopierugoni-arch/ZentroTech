import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationSchema, enquirySchema } from '../src/utils/schemas.js';
import { makeDedupeKey } from '../src/utils/dedupe-key.js';

test('enquiry validation accepts the existing website form payload', () => {
  const parsed = enquirySchema.safeParse({
    name: 'A. Visitor',
    email: 'VISITOR@example.com',
    phone: '',
    company: '',
    service: 'Custom Software',
    message: 'We need a workflow application for our staff.'
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, 'visitor@example.com');
});

test('enquiry validation accepts and normalizes EduCore deployment details', () => {
  const parsed = enquirySchema.safeParse({
    name: 'A. Visitor',
    email: 'VISITOR@example.com',
    company: 'Example Academy',
    industry: 'Education & EdTech',
    service: 'White-label LMS & CRM — Zentro EduCore',
    selectedProduct: 'Zentro EduCore',
    selectedPackage: 'Professional',
    institutionType: 'Training institute',
    studentCount: '500–2,000',
    currentLmsStatus: 'Using a third-party LMS',
    currentCrmStatus: 'No CRM yet',
    requiredFeatures: 'Admissions workflow',
    deploymentTimeline: '1–3 months',
    additionalRequirements: '',
    message: 'We would like to discuss a branded learning platform.'
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.selectedPackage, 'Professional');
  assert.equal(parsed.data.additionalRequirements, '');
});

test('enquiry validation rejects unknown EduCore deployment packages', () => {
  const parsed = enquirySchema.safeParse({
    name: 'A. Visitor',
    email: 'visitor@example.com',
    service: 'White-label LMS & CRM — Zentro EduCore',
    selectedPackage: 'Premium',
    message: 'We would like to discuss a branded learning platform.'
  });
  assert.equal(parsed.success, false);
});

test('enquiry validation requires a meaningful description', () => {
  const parsed = enquirySchema.safeParse({
    name: 'A. Visitor',
    email: 'visitor@example.com',
    service: 'Custom Software',
    message: 'short'
  });
  assert.equal(parsed.success, false);
});

test('career application accepts the website payload and requires its database name field', () => {
  const parsed = applicationSchema.safeParse({
    role: 'General interest',
    applicant_name: 'A. Applicant',
    email: 'person@example.com',
    website: ''
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.applicant_name, 'A. Applicant');

  const missingName = applicationSchema.safeParse({ role: 'General interest', email: 'person@example.com' });
  assert.equal(missingName.success, false);
});

test('duplicate keys are stable for equivalent normalized submissions', () => {
  const first = makeDedupeKey({ email: 'PERSON@example.com', message: 'Hello' });
  const second = makeDedupeKey({ message: ' hello ', email: 'person@example.com' });
  assert.equal(first, second);
  assert.notEqual(first, makeDedupeKey({ email: 'person@example.com', message: 'Different message' }));
});
