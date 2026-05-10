import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import router from './routes/index.js';
import { tratarRequestBodyInvalido } from './middlewares/request-body.js';
import { globalErrorHandler } from './middlewares/global-error-handler.js';
import { zodErrorHandler } from './middlewares/zod-error.js';

const app = express();
const PORT = process.env.PORT || 8080;
const swaggerDocument = YAML.load('./swagger.yaml');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

// Configs
app.use(express.json());
app.use(cors(corsOptions));

// Rotas
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

// Middlewares de erro
app.use(tratarRequestBodyInvalido);
app.use(zodErrorHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Aguardando requisições na porta: ${PORT}`);
  console.log('Swagger local na rota: http://localhost:8080/api/docs');
});
