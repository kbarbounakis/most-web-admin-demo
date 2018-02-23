import HttpBaseController from '@themost/web/controllers/base';
import {AuthStrategy} from '@themost/web/handlers/auth';
import {httpController,httpGet,httpPost,httpAction,httpParam} from '@themost/web/decorators';


@httpController()
export default class AuthController extends HttpBaseController {

    constructor(context) {
        super(context);
    }

    @httpAction('login')
    @httpGet()
    getLogin() {
        return Promise.resolve(this.view());
    }

    @httpAction('logout')
    @httpGet()
    getLogout() {
        const context = this.context;
        /**
         * @type {AuthStrategy}
         */
        const authStrategy = context.application.getStrategy(AuthStrategy);
        return authStrategy.logout(context).then(()=> {
            return Promise.resolve(this.redirect('/auth/login'));
        });
    }

    @httpAction('login')
    @httpPost()
    @httpParam({
        "name":"username",
        "type": "Email",
        "required": true
    })
    @httpParam({
        "name":"password",
        "type": "Text",
        "required": true
    })
    postLogin(username, password) {
        const context = this.context;
        /**
         * @type {AuthStrategy}
         */
        const authStrategy = context.application.getStrategy(AuthStrategy);
        return authStrategy.login(context,username,password).then(()=> {
            return Promise.resolve(this.redirect('/'));
        }).catch((err)=> {
           return Promise.resolve({
               message:err.message
           });
        });

    }

}