import { TServerConfig } from "./server";
import { Application } from "express"

import * as dotenv from "dotenv"

import Routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import limit from "express-rate-limit";
import fs from "fs";
import path from "path";

export default class Server {
    configuration: TServerConfig;
    //sslOptions: any;

    constructor(app: Application, configuration: TServerConfig) {
        this.configuration = configuration;
        this.config(app);
        new Routes(app);
    }

    private config(app: Application): void {
        let time = this.configuration.limiter.time;
        let max = this.configuration.limiter.max;

        dotenv.config();
        app.use(helmet());
        app.use(cookieParser());
        app.use(cors(this.configuration.corsOptions));
        app.use(limit({ windowMs: time, limit: max }))
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.disable('x-powered-by');

        /*this.sslOptions = {
            key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
        }*/
    }
}