module.exports = function() {

  var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
  var results = [];
  var metaarr = [];
  
  var cpuCount = api.os.cpus().length;
  
  var workers = [];
  for (var i = 0; i < cpuCount; i++) {
    var worker = api.cluster.fork();
    workers.push(worker);
  }

  var numofelem = task.length/cpuCount;
  metaarr[0] = task.slice(0,numofelem);
  metaarr[1] = task.slice(numofelem,task.length);
  var i =0;
  
  workers.forEach(function(worker) {
	  
	  

    worker.send({ task: metaarr[i] });
	++i;
    worker.on('exit', function (code) {
      console.log('exit ' + worker.process.pid + ' ' + code);
    });

    worker.on('message', function (message) {
      console.log(
        'message from worker ' + worker.process.pid + ': ' +
        JSON.stringify(message)
      );

	  for(var i = 0; i < message.result.length;i++) results.push(message.result[i]);

	  console.log(results);
	   
      if (results.length === cpuCount) {
        process.exit(1);
      }

    });

  });

};
