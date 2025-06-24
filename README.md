# NBA AI Assistant 🏀

An NBA fantasy basketball assistant that compares players and provides data driven recommendations for your fantasy lineup.

## Features

- **Player Comparison**: Compare two NBA players head to head
- **Matchup Analysis**: Get insights based on season and historical performance against each player's next opponent
- **AI Recommendations**: Get recommendations on who would be the best pickup


## Tech Stack

### Backend
- **Node.js** runs both frontend and backend servers
- **[Mastra Framework](https://mastra.ai/en/docs)** for AI agent orchestration
- **OpenAI GPT-4o** LLM used as the brains of the agent
- **[Elasticsearch](https://www.elastic.co/)** for storing, querying and aggregating NBA player data
- **Dotenv** loads environment variables into `process.env`

### Frontend
- **React** for simple chat interface
- **@ai-sdk/react** [useChat](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat#usechat) hook for querying agent server
- **ReactMarkdown** for properly formatted responses
- **Vite** for scaffolding react project

## Prerequisites

Before running this app, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Elasticsearch cluster** (local or cloud-hosted)
- **[OpenAI API key](https://auth.openai.com/log-in)**

## Installation

1. **Clone the repository**
   ```console

   git clone https://github.com/jdarmada/nba-fantasy-chatbot-js.git

   cd nba-ai-assistant-js

   ```

2. **Install dependencies**
   
   Install all dependencies while in the root folder, run the command:
   ```console

   npm install

   ```


3. **Environment Configuration**
   
   Create a `.env` file in the `backend` folder with the following variables:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Elasticsearch Configuration
   ELASTIC_ENDPOINT=your_elasticsearch_endpoint_here
   ELASTIC_API_KEY=your_elasticsearch_api_key_here
   ```

## Setup Instructions

### 1. Elasticsearch Setup

First, you need an active Elasticsearch cluster. Two options:

**Option A: Use Elasticsearch Cloud**
- Sign up for [Elastic Cloud](https://cloud.elastic.co/)
- Create a new deployment
- Get your endpoint URL and API key

**Option B: Run Elasticsearch locally**
- Install and [run Elasticsearch locally](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart)
- Use `http://localhost:9200` as your endpoint
- Generate an API key

### 2. Data Ingestion

The next step is ingesting the included sample NBA player data into Elasticsearch. 
Head over to `playerDataIngestion.js` in the `backend/lib` directories and run the main function at the bottom.

```console
cd backend/lib
node playerDataIngestion.js
```

Running this file will:
- Create the `sample-nba-player-data` index
- Ingest sample player statistics from the CSV file `sample_nba_data.csv` into Elasticsearch
- Set up proper field mappings to ensure the agent can find and aggregate relevant stats


## Running the Application

### Development Mode

1. **Start both the frontend and backend server**
   ```console
   cd nba-ai-assistant-js
   npm run dev
   ```
   The backend exposes the agent on `http://localhost:4111`, 
   while the frontend runs on `http://localhost:5173`


2. **Access the app**
   Open your browser and navigate to `http://localhost:5173`

## Usage

### Available Players

The application currently supports comparisons for the following NBA players:

- LeBron James
- Stephen Curry
- Jayson Tatum
- Jaylen Brown
- Nikola Jokic
- Luka Doncic
- Kyrie Irving
- Anthony Davis
- Kawhi Leonard
- Russell Westbrook

### Example Queries/Prompts

- "Compare LeBron James and Stephen Curry"
- "Who should I pick between Jayson Tatum and Luka Doncic?"


## Project Structure

```
nba-ai-assistant-js/
├── backend/
│   ├── data/
│   │   ├── playerAndTeamInfo.js      # Player and team metadata
│   │   └── sample_nba_data.csv       # Sample NBA data
│   ├── lib/
│   │   ├── comparePlayers.js        # Player comparison logic
│   │   ├── elasticAggs.js           # Elasticsearch aggregations
│   │   ├── elasticClient.js         # Elasticsearch client setup
│   │   └── playerDataIngestion.js   # Data ingestion script
│   └── src/mastra/
│       ├── agents/
│       │   └── index.ts             # Basketball agent definition
│       ├── tools/
│       │   └── index.ts             # Custom tools for agent
│       └── index.ts                 # Mastra server configuration w/middleware
├── frontend/
│   ├── src/
│   │   └── App.jsx                  # Main application component
│   └── components/
│       └── ChatUI.jsx               # Chat interface component
└── package.json                     # Logic for running both servers concurrently
```


### Modifying Statistics

The data included is pre-generated and not accurate, if you want accurate, updated statistics, please add it into your index from your preferred source.


### Changing the LLM

If you want to switch models, change the model configuration in `backend/src/mastra/agents/index.ts`
Note: Do your research on model capabilities, some don't even support tool calling. You'll most likely need to tinker with the system prompt to get the desired output as different models have different capabilities:

```js
model: openai('gpt-4o-mini'), // or other supported models
```

## Troubleshooting

### Common Issues

1. **Elasticsearch Connection Errors**
   - Verify your `ELASTIC_ENDPOINT` and `ELASTIC_API_KEY`
   - Make sure your environment variables are being loaded in correctly
   - Check to see if your Elasticsearch cluster is running and accessible

2. **OpenAI API Errors**
   - Check your `OPENAI_API_KEY` is valid and has enough credits
   - Verify the model name is correct

3. **Data Not Found**
   - Run the data ingestion file: `node lib/playerDataIngestion.js`
   - Check if the index `sample-nba-player-data` exists in your Elasticsearch cluster

4. **CORS Issues**
   - The backend is configured to accept requests from the default Vite development address `http://localhost:5173`
   - If you're getting CORS errors, update the CORS settings in `backend/src/mastra/index.ts`
   - The implementation is subject to change, be sure to check the [docs](https://mastra.ai/en/docs).


**Note**: This app uses sample data for demo purposes only. For production use with real NBA data, make sure to have proper licensing and data agreements in place.