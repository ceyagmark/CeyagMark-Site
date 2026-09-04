/**
 * Constellation FIGURES — the star-to-star line patterns, not catalogue
 * astrometry.
 *
 * Read this before using the data for anything but decoration: these are the
 * recognisable figure shapes (the geometry that makes Orion look like Orion),
 * expressed as normalised 0..1 coordinates inside each constellation's own box.
 * They are NOT right ascension and declination, they carry no epoch, and they
 * are not accurate to a star catalogue. Writing RA/Dec from memory and calling
 * it survey data would be inventing numbers, which this codebase does not do.
 * At the opacity this renders at, figure geometry is what reads anyway.
 *
 * Every constellation here is genuinely visible from Sri Lanka (about 7 degrees
 * north) at some point in the year, which is why Crux and Scorpius sit next to
 * Ursa Major — at that latitude you get both hemispheres. That much is a real
 * property of the location, not a decorative claim.
 *
 * `mag` is a relative brightness rank within the figure, 1 brightest, used only
 * to size and weight the dot. Named stars carry their common names so the data
 * stays checkable by a human who knows the sky.
 */

export type ConstellationStar = {
  /** Position in the constellation's own normalised box, y increasing downward. */
  x: number;
  y: number;
  /** Relative brightness within this figure: 1 brightest, 4 faintest. */
  mag: 1 | 2 | 3 | 4;
  name?: string;
};

export type Constellation = {
  key: string;
  label: string;
  stars: ConstellationStar[];
  /** Index pairs into `stars`, the drawn figure lines. */
  links: [number, number][];
  /** Where the figure sits in the viewport, and how large, as viewport fractions. */
  at: { x: number; y: number; scale: number };
};

export const CONSTELLATIONS: Constellation[] = [
  {
    key: "orion",
    label: "Orion",
    at: { x: 0.78, y: 0.3, scale: 0.19 },
    stars: [
      { x: 0.26, y: 0.14, mag: 1, name: "Betelgeuse" },
      { x: 0.74, y: 0.2, mag: 2, name: "Bellatrix" },
      { x: 0.4, y: 0.5, mag: 2, name: "Alnitak" },
      { x: 0.51, y: 0.47, mag: 2, name: "Alnilam" },
      { x: 0.62, y: 0.44, mag: 2, name: "Mintaka" },
      { x: 0.32, y: 0.86, mag: 3, name: "Saiph" },
      { x: 0.8, y: 0.8, mag: 1, name: "Rigel" },
    ],
    links: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
    ],
  },
  {
    key: "crux",
    label: "Crux",
    at: { x: 0.14, y: 0.72, scale: 0.1 },
    stars: [
      { x: 0.48, y: 0.06, mag: 2, name: "Gacrux" },
      { x: 0.52, y: 0.94, mag: 1, name: "Acrux" },
      { x: 0.9, y: 0.46, mag: 1, name: "Mimosa" },
      { x: 0.1, y: 0.54, mag: 3, name: "Delta Crucis" },
    ],
    links: [
      [0, 1],
      [2, 3],
    ],
  },
  {
    key: "cassiopeia",
    label: "Cassiopeia",
    at: { x: 0.22, y: 0.16, scale: 0.15 },
    stars: [
      { x: 0.04, y: 0.28, mag: 2, name: "Segin" },
      { x: 0.28, y: 0.78, mag: 2, name: "Ruchbah" },
      { x: 0.52, y: 0.24, mag: 1, name: "Gamma Cassiopeiae" },
      { x: 0.76, y: 0.72, mag: 2, name: "Schedar" },
      { x: 0.97, y: 0.16, mag: 3, name: "Caph" },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    key: "ursa-major",
    label: "The Plough",
    at: { x: 0.5, y: 0.82, scale: 0.2 },
    stars: [
      { x: 0.9, y: 0.2, mag: 1, name: "Dubhe" },
      { x: 0.88, y: 0.58, mag: 2, name: "Merak" },
      { x: 0.63, y: 0.66, mag: 2, name: "Phecda" },
      { x: 0.6, y: 0.34, mag: 3, name: "Megrez" },
      { x: 0.42, y: 0.28, mag: 1, name: "Alioth" },
      { x: 0.24, y: 0.24, mag: 2, name: "Mizar" },
      { x: 0.05, y: 0.36, mag: 2, name: "Alkaid" },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    key: "scorpius",
    label: "Scorpius",
    at: { x: 0.86, y: 0.74, scale: 0.16 },
    stars: [
      { x: 0.78, y: 0.1, mag: 3, name: "Dschubba" },
      { x: 0.6, y: 0.2, mag: 3, name: "Acrab" },
      { x: 0.52, y: 0.36, mag: 1, name: "Antares" },
      { x: 0.42, y: 0.56, mag: 3, name: "Tau Scorpii" },
      { x: 0.3, y: 0.72, mag: 2, name: "Epsilon Scorpii" },
      { x: 0.24, y: 0.88, mag: 3, name: "Mu Scorpii" },
      { x: 0.38, y: 0.96, mag: 2, name: "Shaula" },
      { x: 0.52, y: 0.88, mag: 3, name: "Lesath" },
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    key: "canis-major",
    label: "Canis Major",
    at: { x: 0.36, y: 0.42, scale: 0.13 },
    stars: [
      { x: 0.5, y: 0.12, mag: 1, name: "Sirius" },
      { x: 0.22, y: 0.3, mag: 3, name: "Mirzam" },
      { x: 0.58, y: 0.68, mag: 2, name: "Wezen" },
      { x: 0.32, y: 0.86, mag: 2, name: "Adhara" },
      { x: 0.82, y: 0.76, mag: 3, name: "Aludra" },
    ],
    links: [
      [0, 1],
      [0, 2],
      [2, 3],
      [2, 4],
    ],
  },
];
