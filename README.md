# Expedia API

### Install
```bash
  npm install expedia-api --save
```

### Sample initialize defines.
```javascript
  var options = {
    cid: // YOUR CID,
    apiKey: // YOUR APIKEY,
    sharedSecret: // YOUR SHARED_SECRET
  }

  Expedia = require("expedia-api")(options);
```

### Sample hotels list.
List hotels available in Seattle City, USA.
```javascript
  Expedia.hotels(
    {
      city: "Seattle",
      stateProvinceCode: "WA",
      countryCode: "US",
      arrivalDate: "05/05/2016",
      departureDate: "05/08/2016",
      room1: "2"
    }
  , function (response) {
    // JSON Response.
    console.log(response);
  });
```

### Test in your broswer
[https://tonicdev.com/npm/expedia-api](https://tonicdev.com/npm/expedia-api)
