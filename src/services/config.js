import { store } from '../redux/store';
import { setIsLogin, setAccessToken } from '../redux/Reducers/userReducer';

function getAuthToken() {
  const state = store.getState();
  // console.log(state?.user?.accessToken, 'this is my token');
  return state?.user?.accessToken || null;
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text(); // for plain text responses
  }

  if (response.status === 401) {
    store.dispatch(setIsLogin(false));
    store.dispatch(setAccessToken(null));
    throw new Error(typeof data === 'string' ? data : data?.message || 'Unauthorized');
  }

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : data?.message || 'Something went wrong');
  }

  return data;
}

function buildHeaders(isMultipart = false) {
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* =======================
   BASIC HTTP METHODS
======================= */

async function get(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse(response);
}

async function post(url, body, isMultipart = false) {
  const headers = buildHeaders(isMultipart);

  console.log('📤 API REQUEST');
  console.log('➡️ URL:', url);
  console.log('➡️ METHOD: POST');
  console.log('➡️ HEADERS:', headers);
  console.log('➡️ BODY:', isMultipart ? body : JSON.stringify(body));

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: isMultipart ? body : JSON.stringify(body),
  });
  return handleResponse(response);
}

async function put(url, body, isMultipart = false) {
  const headers = buildHeaders(isMultipart);

  // console.log('📤 API REQUEST');
  // console.log('➡️ URL:', url);
  // console.log('➡️ HEADERS:', headers);
  // console.log('➡️ BODY:', isMultipart ? body : JSON.stringify(body));

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: isMultipart ? body : JSON.stringify(body),
  });

  return handleResponse(response);
}

async function patch(url, body) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

async function _delete(url) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: buildHeaders(),
  });

  return handleResponse(response);
}
async function upload(url, formData) {
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });

  return handleResponse(response);
}

export const Fetch = {
  get,
  post,
  put,
  patch,
  delete: _delete,
  upload,
};
