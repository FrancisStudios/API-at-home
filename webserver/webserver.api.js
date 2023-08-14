import express from 'express';
import { UNICUMIntranetLoginService } from './endpoints/login.endpoint.js';

const UnicumWebService = express();
/* Endpoint Service Instantiations */
UNICUMIntranetLoginService.initLoginEndpoint(UnicumWebService);

/* ROOT and basic API definitions */
UnicumWebService.get('/', function (req, res) {
  res.send('API-at-home root')
})

UnicumWebService.listen(3000)