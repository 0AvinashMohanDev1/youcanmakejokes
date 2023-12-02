const fs=require("fs");
const fetch = require('node-fetch');
const argv=process.argv.slice(2);
const operation=argv[0];
const readline=require("readline")

const wordForJoke=argv[1];

switch (operation) {
    case 'searchTerm':
        jokeCrack(wordForJoke);
        break;
    case 'leaderBoard':
        topJoke();
        break;
    default:
        console.log(`Please use {searchTerm} word for searching any jokes.`)
        break;
}

async function jokeCrack(word){
    
    try {
      const response=await  fetch(`https://icanhazdadjoke.com/search?term=${word}`,{
        headers:{Accept:"application/json"}
      })
      if(!response.ok)return console.log(`Error in fetching data, ${response.status}`);
      const data=await response.json();
    //   console.log(data)
      if(data.results.length>0){
        const size=data.results.length;
        const num=randomNum(0,size);
        const joke=data.results[num].joke;

        fs.appendFileSync("jokes.txt",`${joke}\n`);
        console.log(joke);
        // Ask the user if they like the joke
      const userResponse = await getUserResponse();

      // Process the user response and update the leaderboard
      updateLeaderboard(joke, userResponse);
      }else {
                throw new Error(`No jokes found for "${word}"`);
      }
    } catch (error) {
        console.log({error})
      console.log("Attention all humans! The joke gods have officially declared a day off. Apparently, even deities need a break from the pun-derful workload. In the meantime, please feel free to create your own laughter; just be cautious not to strain your humor muscles. Normal joking services will resume shortly. Thank you for your understanding, and remember, laughter is the best medicine, even when the joke gods are on vacation!");
    }
}
const getUserResponse = async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise(resolve => {
      rl.question('Did you like the joke? (yes/no): ', answer => {
        rl.close();
        resolve(answer.toLowerCase().trim());
      });
    });
  };


  const updateLeaderboard = (joke, userResponse) => {
    const leaderboardPath = 'leaderboard.json';
  
    try {
      const leaderboard = fs.existsSync(leaderboardPath)
        ? JSON.parse(fs.readFileSync(leaderboardPath, 'utf8'))
        : {};
      leaderboard[joke] = leaderboard[joke] || { likes: 0, dislikes: 0 };
  
      userResponse === 'yes' ? leaderboard[joke].likes++ : leaderboard[joke].dislikes++;
  
      fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboard, null, 2));
  
      console.log(`User response recorded. Thank you for your feedback!`);
    } catch (error) {
      console.error('Error updating leaderboard:', error.message);
    }
  };
  
 async function topJoke(){
    const response=fs.readFileSync('leaderboard.json','utf-8');
    const jokes=JSON.parse(response);
    let lead='not fund',num=0;
    for(let joke in jokes){
        if(jokes[joke].likes>num){
            lead=joke;
            num=jokes[joke].likes;
        }
    }
    console.log(lead);
 }

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
