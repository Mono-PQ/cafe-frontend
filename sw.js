const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    '/',
    '/index.html',
    '/fallback.html',
    '/js/app.js',
    '/js/ui.js',
    '/css/index.css',
    '/libs/bootstrap/css/bootstrap.min.css',
    '/libs/bootstrap/css/bootstrap.min.css.map',
    '/libs/bootstrap/js/bootstrap.min.js',
    '/libs/bootstrap/js/bootstrap.min.js.map',
    '/libs/popper/popper.min.js', 
    // '/assets/img/myBanner.png',
    // '/assets/img/myLogo.png',
    // '/assets/img/myMembership.png',
    // '/assets/img/myMenu.png',
    // '/assets/img/myOutlets.png',
    // '/assets/img/carousel/photo1.jpg',
    // '/assets/img/carousel/photo2.jpg',
    // '/assets/img/carousel/photo3.jpg',
];

// Cache size limit function
const limitCacheSize = (names, size) => {
    caches.open(names).then(cache=>{
        cache.keys().then(keys=>{
            if (keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(names, size));
            }
        })
    })
}

// Install service worker 
self.addEventListener('install', evt => {
    // console.log('Service worker has been installed.')
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Caching shell assets.');
            cache.addAll(assets);
        })
    );
});

// Activate event
self.addEventListener('activate', evt=>{
    // console.log('Service worker has been activated.')
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys));
            return Promise.all(keys
                .filter(key => key!== staticCacheName && key !==dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', evt =>{
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
            caches.match(evt.request).then(cacheRes =>{
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache =>{
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 150);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if(evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/fallback.html');
                }
            })
        );
    }
});