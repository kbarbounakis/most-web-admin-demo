import {DataObject} from '@themost/data/data-object';
import {EdmMapping} from '@themost/data/odata';

@EdmMapping.entityType('User')
export default class User extends  DataObject {
    constructor() {
        super()
    }

    /**
     * @returns {Promise<User>}
     */
    @EdmMapping.func('me','User')
    static getMe(context) {
        if (context.user && context.user.name) {
            return context.model('User').where('name').equal(context.user.name).getTypedItem();
        }
        return Promise.resolve();
    }

}