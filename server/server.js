import path from 'path';
import {HttpApplication} from '@themost/web/app';
import {ODataModelBuilderConfiguration} from '@themost/web/odata';
//initialize http application
const app = new HttpApplication(path.resolve(__dirname));
//initialize OData services configuration
ODataModelBuilderConfiguration.config(app).then((builder) => {
    builder.hasContextLink((context) => {
        return '/api/$metadata';
    });
    //and finally start application
    app.start({
        "port":3001
    });
}).catch((err)=> {
    console.log(err);
});



