// need to add files to cache
// need the cache name- look at lesson 12
// data cache- look at lesson 12

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


const FILES_TO_CACHE = [
    "/",
    "index.html",
    "/manifest.json",
    "/styles.css",
    "/db.js",
    "/index.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",

];


// install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    // self.skipWaiting();
});




// // activate pulled from lesson 12
// self.addEventListener("activate", (event) => {
//   const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return cacheNames.filter(
//           (cacheName) => !currentCaches.includes(cacheName)
//         );
//       })
//       .then((cachesToDelete) => {
//         return Promise.all(
//           cachesToDelete.map((cacheToDelete) => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });


self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cachedResponse) => {
        return fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            cachedResponse.put(event.request.url, response.clone())
          }
          return response
        }).catch(err => {
          return cachedResponse.match(event.request)
        })
      })
      .catch(err => {
        console.log(err)
      })
    )
      return;
    }

  event.respondWith(fetch(event.request).catch(()=>{
    return caches.match(event.request).then((res)=>{
if(res){
  return res;
} else if (event.request.headers.get("accept").includes("text/html")){
  return caches.match("/");
}
    })
  }))
      })
