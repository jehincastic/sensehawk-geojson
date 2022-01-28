### To start this app follow the instruction

*Install Dependencies*
* Use npm or yarn to install the required dependencies
```console
foo@bar:~$ npm i (or) yarn
```

*Update the envinorments variables based on the [.env.sample][env] file*
  * DB_URL => MongoDB Database url
  * PRIVATE_KEY => JWT Private Key
  * PORT => Port number to run the server

*Start the server*
  * To start the server and publisher 
  ```console
  foo@bar:~$ npm run start (or) yarn start
  ```

*Note*
  * The [postman collection][postman] is also included

[env]: https://github.com/jehincastic/sensehawk-geojson/blob/master/.env.example
[postman]: https://github.com/jehincastic/sensehawk-geojson/blob/master/postman_collection.json