import express from 'express';
import { UNICUMIntranetLoginService } from './endpoints/login.endpoint.js';
import cors from 'cors'

const UnicumWebService = express();
UnicumWebService.use(cors());
UnicumWebService.use(express.json({ type: '*/*'}));
/* Endpoint Service Instantiations */
UNICUMIntranetLoginService.initLoginEndpoint(UnicumWebService);

/* ROOT and basic API definitions */
UnicumWebService.get('/', function (req, res) {
  //console.log("reguesting root")
  res.send('API-at-home root')
})

UnicumWebService.listen(3000)