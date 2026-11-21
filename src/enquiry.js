import { api } from './services/api';

export async function submitEnquiry(form) {
  const data = await api.enquiries.create(form);
  return { mode: 'api', data };
}

export async function submitContact(form) {
  return api.contacts.create(form);
}

export async function submitJobApplication(form, resume) {
  return api.jobs.apply(form, resume);
}
