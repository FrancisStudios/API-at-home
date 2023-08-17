import express from 'express';
import { UNICUMIntranetLoginService } from './endpoints/login.endpoint.js';
import cors from 'cors'
import { WikiArticleEndpointService } from './endpoints/wiki-article.endpoint.js';
import { UserOperationsEndpointService } from './endpoints/user-operations.endpoint.js';

const UnicumWebService = express();
UnicumWebService.use(cors());
UnicumWebService.use(express.json({ type: '*/*'}));
/* Endpoint Service Instantiations */
UNICUMIntranetLoginService.initLoginEndpoint(UnicumWebService);
WikiArticleEndpointService.initArticleEndpoint(UnicumWebService);
UserOperationsEndpointService.initUserOperationsEndpoint(UnicumWebService);

/* ROOT and basic API definitions */
UnicumWebService.get('/', function (req, res) {
  //console.log("reguesting root")
  res.send('API-at-home root')
})

UnicumWebService.listen(3000);