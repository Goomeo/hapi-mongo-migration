# hapi-mongo-migration
Hapi migration plugin for mongoDB. Use the mongodb-migrations module : https://github.com/emirotin/mongodb-migrations


## Install

```
npm install --save hapi-mongo-migration
```

## Usage

Optiens are the same as mongodb-migrations module.

```javascript
server.register({
    register : require('hapi-mongo-migration'),
    options     : {
        url             : 'mongodb://user:pass@server/database',
        collection      : 'hapiMigration',
        migrationPath   : './migrations',
    }
}, (err) => {

});
```

## Migration scripts

### Simple example

```javascript
'use strict';

exports.id = 'create-toby';

exports.up = function up(done) {
    let coll = this.db.collection('test');

    coll.insert({ name : 'tobi' }, done);
};

exports.down = function down(done) {
    let  coll = this.db.collection('test');

    coll.remove({}, done);
};
```

### Parallel inserts

```javascript
'use strict';

const async = require('async');

exports.id = 'error';

exports.up = function up(done) {
    let coll = this.db.collection('test');

    async.parallel([
        (done) => { coll.insert({ name : 'many' }, done); },
        (done) => { coll.insert({ name : 'george' }, done); },
        (done) => { coll.insert({ name : 'tobi' }, done); }
    ], done);
};

exports.down = function down(done) {
    let  coll = this.db.collection('test');

    async.parallel([
        (done) => { coll.remove({ name : 'many' }, done); },
        (done) => { coll.remove({ name : 'george' }, done); },
        (done) => { coll.remove({ name : 'tobi' }, done); }
    ], done);
};
```