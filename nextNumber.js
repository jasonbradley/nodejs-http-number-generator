var http = require('http')
var fs = require('fs')

//load the lockfile (https://www.npmjs.com/package/lockfile | npm install lockfile)
var lockFile = require('lockfile')

//server settings
var PORT = 8000
var URL = '/'

//lock settings
var LOCK_PATH = '/tmp/lock_file'
var opts = [] //see https://www.npmjs.com/package/lockfile#lockfile-lock-path-opts-cb

//nextNumber settings
var FILE_PATH = '/tmp/next_number'
var STARTING_NUMBER = 1
var INCREMENT_COUNT = 1

//create the file for holding the count
function initFile()
{
    fs.writeFileSync(FILE_PATH, STARTING_NUMBER)
}

//increment the counter and return the next number
function incrementFileNumber()
{
    var currentNumber = parseInt(fs.readFileSync(FILE_PATH, 'utf8'))

    //ensure we have a number first
    nextNumber = (!currentNumber) ? STARTING_NUMBER : parseInt(currentNumber) + parseInt(INCREMENT_COUNT)

    //save the new number
    fs.writeFileSync(FILE_PATH, nextNumber)

    return nextNumber
}

//get the next number
function getNextNumber()
{
    var nextNumber = false

    if (fs.existsSync(FILE_PATH) === false) {
        initFile()
        nextNumber = STARTING_NUMBER
    } else {
        nextNumber = incrementFileNumber()
    }

    return parseInt(nextNumber)
}

//deal with the http request
function handleRequest(request)
{
    if (request.url == URL) {
        var nextNumber = getNextNumber()

        var response = { id: nextNumber }

        return JSON.stringify(response)
    }
}

//create the HTTP server
var server = http.createServer(function(req, res) {
    lockFile.lock(LOCK_PATH, opts, function (er) {
      var response = handleRequest(req)

      //write the response
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(response)

      //release the lock
      lockFile.unlock(LOCK_PATH, function (er) {
      })
    })
})

//start listening for requests
server.listen(PORT)
