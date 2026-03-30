"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import ProjectCard, { type Project } from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import { Badge } from "./ui/badge";

export type { Project };

const CARD_RATIO = 349 / 556; // aspect ratio height/width
const STACK_OFFSET = 72;
const STACK_OFFSET_MOBILE = 51;
const HOVER_GAP = 8;

const shadowSm =
  "0px 0.5px 1px rgba(0,0,0,0.04), 0px 1px 3px rgba(0,0,0,0.06)";
const shadowLg =
  "0px 2px 4px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.06), 0px 12px 32px rgba(0,0,0,0.12)";

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 28,
};

const expandTransition = {
  type: "spring" as const,
  stiffness: 150,
  damping: 22,
};

const projects: Project[] = [
  {
    id: "gotham",
    title: "Palantir Gotham",
    year: "2026",
    isDark: true,
    tags: ["Defense", "Geospatial & 3D", "Full-time"],
    hoverDescription:
      "Pioneered 3D geospatial applications for defense—designing across space operations, AI-powered military planning, and autonomous vehicle operations.",
    backgroundImage: "/projects/gotham-bg.png",
    logo: (
      <div className="flex items-center gap-3">
        <div className="relative h-[22px] w-[17px]">
          <Image
            src="/projects/palantir-icon.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p className="text-[20px] font-medium leading-[25px] text-[#fafafa]">
          Palantir Gotham
        </p>
      </div>
    ),
    detail: {
      duration: "Sept 2023 to March 2026",
      role: "As one of three 0→1 designers at Palantir, I helped pioneer the company's 3D geospatial application space, designing across the some of most cutting-edge problem spaces in defense: space operations, AI-powered military planning, autonomous vehicle operations, and live air-defense systems.",
      contextHeadline:
        "Palantir Gotham is a data integration and analytics platform designed for high-stakes operations in defense, intelligence, and the public sector.",
      context: [
        "At its core, Gotham allows organizations to unite diverse datasets—from field intelligence and sensor data to logistics and communications—into geo-spatial, interactive environments; empowering decision-makers to plan and execute missions efficiently by turning complex data into strategic advantages.",
      ],
      sections: [
        {
          sidebarItems: [
            { label: "AI Agent Landing", isActive: true },
            { label: "Viewing AI-generated edits" },
            { label: "Edit Comparison View" },
          ],
          title: "Geospatial AI-powered mission planning platform",
          overview:
            "The platform's mission planning tools combine real-time and historical data to create unified operational views for current and future scenarios, enabling teams to understand situations quickly, spot threats and opportunities, and coordinate responses effectively.",
          impact:
            "I led and collaborated on design on various 0→1 modes and use cases within mission planning suite, treating each project with an experimental approach, based in hypotheses to test through design.",
          images: [
            { type: "image", src: "/projects/gotham-strike-plan-4.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-strike-plan-2.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-strike-plan-3.png", aspectRatio: "3360/2100" },
          ],
        },
        {
          sidebarItems: [
            { label: "Autonomous Mission Board", isActive: true },
            { label: "Editing a mission" },
          ],
          title: "Autonomous mission planning for unmanned vehicles",
          overview:
            "A multi-year endeavor within the mission planning app suite, our declarative autonomy mode allows users to create guided, targeting-based missions for unmanned systems.",
          impact:
            "Unmanned system missions fundamentally differ from traditional mission planning. In this innovative field, I collaborated with two forward-deployed engineers to develop a hypothesis on how to introduce this functionality to the market. We focused on current use cases and designed a product that accommodates layered complexity in mission planning capabilities, from simple A→B missions, to multi-wave, dependency-based executions.",
          images: [
            { type: "image", src: "/projects/gotham-autonomous-2.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-autonomous-drawing.png", aspectRatio: "3360/2100" },
          ],
        },
        {
          sidebarItems: [
            { label: "Data layers", isActive: true },
            { label: "Tools and Actions" },
            { label: "New Overflight Analysis" },
            { label: "Completed Overflight Analysis" },
          ],
          title: "Operation picture and analysis tooling for space operations",
          overview:
            "Nebula is a space operation application that provides situational awareness for satellite coverage and location, as well as facilitating satellite operations and calculations.",
          impact:
            "As the lead designer for this project, I developed the app from a systems perspective, making design choices rooted in customer needs and translating technical concepts into user-friendly, data-readable interfaces that allowed the product to find rapid market fit within government and defense use cases.",
          images: [
            { type: "image", src: "/projects/gotham-nebula-1.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-nebula-2.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-overflight-3.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-overflight-2.png", aspectRatio: "3384/2124" },
          ],
        },
      ],
    },
  },
  {
    id: "foundry",
    title: "Palantir Foundry",
    year: "2025",
    isDark: false,
    tags: ["B2B", "Data Analytics", "Full-time"],
    hoverDescription:
      "Drove end-to-end design on foundational data entry and ontology initiatives—each adopted immediately by tens of thousands of daily users across critical workflows.",
    centerImage: "/projects/foundry-logo.svg",
    centerImageSize: { width: 124, height: 141 },
    logo: (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/palantir-foundry-icon.svg" alt="" className="h-[25px] w-auto" />
        <p className="text-[20px] font-medium leading-[25px] text-[#09090b]">
          Palantir Foundry
        </p>
      </div>
    ),
    detail: {
      duration: "April 2024 to November 2025",
      role: "The sole product designer for the Ontology Actions team within Foundry. During my time on Foundry Actions, I led key design and product initiatives that powered the way Palantir's entire forward-deployed suite builds, edits, and operates on client data. I drove end-to-end execution on foundational features—each of which was adopted immediately by tens of thousands of daily users across critical workflows. This work required deep product fluency, crisp strategic alignment, and tight collaboration with design, product, and engineering partners to ensure we delivered tools that were both powerful and intuitive at scale.",
      contextHeadline:
        "Palantir Foundry is a platform for data integration and analytics, enabling organizations to manage and operationalize complex data at scale.",
      context: [
        "A core feature to Foundry is its Ontology, a semantic layer that maps raw data to real-world business concepts like Customer, Product, or Facility. Through structured relationships and inheritance, data from differing sources is mapped into a clear, reusable, and governed framework that abstracts technical complexity.",
        "Actions are similar to functions or methods in coding, each representing a command that can create, modify, or delete objects within Palantir's Ontology.",
      ],
      sections: [
        {
          sidebarItems: [
            { label: "Rules", isActive: true },
            { label: "Parameters" },
            { label: "Specific Parameter" },
            { label: "User Interface: In-line Form" },
            { label: "User Interface: Table" },
          ],
          title: "Redesigning Actions in the Ontology Manager Application",
          overview:
            "The Action page in Ontology Manager is the primary interface for configuring Actions—the core commands that create, modify, or delete objects within Palantir's Ontology. Users rely on this page to define rules, set parameters, and build user-facing forms.",
          impact:
            "Executed on a full redesign, conducting extensive research and gathering widespread feedback to drive a design-led effort. The resulting overhaul improved information architecture, navigation, and hierarchy, delivering a more intuitive and user-friendly experience.",
          images: [
            { type: "image", src: "/projects/foundry-rules.png", aspectRatio: "908/534" },
            { type: "image", src: "/projects/foundry-params.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-params-2.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-ui.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-ui-2.png", aspectRatio: "3296/1896" },
          ],
        },
        {
          sidebarItems: [
            { label: "Dynamic Scheduler Object View Interaction", isActive: true },
            { label: "Drag Interaction" },
          ],
          title: "Dynamic scheduling widgets",
          overview:
            "Dynamic scheduling interfaces enable users to view and interact with ontological entities and actions along a time axis, providing temporal context to operational workflows.",
          impact:
            "Designed a series of scheduling interfaces from the ground up, defining interaction patterns for both click-based and drag-based time-axis interactions.",
          images: [
            { type: "image", src: "/projects/foundry-scheduler-click.png", aspectRatio: "2976/1896" },
            { type: "image", src: "/projects/foundry-scheduler-drag.png", aspectRatio: "2976/1896" },
          ],
        },
        {
          sidebarItems: [
            { label: "Standard Action Table", isActive: true },
            { label: "Table Error States" },
            { label: "File upload dialog" },
            { label: "File upload dialog: Mapping" },
            { label: "File upload fullscreen" },
          ],
          title: "Bulk data entry and transformation through the Action table",
          overview:
            "The Action Table is a tabular tool within Foundry's Workshop for bulk edits and creation of objects, providing an at-scale experience for data entry and transformation across the Ontology.",
          impact:
            "Since launch, the Action Table enables 2 million action submissions per month, with unique users growing from 500 in November 2024 to over 20k in November 2025, significantly streamlining and scaling ontology updates across the company.",
          images: [
            { type: "image", src: "/projects/foundry-inbox.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-workshop.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-global.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-global-2.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-fullscreen.png", aspectRatio: "2880/1800" },
          ],
        },
      ],
    },
  },
  {
    id: "baba",
    title: "Baba",
    year: "2026",
    isDark: false,
    tags: ["Consumer", "Healthcare", "Contractor"],
    hoverDescription:
      "Redesigned the patient experience for an eldercare start-up—from the application to the onboarding process over a 2-week contract.",
    backgroundGradient:
      "linear-gradient(180deg, rgba(186, 221, 255, 0.78) 0%, rgba(220, 232, 243, 0.538) 50%, rgba(254, 255, 232, 0.296) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
    backgroundImage: "/projects/baba-card-clouds.png",
    logo: (
      <div className="relative h-[24px] w-[72px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/baba-logo-card.png" alt="baba" className="h-full w-full object-contain" />
      </div>
    ),
    detail: {
      duration: "February 2026 • 2 weeks",
      role: "I was a product designer on a 2 week contract duration for Baba, an eldercare start-up providing care advocates to seniors. Over the course of the two weeks, I redesigned the patient experience, from the application to the onboarding process.",
      contextHeadline:
        "Baba is a eldercare advocacy startup, which matches senior patients with care advocates who can help them acquire the care and services they need.",
      context: [
        "A Baba advocate helps their patient understand benefits, resolve billing disputes, and cut through insurance red tape—but the existing patient experience didn't clearly communicate what Baba does, or guide patients through the multi-step onboarding process to connect with their advocate.",
      ],
      sections: [
        {
          sidebarTitle: "The solution",
          sidebarItems: [
            { label: "Patient onboarding", isActive: true },
            { label: "Initial consultation and advocate matching" },
          ],
          title: "The first 8 minutes: Patient Onboarding",
          overview:
            "Patients didn't know what Baba was, and what they were signing up for. Most patients would click on a Baba ad because they wanted a wheelchair, but didn't realize that in order to receive their wheelchair, they would need to actually match with a care advocate who can then navigate the process for them.",
          impact:
            "By breaking down the onboarding flow, I concluded that the current flow only showed action and form items, but didn't guide or educate the patient on the process. The new redesigned onboarding flow's goal was to directly tie the care advocate program to the patient's specific need clearly, so they could understand the exact service they can expect.",
          images: [
            { type: "video", src: "/projects/Baba-first-onboarding.mov", aspectRatio: "1000/708" },
          ],
          imageGroups: [
            {
              title: "The first week: Initial consultation and advocate matching",
              overview:
                "Similar to above, patients didn't understand the entire process of matching with an advocate. The existing process to connect with a care advocate involves several steps over 3-5 days:\nPatients must first have a consultation with a doctor and receive a care plan before being matched with an advocate and completing an introductory call.\n\nThe existing UX didn't clearly communicate and guide patients through this process.",
              impact:
                "By identifying and designing around the different states in the patient's onboarding and matching process, I redesigned the flow from initial consultation to completed advocate intro call to the steady state of the platform. The new solution's goal is to clearly outlines the identified next steps, the onboarding process, and the identity of their assigned advocate, so the patient has a clear idea of where they are in the process and what they have left to complete.",
              images: [
                { type: "video", src: "/projects/baba-onboarding.mov", aspectRatio: "2912/1820" },
              ],
            },
          ],
        },
        {
          sidebarTitle: "Final keyframes.",
          sidebarItems: [
            { label: "Initial consultation", isActive: true },
            { label: "Advocate matching" },
            { label: "Advocate intro call needed" },
            { label: "Advocate intro call booked" },
            { label: "Completion: Steady state" },
          ],
          images: [
            { type: "image", src: "/projects/baba-screens-1.png", aspectRatio: "3840/2400" },
            { type: "image", src: "/projects/baba-screens-2.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-3.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-4.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-5.png", aspectRatio: "3844/2404" },
          ],
        },
        {
          sidebarTitle: "The process.",
          sidebarItems: [
            { label: "Decomposition: Stages of Patient onboarding", isActive: true },
            { label: "Ideation: Needed features and actions" },
            { label: "Low fidelity Thumbnails" },
          ],
          images: [],
          imageGroups: [
            {
              title: "Decomposition: Stages of Patient onboarding",
              description:
                "I broke down the patient journey into discrete stages—from first hearing about Baba, through the application, consultation scheduling, advocate matching, and finally the introductory call. This decomposition helped identify the key moments where patients were dropping off or getting confused.",
              images: [
                { type: "image", src: "/projects/baba-process-1.png", aspectRatio: "4096/2645" },
              ],
            },
            {
              title: "Ideation: Needed features and actions",
              description:
                "For each stage, I mapped out the required features and user actions. This included progress indicators, clear CTAs, contextual help, and status updates that would keep patients informed and engaged throughout the multi-day onboarding process.",
              images: [
                { type: "image", src: "/projects/baba-process-2.png", aspectRatio: "4096/3068" },
              ],
            },
            {
              title: "Low fidelity Thumbnails",
              description:
                "Rapid thumbnail sketches helped me explore multiple layout approaches before committing to high-fidelity designs. This stage focused on information hierarchy and flow rather than visual polish.",
              images: [
                { type: "image", src: "/projects/baba-process-3.png", aspectRatio: "4096/2699" },
              ],
            },
          ],
        },
        {
          sidebarTitle: "Mobile Patient experience",
          sidebarItems: [
            { label: "Part 1: Mobile onboarding", isActive: true },
            { label: "Part 2: Mobile onboarding" },
          ],
          title: "Mobile Patient Experience",
          description:
            "Translated the patient experience for desktop into a mobile web app format.",
          images: [
            { type: "image", src: "/projects/baba-mobile-1.png", aspectRatio: "2584/2106" },
            { type: "image", src: "/projects/baba-mobile-2.png", aspectRatio: "2584/2462" },
          ],
        },
      ],
    },
  },
  {
    id: "kumu",
    title: "kumu",
    year: "2026",
    isDark: false,
    tags: ["Consumer app", "Study cards", "Personal project", "Fullstack development"],
    hoverDescription:
      "A mobile app that transforms raw study notes into personalized AI-generated flashcard decks and delivers an intelligent coaching experience.",
    backgroundImage: "/projects/kumu-card-bg.png",
    logo: (
      <div className="flex items-center gap-3">
        <div className="relative h-[24px] w-[22px]">
          <Image
            src="/projects/kumu-icon.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p
          className="text-[20px] leading-[25px] text-[#09090b]"
          style={{ fontFamily: "'Iowan Old Style', 'Georgia', serif", fontStyle: "italic" }}
        >
          kumu
        </p>
      </div>
    ),
    detail: {
      duration: "March 2026 • 1 week",
      role: "Kumu is a project I independently designed and developed to enhance my skills in fine-tuning and deploying Liquid Fine Models for a straightforward use case. I crafted the project plan and PRD, trained the models, and deployed them within the application, followed by designing the complete key workflows.",
      contextHeadline:
        "Kumu is a mobile application that transforms raw study notes into personalized AI-generated flashcard decks and delivers an intelligent coaching experience.",
      context: [
        "The app leverages Liquid AI\u2019s fine-tuned Language Foundation Models (LFMs) running via the LEAP Edge SDK for on-device inference, ensuring full privacy and offline capability.",
      ],
      sections: [
        {
          sidebarTitle: "Kumu: Your personalized study guide.",
          sidebarItems: [
            { label: "Core pages", isActive: true },
            { label: "Generating decks" },
            { label: "Quizzes and coaching" },
          ],
          images: [],
          imageGroups: [
            {
              title: "Core pages",
              description:
                "Home, where users can create flashcard decks. All Decks, where users can find all their created card decks, and the Profile, where they can see their study streaks and signout.",
              images: [
                { type: "image", src: "/projects/kumu media/Home.png", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/All decks.png", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Profile.png", aspectRatio: "1320/2868" },
              ],
            },
            {
              title: "Card deck generation",
              description:
                "By uploading raw study notes, users can create card decks, which they can study and quiz against.",
              images: [
                { type: "video", src: "/projects/kumu media/Generating a card deck.mp4", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Card.png", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Card list.png", aspectRatio: "1320/2868" },
              ],
            },
            {
              title: "Quiz on your flash cards, and receive personalized coaching feedback.",
              description:
                "With Kumu\u2019s AI coach, receive tailored feedback on each of your answers, whether right or wrong.",
              layout: "side-by-side",
              images: [
                { type: "video", src: "/projects/kumu media/Quiz taking.mp4", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Quix complete.png", aspectRatio: "1320/2868" },
              ],
            },
            {
              images: [
                { type: "image", src: "/projects/kumu media/Correct.png", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Coaching feedback - Correct.png", aspectRatio: "1320/2868" },
                { type: "image", src: "/projects/kumu media/Coaching feedback - Almost.png", aspectRatio: "1320/2868" },
              ],
            },
          ],
        },
        {
          sidebarTitle: "The process.",
          sidebarItems: [
            { label: "Tech stack", isActive: true },
            { label: "Fine tuning LFMs" },
            { label: "Iteration" },
            { label: "Components and Design" },
          ],
          images: [],
          imageGroups: [
            {
              title: "Tech stack",
              images: [
                { type: "image", src: "/projects/kumu-tech-stack.png", aspectRatio: "2308/1028", fillWidth: true },
              ],
            },
            {
              title: "Fine tuning LFMs",
              description:
                "To train Liquid\u2019s Foundational Models to be able to complete the tasks I had in mind, I created training datasets for both Card Generation and Coaching, which were used to train and evaluate the models.",
              images: [
                { type: "image", src: "/projects/kumu-fine-tuning.png", aspectRatio: "2366/596", fillWidth: true },
              ],
            },
            {
              title: "Iteration",
              description:
                "Iteration was a process involving both Claude Code and Figma, generating simple proof of concepts for interactions in Code before porting them into Figma for polish and design. This, while a simple task, was really interesting to conduct, as it flipped the standard enterprise design process on its head, having code be the base that design worked off of.",
              images: [
                { type: "image", src: "/projects/kumu-iteration-code.png", aspectRatio: "241/520" },
                { type: "image", src: "/projects/kumu-iteration-midfi.png", aspectRatio: "1313/2862" },
                { type: "image", src: "/projects/kumu media/Home.png", aspectRatio: "1320/2868" },
              ],
            },
            {
              title: "Components and design",
              description:
                "The design portion of the project was relatively light, where I identified key components and key frames to be designed, and worked in both Figma and Claude Code to bring them to light.",
              layout: "vertical",
              images: [
                { type: "image", src: "/projects/kumu-components-1.png", aspectRatio: "697/440" },
                { type: "image", src: "/projects/kumu-components-2.png", aspectRatio: "2504/1998" },
                { type: "image", src: "/projects/kumu-components-3.png", aspectRatio: "3336/1710" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "kickback",
    title: "Kickback",
    year: "2024",
    isDark: true,
    tags: ["Consumer App", "Social Media", "Personal Project"],
    hoverDescription:
      "A social platform where friends can effortlessly plan hangouts — eliminating endless group chat coordination.",
    centerImage: "/projects/kickback-phone-mockup.png",
    centerImageSize: { width: 230, height: 470 },
    centerImageOffset: { y: 127 },
    detail: {
      duration: "February 2026 • 2 weeks",
      role: "As the product designer, I worked a small team of 3 other developers to create the product narrative, before designing the high fidelity end-to-end workflows and design systems. Responsibilities included product strategy, interaction design, and visual design.",
      contextHeadline:
        "Kickback, the \u201CBeReal for friend groups\u201D: a social platform where friends can effortlessly plan hangouts — eliminating the endless group chat coordination and making spontaneous meetups the norm, not the exception.",
      context: [
        "Kickback reimagines social planning with four core features that remove friction from getting together. Users can upload photos to each Kickback, a real-time prompt for image sharing with your friends, and see what everyone else in their friend group is up to at that moment.",
      ],
      sections: [
        {
          sidebarTitle: "The solution",
          sidebarItems: [
            { label: "Real-time photo sharing", isActive: true },
            { label: "Reactions" },
            { label: "A mosaic of memories" },
            { label: "Kickback friend groups" },
          ],
          images: [],
          imageGroups: [
            {
              title: "Real-time photo sharing.",
              description:
                "Each Kickback is a shared moment: One friend starts the day with a photo and optional prompt. Everyone in the group responds within a set window. Photos unlock as friends post, creating a sense of presence and participation.",
              images: [
                { type: "image", src: "/projects/kickback-photo-1.png", aspectRatio: "860/1864" },
                { type: "image", src: "/projects/kickback-photo-2.png", aspectRatio: "860/1864" },
                { type: "video", src: "/projects/Kickback videos/kickback-partake.mov", aspectRatio: "860/1864" },
              ],
            },
            {
              title: "React with emojis and comments.",
              description:
                "Have a space for reactions, conversations and short quips for each picture a member posts.",
              layout: "side-by-side",
              images: [
                { type: "video", src: "/projects/Kickback videos/kickback-reactions.mov", aspectRatio: "860/1864" },
                { type: "video", src: "/projects/Kickback videos/Shortcut RXN.mp4", aspectRatio: "860/1864" },
              ],
            },
            {
              title: "A mosaic of memories.",
              description:
                "Daily Kick Backs are saved into your Group Memories become a visual thread of friendship—authentic, casual, and uniquely yours.",
              images: [
                { type: "image", src: "/projects/kickback-memories-1.png", aspectRatio: "860/1864" },
                { type: "image", src: "/projects/kickback-memories-2.png", aspectRatio: "860/1864" },
                { type: "video", src: "/projects/Kickback videos/kickback-memories.mov", aspectRatio: "860/1864" },
              ],
            },
            {
              title: "Creating a new Kick Back group.",
              description:
                "Groups can be made from new Kick Back posts, sending notifications to each friend that they've been invited to a Kick Back with their new group.",
              layout: "side-by-side",
              images: [
                { type: "video", src: "/projects/Kickback videos/kickback-create-group.mov", aspectRatio: "860/1864" },
              ],
            },
          ],
        },
        {
          sidebarTitle: "The process.",
          sidebarItems: [
            { label: "Value proposition", isActive: true },
            { label: "The narrative" },
            { label: "Workflow diagrams" },
            { label: "Iterations" },
            { label: "Visual design development" },
          ],
          images: [],
          imageGroups: [
            {
              title: "Value proposition.",
              description:
                "Gen Z relies on group chats to stay close with friends. Market trends show they're using these spaces to prompt real-time photo updates—creating a more intimate, private version of BeReal.\n\nA social app that helps friend groups build intimacy and stay connected through simple, real-time photo and prompt sharing, capitalizing on Gen Z's desire to participate in connection efforts with their close, intimate friend groups online.",
              images: [],
            },
            {
              title: "The narrative",
              description:
                "Through competitive analysis, brainstorming, and ranking of the different ideas we had, we were able to craft a narrative that defined a list of features to achieve our goal, without overcomplicating the solution space.",
              images: [
                { type: "image", src: "/projects/kickback-narrative.png", aspectRatio: "732/461" },
              ],
            },
            {
              title: "Workflow diagrams.",
              description:
                "Diagrams and low-fidelity explorations of the core flow — creating a hangout, inviting friends, and the real-time coordination experience.",
              layout: "vertical",
              images: [
                { type: "image", src: "/projects/kickback-workflow.png", aspectRatio: "732/500" },
                { type: "image", src: "/projects/kickback-wireframe.png", aspectRatio: "732/961" },
              ],
            },
            {
              title: "Iterations",
              layout: "vertical",
              images: [
                { type: "image", src: "/projects/kickback-lofi.png", aspectRatio: "732/375" },
                { type: "image", src: "/projects/kickback-midfi.png", aspectRatio: "4096/1570" },
                { type: "image", src: "/projects/kickback-midfi-2.png", aspectRatio: "594/290" },
                { type: "image", src: "/projects/kickback-midfi-3.png", aspectRatio: "638/651" },
              ],
            },
            {
              title: "Visual design library",
              description:
                "In the process of developing a visual design library and language, we were able to create polished high-fidelity screens, incorporating all learnings from research and iteration phases.",
              layout: "vertical",
              images: [
                { type: "image", src: "/projects/kickback-typography.png", aspectRatio: "2118/1368" },
                { type: "image", src: "/projects/kickback-components.png", aspectRatio: "3870/4096" },
              ],
            },
          ],
        },
      ],
    },
  },
];

interface CardStackProps {
  onExpandChange?: (expanded: boolean) => void;
  closeRef?: React.MutableRefObject<(() => void) | null>;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function CardStack({ onExpandChange, closeRef }: CardStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute card height from actual container width + fixed aspect ratio
  const [cardH, setCardH] = useState(isMobile ? 232 : 349);
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCardH(Math.round(w * CARD_RATIO));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isMobile]);

  const stackOff = isMobile ? STACK_OFFSET_MOBILE : STACK_OFFSET;

  const getCardY = useCallback(
    (index: number) => {
      if (selectedIndex !== null) {
        if (index === selectedIndex) return 0;
        if (index < selectedIndex) return -(cardH + 40);
        return cardH + 200;
      }

      if (hoveredIndex === null) {
        return index * stackOff;
      }

      // Top card: lift it slightly
      if (hoveredIndex === 0) {
        if (index === 0) return -8;
        return index * stackOff;
      }

      // Cards above hovered: stay in their stacked position
      if (index < hoveredIndex) {
        return index * stackOff;
      }
      // Hovered card + cards below: shift down so hovered card is fully revealed
      // The hovered card needs to clear the card above it
      const revealOffset = cardH - stackOff + HOVER_GAP;
      return index * stackOff + revealOffset;
    },
    [hoveredIndex, selectedIndex, isMobile, cardH, stackOff]
  );

  const getCardOpacity = useCallback(
    (index: number) => {
      if (selectedIndex === null) return 1;
      return index === selectedIndex ? 1 : 0;
    },
    [selectedIndex]
  );

  const getCardScale = useCallback(
    (index: number) => {
      if (selectedIndex !== null && index !== selectedIndex) return 0.95;
      return 1;
    },
    [selectedIndex]
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    onExpandChange?.(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onExpandChange]);

  useEffect(() => {
    if (closeRef) closeRef.current = handleClose;
  }, [closeRef, handleClose]);

  const isExpanded = selectedIndex !== null;

  // Calculate the total height of the card stack based on hover/expand state
  const stackHeight = useMemo(() => {
    if (isExpanded) return cardH;
    if (hoveredIndex === null || hoveredIndex === 0) {
      return (projects.length - 1) * stackOff + cardH;
    }
    // When hovering, the stack expands by the reveal offset
    const revealOffset = cardH - stackOff + HOVER_GAP;
    return (projects.length - 1) * stackOff + cardH + revealOffset;
  }, [hoveredIndex, isExpanded, isMobile, cardH, stackOff]);

  // Scroll to center the hovered card when hover changes
  useEffect(() => {
    if (hoveredIndex === null || isExpanded) return;

    let cardY: number;
    if (hoveredIndex === 0) {
      cardY = -8;
    } else {
      const revealOffset = cardH - stackOff + HOVER_GAP;
      cardY = hoveredIndex * stackOff + revealOffset;
    }
    const cardCenter = cardY + cardH / 2;

    const container = containerRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetScroll = containerTop + cardCenter - window.innerHeight / 2;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [hoveredIndex, isExpanded, isMobile, cardH, stackOff]);

  return (
    <div className="flex flex-col items-center w-full px-5 md:px-0">
      <motion.div
        ref={containerRef}
        className="relative w-full md:w-[480px] lg:w-[556px]"
        animate={{ height: stackHeight }}
        transition={springTransition}
        onMouseLeave={() => {
          if (!isExpanded) setHoveredIndex(null);
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="absolute left-0 right-0"
            style={{ zIndex: isExpanded && index === selectedIndex ? 50 : projects.length - index }}
            animate={{
              y: getCardY(index),
              opacity: getCardOpacity(index),
              scale: getCardScale(index),
            }}
            transition={isExpanded ? expandTransition : springTransition}
            onMouseEnter={() => {
              if (!isExpanded) setHoveredIndex(index);
            }}
          >
            <div className="relative">
              {/* Tags — left side, behind card (desktop only) */}
              {project.tags && !isExpanded && !isMobile && (
                <div className="absolute left-[-40px] top-1/2 -translate-x-full -translate-y-1/2 flex flex-col gap-1 items-end pointer-events-none z-0">
                  {project.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        x: hoveredIndex === index ? 0 : 40,
                      }}
                      transition={{
                        ...springTransition,
                        delay: hoveredIndex === index ? i * 0.03 : 0,
                      }}
                    >
                      <Badge variant="outline" className="bg-background">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Description — right side, behind card (desktop only) */}
              {project.hoverDescription && !isExpanded && !isMobile && (
                <motion.div
                  className="absolute right-[-40px] top-1/2 translate-x-full -translate-y-1/2 pointer-events-none w-[204px] z-0"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    x: hoveredIndex === index ? 0 : -40,
                  }}
                  transition={{
                    ...springTransition,
                    delay: hoveredIndex === index ? 0.05 : 0,
                  }}
                >
                  <p className="text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
                    {project.hoverDescription}
                  </p>
                </motion.div>
              )}
              {/* Card — on top */}
              <motion.div
                animate={{
                  boxShadow:
                    (hoveredIndex === index && !isExpanded) || (isExpanded && index === selectedIndex) ? shadowLg : shadowSm,
                }}
                transition={springTransition}
                className="relative z-10 rounded-[8px] md:rounded-[16px]"
              >
                <ProjectCard
                  project={project}
                  onClick={() => {
                    if (isExpanded) {
                      handleClose();
                    } else {
                      setHoveredIndex(null);
                      onExpandChange?.(true);
                      window.scrollTo({ top: 0, behavior: "instant" });
                      requestAnimationFrame(() => {
                        setSelectedIndex(index);
                      });
                    }
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded project detail */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...expandTransition, delay: 0.35 }}
            className="w-full"
          >
            <ProjectDetail
              project={projects[selectedIndex]}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
