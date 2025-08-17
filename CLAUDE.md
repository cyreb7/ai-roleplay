# Commands

- `npm run lint` - Run TypeScript compiler, ESLint, and Prettier formatting

# Architecture

This is a Next.js 15 AI roleplay application that enables conversational interactions between a player and an AI character using local Ollama models.

## Core Components

**AI Management (`app/ai/`)**

- `aiManager.ts` - Central AI interface that connects to local Ollama instance
- `character.ts` - Character system with public/private context and message generation
- `context.ts` - Dynamic context system for character descriptions, short-term goals, and long-term goals
- `chatMessage.ts` - Message structure and AI prompt generation

**UI Components (`app/components/`)**

- `chat.tsx` - Main chat interface with message input and history
- `characterSettings.tsx` - Character configuration interface for both AI and player
- `aiSettings.tsx` - AI model selection and configuration
- `messageHistory.tsx` - Display component for chat messages
- `message.tsx` - Individual message rendering component

## Key Architecture Patterns

**Dual AI Manager System**: The application uses two separate `AiManager` instances:

- Chat AI Manager: Handles conversational responses
- Generate AI Manager: Handles dynamic context generation (goals, descriptions)

**Dynamic Context Generation**: Characters have context that automatically updates un the background after new messages:

- Descriptions (static)
- Short-term goals (regenerated after each message)
- Long-term goals (regenerated after each message)

**Character System**: Both player and AI are represented as `Character` objects with:

- Public Context: Information shared with all participants in the chat. This includes descriptions and other details that other characters can observe or know about.
- Private Context: Information visible only to the specific character's AI. This includes internal thoughts or background details that other characters shouldn't know.

## State Management

The application uses React state management with:

- `chatHistory` - Array of `ChatMessage` objects
- `aiCharacter` and `playerCharacter` - Character state with context
- `AiManager` instances for different AI operations

## Dependencies

- **Ollama**: Browser client for local LLM interaction
- **Next.js 15**: React framework with App Router
- **Tailwind CSS**: Styling framework
- **UUID**: Message and component ID generation
- **TypeScript**: Full type safety throughout the codebase
