# AI Chat & Translation Platform (Backend)

A Spring Boot backend application providing a conversational interface with support for AI-driven chat, text paraphrasing, and multi-language translations powered by **OpenRouter**.

---

## Key Features

- **AI-Powered LLM Integration**: Multi-model AI capabilities (chat, paraphrasing, translation) routed through the OpenRouter API.
- **Conversation & Chat Management**: Create conversations, manage context, and persist message histories.
- **Asynchronous Paraphrasing**: Non-blocking background generation and storage of paraphrased text tied to specific messages.
- **Asynchronous Translation**: Non-blocking background translation processing for incoming/outgoing chat messages.
- **Authentication & Authorization**: Stateless security via **JWT (JSON Web Tokens)** and custom security filters.
- **Centralized Exception Handling**: Custom business exceptions (`BusinessException`) handled globally via `GlobalExceptionHandler`.

---

## Tech Stack

* **Language**: Java 17+ / 21, TypeScript
* **Framework**: Spring Boot, React
* **Version Control**: Git
* **AI Provider**: OpenRouter API
* **Security**: Spring Security, JWT (JJWT)
* **Persistence**: Spring Data JPA / Hibernate
* **Async Processing**: Spring `@Async` / TaskExecutors
* **Architecture**: Layered Architecture (Controller - Service - Repository - Entity/DTO)

---
<img width="2536" height="1209" alt="brave_screenshot_localhost" src="https://github.com/user-attachments/assets/e601b526-c01a-4ca5-ab47-83e6b7bb2a65" />
<img width="2544" height="1216" alt="Screenshot 2026-09-03 at 23 10 18" src="https://github.com/user-attachments/assets/ceaa7c2a-d967-4e36-884a-ab598d91eb64" />
