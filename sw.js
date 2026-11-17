/* 서비스 워커: 앱 파일을 휴대폰에 저장해 두고, 인터넷이 없으면 저장본을 보여줌 */
const CACHE = 'saturday-light-v1';   // 파일을 고친 뒤에는 v2, v3…로 바꿔 주세요
const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// 설치: 필요한 파일 미리 저장
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

// 활성화: 예전 버전 저장본 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// 요청: 인터넷이 되면 최신 파일, 안 되면 저장본
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html'))
      )
  );
});
