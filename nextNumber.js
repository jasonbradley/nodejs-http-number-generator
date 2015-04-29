var http = require('http')
var fs = require('fs')

var PORT = 8000
var FILE_PATH = '/tmp/next_number'
var STARTING_NUMBER = 1
var INCREMENT_COUNT = 1
var URL = '/'

function initFile()
{
    fs.writeFileSync(FILE_PATH, STARTING_NUMBER)
}

function incrementFileNumber()
{
    var currentNumber = parseInt(fs.readFileSync(FILE_PATH, 'utf8'))

    //ensure we have a number first
    nextNumber = (!currentNumber) ? STARTING_NUMBER : parseInt(currentNumber) + parseInt(INCREMENT_COUNT)

    //save the new number
    fs.writeFileSync(FILE_PATH, nextNumber)

    return nextNumber
}

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

var server = http.createServer(function(req, res) {
    if (req.url == URL) {
        var nextNumber = getNextNumber()

        var response = { id: nextNumber }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
    }
})

//START LISTENING FOR REQUESTS
server.listen(PORT)
