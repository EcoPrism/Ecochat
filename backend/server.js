const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
const request = require('request')
const axios = require('axios');
const app = express();
const FormData = require('form-data');
var fs = require('fs');
var HttpStatus = require('http-status-codes');
var morgan = require('morgan');
var Busboy = require('busboy');
var fileupload = require("express-fileupload");
var FileReader = require('filereader');
const reader = require('xlsx');
const multer  = require('multer')


// const { LocalStorage } = require('node-localstorage');
// const localStorage = new LocalStorage('./scratch');

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});

const baseurl= "https://ecoprismapiapi.azure-api.net/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/ingredients', function(req, res) {
    console.log("GET From SERVER");
    res.send(ingredients);
});

//Get ALL Countries Data
app.get('/countries', function(req, res) {
    var body = req.body;
    var options = {
      url: baseurl+'Entity/GetAvailableCountries',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});

//Get ALL Currencies Data
app.get('/currencies', function(req, res) {
  var body = req.body;
  var options = {
    url: baseurl+'Entity/GetAllCurrencies',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Generate SAS Token
app.get('/GetSASToken', function(req, res) {
  var body = req.body;
  var options = {
    url: baseurl+'Integration/GetSASToken',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});

//Get ALL Currencies Data
app.get('/country-currencies', function(req, res) {
  var body = req.body;
  var cur = req.headers.country;
  var options = {
    url: baseurl+'Entity/GetCurrencyByCountry?country='+cur,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Get ALL PDF Fields
app.get('/GetPdfParameter', function(req, res) {
  var appname = 'PDF';
  var filename = req.headers.filename;
  let data = '';
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://ecoprismapiapi.azure-api.net/File/ProcessPDFAndImageFile?fileName='+filename+'&AppName=PDF',
    headers: { 
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6', 
      'Cookie': 'ARRAffinity=a92929ff9d30479a471c61dcfdbd79a01a445a9b237727827954b582944f6b5c; ARRAffinitySameSite=a92929ff9d30479a471c61dcfdbd79a01a445a9b237727827954b582944f6b5c'
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    res.status(200).send(response.data);
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    res.status(400).send("Something Went Wrong");
    console.log(error);
  });
});

//Get ALL Legal Entity Data
app.get('/list-entities', function(req, res) {
    var username=req.headers.username;
    var body = req.body;
    var options = {
      url: baseurl+'Entity/GetLegalEntities?userEmail='+username,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});


//Get Available App Name For Connector Config
app.get('/get-appname', function(req, res) {
  var username=req.headers.username;
  var esg=req.headers.esg;
  var site=req.headers.site;
  var body = req.body;
  var options = {
    url: baseurl+'File/GetConfiguredAppNames?userEmail='+username+'&esgMetric='+esg+'&siteLocationId='+site,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Get ALL Site Location Data
app.get('/list-sitelocation', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/GetSiteLocations?userEmail='+username,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Get ALL Modules In Configration Scren
app.get('/list-modules', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/Integration/GetSupportedScopeAndModules',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});


//Get ALL Business Unit Data
app.get('/list-businessunits', function(req, res) {
    var username=req.headers.username;  
    var body = req.body;
    var options = {
      url: baseurl+'Entity/GetBusinessUnits?userEmail='+username,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});

//Get ALL Company Data
app.get('/list-company', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/GetBusinessUnits?userEmail='+username,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Create Legal Entity By Admin
app.post('/create-legalentity', function(req, res) {
  var username=req.headers.username;
    var body = req.body;
    var options = {
      url: baseurl+'Entity/CreateLegalEntity?userEmail='+username,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});

// Create Site Location By Admin
app.post('/create-sitelocation', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/CreateSiteLocations?userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Create Business Unit By Admin
app.post('/create-businessunit', function(req, res) {
  var username=req.headers.username;
    var body = req.body;
    var options = {
      url: baseurl+'Entity/CreateBusinessUnits?userEmail='+username,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});

// Create Company By Superadmin
app.post('/create-company', function(req, res) {
  var body = req.body;
  var options = {
    url: baseurl+'Entity/CreateParentEntity?userEmail=sudi@ecoprism.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Delete Legal Entity
app.post('/delete-legalentity', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/DeleteLegalEntity?oldLegalEntityName='+body.name+'&userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    }
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Delete Business Unit
app.post('/delete-businessunit', function(req, res) {
  var username=req.headers.username;
    var body = req.body;
    var options = {
      url: baseurl+'/Entity/DeleteBusinessUnit?oldBusinessUnitName='+body.name+'&userEmail='+username,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
      }
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});

// Delete Connector Config
app.post('/delete-connector-cofig', function(req, res) {
    var username=req.headers.username;
    var site=req.headers.site;
    var file=req.headers.file;
    var esg=req.headers.esg;
    var body = req.body;
    var options = {
      url: baseurl+'/File/DeleteConnectorConfig?siteLocationId='+site+'&fileFormat='+file+'&esgMetric='+esg+'&userEmail='+username,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
      }
    }
    request(options, function (error, response, body) {
      res.status(200).send(body);
    })
    
});


// Delete Site Location
app.post('/delete-sitelocation', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/DeleteSiteLocation?oldSiteLocationName='+body.name+'&userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    }
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});


//Update Legal Entity
app.post('/update-legalentity', function(req, res) {
  var username=req.headers.username;
  var old=req.headers.old;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/UpdateLegalEntity?oldLegalEntityName='+old+'&userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});


//Update Site Location
app.post('/update-sitelocation', function(req, res) {
  var username=req.headers.username;
  var old=req.headers.old;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/UpdateSiteLocation?userEmail='+username+"&oldSiteLocationName="+old,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Update Connector Config
app.post('/UpdateConnectorConfig', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'File/UpdateConnectorConfig?userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Update Business Unit
app.post('/update-businessunit', function(req, res) {
  var username=req.headers.username;
  var old=req.headers.old;
  var body = req.body;
  var options = {
    url: baseurl+'Entity/UpdateBusinessUnit?userEmail='+username+"&oldBusinessUnitName="+old,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'images', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
   cb(undefined, true)
}
}) 

app.post('/file', imageUpload.single('file'), (req, res) => {
  res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
      
      

         
      
      

      



//Get ALL Fields For Excel
app.get('/get-fields', function(req, res) {
  var module=req.headers.modulename;
  var filePattern=req.headers.pattern;
  var esg=req.headers.esgmetric;
  var body = req.body;
  var options = {
    url: baseurl+'/Integration/GetDestinationFieldsForMapping?AppName='+filePattern+'&Module='+esg,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

app.post('/GetAccessToken', function(req, res) {
  var body = req.body;
  console.log(body);
  var options = {
    url: "https://login.microsoftonline.com/2c4f8d59-3090-4fc7-a1d7-19a73ee1811c/oauth2/v2.0/token",
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});


// Save Connector Config
app.post('/SaveConnectorConfig', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'File/SaveConnectorConfig?userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

// Run Report
app.post('/RunReport', function(req, res) {
  var username=req.headers.username;
  var site=req.headers.site;
  var type=req.headers.type;
  var esgmetric=req.headers.esgmetric;
  var body = req.body;
  var options = {
    url: baseurl+'/File/RunReportForIncomingValues?siteLocation='+site+'&esgMetric='+esgmetric+'&fileFormat='+type+'&userEmail='+username,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'df42efbe925a41b6839b18649dd621a6'
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});

//Get ALL Connector Config
app.get('/list-connector-config', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/File/GetConnectorConfig?userEmail='+username,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
  
});


//Check Business Unit
app.get('/check-business', function(req, res) {
  var username=req.headers.username;
  var name=req.headers.name;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/CheckBusinessUnitNameExists?userEmail='+username+'&businessUnitName='+name,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});

//Check Legal Entity
app.get('/check-legal-entity', function(req, res) {
  var username=req.headers.username;
  var name=req.headers.name;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/CheckLegalEntityNameExists?userEmail='+username+'&legalEntityName='+name,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});

//Check Site Location
app.get('/check-sitelocation', function(req, res) {
  var username=req.headers.username;
  var name=req.headers.name;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/CheckSiteLocationNameExists?userEmail='+username+'&siteLocationName='+name,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});


//Get ALL Connector Config
app.get('/report-history', function(req, res) {
  var username=req.headers.username;
  var sl=req.headers.sl;
  var esg=req.headers.esg;
  var body = req.body;
  var options = {
    url: baseurl+'/ReportHistory/GetReportHistoryBySiteConfig?email='+username+'&siteLocation='+sl+'&esgMetric='+esg,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});

//Get ALL Legal Entity Type
app.get('/fetch-legal-entity-type', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/GetLegalEntityType',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});

//Get ALL Site Type
app.get('/list-sitetype', function(req, res) {
  var username=req.headers.username;
  var body = req.body;
  var options = {
    url: baseurl+'/Entity/GetSiteType',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});


//Get ALL Site Type
app.get('/ESG', function(req, res) {
  var username=req.headers.username;
  var param=req.headers.param;
  var body = req.body;
  var options = {
    url: baseurl+'/Integration/GetESGMetrics?ModuleName='+param,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response, body) {
    res.status(200).send(body);
  })
});



app.listen(8000);