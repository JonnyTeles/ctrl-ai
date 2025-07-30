export async function chatIa(prompt: string): Promise<string> {
    try {
    return await window.electronAPI.ask(prompt)
    } catch (err) {
        console.error(err)
        return "Erro no client OpenAI"
    }
}
