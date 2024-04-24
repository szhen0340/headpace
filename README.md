![Headpace Logo](https://raw.githubusercontent.com/szhen0340/headpace/main/public/headspace_text.png)

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/ChatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white" />
</p>


# Headpace

Transform your productivity. Designed to streamline your schedule, manage appointments, and keep you on track. Experience the future of time management today!

Headpace is a natural-language AI-driven calendar assistant to boost your productivity and solve scheduling conflicts.

Headpace is the **1st place** [project](https://devpost.com/software/headpace) winner at the 2024 [HSHacks](https://hshacks.org/) 12-hour Hackathon hosted by John Hersey High School.

## Usage

A preview of the website is deployed on [Vercel](https://headpace.vercel.app/). However, it is recommended that you pull the source code and deploy the website yourself with your API keys for the full features. Directly opening a Github Codespace and typing `npm run dev` or `npm run build` works.

Have a `.env` file. It should include `OPENAI_API_KEY=your_key` and `NO_AI=false`. The AI is disabled on the hosted website for security purposes.

A commentary-free recording of a previous version of the product is also available on our [Devpost page](https://devpost.com/software/headpace).

## Inspiration

It's hard to get people who don't plan to join in on group planning sessions. Current solutions like lettucemeet or when2meet require a lot of work and we wanted to provide a more seamless experience.

Thus we introduce Headpace - an AI-driven all-in-one platform that allows you to work efficiently with your team.
The user signs in with their Google account and in the future will sync the app with their Google Calendar. The user can see a clear overview of all upcoming events and time until it happens.
The user can use our integrated AI-assistant powered by GPT-4 to ask for available time and help with scheduling. The AI can also help with scheduling events with other people when all of you are free. The AI also supports text-to-speech so you feel a real human assistant help you schedule your meetings.

## How we built it

We used Next.js and shadcn/ui's component library for the frontend. For backend we used the OpenAI API for the LLM and Firestore for the database.

We utilize GPT-4's function-calling feature, which allows GPT-4 to seamlessly interact with our backend algorithms that detects conflicts and finds available time slots.

## What's next for Headpace

Having a true multi-person integration so it's a viable solution for large groups and adding a speech to text. We also look forward to integrate Google Calendar in the product.

