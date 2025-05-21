import asyncio
from .memory.session_manager import create_new_session, load_session, save_session
from .memory.manager import MemoryManager
from .crews.conversation_agent import ConversationCrew
import pysqlite3 as _sqlite3
import sys

# Override the stdlib module
sys.modules['sqlite3'] = _sqlite3

# Main async handler for a user turn
async def handle_message(session_id: str | None, user_input: str):
    """
    Handle one turn of the conversation:
      1. Load or create a session
      2. Update memory (short-term buffer + vector DB)
      3. Kick off the CrewAI flow with context
      4. Save updated session state
      5. Return (session_id, agent_reply)
    """
    # 1. Load existing session or create a new one
    state = None
    if session_id is not None:
        state = await load_session(session_id)

    if state is None:
        # No valid session found → create a new one
        conversation_crew = ConversationCrew()
        session_id = await create_new_session(conversation_crew.crew(), session_id)
        state = await load_session(session_id)

    # At this point, 'state' is guaranteed to be a dict
    crew = state["crew"]
    buffer = state["buffer"]

    # 2. Manage memory (both short-term and long-term)
    memory = MemoryManager(session_id, buffer)
    memory.add_message(f"User: {user_input}")

    # 3. Prepare inputs and kickoff the CrewAI flow
    inputs = {
        "new_message": user_input,
        "history": memory.buffer,
    }
    result = crew.kickoff(inputs=inputs)  # assuming an async kickoff

    # 4. Record and save the agent's reply
    agent_reply = result
    memory.add_message(f"Agent: {agent_reply}")

    # Persist updated crew instance and buffer back to Redis
    await save_session(session_id, crew, memory.buffer)

    return session_id, agent_reply.raw