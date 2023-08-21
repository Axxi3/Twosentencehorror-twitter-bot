require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const CronJob = require("cron").CronJob;
const axios = require("axios");
const { twitterClient } = require("./twitterClient.js"); 


app.get("/", (req, res) => {
  res.send("Hello from the Express server!");
});  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const tweet = async (data) => {
  let tvShowQuotes = data;

  async function LoadData() {
    const randomnumber = getRandomIndex(tvShowQuotes.length);   
    console.log(tvShowQuotes[randomnumber].media.richtextContent.document[0].c[0].t)  
    if(tvShowQuotes[randomnumber].media.richtextContent.document[0].c[0].t!==undefined) { 
      const tweetText = tvShowQuotes[randomnumber].media.richtextContent.document[0].c[0].t;
      console.log(tvShowQuotes[randomnumber].media.richtextContent.document.length)  
      console.log(tweetText)   
      
           const tweetResponse = await tweetData(tweetText);    
       
           console.log(tweetResponse.data.id)
      
          for (let index = 1; index < tvShowQuotes[randomnumber].media.richtextContent.document.length; index++) {
           
              await replyToTweet(tweetResponse.data.id, tvShowQuotes[randomnumber].media.richtextContent.document[index].c[0].t);
            
          }
    } else { 
      cronTweetfordata.start()
    }
   
  }  

  async function tweetData(data) {  
  
    return await twitterClient.v2.tweet(data+ "\n" + "Follow fot daily horror dose #twosentencehorror");
  }

  const replyToTweet = async (tweetId, replyText) => {
    try {
      const response = await twitterClient.v2.createTweet({
        text: replyText,
        in_reply_to_tweet_id: tweetId
      });
      console.log("Replied to Tweet ID:", tweetId);
      return response;
    } catch (error) {
      console.error("Error replying to tweet:", error);
    }
  };

  function getRandomIndex(max) {
    return Math.floor(Math.random() * (max - 1)) + 1;
  }

  try {
    LoadData()
  } catch (e) {
    console.log(e);
  }
};


// const cronTweet = new CronJob("*/10 * * * * *", async (data) => {  
//   console.log("data taken");   
//   tweet(data);  
//   console.log("Tweet done")
// });
 


//0 */3 * * *
const cronTweetfordata = new CronJob( "* * * * *",  async () => {
  console.log("data loaded");   



  const options = {
    method: 'GET',
    url: 'https://subreddit-scraper.p.rapidapi.com/subreddit',
    params: {
       q: 'TwoSentenceHorror',
      limit: '25'
    },
    headers: {
      'X-RapidAPI-Key': '3b7a0ef5f1msha3a7cf231bf6c24p1229a7jsn582f6d9f7cfb',
      'X-RapidAPI-Host': 'subreddit-scraper.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    tweet(response.data.posts)
  } catch (error) {
    console.error(error);
  }


 
},null,
true,
"Asia/Kolkata");

cronTweetfordata.start();




