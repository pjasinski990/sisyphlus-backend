import { Message } from '@/shared/feature/llm/entity/message';

export interface LLMProvider {
    query(conversation: Message[]): Promise<string>;
    streamQuery: (conversation: Message[]) => AsyncGenerator<string, void, unknown>;
}
