//hold connection
let db;
const request = indexedDB.open("budget-tracker", 1); // Name and version to connect to

//if !exist, create
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save connection
  const db = event.target.result;
  // create an object store (table) called set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new-info", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  //when we create or establish a connection
  db = event.target.result;

  //if online, send data to loval apu
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    // uploadPizza();
  }
};

request.onerror = function (event) {
  //log the error
  console.log(event.target.errorCode);
};

//save the data to the indexDB
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new-info"], "readwrite");

  // access the table
  const infoObjectStore = transaction.objectStore("new-info");

  // add record to your store with add method
  infoObjectStore.add(record);
}

function uploadData() {
  //open transaction with db
  const transaction = db.transaction(["new-info"], "readwrite");
  //access our tables
  const objectStore = transaction.objectStore("new-info");
  //get all records to a var
  const getAll = objectStore.getAll();
  //if the getAll worked then we can post the data to the db
  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store send it to the server
    if (getAll.result.length > 0) {
      console.log("Sending fetch request");
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            throw new Error(serverResponse);
          }
          //clear the indexdb
          //open transaction
          const transaction = db.transaction(["new-info"], "readwrite");
          //access our table
          const objectStore = transaction.objectStore("new-info");
          //clear all the items
          objectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}
//if the browser comes back online we can upload our data
window.addEventListener("online", uploadData);
