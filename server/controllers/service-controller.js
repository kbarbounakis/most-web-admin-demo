import HttpServiceController from '@themost/web/controllers/service';
import {httpController} from '@themost/web/decorators';

@httpController()
export default class ServiceController extends HttpServiceController {
    constructor(context) {
        super(context);
    }
}