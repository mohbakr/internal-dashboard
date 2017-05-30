var request = require('request');
var express = require('express');
var promise = require('promise')
var fs = require('fs');

var kubeService = function () {};



kubeService.prototype.getNodeAddressInfo = function (callback){
    
    var finalData = getData();
    console.log(finalData);
    var test = getHost_1_140_Data();
   console.log(test);

    return callback(finalData);

}

var getData = function(){


// Getting Data for Nodes info 
var nodesData = fs.readFileSync('sampleData/uptime', function(error, data){
  if(error) console.log(error);
  else{
    console.log('nodesData has been read successfully');
  }
}); 

// Getting Data for memory usage


  // var hosts = fs.readFileSync('sampleData/hosts', function(error, data){
  //   if(error) console.log(error);
  //   else{
  //     console.log('Memory Usage Data has been read successfully');
  //   }
  // });          
  //     var hosts = JSON.parse(hosts);

   // creating a json obj
   var nodesData = JSON.parse(nodesData);    

   //extracting the AWS zone from the string
   var str = nodesData.results[0].series[0].values[1][6];
   var res = str.split(":");

   var data=[];

   //extracting data, creating a json object and saving it in an array
   for(var i = 0; i < nodesData.results[0].series[0].values.length; i++)
   {
      var nodeAddress = {};
      nodeAddress['nodeIP']= nodesData.results[0].series[0].values[i][4];
      nodeAddress['uptime']= (((nodesData.results[0].series[0].values[i][14]) / (1000*60*60*24)).toPrecision(2))+" Days";
      nodeAddress['zone']= (nodesData.results[0].series[0].values[i][6]).split(":")[5];
      nodeAddress['memoryUsage']= ((nodesData.results[1].series[0].values[i][14]).toPrecision(2))+"%";
      nodeAddress['diskSpace']= ((nodesData.results[2].series[0].values[i][8]).toPrecision(2))+"%";
      
      //pushing the json data into the array
      data.push(nodeAddress); 
   }

    var myNewData = { 
      data
    }

return myNewData;
}



var getHost_1_140_Data = function(){

// Getting Data for Nodes info 
  var hostData = fs.readFileSync('sampleData/192-168-1-140', function(error, data){
    if(error) console.log(error);
    else{
      console.log('hostData has been read successfully');
    }
  }); 

   var hostData = JSON.parse(hostData);
   console.log(hostData);    

   //extracting the AWS zone from the string


   var data=[];

   //extracting data, creating a json object and saving it in an array
   for(var i = 0; i < hostData.results[0].series[0].values.length; i++)
   {
      console.log("i am in the loop")
      var nodeAddress = {};
      nodeAddress['nameSpace']= hostData.results[0].series[0].values[i][13];
      nodeAddress['pod']= hostData.results[0].series[0].values[i][11];
      nodeAddress['memoryUsage']= hostData.results[0].series[0].values[i][14];
      nodeAddress['upTime']= (((hostData.results[1].series[0].values[i][14]) / (1000*60*60*24)).toPrecision(2))+" Days";
      console.log(nodeAddress)
      //pushing the json data into the array
      data.push(nodeAddress); 
   }

    var myhostData = { 
      data
    }

  return myhostData;
}



module.exports = new kubeService();
