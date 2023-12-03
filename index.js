const fs = require("fs");
const fetch = require('node-fetch');
const argv = process.argv.slice(2);
const operation = argv[0];
const readline = require("readline");

const wordForJoke = argv[1];

// Switch statement to determine the operation based on user input
switch (operation) {
    case 'searchTerm':
        jokeCrack(wordForJoke);
        break;
    case 'leaderBoard':
        topJoke();
        break;
    default:
        console.log(`Please use {searchTerm} word for searching any jokes.`);
        break;
}

// Function to fetch and display a joke based on a search term
async function jokeCrack(word) {
    try {
        // Fetch jokes based on the provided search term
        const response = await fetch(`https://icanhazdadjoke.com/search?term=${word}`, {
            headers: { Accept: "application/json" }
        });

        // Check if the response is successful
        if (!response.ok) return console.log(`Error in fetching data, ${response.status}`);

        // Parse the response to JSON
        const data = await response.json();

        // If jokes are found, select a random one and display it
        if (data.results.length > 0) {
            const size = data.results.length;
            const num = randomNum(0, size);
            const joke = data.results[num].joke;

            // Append the joke to a file
            fs.appendFileSync("jokes.txt", `${joke}\n`);

            // Display the joke
            console.log(joke);

            // Ask the user for feedback and update the leaderboard
            const userResponse = await getUserResponse();
            updateLeaderboard(joke, userResponse);
        } else {
            throw new Error(`No jokes found for "${word}"`);
        }
    } catch (error) {
        console.log({ error });
        console.log("Attention all humans! The joke gods have officially declared a day off. Apparently, even deities need a break from the pun-derful workload. In the meantime, please feel free to create your own laughter; just be cautious not to strain your humor muscles. Normal joking services will resume shortly. Thank you for your understanding, and remember, laughter is the best medicine, even when the joke gods are on vacation!");
    }
}

// Function to get user response
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

// Function to update the leaderboard with user responses to jokes
const updateLeaderboard = (joke, userResponse) => {
    const leaderboardPath = 'leaderboard.json';

    try {
        // Read existing leaderboard data or initialize an empty object
        const leaderboard = fs.existsSync(leaderboardPath)
            ? JSON.parse(fs.readFileSync(leaderboardPath, 'utf8'))
            : {};

        // Ensure the joke has an entry in the leaderboard
        leaderboard[joke] = leaderboard[joke] || { likes: 0, dislikes: 0 };

        // Update the count based on user response
        userResponse === 'yes' ? leaderboard[joke].likes++ : leaderboard[joke].dislikes++;

        // Write the updated leaderboard to the file
        fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboard, null, 2));

        console.log(`User response recorded. Thank you for your feedback!`);
    } catch (error) {
        console.error('Error updating leaderboard:', error.message);
    }
};

// Function to display the joke with the highest likes from the leaderboard
async function topJoke() {
    const response = fs.readFileSync('leaderboard.json', 'utf-8');
    const jokes = JSON.parse(response);
    let lead = 'not found', num = 0;

    // Iterate through the jokes to find the one with the highest likes
    for (let joke in jokes) {
        if (jokes[joke].likes > num) {
            lead = joke;
            num = jokes[joke].likes;
        }
    }

    console.log(lead);
}

// Function to generate a random number within a specified range
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
