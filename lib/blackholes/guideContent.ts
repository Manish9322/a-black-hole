export interface GuideSubsection {
  title: string;
  paragraphs: string[];
}

export interface GuideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface GuideSection {
  id: string;
  numeral: string;
  title: string;
  summary: string;
  paragraphs: string[];
  subsections?: GuideSubsection[];
  table?: GuideTable;
  closingNote?: string;
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'introduction',
    numeral: '00',
    title: 'Introduction',
    summary:
      'Why a region of pure gravity captures the imagination of physicists, astronomers, and anyone looking up at the night sky.',
    paragraphs: [
      'Few objects in nature sound as simple yet behave as strangely as a black hole. Born when an enormous amount of matter is compressed into a tiny volume, a black hole warps space and time so severely that nothing—not even a beam of light—can escape once it crosses an invisible boundary called the event horizon.',
      'Unlike a star or a planet, a black hole is not made of rock, gas, or plasma at its core. It is best understood as a region of space where gravity has overwhelmed every known force capable of holding matter apart. Yet despite their dark reputation, black holes are responsible for some of the brightest, most energetic phenomena in the universe: superheated disks of spiraling gas, relativistic particle jets spanning entire galaxies, and ripples in spacetime itself.',
      'This guide accompanies the interactive 3D visualization on the main page. It walks through what black holes actually are, how they form, what happens to light and matter around them, how astronomers observe something that emits no light of its own, and where our live 3D simulation follows—or simplifies—real astrophysics.',
    ],
  },
  {
    id: 'what-is-a-black-hole',
    numeral: 'I',
    title: 'What Is a Black Hole?',
    summary:
      'Understanding escape velocity, the boundary of no return, and why a black hole is shaped spacetime rather than an empty hole.',
    paragraphs: [
      'To leave Earth’s surface permanently, a rocket must reach about 11.2 kilometers per second—Earth’s escape velocity. Compress the same mass into a smaller radius and the surface gravity climbs sharply, raising the speed needed to break free. A black hole is what happens when mass is packed so densely that its escape velocity reaches and exceeds the speed of light (299,792 kilometers per second).',
      'Because no physical signal or particle can travel faster than light through space, the threshold where escape velocity equals light speed becomes a one-way boundary in spacetime: the event horizon. Anything crossing inward can never send a signal back out.',
      'It is tempting to picture a black hole as a cosmic tunnel or an empty pit punched through space. In reality, it is neither empty nor a hole in the fabric of the cosmos. A black hole has real mass, gravitational pull, and angular momentum, and from a safe distance it exerts the exact same gravitational attraction as any normal star or compact object of equal mass.',
    ],
    subsections: [
      {
        title: 'Mass, Density, and the Schwarzschild Radius',
        paragraphs: [
          'In 1916, physicist Karl Schwarzschild calculated the exact radius at which a spherical, non-spinning mass becomes a black hole. For Earth’s mass, that radius is roughly 9 millimeters—smaller than a marble. For the Sun’s mass, it is about 3 kilometers.',
          'Crucially, larger black holes do not require higher average density inside their event horizon. Because the radius of an event horizon grows linearly with mass while volume grows with the cube of the radius, a billion-solar-mass supermassive black hole has an average density inside its horizon lower than that of water or even air.',
        ],
      },
    ],
  },
  {
    id: 'anatomy',
    numeral: 'II',
    title: 'Anatomy of a Black Hole',
    summary:
      'Distinguishing physical structures, light-bending optical effects, and theoretical limits inside a black hole system.',
    paragraphs: [
      'When astronomers and physicists talk about a black hole, they often refer to a whole ecosystem of features around it. Some are mathematical boundaries in spacetime, some are glowing matter orbiting outside, and others are optical illusions created by bent starlight.',
    ],
    subsections: [
      {
        title: 'The Singularity (Theoretical Core)',
        paragraphs: [
          'In Einstein’s general relativity, all collapsed matter inside a non-spinning black hole is driven toward a central point of infinite density called the singularity (or a ring-shaped singularity in a spinning black hole). Most physicists view this infinity not as a literal physical object, but as a sign that general relativity breaks down at quantum scales and must eventually be replaced by a theory of quantum gravity.',
        ],
      },
      {
        title: 'The Event Horizon (Spacetime Boundary)',
        paragraphs: [
          'The event horizon is not a solid wall or shell; an astronaut falling across a sufficiently large horizon would feel nothing special at that exact moment. Rather, it is a geometric boundary in spacetime where all future paths point strictly inward.',
        ],
      },
      {
        title: 'The Photon Sphere (Unstable Light Orbits)',
        paragraphs: [
          'Outside the event horizon—at 1.5 times the Schwarzschild radius for a non-spinning black hole—gravity is strong enough to bend light into circular orbits. This shell is the photon sphere. Any photon grazing it orbits precariously before either spiraling into the black hole or escaping outward toward a distant observer.',
        ],
      },
      {
        title: 'The Black Hole Shadow (Observational Silhouette)',
        paragraphs: [
          'The dark circle seen at the center of images like M87* is the black hole shadow, not the event horizon itself. Because gravity pulls grazing light inward, the shadow appears roughly 2.6 times wider across than the physical Schwarzschild radius.',
        ],
      },
      {
        title: 'The Accretion Disk & Relativistic Jets',
        paragraphs: [
          'Unlike the horizon or shadow, an accretion disk and relativistic jets are made of real, physical matter—superheated plasma swirling around the outside of the black hole and, in some active systems, narrow beams of magnetized particles launched along the black hole’s spin axis at nearly the speed of light.',
        ],
      },
    ],
    table: {
      caption: 'Table 1 — Major features of a black hole system and their physical nature',
      headers: ['Feature', 'Classification', 'Location (Non-Spinning)', 'Role in the System'],
      rows: [
        [
          'Singularity',
          'Theoretical limit',
          'Center (r = 0)',
          'Where classical spacetime curvature diverges; likely governed by unknown quantum gravity',
        ],
        [
          'Event Horizon',
          'Spacetime boundary',
          '1.0 × Rs',
          'One-way surface beyond which escape velocity exceeds the speed of light',
        ],
        [
          'Photon Sphere',
          'Optical / orbital shell',
          '1.5 × Rs',
          'Unstable region where light can temporarily orbit the black hole',
        ],
        [
          'Black Hole Shadow',
          'Observational silhouette',
          '~2.6 × Rs (apparent)',
          'Dark apparent silhouette cast against surrounding emission by light capture',
        ],
        [
          'Accretion Disk',
          'Physical matter',
          '~3 × Rs outward',
          'Disk of turbulent, friction-heated plasma orbiting outside the horizon',
        ],
        [
          'Relativistic Jets',
          'Physical plasma outflow',
          'Polar spin axes',
          'Collimated beams accelerated by twisted magnetic fields near spinning black holes',
        ],
      ],
    },
  },
  {
    id: 'formation',
    numeral: 'III',
    title: 'How Black Holes Form',
    summary:
      'From the violent collapse of massive stars to the uncertain cosmic origins of galactic giants.',
    paragraphs: [
      'Black holes are not all born the same way. While stellar-mass black holes have a well-understood birthplace in dying massive stars, the earliest origins of the gargantuan black holes at the hearts of galaxies remain one of the most active research areas in modern cosmology.',
    ],
    subsections: [
      {
        title: 'Core-Collapse of Massive Stars',
        paragraphs: [
          'Throughout its life, a massive star maintains a delicate truce: nuclear fusion in its core generates outward radiation pressure that balances the inward crush of gravity. Once a star more than roughly 20 to 25 times the mass of our Sun exhausts its nuclear fuel and builds an iron core, fusion can no longer release energy.',
          'Within fractions of a second, the core collapses inward. Outer layers rebound in a supernova explosion—or, in some massive stars, fall straight inward in a “failed supernova.” If the remaining core exceeds about 2.2 to 3 solar masses (above the Tolman–Oppenheimer–Volkoff limit for neutron stars), no known pressure can halt the collapse, and a stellar-mass black hole is born.',
        ],
      },
      {
        title: 'Growth of Supermassive Black Holes',
        paragraphs: [
          'Nearly every large galaxy hosts a supermassive black hole weighing millions to billions of times the Sun’s mass. Observations from telescopes such as JWST show that billion-solar-mass black holes already existed less than a billion years after the Big Bang—posing a puzzle as to how they grew so quickly.',
          'Leading hypotheses include “light seeds” left by the first generation of massive stars growing through rapid gas accretion and mergers, as well as “heavy seeds” formed by the direct collapse of pristine giant gas clouds in the early universe without passing through a normal star stage.',
        ],
      },
      {
        title: 'Mergers and Theoretical Pathways',
        paragraphs: [
          'Black holes also grow through binary mergers—when two black holes spiral together, radiate energy away as gravitational waves, and coalesce into a single larger black hole. Separately, cosmologists have proposed that extreme density fluctuations in the first fractions of a second after the Big Bang might have formed primordial black holes, though these remain strictly hypothetical.',
        ],
      },
    ],
  },
  {
    id: 'types',
    numeral: 'IV',
    title: 'Types of Black Holes',
    summary:
      'Categorizing black holes by mass, observational evidence, and mathematical spacetime models.',
    paragraphs: [
      'Astronomers typically group black holes by mass scale, while theoretical physicists also classify them by two fundamental properties allowed in general relativity: spin (angular momentum) and electric charge. In practice, astrophysical black holes are expected to be nearly electrically neutral, leaving mass and spin as the two parameters that govern their behavior.',
    ],
    subsections: [
      {
        title: 'Mass Categories: Confirmed vs. Hypothetical',
        paragraphs: [
          'Stellar-mass black holes (roughly 3 to 100 solar masses) are firmly established through X-ray binaries and gravitational-wave detections. Supermassive black holes (millions to tens of billions of solar masses) are equally well confirmed at the centers of galaxies.',
          'Between those two extremes sit intermediate-mass black holes (roughly 100 to 100,000 solar masses). Several strong candidates exist—such as the ~142-solar-mass merger remnant GW190521 and objects inside dense star clusters—but their population and formation channels are still being mapped. Primordial black holes, which could theoretically span masses from microscopic scales to thousands of Suns, remain unconfirmed.',
        ],
      },
      {
        title: 'Non-Spinning (Schwarzschild) vs. Spinning (Kerr) Models',
        paragraphs: [
          'The simplest black hole solution is the Schwarzschild metric: perfectly spherical, stationary, and non-spinning. Real cosmic objects almost always retain angular momentum from the stars or gas clouds that formed them, so astrophysical black holes are better described by the Kerr metric—an exact solution for rotating black holes discovered by Roy Kerr in 1963.',
        ],
      },
    ],
    table: {
      caption: 'Table 2 — Classification of black holes by mass and physical status',
      headers: ['Class', 'Typical Mass', 'Scientific Status', 'Primary Origin'],
      rows: [
        [
          'Stellar-Mass',
          '~3 – 100 M☉',
          'Confirmed',
          'Core collapse of massive stars and binary mergers',
        ],
        [
          'Intermediate-Mass',
          '~100 – 10⁵ M☉',
          'Emerging / Candidates',
          'Successive black hole mergers or runaway stellar collisions in dense clusters',
        ],
        [
          'Supermassive',
          '~10⁶ – 10¹⁰ M☉',
          'Confirmed',
          'Early cosmic seeds growing via gas accretion and galactic mergers',
        ],
        [
          'Primordial',
          'Sub-planetary to 10⁵ M☉',
          'Hypothetical (Unconfirmed)',
          'Proposed density fluctuations in the very early universe',
        ],
      ],
    },
  },
  {
    id: 'relativity',
    numeral: 'V',
    title: 'Gravity, Spacetime & Relativity',
    summary:
      'How curved spacetime bends starlight, slows clocks, and produces the warped geometry seen around a black hole.',
    paragraphs: [
      'In Isaac Newton’s picture of gravity, objects pull on one another across empty space with an invisible force. In 1915, Albert Einstein reframed gravity completely through general relativity: mass and energy tell spacetime how to curve, and curved spacetime tells matter—and light—how to move.',
      'Even though photons have no rest mass, they travel along the straightest possible paths through spacetime, known as null geodesics. When spacetime itself is steepened near a massive object, those “straight” paths curve smoothly around the mass—an effect called gravitational lensing.',
    ],
    subsections: [
      {
        title: 'Why Light Bends Around a Black Hole',
        paragraphs: [
          'Gentle gravitational lensing occurs around galaxy clusters and stars, subtly magnifying or duplicating distant galaxies behind them. Around a black hole, curvature becomes extreme. Light emitted from the far side of an accretion disk—normally hidden behind the black hole—can curve over the top and underneath the event horizon toward the viewer.',
          'This optical warping is why a flat equatorial disk viewed nearly edge-on appears to wrap both over the upper silhouette and under the lower edge of the black hole shadow at the same time.',
        ],
      },
      {
        title: 'Gravitational Time Dilation',
        paragraphs: [
          'Relativity couples space and time together, meaning steep gravity also alters the pace of clocks. To a distant observer, a clock hovering close to an event horizon ticks noticeably slower than an identical clock far away in deep space, and light climbing out of that gravity well loses energy, shifting toward redder wavelengths (gravitational redshift).',
        ],
      },
    ],
  },
  {
    id: 'accretion-disk',
    numeral: 'VI',
    title: 'The Accretion Disk',
    summary:
      'Why infalling gas flattens into a luminous, turbulent whirlpool that outshines entire galaxies.',
    paragraphs: [
      'A black hole sitting alone in empty space is almost impossible to see. When nearby gas, dust, or material stripped from a companion star falls toward it, however, that matter rarely drops straight in. Because the infalling gas carries sideways motion (angular momentum), it naturally settles into a rotating, flattened disk called an accretion disk.',
    ],
    subsections: [
      {
        title: 'Friction, Turbulence, and Glowing Plasma',
        paragraphs: [
          'Inner orbits whip around the black hole faster than outer ones, creating intense shear. Magnetic fields threaded through the ionized gas amplify turbulence—a process known as the magnetorotational instability—generating effective friction that heats the plasma to millions or even billions of degrees and lets matter gradually lose angular momentum and spiral inward.',
          'Depending on the black hole’s mass and feeding rate, this superheated plasma radiates brightly across radio, infrared, optical, ultraviolet, and X-ray wavelengths.',
        ],
      },
      {
        title: 'Relativistic Beaming & Why Disks Look Asymmetric',
        paragraphs: [
          'In real observations and relativistic simulations, one side of an edge-on accretion disk almost always looks brighter than the other. Plasma swirling toward the observer at a substantial fraction of light speed has its light focused forward and boosted in energy—an effect called relativistic Doppler beaming—while light from the receding side is dimmed and redshifted.',
        ],
      },
    ],
  },
  {
    id: 'shadow-and-photon-ring',
    numeral: 'VII',
    title: 'The Black Hole Shadow & Photon Ring',
    summary:
      'Why the dark center looks larger than the event horizon, and how multiple loops of bent light trace a razor-thin luminous ring.',
    paragraphs: [
      'One of the subtlest revelations of black hole imaging is that the dark silhouette we observe is not a direct outline of the event horizon. Instead, it is the boundary of light capture.',
      'Any photon aimed inside a critical impact parameter (about 2.6 Schwarzschild radii from the center for a non-spinning black hole) spirals down into the event horizon and disappears. Photons passing slightly outside that threshold are sharply deflected—sometimes looping around the black hole once, twice, or many times—before escaping toward our telescopes.',
    ],
    subsections: [
      {
        title: 'Higher-Order Lensed Rings',
        paragraphs: [
          'Because light can orbit the photon sphere multiple times before escaping, an observer sees a cascade of nested images of the surrounding accretion disk. The primary direct image is accompanied by a secondary image formed by light bent around the back of the black hole, and an increasingly thin “photon ring” formed by photons that completed half-turns or full orbits near the photon sphere.',
          'In theoretical general relativity, these higher-order subrings become exponentially sharper and narrower with each extra half-orbit, framing the dark central shadow with a delicate ring of concentrated light.',
        ],
      },
    ],
  },
  {
    id: 'near-and-inside',
    numeral: 'VIII',
    title: 'What Happens Near and Inside a Black Hole?',
    summary:
      'Tidal stretching, frozen signals from afar, and the honest limits of modern physics beyond the horizon.',
    paragraphs: [
      'Popular stories often imagine a fiery barrier or an instant portal at a black hole’s edge. General relativity paints a stranger, quieter, and more precise picture—one that depends strongly on how massive the black hole is.',
    ],
    subsections: [
      {
        title: 'Tidal Forces & Spaghettification',
        paragraphs: [
          'Gravity weakens rapidly with distance. Near a compact stellar-mass black hole, the gravitational pull on your feet (closer to the center) can be vastly stronger than the pull on your head, while your sides are squeezed inward. Astrophysicists informally call this extreme tidal stretching spaghettification.',
          'For a stellar-mass black hole, lethal tidal stretching happens well outside the event horizon. For a supermassive black hole weighing billions of Suns, however, the horizon is so enormous that tidal forces right at the boundary are gentler than Earth’s everyday gravity—allowing a traveler to cross the horizon intact, only to encounter lethal tidal forces deeper inside.',
        ],
      },
      {
        title: 'Two Perspectives on Crossing the Horizon',
        paragraphs: [
          'To a distant watcher using a telescope, an object falling toward the event horizon appears to slow down, fade, and redden until it seems frozen near the edge—because each successive flash of light takes longer and longer to climb out of the deepening gravity well. From the infalling traveler’s own watch, however, time ticks normally and they cross the horizon in a finite, measurable moment.',
        ],
      },
      {
        title: 'Inside the Horizon: What Science Does Not Yet Know',
        paragraphs: [
          'Once inside the event horizon, radial space and forward time swap roles in the equations of relativity: moving toward smaller radii becomes as unavoidable as moving into tomorrow. Classical relativity predicts an inevitable crash into a singularity, yet physicists know quantum effects must alter that final state. What actually replaces the classical singularity remains an open question in quantum gravity.',
        ],
      },
    ],
  },
  {
    id: 'spin',
    numeral: 'IX',
    title: 'Black Hole Spin',
    summary:
      'How a rotating black hole drags spacetime itself into a whirlpool and reshapes orbits around it.',
    paragraphs: [
      'A spinning black hole does not rotate through space like a spinning top in an empty room—it drags the surrounding fabric of spacetime around with it, an effect known as frame-dragging (or the Lense–Thirring effect).',
    ],
    subsections: [
      {
        title: 'Ergosphere & Closer Stable Orbits',
        paragraphs: [
          'Outside the event horizon of a rotating Kerr black hole lies an oblate zone called the ergosphere. Inside the ergosphere, spacetime is dragged faster than light relative to distant stars; nothing can stand still there, even though an object can still escape outward if it has enough energy.',
          'Spin also changes how close matter can safely orbit. When an accretion disk orbits in the same direction as the black hole’s spin (prograde), its innermost stable circular orbit moves much closer to the horizon—from 3 Schwarzschild radii down to as little as 0.5 gravitational radii for a maximally spinning black hole—allowing infalling gas to release far more gravitational energy as light and helping power relativistic jets.',
        ],
      },
    ],
  },
  {
    id: 'observation',
    numeral: 'X',
    title: 'How We Observe Black Holes',
    summary:
      'If black holes trap light, astronomers must become cosmic detectives—tracking stars, X-rays, spacetime ripples, and radio silhouettes.',
    paragraphs: [
      'Because a black hole emits no classical light of its own, every discovery relies on watching how it disturbs its neighborhood.',
    ],
    subsections: [
      {
        title: 'Stellar Orbits & X-Ray Binaries',
        paragraphs: [
          'By tracking individual stars whipping around invisible companions over years—most famously star S2 orbiting the center of the Milky Way—astronomers measure the hidden object’s mass and size directly using Kepler’s laws. In binary systems where a stellar-mass black hole pulls gas off a normal companion star, the superheated accretion disk shines fiercely in X-rays.',
        ],
      },
      {
        title: 'Gravitational-Wave Interferometry',
        paragraphs: [
          'Since 2015, laser observatories such as LIGO, Virgo, and KAGRA have detected sub-proton-scale ripples in spacetime produced when pairs of black holes spiral together and merge—letting scientists “hear” black hole collisions directly across billions of light-years.',
        ],
      },
      {
        title: 'The Event Horizon Telescope (EHT)',
        paragraphs: [
          'Using Very Long Baseline Interferometry (VLBI), the Event Horizon Telescope links radio dishes across continents into an Earth-sized virtual telescope. In 2019, the EHT collaboration unveiled the first horizon-scale image of a black hole shadow in galaxy M87, followed in 2022 by Sagittarius A* at the heart of our own galaxy.',
        ],
      },
    ],
  },
  {
    id: 'famous-black-holes',
    numeral: 'XI',
    title: 'Famous Black Holes',
    summary:
      'Landmark objects that transformed black holes from mathematical curiosities into observed cosmic landmarks.',
    paragraphs: [
      'Over the past half-century, a handful of real systems have anchored our understanding of black holes across vastly different mass scales and detection methods.',
    ],
    table: {
      caption: 'Table 3 — Selected scientifically significant black holes and detections',
      headers: ['Object / Event', 'Approximate Mass', 'Distance', 'Observational Significance'],
      rows: [
        [
          'Sagittarius A* (Sgr A*)',
          '~4.3 million M☉',
          '~26,700 light-years',
          'Supermassive black hole at the center of the Milky Way; imaged by the EHT (2022) and tracked via orbiting stars like S2',
        ],
        [
          'M87* (Messier 87)',
          '~6.5 billion M☉',
          '~55 million light-years',
          'First black hole shadow ever directly imaged (EHT, 2019); launches a relativistic jet ~5,000 light-years long',
        ],
        [
          'Cygnus X-1',
          '~21 M☉',
          '~7,200 light-years',
          'First widely accepted stellar-mass black hole candidate; bright X-ray binary pulling wind from a blue supergiant star',
        ],
        [
          'GW150914',
          '~62 M☉ (remnant)',
          '~1.3 billion light-years',
          'First direct detection of gravitational waves (LIGO, 2015), formed by the merger of ~36 M☉ and ~29 M☉ black holes',
        ],
        [
          'TON 618',
          '~40–66 billion M☉',
          '~10.4 billion light-years (light-travel)',
          'Hyper-luminous quasar powering one of the most massive black holes estimated in the observable universe',
        ],
      ],
    },
  },
  {
    id: 'misconceptions',
    numeral: 'XII',
    title: 'Misconceptions About Black Holes',
    summary:
      'Separating science-fiction myths from what general relativity and observations actually show.',
    paragraphs: [
      'Because black holes push everyday intuition to its limits, several persistent myths surround them.',
    ],
    subsections: [
      {
        title: '“Black holes act like cosmic vacuum cleaners, sucking everything in.”',
        paragraphs: [
          'They do not. Gravity obeys the same laws outside a black hole as outside a star of equal mass. If the Sun were magically replaced by a black hole of exactly one solar mass, Earth would grow dark and freeze, but its orbit would not change by a single meter—it would not be “sucked in.” Matter falls in only if it loses angular momentum or passes extraordinarily close.',
        ],
      },
      {
        title: '“Every black hole is infinitely dangerous from any distance.”',
        paragraphs: [
          'A black hole’s intense gravitational traps exist only very close to its horizon. At interstellar distances, a black hole exerts no unusual pull compared with an ordinary star of the same mass.',
        ],
      },
      {
        title: '“The event horizon is a physical surface you can crash into.”',
        paragraphs: [
          'There is no crust, membrane, or glowing wall at the event horizon. It is an empty boundary in spacetime defined purely by where escape becomes impossible.',
        ],
      },
      {
        title: '“Black holes can be seen directly like stars.”',
        paragraphs: [
          'We never see light emitted by a black hole’s interior. Every image of a black hole shows either radiation from hot gas swirling outside the horizon or the dark silhouette (shadow) carved out of that surrounding glow.',
        ],
      },
    ],
  },
  {
    id: 'visualization-science',
    numeral: 'XIII',
    title: 'The Science Behind This Visualization',
    summary:
      'An honest look at which physical laws power the interactive 3D black hole on this site, and where real-time artistic approximations take over.',
    paragraphs: [
      'A real-time web simulation running smoothly in your browser has very different constraints from a supercomputer cluster computing radiative magnetohydrodynamics over weeks. Here is an exact breakdown of what the interactive 3D experience on the home page actually computes—and what it intentionally simplifies.',
    ],
    subsections: [
      {
        title: 'What Is Physically Modeled',
        paragraphs: [
          'Curved Light Paths (Schwarzschild Geodesics): Every pixel in the 3D scene launches a light ray backward from your camera and integrates its curved trajectory through a spherically symmetric Schwarzschild gravitational potential using a multi-step midpoint solver. That is why background stars bend around the center and why the back of the accretion disk rises visibly above and below the shadow as you orbit.',
          'Shadow Capture & Photon-Ring Scale: Rays passing inside the event horizon capture radius are terminated to form the dark interior, while grazing rays track their closest approach to highlight the thin photon-ring outline outside the shadow.',
          'Differential Orbital Flow & Brightness Shift: Matter in the equatorial disk rotates faster closer to the center than in the outer rings, and approaching plasma receives a subtle brightness boost and warm color shift relative to receding plasma.',
        ],
      },
      {
        title: 'Approximations & Artistic Choices',
        paragraphs: [
          'Non-Spinning Spacetime: The shader uses a non-spinning Schwarzschild potential rather than a spinning Kerr metric, so frame-dragging and asymmetric spin distortion of the shadow are not simulated.',
          'Procedural Plasma & Particle Layer: Rather than solving full fluid magnetic equations, the glowing accretion filaments, surrounding volumetric haze, and orbiting 3D dust motes use layered procedural noise and orbital tracks tuned for visual clarity, calm pacing, and interactive 60 FPS responsiveness.',
          'Color Palette & Omitted Features: The obsidian, muted bronze, warm rose-gold, and ivory palette—along with subtle cool inner-edge rim accents—is an artistic representation designed for perceptual depth rather than a calibrated false-color radio map, and relativistic polar jets are intentionally omitted.',
        ],
      },
    ],
    closingNote:
      'Whenever you drag, zoom, or tilt the 3D black hole on the main view, you are watching real geodesic light-bending mathematics interact live with an artistically crafted accretion environment.',
  },
];
