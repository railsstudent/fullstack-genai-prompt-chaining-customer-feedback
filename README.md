# FullstackGenAIPromptChainingCustomerFeedback

This repository is consisted of four backend applications and a frontend application to generate replies for different feedback.
The backend applications use different stacks to build
- Genimi API and Gemini 1.5 Pro model
- Groq and Gemma 7B model
- Langchain multiple chains, Gemini 1.5 Pro model
- Huggingface Inference and Mistral 7B model

The frontend application is built with Angular 18.

## Run in Docker
- The docker container launches all four backend applications and a frontend application

```bash
nvm use 20

pnpm i
docker compose up
```

Then navigate to http://localhost:4200 to try generating replies for different customer feedback.
