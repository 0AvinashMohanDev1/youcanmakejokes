# youcanmakejokes

This Node.js application allows users to search for jokes based on a provided search term and tracks user responses to jokes, creating a leaderboard of the most liked jokes.

## Prerequisites

- Node.js installed on your machine

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   node <filename.js> <operation> <search-term>
   ```

   - `<filename.js>`: The name of the JavaScript file (e.g., `index.js`).
   - `<operation>`: Use `searchTerm` to search for jokes or `leaderBoard` to view the leaderboard.
   - `<search-term>`: The word to search for jokes (applicable only for the `searchTerm` operation).

## Operations

### 1. Search for Jokes

To search for jokes based on a specific term:

```bash
node index.js searchTerm <word>
```

Replace `<word>` with the term you want to search for jokes.

### 2. View Leaderboard

To view the leaderboard of the most liked jokes:

```bash
node index.js leaderBoard
```

## Feedback

After each displayed joke, the application prompts the user to provide feedback by answering whether they liked the joke. The feedback is recorded, and the leaderboard is updated accordingly.

---