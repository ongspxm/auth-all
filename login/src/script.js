/* eslint-env browser */

function getQueryString(field, url) {
  const href = url || window.location.href;
  const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
  const string = reg.exec(href);
  return string ? string[1] : null;
}

const CLIENT_ID = getQueryString('clientId');
const CALLBACK_URL = getQueryString('callback');
const BASE_OPTS = `clientId=${CLIENT_ID}&callback=${CALLBACK_URL}`;

function loginFb() {
  window.location.href = `/fb?${BASE_OPTS}`;
}

const emailSignup = false;
function loginEmail(form) {
  function createValue(key, val) {
    const ele = document.createElement('input');
    ele.type = 'hidden';

    ele.name = key;
    ele.value = val;
    return ele;
  }

  form.appendChild(createValue('clientId', CLIENT_ID));
  form.appendChild(createValue('callback', CALLBACK_URL));

  if(emailSignup){
    form.appendChild(createValue('newacct', 'newacct'));
  }
}
