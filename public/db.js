
let db;
const request = window.indexedDB.open('budget-tracker' , 1);



  request.onupgradeneeded = ({ target }) => {
      db = target.result;
       db.createObjectStore('WaitingStore', {autoIncrement: true });
};


request.onsuccess = ({ target }) => {
    db = target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(e) {
    console.log(`Error: ${e.target.errorCode}`)
};

function saveRecord(record) {
    const transaction = db.transaction(['WaitingStore'], 'readwrite');
    const store = transaction.objectStore('WaitingStore');
    store.add(record);

   
}
function checkDatabase() {
    const transaction = db.transaction(['WaitingStore'], 'readwrite');
    const store = transaction.objectStore('WaitingStore');
    const getAll = store.getAll();
    

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transation/bulk' , {
              method: 'POST' ,
              body: JSON.stringify(getAll.result),
              headers: {
                  Accept: 'application/json, text/plain, */*' ,
                  'Content-Type': 'application/json'
              }  
            })
            .then((response) => {
                return response.json()
            })
            .then(() => {
                
                   const transaction = db.transaction(['WaitingStore'], 'readwrite');
                    const activeStore = transaction.objectStore('WaitingStore');
                    activeStore.clear();
                
            });
        }
    };
}

window.addEventListener('online', checkDatabase);