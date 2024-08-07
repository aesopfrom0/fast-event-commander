const fs = require('fs');
const dotenv = require('dotenv');

// .env 파일에서 환경 변수를 로드합니다
dotenv.config();

const manifest = {
  manifest_version: 3,
  name: 'Fast Event Commander',
  description: 'Quickly add events to your calendar from text input.',
  version: '0.9.0',
  permissions: ['identity', 'storage', 'activeTab'],
  oauth2: {
    client_id: process.env.REACT_APP_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  },
  background: {
    service_worker: 'service-worker.js',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'images/icon16.png',
      48: 'images/icon48.png',
      128: 'images/icon128.png',
    },
  },
  icons: {
    16: 'images/icon16.png',
    48: 'images/icon48.png',
    128: 'images/icon128.png',
  },
};

// `dist/manifest.json` 파일로 저장합니다
fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
