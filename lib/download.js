var Download = require('download'),
	progress = require('download-status'),
	fs = require('fs')

var cwd = process.cwd()

module.exports = function(dataset, amount, all_option){
	if(all_option)
	{
		amount = Infinity
	}

	if(typeof amount === 'undefined')
	{
		console.log("Invalid amount given.")
		console.log("\n   For help type \"dmt --help\"\n")
		return
	}
	else if(dataset === "ebird")
	{
		downloadDataSet(dataset, "http://storage.googleapis.com/ebird.data.sikuli.org/index.json", amount)
	}
	else if(dataset === "apks")
	{
		downloadDataSet(dataset, "http://storage.googleapis.com/apk.bigdiff.org/index.json", amount)
	}
	else if(dataset === "web")
	{
		downloadDataSet(dataset, "http://storage.googleapis.com/ianstestbucket/index.json", amount)
	}
	else
	{
		console.log("Data set not found.")
		console.log("\n   For help type \"dmt --help\"")
	}
}

function downloadDataSet(dataset, url, amount){
	if(amount <= 0)
	{
		console.log("Invalid amount")
		return
	}

	data_dir = cwd + '/data'
	fs.exists(data_dir, function(exists){
		if(!exists){
			fs.mkdirSync(data_dir)
		}
	})	

	var dwnld_dir = cwd + "/data/" + dataset
	var json_download = new Download()
		.get(url)

	json_download.run(function(err, files){
		if(err){
			throw err
		}

		var index = JSON.parse(files[0].contents)
		if(amount > index.length)
		{
			console.log("Downloading all " + index.length + " files.")
			amount = index.length
		}
		var apk_download = new Download()
		fs.exists(dwnld_dir, function(exists){
			if(!exists){
				fs.mkdirSync(dwnld_dir)
			}
		})

		for(var i = 0; i < amount; i++)
		{
			apk_download.get(index[i].downloadUrl)
		}
		apk_download.dest(dwnld_dir)
			.use(progress())
		apk_download.run(function(err, files){
			if(err){
				throw err
			}

			console.log("Downloaded!")
		})
	})
}