/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import _ from 'lodash';
/**
 *
 * @param {DataEventArgs} event
 * @param {Function} callback
 */
export function afterSave(event, callback) {
    if (event.state !== 1) {
        return callback();
    }
    const context = event.model.context;
    return event.model.where('id').equal(event.target.id).select('external').silent().value().then((value) => {
        if (value) {
            return callback();
        }
        return context.model('UserCredential').where('id').equal(event.target.id).silent().count().then((count) => {
            if (count===1) { return callback(); }
            //create credentials
            const creds = {
                id:event.target.id,
                pwdLastSet: true,
                $state:1
            };
            return context.model('UserCredential').silent().save(creds).then(() => {
                return callback();
            });
        });
    }).catch((err) => {
        return callback(err);
    });
}