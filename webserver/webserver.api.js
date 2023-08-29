import express from 'express';
import { UNICUMIntranetLoginService } from './endpoints/login.endpoint.js';
import cors from 'cors'
import { WikiArticleEndpointService } from './endpoints/wiki-article.endpoint.js';
import { UserOperationsEndpointService } from './endpoints/user-operations.endpoint.js';
import { LabelsAndCategoriesEndpointService } from './endpoints/duegev/labels.endpoint.js';
import { DuegevArticleLikeEndpointService } from './endpoints/duegev/like.endpoint.js';
import { TimeServerEndpointService } from './endpoints/duegev/time-server.endpoint.js';
import { ArticleSearchServerEndpoint } from './endpoints/duegev/article-search.endpoint.js';

const UnicumWebService = express();
UnicumWebService.use(cors());
UnicumWebService.use(express.json({ type: '*/*'}));
/* Endpoint Service Instantiations */
UNICUMIntranetLoginService.initLoginEndpoint(UnicumWebService);
WikiArticleEndpointService.initArticleEndpoint(UnicumWebService);
UserOperationsEndpointService.initUserOperationsEndpoint(UnicumWebService);
LabelsAndCategoriesEndpointService.init(UnicumWebService);
DuegevArticleLikeEndpointService.init(UnicumWebService);
TimeServerEndpointService.init(UnicumWebService);
ArticleSearchServerEndpoint.init(UnicumWebService);

/* ROOT and basic API definitions */
UnicumWebService.get('/', function (req, res) {
  //console.log("reguesting root")
  res.send('API-at-home root')
})

UnicumWebService.listen(3000);