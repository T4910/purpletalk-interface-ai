# memory_manager.py
from ..tools.rag_tool import append_to_index, similarity_search

class MemoryManager:
    def __init__(self, session_id: str, buffer=None):
        self.session_id = session_id
        self.buffer = buffer or []      # short-term in-RAM buffer
    def add_message(self, text: str):
        self.buffer.append(text)
        if len(self.buffer) > 10:
            self.buffer.pop(0)          # maintain last N turns :contentReference[oaicite:9]{index=9}
        append_to_index(self.session_id, text)

    def retrieve_context(self, query: str, k: int = 5):
        response = similarity_search(self.session_id, query, k=k)
        return response.get_formatted_sources()  # List[str]