import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DATABASE } from './detabase/index.js';
import { UserRoute } from './routes/auth.routes.js';
import { ProductRoute } from './routes/product.routes.js';
import { CheckoutRoute } from './routes/chekout.routes.js';
import { SummaryRoute } from './routes/summary.routes.js';
import { FileuploadRoute } from './routes/fileupload.routes.js';
import { CartRoute } from './routes/usercart.routes.js';

dotenv.config()

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ optionsSuccessStatus: 200 }));



app.get('/', (req, res) => {
    res.send({ message: "api is working" })
});

app.use('/api', UserRoute);
app.use('/api', ProductRoute);
app.use('/api', CheckoutRoute);
app.use('/api', SummaryRoute);
app.use('/api', FileuploadRoute);
app.use('/api', CartRoute);

app.use("*", (req, res) => {
    res.status(405).json({
        message: "Method Not Allowed",
    });
});

DATABASE()
    .then((response) => {
        try {
            app.listen(process.env?.PORT, undefined, () => {
                console.log(`Server connected to http://localhost:${process.env?.PORT}`)
            })
            // SocketServer(server)
        } catch (error) {
            console.log('Cannot connect to the server', error)
        }
    })
    .catch((error) => {
        console.log("Invalid database connection...!", error);
    })