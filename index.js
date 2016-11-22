'use strict';

const mm    = require('mongodb-migrations');

/**
 * Plugin registration function
 *
 * @param {object}      server                              Hapi Server Instance
 * @param {object}      options                             Plugin options
 * @param {string}      [options.url]                       Mongodb connection URL
 * @param {string}      [options.host]                      MongoDB host (optional when using replicaset),
 * @param {number}      [options.port]                      MongoDB port (optional when using replicaset),
 * @param {string}      [options.db]                        MongoDB database name,
 * @param {string}      [options.ssl]                       boolean, if true, '?ssl=true' is added to the MongoDB URL,
 * @param {string}      [options.user]                      MongoDB user name when authentication is required,
 * @param {string}      [options.password]                  MongoDB password when authentication is required,
 * @param {string}      options.collection                  The name of the MongoDB collection to track already ran migrations,
 * @param {string}      options.migrationPath               the directory (path relative to the current folder) to store migration files in and read them from,default
 * @param {string}      [options.timeout]                   time in milliseconds after which migration should fail if done() is not called (use 0 to disable timeout)
 * @param {number}      [options.poolSize]                  the size of the mongo connection pool,
 * @param {function}    next                                Callback
 */
exports.register = (server, options, next) => {
    let migrator = new mm.Migrator(options);

    migrator.runFromDir(options.migrationPath, (err) => {
        if (err) {
            migrator.rollback(() => {
                migrator.dispose(next);
            });
            return;
        }
        migrator.dispose(next);
    });
};

exports.register.attributes = {
    name : 'hapi-mongo-migration'
};
