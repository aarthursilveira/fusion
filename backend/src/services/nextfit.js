import axios from 'axios';

const NEXTFIT_API_URL = process.env.NEXTFIT_API_URL;
const NEXTFIT_API_TOKEN = process.env.NEXTFIT_API_TOKEN;

const nextfit = axios.create({
  baseURL: NEXTFIT_API_URL,
  headers: {
    'Authorization': `Bearer ${NEXTFIT_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const getMemberStatus = async (nextfit_id) => {
  // Simulate NextFit API call if token is missing
  if (!NEXTFIT_API_TOKEN) {
    return {
      status: 'Ativo',
      statusColor: 'green',
      expirationDate: '2026-12-31',
      nextPayment: '2026-04-20',
      planName: 'Plano Black Anual'
    };
  }
  const response = await nextfit.get(`/members/${nextfit_id}/status`);
  return response.data;
};

export const getMemberPayments = async (nextfit_id) => {
  if (!NEXTFIT_API_TOKEN) {
    return [
      { id: 1, date: '2026-03-20', description: 'Mensalidade Março', amount: 99.90, status: 'Pago' },
      { id: 2, date: '2026-02-20', description: 'Mensalidade Fevereiro', amount: 99.90, status: 'Pago' },
      { id: 3, date: '2026-04-20', description: 'Mensalidade Abril', amount: 99.90, status: 'Pendente' },
    ];
  }
  const response = await nextfit.get(`/members/${nextfit_id}/payments`);
  return response.data;
};

export const getMemberPlan = async (nextfit_id) => {
  if (!NEXTFIT_API_TOKEN) {
    return {
      name: 'Plano Black Anual',
      price: 99.90,
      features: ['Acesso total', 'Levar amigo 5x/mês', 'Cadeira de massagem'],
      duration: '12 meses'
    };
  }
  const response = await nextfit.get(`/members/${nextfit_id}/plan`);
  return response.data;
};

export const updateMemberProfile = async (nextfit_id, data) => {
  if (!NEXTFIT_API_TOKEN) {
    return { success: true, message: 'Profile updated (mock)' };
  }
  const response = await nextfit.put(`/members/${nextfit_id}`, data);
  return response.data;
};

// For registration (wizard step 2)
export const getAvailablePlans = async () => {
  if (!NEXTFIT_API_TOKEN) {
    return [
      { id: 'p1', name: 'Plano Smart', price: 79.90, features: ['Acesso a 1 unidade', 'Horário livre'], duration: 'Mensal' },
      { id: 'p2', name: 'Plano Black', price: 99.90, features: ['Acesso a todas as unidades', 'Levar acompanhante', 'Cadeira de massagem'], duration: 'Anual' },
      { id: 'p3', name: 'Plano VIP', price: 149.90, features: ['Personal Trainer incluso 2x/semana', 'Acesso total', 'Brinde exclusivo'], duration: 'Semestral' },
    ];
  }
  const response = await nextfit.get('/plans');
  return response.data;
};
