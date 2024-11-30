import e from "express"
import bodyParser from "body-parser"
import axios from "axios"

const port = 3000
const app = e()

app.listen(port)
app.use(e.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
var selectedCoin
var history
const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': 'coinranking1033bfea39bd717c00dc0cf9826809d2d4c4fed713b428e9'
    },
  };
  

app.get("/", async (req,res) =>{
    try{
        const response = await axios.get("https://api.coinranking.com/v2/coins",options);
        res.render("index.ejs",{
          coins: response.data.data.coins
        })
    }   catch (error) {
        console.error("Failed to make request:", error.response.data.message);
        res.status(500).send("Failed to fetch activity. Please try again.");
    }
});

app.post("/getCoinDetails", async (req,res) =>{
  const coinUuid = req.body.uuid
  const timeperiod = req.body.timeperiod || '24h'
  try{
    const response = await axios.get(`https://api.coinranking.com/v2/coin/${coinUuid}`,options);
    const historyResult = await axios.get(`https://api.coinranking.com/v2/coin/${coinUuid}/history?timePeriod=${timeperiod}`,options)
    selectedCoin = response.data.data.coin
    history = historyResult.data.data.history
    res.redirect("/coinDetails")
  }catch (error) {
    console.error("Failed to make request:", error);
    res.status(500).send("Failed to fetch activity. Please try again.");
  }
})

app.get("/coinDetails", (req, res) => {
  if (!selectedCoin) {
    res.status(404).send("Coin details not found. Please try again.");
    return;
  }
  res.render("coinDetail.ejs", { coin: selectedCoin,history:history });
  selectedCoin = null
  history= null
});       