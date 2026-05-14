import { Project } from "../types";

export const projects: Project[] = [
  {
    id: "geoextract",
    title: "GeoExtract",
    description:
      "Vision-Based LLM for processing satellite imagery. Infrastructure optimized for remote training.",
    techStack: ["Python", "Computer Vision", "LLMs", "Runpod"],
    architecture:
      "GeoExtract combines computer vision preprocessing with language-model reasoning for satellite imagery workflows. The infrastructure is tuned for remote GPU training, repeatable dataset handling, and fast iteration on geospatial extraction tasks.",
  },
  {
    id: "fe64",
    title: "Fe64",
    description:
      "Custom chess engine utilizing raw bitboard representation for move generation and evaluation.",
    techStack: ["C", "Bitboards", "Game Theory", "Lichess API"],
    architecture:
      "Fe64 uses compact 64-bit bitboards to represent board state, generate legal moves, and evaluate tactical positions. The project integrates with the Lichess API so visitors can inspect live and recent bot games directly from the portfolio.",
  },
  {
    id: "axiom",
    title: "Axiom: SDT-for-Data-Integrity",
    description:
      "Production-grade DSL-to-SQL compiler. Converts complex business rules into robust MySQL triggers and CHECK constraints via SDT.",
    techStack: ["Compiler", "MySQL", "Syntax Directed Translation"],
    architecture:
      "Axiom translates a domain-specific rule language into MySQL constraints and triggers. Its syntax-directed translation pipeline focuses on reliable data integrity, readable generated SQL, and maintainable business-rule enforcement.",
  },
];
