var frisby = require('frisby');

frisby.globalSetup({ 
  timeout: 1000000
});

var apiUrl = 'http://opendataqa.arcgis.com/';
var per_page = 100;
var page = 1;
var datasetId;

var datasetSpec = {
  //object_id_field: String,
  //display_field: String,
  //max_record_count: Number,
  record_count: Number,
  //geometry_type: String,
  landing_page: String,
  description: String,
  extent: { coordinates: Array },
  fields: Array,
  id: String,
  item_name: String,
  type: String,
  item_type: String,
  name: String,
  url: String,
  current_version: Number
};

frisby.create('Get Open Data search results')
  .get(apiUrl + 'datasets.json?per_page=' + per_page + '&page=' + page)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    data: Array,
    metadata: {
      query_parameters: {
        bbox: null,
        page: Number,
        per_page: Number,
        q: String,
        required_keywords: Array,
        sort_by: String,
        sort_order: String
      },
      stats: {
        count: Number,
        total_count: Number
      }
    }
  })
  .expectJSONTypes('metadata.stats.top_tags.*', {
    name: String,
    count: Number
  })
  .expectJSONTypes('data.*', datasetSpec)
  .afterJSON(function (responseObj) {
    // NOTE: kinda sucks to have to nest but just setting global datasetId here didn't work
    var datasetId = responseObj.data[0].id;
    frisby.create('Get Open Data dataset')
      .get(apiUrl + 'datasets/' + datasetId + '.json')
      .expectStatus(200)
      .expectHeaderContains('content-type', 'application/json')
      .expectJSONTypes({
        data: datasetSpec
      })
    .toss();
  })
.toss();
