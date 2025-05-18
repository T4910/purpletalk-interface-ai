# # rag_tool.py

# # 1. Load environment variables
# import os
# from dotenv import load_dotenv

# load_dotenv()  # expects ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, OPENAI_API_KEY

# ASTRA_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
# ASTRA_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
# EMBED_DIM = 1536  # must match your embeddings model dimension

# if ASTRA_TOKEN is None or ASTRA_ENDPOINT is None:
#     raise ValueError("Environment variables for Astra DB are not set properly.")


# # 2. Imports from LlamaIndex
# from llama_index.core import VectorStoreIndex, StorageContext, Document
# from llama_index.embeddings.openai import OpenAIEmbedding
# from llama_index.vector_stores.astra_db import AstraDBVectorStore

# # 3. Internal helper to get the AstraDB vector store for a conversation
# def _get_store(conversation_id: str, embedding_dim: int = EMBED_DIM) -> AstraDBVectorStore:
#     return AstraDBVectorStore(
#         token=ASTRA_TOKEN,
#         api_endpoint=ASTRA_ENDPOINT,
#         collection_name=f"conv_{conversation_id}",
#         embedding_dimension=embedding_dim,
#     )

# # 4. Create a new (empty) index for a conversation
# def create_conversation_index(conversation_id: str) -> VectorStoreIndex:
#     """
#     Initializes a new, empty VectorStoreIndex for a conversation.
#     """
#     store = _get_store(conversation_id)
#     storage_context = StorageContext.from_defaults(vector_store=store)
#     index = VectorStoreIndex.from_documents([], storage_context=storage_context)
#     return index

# # 5. Append a message to the existing conversation index
# def append_to_index(conversation_id: str, text: str) -> None:
#     """
#     Embeds and inserts a new message into the conversation's AstraDB-backed index.
#     """
#     store = _get_store(conversation_id)
#     # Rehydrate index directly from the live vector store
#     index = VectorStoreIndex.from_vector_store(store)
#     doc = Document(text=text)
#     index.insert(doc)

# # 6. Perform semantic similarity search
# def similarity_search(conversation_id: str, query: str, k: int = 5):
#     """
#     Retrieves the top-k most similar messages from the conversation index.
#     Returns the LlamaIndex Response object.
#     """
#     store = _get_store(conversation_id)
#     index = VectorStoreIndex.from_vector_store(store)
#     query_engine = index.as_query_engine(similarity_top_k=k)
#     response = query_engine.query(query)
#     return response

# # === Example usage ===
# if __name__ == "__main__":
#     # 1. Create a new conversation
#     create_conversation_index("chat123")

#     # 2. Append messages
#     append_to_index("chat123", "User: Hello, how are you?")
#     append_to_index("chat123", "Agent: I'm fine, thanks! What can I help with?")

#     # 3. Search for similar context
#     response = similarity_search("chat123", "help with", k=2)

#     # 4a. If you just want the text snippets:
#     print("Formatted sources:")
#     for snippet in response.get_formatted_sources():  
#         print("-", snippet)  # snippet is a string :contentReference[oaicite:1]{index=1}

#     # 4b. If you need the Node objects (with metadata):
#     print("\nRaw nodes:")
#     for node in response.source_nodes:
#         # `node.node.get_content()` returns the Document text
#         print("-", node.node.get_content())  # :contentReference[oaicite:2]{index=2}


# rag_tool.py

# 1. Load environment variables
import os
from dotenv import load_dotenv

load_dotenv()  # expects ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, OPENAI_API_KEY

ASTRA_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
EMBED_DIM = 1536  # must match your embeddings model dimension

if ASTRA_TOKEN is None or ASTRA_ENDPOINT is None:
    raise ValueError("Environment variables for Astra DB are not set properly.")

# 2. Imports
from llama_index.core import VectorStoreIndex, StorageContext, Document
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.astra_db import AstraDBVectorStore

from astrapy import DataAPIClient

# 3. Internal helper to get AstraDBVectorStore
def _get_store(conversation_id: str, embedding_dim: int = EMBED_DIM) -> AstraDBVectorStore:
    return AstraDBVectorStore(
        token=ASTRA_TOKEN,
        api_endpoint=ASTRA_ENDPOINT,
        collection_name=f"conv_{conversation_id}",
        embedding_dimension=embedding_dim,
    )

# 4. Idempotent index creation
def create_conversation_index(conversation_id: str) -> VectorStoreIndex:
    """
    Initializes a new VectorStoreIndex for a conversation, unless one exists.
    If the AstraDB collection 'conv_<conversation_id>' already exists,
    rehydrate its index; otherwise, create an empty one.
    """
    store = _get_store(conversation_id)

    # Check if collection exists in AstraDB
    client = DataAPIClient(token=ASTRA_TOKEN)  # :contentReference[oaicite:0]{index=0}
    db = client.get_database(ASTRA_ENDPOINT, token=ASTRA_TOKEN)
    existing = db.list_collection_names()      # :contentReference[oaicite:1]{index=1}
    coll_name = f"conv_{conversation_id}"

    if coll_name in existing:
        # Rehydrate from live vector store
        index = VectorStoreIndex.from_vector_store(store)  # 
    else:
        # Create empty index (this also creates the collection)
        storage_context = StorageContext.from_defaults(vector_store=store)
        index = VectorStoreIndex.from_documents([], storage_context=storage_context)
    return index

# 5. Append a message
def append_to_index(conversation_id: str, text: str) -> None:
    """
    Embeds and inserts a new message into the AstraDB-backed index.
    """
    create_conversation_index(conversation_id)
    store = _get_store(conversation_id)
    index = VectorStoreIndex.from_vector_store(store)      # 
    doc = Document(text=text)
    index.insert(doc)

# 6. Similarity search
def similarity_search(conversation_id: str, query: str, k: int = 5):
    """
    Retrieves the top-k most similar messages from the conversation index.
    """
    store = _get_store(conversation_id)
    index = VectorStoreIndex.from_vector_store(store)      # 
    qe = index.as_query_engine(similarity_top_k=k)
    return qe.query(query)

# 7. Fetch all messages in insertion order
def fetch_all_messages(conversation_id: str):
    """
    Retrieves all messages stored in the AstraDB collection for the given conversation,
    returning them in the order they were appended (ascending by timestamp).
    """
    client = DataAPIClient(token=ASTRA_TOKEN)             # :contentReference[oaicite:5]{index=5}
    db = client.get_database(ASTRA_ENDPOINT, token=ASTRA_TOKEN)
    collection = db.get_collection(f"conv_{conversation_id}")

    # Empty filter + sort on _ts ascending to preserve insertion order
    cursor = collection.find({}, sort={"_ts": 1})         # :contentReference[oaicite:6]{index=6}

    docs = []
    for record in cursor:
        text = record.get("text", record.get("content", ""))
        docs.append(Document(text=text))
    return docs

# === Example usage ===
# if __name__ == "__main__":
#     # 1. Create or rehydrate index
#     # create_conversation_index("chat123")

#     # # 2. Append messages
#     # append_to_index("chat123", "User: Hello, how are you?")
#     # append_to_index("chat1234", "User: What is your name")

#     # # 3. Fetch everything in append order
#     all_docs = fetch_all_messages("chat1234")
#     print("All stored messages in order:")
#     for doc in all_docs:
#         print("-", doc.text)

