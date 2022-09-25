// create an express app
require('dotenv').config()
const { json } = require("express")
const express = require("express")
const app = express()
const request = require('axios')
const { default: axios } = require("axios")

app.set('view engine', 'ejs')

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", async function (req, res) {

    await main()

    async function main() {
        var tweetDetails = await getDetails()
        if (tweetDetails.author_id === 'unknown') {
            tweetDetails.author = 'Unknown'
        } else {
            tweetDetails.author = await getUser(tweetDetails.author_id)
        }   
        res.render('index', await tweetDetails)
    }
})


async function getDetails() {

    return new Promise(function (resolve, reject) {
        var url = 'https://api.twitter.com/2/tweets/search/recent?query=-is%3Aretweet%20' + process.env.QUERY + '%20lang%3Aen&max_results=100&expansions=author_id&user.fields=url'
        console.log(url)
        axios.get(url, {method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER}` ,
        }}).then(
            (response) => {

                var result = response.data;
                var randomNumber = Math.floor(Math.random() * result.data.length);
                var randomTweetData = result.data[randomNumber]
                
                if (typeof randomTweetData !== "undefined") {
                    if (randomTweetData.author_id) {
                        var userId = randomTweetData.author_id
                    } else {
                    userId = "unknown"
                } 
                var data = {tweet: randomTweetData.text, author_id: userId, tweetId:randomTweetData.id}
                } else {
                    var data = {tweet: 'N/A', author_id: "unknown", tweetId:"N/A"}
                }
                resolve(data);
            },
                (error) => {
                reject(error);
            }
        );
    });

}

async function getUser(the_id) {

    return new Promise(function (resolve, reject) {
        axios.get(`https://api.twitter.com/2/users/${the_id}`, {method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER}` ,
        }}).then(
            (response) => {

                var result = response.data;
                console.log(result.data)
                console.log(result.data.username)
                
                resolve(result.data.username);
            },
                (error) => {
                reject(error);
            }
        );
    });

}

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."))