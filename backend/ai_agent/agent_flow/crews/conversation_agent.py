# ConversationCrew definition remains unchanged for non-streaming events
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai import LLM
from crewai_tools import SerperDevTool
from ..tools.scraper_tool import ScraperTool


@CrewBase
class ConversationCrew:
    """Real Estate Conversation Crew"""
    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def conversation_agent(self) -> Agent:
        return Agent(
            role="A real estate chatbot named Realyze",
            goal="Your goal is to help the user with whatever questions they have about real estate",
            backstory="You are a seasoned real estate expert with years of experience in real estate and customer service",
            llm=LLM(
                model="openai/gpt-4o",
            ),
            tools = [SerperDevTool(),ScraperTool()]
        )

    @task
    def converse_with_user(self) -> Task:
        return Task(
            config=self.tasks_config["converse_with_user"],  # type: ignore[index]
        )

    @crew
    def crew(self) -> Crew:
        # No need to pass event_listeners here; streaming uses scoped handlers.
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,  # Set to True for debugging
        )


# inputs = {"new_message":"Can you tell me about the current price range of 4 bedroom houses in OKlahoma, please search the internet before answering me",
#             "history": " "}
# result = ConversationCrew().crew().kickoff(inputs=inputs)
# print(result.raw)
