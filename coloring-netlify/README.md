# Cozy Coloring Studio

A relaxing coloring app with AI-powered image generation.

## Features

- 🎨 **Fill Tool** - Click to flood-fill areas with color
- 🖌️ **Brush Tool** - Paint freely with adjustable brush size
- 🧹 **Eraser Tool** - Remove colors while preserving linework
- 🎡 **Color Wheel** - Intuitive color selection
- ✨ **AI Generation** - Generate coloring pages using Claude AI
- 📁 **Image Upload** - Upload your own images
- ↩️ **Undo** - Multiple undo levels
- 💾 **Download** - Save your colored artwork as PNG

## Deploy to Netlify

### Step 1: Deploy the site

**Option A: Via GitHub**
1. Push this folder to a GitHub repository
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Netlify will auto-detect settings from `netlify.toml`

**Option B: Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Step 2: Add your Anthropic API Key

1. Go to your site's dashboard on Netlify
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Set:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (starts with `sk-ant-...`)
5. Click **Save**
6. **Redeploy** your site (Deploys → Trigger deploy → Deploy site)

### Step 3: Test it!

1. Visit your deployed site
2. Type a prompt like "a cute cat playing with yarn"
3. Click "Generate" and wait for your coloring page!

## Local Development

```bash
# Install dependencies
npm install

# Install Netlify CLI
npm install -g netlify-cli

# Create a .env file with your API key
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Run locally with Netlify Dev (includes functions)
netlify dev
```

Opens at http://localhost:8888

## Project Structure

```
├── public/
│   └── index.html          # Main app (React + Tailwind)
├── netlify/
│   └── functions/
│       └── generate-image.js   # Serverless function for AI
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
└── README.md
```

## Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy the key (it starts with `sk-ant-`)

**Important:** Never commit your API key to code! Always use environment variables.

## Troubleshooting

**"API key not configured" error:**
- Make sure you added `ANTHROPIC_API_KEY` in Netlify's environment variables
- Redeploy the site after adding the variable

**Image generation fails:**
- Check that your API key is valid and has credits
- The AI may refuse certain prompts - try rephrasing

**Function timeout:**
- Image generation can take 10-30 seconds
- Netlify functions have a 10-second timeout on free tier (26s on paid)
