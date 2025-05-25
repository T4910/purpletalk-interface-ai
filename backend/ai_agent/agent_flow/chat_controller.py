import asyncio
from .memory.session_manager import create_new_session, load_session, save_session
from .memory.manager import MemoryManager
from .crews.conversation_agent import ConversationCrew
from datetime import datetime
from typing import Tuple
from crewai.utilities.events import crewai_event_bus, LLMStreamChunkEvent
from typing import AsyncGenerator
import time


# Synchronous wrapper
def handle_message(session_id: str | None, user_input: str) -> Tuple[str, str]:
    state = None
    if session_id:
        state = load_session(session_id)
        crew = ConversationCrew().crew()
    
    if not state:
        # Generate a new session ID internally (fixes parameter issue)
        crew = ConversationCrew().crew()
        session_id = create_new_session(crew, session_id)
        state = load_session(session_id)
    
    buffer = state
    memory = MemoryManager(session_id, buffer)
    memory.add_message(f"User: {user_input}")
    
    result =crew.kickoff(inputs={
        "new_message": user_input,
        "history": buffer,
        "date": datetime.now().strftime("%Y-%m-%d")
    })
    
    reply = result.raw if hasattr(result, "raw") else str(result)
    memory.add_message(f"Agent: {reply}")
    save_session(session_id, memory.buffer)
    return session_id, reply


# Streaming handler with scoped listeners and Final Answer filter
def handle_message_stream(session_id: str | None, user_input: str) -> AsyncGenerator[str, None]:
    async def stream_generator():
        # Load/create session
        state = None
        if session_id:
            state = await load_session(session_id)
        if state is None:
            new_id = await create_new_session(ConversationCrew().crew(), session_id)
            state = await load_session(new_id)

        crew = ConversationCrew().crew()
        buffer = state["buffer"]
        memory = MemoryManager(session_id or new_id, buffer)
        memory.add_message(f"User: {user_input}")

        queue: asyncio.Queue[str] = asyncio.Queue()
        buffer_chunks: list[str] = []
        final_answer_started = False

        # Scoped listener
        with crewai_event_bus.scoped_handlers():
            @crewai_event_bus.on(LLMStreamChunkEvent)
            def on_chunk(source, event: LLMStreamChunkEvent):
                nonlocal buffer_chunks, final_answer_started
                chunk = event.chunk
                if not final_answer_started:
                    buffer_chunks.append(chunk)
                    combined = ''.join(buffer_chunks)
                    marker = 'Final Answer:'
                    if marker in combined:
                        # Emit only text after the marker
                        idx = combined.find(marker) + len(marker)
                        final_chunk = combined[idx:].lstrip()
                        queue.put_nowait(final_chunk)
                        final_answer_started = True
                        buffer_chunks.clear()
                else:
                    # Pass through subsequent chunks
                    queue.put_nowait(chunk)

            # Kickoff in executor
            loop = asyncio.get_running_loop()
            kickoff = loop.run_in_executor(
                None,
                lambda: crew.kickoff(inputs={"new_message": user_input, "history": buffer,"date": datetime.now().strftime("%Y-%m-%d")})
            )

            # Stream until done
            while not kickoff.done() or not queue.empty():
                try:
                    chunk = await asyncio.wait_for(queue.get(), timeout=0.1)
                    yield chunk
                except asyncio.TimeoutError:
                    continue

            # Finalize
            result = await kickoff
            full_reply = result.raw if hasattr(result, "raw") else str(result)
            memory.add_message(f"Agent: {full_reply}")
            await save_session(session_id or new_id, crew, memory.buffer)

    return stream_generator()
