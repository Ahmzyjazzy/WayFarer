import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import config from './src/config';

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//setup postgress connection
const pool = new Pool(config);
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1)
});

//register api routes
import apiVersion1 from './src/routes/v1';
apiVersion1(app, pool);

app.get('*', (req, res) => {
    res.json({
        status: 'error',
        error: 'Invalid endpoint'
    });
});

app.listen(process.env.PORT, () =>
  console.log(`app listening on port ${process.env.PORT}!`),
);