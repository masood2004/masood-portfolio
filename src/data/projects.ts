import { Project } from "../types";

export const projects: Project[] = [
  {
    id: "geoextract",
    title: "GeoExtract",
    description:
      "Vision-Based LLM for processing satellite imagery. Infrastructure optimized for remote training.",
    techStack: ["Python", "Computer Vision", "LLMs", "Runpod"],
  },
  {
    id: "fe64",
    title: "Fe64",
    description:
      "Custom chess engine utilizing raw bitboard representation for move generation and evaluation.",
    techStack: ["C", "Bitboards", "Game Theory", "Lichess API"],
  },
  {
    id: "axiom",
    title: "Axiom: SDT-for-Data-Integrity",
    description:
      "Production-grade DSL-to-SQL compiler. Converts complex business rules into robust MySQL triggers and CHECK constraints via SDT.",
    techStack: ["Compiler", "MySQL", "Syntax Directed Translation"],
  },
];
