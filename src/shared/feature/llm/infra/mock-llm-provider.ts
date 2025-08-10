import { LLMProvider } from '@/shared/feature/llm/application/port/out/llm-provider';
import { MockMessage, RandomMessage } from '@/shared/util/testing/mock-message';
import { Random } from '@/shared/util/testing/random';
import { Message, Role } from '@/shared/feature/llm/entity/message';

export class MockLLMProvider implements LLMProvider {
    async *streamQuery(conversation: Message[]): AsyncGenerator<string, void, unknown> {
        const lastMessage = conversation[conversation.length - 1];
        const newMessage = new MockMessage()
            .withRole(Role.ASSISTANT)
            .withPreviousId(lastMessage.id)
            .build();

        const content = Array.isArray(newMessage.content) ? newMessage.content.join(' ') : newMessage.content;
        const streamedChunks = this.chunkWords(content);
        for (const chunk of streamedChunks) {
            yield chunk;
            await new Promise(res => setTimeout(res, Random.int(300, 500)));
        }
    }

    query(conversation: Message[]): Promise<string> {
        void conversation;
        return new Promise(
            resolve => setTimeout(
                ()=> resolve(RandomMessage.content()),
                1000
            )
        );
    }

    chunkWords(text: string, size = 4): string[] {
        const words = text.trim().split(/\s+/);
        const chunks: string[] = [];

        for (let i = 0; i < words.length; i += size) {
            chunks.push(words.slice(i, i + size).join(' ') + ' ');
        }
        return chunks;
    }
}
