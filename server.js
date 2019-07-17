import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static('public/', { index: 'index.html' }));

//register api routes
import apiVersion1 from './src/routes/v1';
apiVersion1(app);

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to WayFare Api'
    });
});

app.get('*', (req, res) => {
    res.json({
        status: 'error',
        error: 'Invalid endpoint'
    });
});

app.listen(PORT, () =>
  console.log(`app listening on port ${PORT}!`),
);