import express from 'express'
import cors from 'cors'
import { routes } from './routes'


const app = express();

app.use(cors());
app.use(express.json()); // middleware
app.use(routes);

app.listen(3333, () => {
  console.log("HTTP server listening on port")
})