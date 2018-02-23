import {DataObject} from '@themost/data/data-object';
import {EdmMapping} from '@themost/data/odata';

@EdmMapping.entityType('Person')
export default class Person extends  DataObject {
    constructor() {
        super()
    }

    /**
     * @returns {Promise<Person>}
     */
    @EdmMapping.func('me', 'Person')
    static getMe(context) {
        if (context.user && context.user.name) {
            return context.model('Person').where('user/name').equal(context.user.name).getTypedItem();
        }
        return Promise.resolve();
    }

}
