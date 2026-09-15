import { Subject, Chapter, Question, CBTTest } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'BIOLOGY',
    name: 'Biology',
    iconName: 'Dna',
    color: 'emerald',
    accentColor: '#10b981',
    classLevels: ['11', '12'],
    chaptersCount: 38,
    questionsCount: 4200,
  },
  {
    id: 'PHYSICS',
    name: 'Physics',
    iconName: 'Atom',
    color: 'indigo',
    accentColor: '#6366f1',
    classLevels: ['11', '12'],
    chaptersCount: 30,
    questionsCount: 3400,
  },
  {
    id: 'CHEMISTRY',
    name: 'Chemistry',
    iconName: 'FlaskConical',
    color: 'amber',
    accentColor: '#f59e0b',
    classLevels: ['11', '12'],
    chaptersCount: 30,
    questionsCount: 3600,
  },
  {
    id: 'MATHEMATICS',
    name: 'Mathematics',
    iconName: 'Binary',
    color: 'cyan',
    accentColor: '#06b6d4',
    classLevels: ['11', '12'],
    chaptersCount: 32,
    questionsCount: 3100,
  },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'bio-11-cell',
    number: 8,
    title: 'Cell: The Unit of Life',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    description: 'Structure and functions of prokaryotic and eukaryotic cells, endomembrane system, mitochondria, chloroplasts, and nucleus.',
    totalPages: 4,
    highYieldFor: ['NEET', 'BOARDS'],
    weightage: '8-10% in NEET (3-4 questions every year)',
    concepts: [
      'Cell Theory & Omnis Cellula-e-Cellula',
      'Prokaryotic Cell Envelope & Mesosomes',
      'Fluid Mosaic Model of Plasma Membrane',
      'Endomembrane System (ER, Golgi, Lysosomes, Vacuoles)',
      'Mitochondria & Chloroplast (Semi-autonomous)',
      'Nucleus, Chromatin & Chromosome Types'
    ],
    pages: [
      {
        pageNumber: 1,
        chapterId: 'bio-11-cell',
        title: 'What is a Cell? & Cell Theory',
        subheading: 'Unit 3: Cell Structure and Functions · NCERT Page 125-126',
        sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 125',
        topics: ['Discovery of Cell', 'Cell Theory', 'Overview of Cell', 'Cell Sizes'],
        sections: [
          {
            id: 'sec-8-1',
            title: '8.1 What is a Cell?',
            content: [
              'Unicellular organisms are capable of independent existence and performing the essential functions of life. Anything less than a complete structure of a cell does not ensure independent living. Hence, cell is the fundamental structural and functional unit of all living organisms.',
              'Anton Von Leeuwenhoek first saw and described a live cell. Robert Brown later discovered the nucleus. The invention of the microscope and its improvement leading to the electron microscope revealed all the structural details of the cell.'
            ],
            keyTerms: ['Anton Von Leeuwenhoek (First live cell)', 'Robert Brown (Nucleus 1831)', 'Independent living'],
            ncertHighlight: 'Anything less than a complete structure of a cell does not ensure independent living. Cell is the fundamental structural and functional unit of all organisms.'
          },
          {
            id: 'sec-8-2',
            title: '8.2 Cell Theory',
            content: [
              'In 1838, Matthias Schleiden, a German botanist, examined a large number of plants and observed that all plants are composed of different kinds of cells which form the tissues of the plant.',
              'At about the same time, Theodore Schwann (1839), a British Zoologist, studied different types of animal cells and reported that cells had a thin outer layer which is today known as the "plasma membrane". He also concluded, based on studies on plant tissues, that the presence of cell wall is a unique character of the plant cells.',
              'On the basis of this, Schwann proposed the hypothesis that the bodies of animals and plants are composed of cells and products of cells.',
              'Schleiden and Schwann together formulated the cell theory. This theory however, did not explain as to how new cells were formed.',
              'Rudolf Virchow (1855) first explained that cells divided and new cells are formed from pre-existing cells (Omnis cellula-e cellula). He modified the hypothesis of Schleiden and Schwann to give the cell theory a final shape.'
            ],
            keyTerms: ['Matthias Schleiden (1838 - German Botanist)', 'Theodore Schwann (1839 - British Zoologist)', 'Rudolf Virchow (1855 - Omnis cellula-e cellula)'],
            ncertHighlight: 'Cell theory as understood today: (i) All living organisms are composed of cells and products of cells. (ii) All cells arise from pre-existing cells (Omnis cellula-e cellula).'
          },
          {
            id: 'sec-8-3',
            title: '8.3 An Overview of Cell & Dimensions',
            content: [
              'Cells differ greatly in size, shape and activities. For example, Mycoplasmas, the smallest cells, are only 0.3 µm in length while bacteria could be 3 to 5 µm.',
              'The largest isolated single cell is the egg of an ostrich. Among multicellular organisms, human red blood cells are about 7.0 µm in diameter. Nerve cells are some of the longest cells.'
            ],
            keyTerms: ['Mycoplasma: 0.3 µm', 'Bacteria: 3 to 5 µm', 'Human RBC: ~7.0 µm diameter', 'Ostrich egg: Largest single cell']
          }
        ],
        summaryPoints: [
          'Schleiden was a German Botanist (1838); Schwann was a British Zoologist (1839).',
          'Presence of cell wall was deduced as a unique plant feature by Schwann (Zoologist!), a classic NEET trap question.',
          'Virchow added "Omnis cellula-e cellula" in 1855 to give modern cell theory.'
        ]
      },
      {
        pageNumber: 2,
        chapterId: 'bio-11-cell',
        title: 'Prokaryotic Cells & Cell Envelope',
        subheading: 'Unit 3: Cell Structure and Functions · NCERT Page 127-128',
        sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 127',
        topics: ['Prokaryotic Cell', 'Cell Envelope', 'Mesosomes', 'Pili and Fimbriae'],
        sections: [
          {
            id: 'sec-8-4',
            title: '8.4 Prokaryotic Cells',
            content: [
              'The prokaryotic cells are represented by bacteria, blue-green algae, mycoplasma and PPLO (Pleuro Pneumonia Like Organisms). They are generally smaller and multiply more rapidly than the eukaryotic cells.',
              'The four basic shapes of bacteria are bacillus (rod like), coccus (spherical), vibrio (comma shaped) and spirillum (spiral).',
              'All prokaryotes have a cell wall surrounding the cell membrane except in mycoplasma. The fluid matrix filling the cell is the cytoplasm. There is no well-defined nucleus. The genetic material is basically naked, not enveloped by a nuclear membrane.'
            ],
            keyTerms: ['Mycoplasma lacks cell wall', 'Shapes: Bacillus, Coccus, Vibrio, Spirillum', 'Naked circular DNA (genophore)']
          },
          {
            id: 'sec-8-5',
            title: '8.4.1 Cell Envelope and its Modifications',
            content: [
              'Most prokaryotic cells, particularly the bacterial cells, have a chemically complex cell envelope. The cell envelope consists of a tightly bound three layered structure: the outermost glycocalyx followed by the cell wall and then the plasma membrane.',
              'Although each layer of the envelope performs distinct function, they act together as a single protective unit. Bacteria can be classified into two groups on the basis of differences in cell envelopes and response to Gram staining: Gram positive and Gram negative.',
              'Glycocalyx differs in composition and thickness among different bacteria. It could be a loose sheath called the slime layer, or it may be thick and tough, called the capsule.',
              'A special membranous structure is the mesosome which is formed by the extensions of plasma membrane into the cell. These extensions are in the form of vesicles, tubules and lamellae. They help in cell wall formation, DNA replication and distribution to daughter cells. They also help in respiration and secretion processes.'
            ],
            keyTerms: ['Three layers: Glycocalyx → Cell Wall → Plasma Membrane', 'Slime layer (loose) vs Capsule (tough)', 'Mesosome: Plasma membrane extension for respiration & DNA replication'],
            ncertHighlight: 'Mesosomes are formed by extensions of plasma membrane into the cell in the form of vesicles, tubules and lamellae. They help in respiration, secretion, and cell wall formation.'
          }
        ],
        summaryPoints: [
          'Prokaryotic cell envelope has 3 concentric layers acting as a single protective unit.',
          'Mesosomes are functional analogues of mitochondria in prokaryotes (involved in cellular respiration & replication).',
          'Pili and fimbriae do not play a role in bacterial motility; motility is mediated solely by flagella.'
        ]
      },
      {
        pageNumber: 3,
        chapterId: 'bio-11-cell',
        title: 'Eukaryotic Cells: Plasma Membrane & Endomembrane System',
        subheading: 'Unit 3: Cell Structure and Functions · NCERT Page 131-134',
        sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 131',
        topics: ['Fluid Mosaic Model', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosomes & Vacuoles'],
        sections: [
          {
            id: 'sec-8-6',
            title: '8.5.1 Cell Membrane & Fluid Mosaic Model',
            content: [
              'Chemical studies on human red blood cells enabled the scientists to deduce the possible structure of plasma membrane. The cell membrane is mainly composed of lipids and proteins.',
              'The major lipids are phospholipids that are arranged in a bilayer. The lipids are arranged with the polar hydrophilic head towards the outer sides and the hydrophobic tail towards the inner part. This ensures that the nonpolar tail of saturated hydrocarbons is protected from the aqueous environment.',
              'In human beings, the membrane of the erythrocyte has approximately 52 per cent protein and 40 per cent lipids.',
              'An improved model of cell membrane structure was proposed by Singer and Nicolson (1972) widely accepted as Fluid Mosaic Model. According to this, the quasi-fluid nature of lipid enables lateral movement of proteins within the overall bilayer.'
            ],
            keyTerms: ['Singer & Nicolson (1972) - Fluid Mosaic Model', 'RBC Membrane: 52% protein, 40% lipids', 'Quasi-fluid nature allows lateral movement'],
            ncertHighlight: 'The ratio of protein and lipid varies considerably in different cell types. In human erythrocyte, membrane has approximately 52% protein and 40% lipids.'
          },
          {
            id: 'sec-8-7',
            title: '8.5.3 Endomembrane System',
            content: [
              'While each of the membranous organelles is distinct in terms of its structure and function, many of these are considered together as an endomembrane system because their functions are coordinated.',
              'The endomembrane system includes endoplasmic reticulum (ER), golgi complex, lysosomes and vacuoles.',
              'Since the functions of the mitochondria, chloroplast and peroxisomes are not coordinated with the above components, these are not considered as part of the endomembrane system.',
              'Camillo Golgi (1898) first observed densely stained reticular structures near the nucleus. Golgi apparatus consists of flat, disc-shaped sacs or cisternae of 0.5 µm to 1.0 µm diameter. The Golgi cisternae are concentrically arranged near the nucleus with distinct convex cis or the forming face and concave trans or the maturing face.',
              'The cis and trans faces of the organelle are entirely different, but interconnected. The Golgi apparatus principally performs the function of packaging materials, to be delivered either to the intracellular targets or secreted outside the cell.'
            ],
            keyTerms: ['Endomembrane: ER, Golgi, Lysosomes, Vacuoles', 'EXCLUDED: Mitochondria, Chloroplasts, Peroxisomes', 'Golgi: cis (forming/convex) & trans (maturing/concave)'],
            ncertHighlight: 'Mitochondria, chloroplast and peroxisomes are NOT part of the endomembrane system because their functions are not coordinated with ER, Golgi, lysosomes, and vacuoles.'
          }
        ],
        summaryPoints: [
          'Erythrocyte membrane composition: 52% protein, 40% lipid (frequently tested in NEET).',
          'Cis face faces nucleus (forming face); Trans face faces plasma membrane (maturing face).',
          'Proteins synthesized by ribosomes on ER are modified in the cisternae of Golgi before release.'
        ]
      },
      {
        pageNumber: 4,
        chapterId: 'bio-11-cell',
        title: 'Mitochondria, Plastids, & Nucleus',
        subheading: 'Unit 3: Cell Structure and Functions · NCERT Page 135-138',
        sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 135',
        topics: ['Mitochondria Structure', 'Chloroplasts', 'Ribosomes (70S vs 80S)', 'Nucleus & Chromatin'],
        sections: [
          {
            id: 'sec-8-8',
            title: '8.5.4 Mitochondria: Powerhouse of the Cell',
            content: [
              'Mitochondria unless specifically stained are not easily visible under the microscope. The number of mitochondria per cell is variable depending on the physiological activity of the cells.',
              'Typically it is sausage-shaped or cylindrical having a diameter of 0.2-1.0 µm (average 0.5 µm) and length 1.0-4.1 µm. Each mitochondrion is a double membrane-bound structure with the outer membrane and inner membrane dividing its lumen distinctly into two aqueous compartments: outer compartment and inner compartment.',
              'The inner compartment is filled with a dense homogeneous substance called the matrix. The outer membrane forms the continuous limiting boundary of the organelle.',
              'The inner membrane forms a number of infoldings called cristae (sing. crista) towards the matrix. The cristae increase the surface area. The matrix also possesses single circular DNA molecule, a few RNA molecules, ribosomes (70S) and components required for the synthesis of proteins.',
              'The mitochondria divide by fission.'
            ],
            keyTerms: ['Stain: Janus Green B', 'Cristae: Infoldings to increase surface area', 'Matrix contains single circular DNA & 70S ribosomes', 'Division by fission'],
            ncertHighlight: 'Mitochondrial matrix possesses a single circular DNA molecule, RNA molecules, 70S ribosomes, and divides by fission.'
          },
          {
            id: 'sec-8-9',
            title: '8.5.5 Plastids & Chloroplasts',
            content: [
              'Plastids are found in all plant cells and in euglenoides. These are easily observed under microscope as they are large. Based on type of pigments, plastids can be classified into chloroplasts, chromoplasts and leucoplasts.',
              'Chloroplasts are double membrane-bound. Space limited by inner membrane is called the stroma. A number of organized flattened membranous sacs called thylakoids are present in stroma. Chlorophyll pigments are present in the thylakoids.'
            ],
            keyTerms: ['Chloroplast, Chromoplast, Leucoplast', 'Thylakoid membranes contain chlorophyll', 'Stroma has circular DNA and 70S ribosomes']
          },
          {
            id: 'sec-8-10',
            title: '8.5.7 Nucleus & Chromosomes',
            content: [
              'Nucleus as a cell organelle was first described by Robert Brown as early as 1831. Later the material of the nucleus stained by basic dyes was given the name chromatin by Flemming.',
              'The interphase nucleus has highly extended and elaborate nucleoprotein fibres called chromatin, nuclear matrix and one or more spherical bodies called nucleoli (sing. nucleolus).',
              'Based on the position of centromere, chromosomes can be classified into four types: Metacentric (middle centromere, V-shape), Sub-metacentric (slightly away, L-shape), Acrocentric (close to end, J-shape), and Telocentric (terminal centromere, I-shape).'
            ],
            keyTerms: ['Robert Brown (1831)', 'Flemming (Chromatin - basic dyes)', 'Types: Metacentric, Sub-metacentric, Acrocentric, Telocentric']
          }
        ],
        summaryPoints: [
          'Mitochondria and Chloroplasts both possess circular dsDNA, 70S ribosomes, and divide by binary fission.',
          'Chromatin was coined by Flemming using basic dyes.',
          'Metacentric chromosomes form V-shape during anaphase movement.'
        ]
      }
    ]
  },
  {
    id: 'bio-12-genetics',
    number: 5,
    title: 'Principles of Inheritance and Variation',
    subjectId: 'BIOLOGY',
    classLevel: '12',
    description: 'Mendelian principles, monohybrid & dihybrid crosses, chromosomal theory of inheritance, sex determination, and genetic disorders.',
    totalPages: 2,
    highYieldFor: ['NEET', 'BOARDS'],
    weightage: '10-12% in NEET (4-5 questions every year)',
    concepts: [
      'Mendel\'s Laws of Inheritance',
      'Law of Segregation & Independent Assortment',
      'Incomplete Dominance & Co-dominance',
      'Chromosomal Theory of Inheritance (Sutton & Boveri)',
      'Linkage and Recombination (T.H. Morgan)',
      'Mendelian & Chromosomal Disorders'
    ],
    pages: [
      {
        pageNumber: 1,
        chapterId: 'bio-12-genetics',
        title: 'Mendel\'s Laws of Inheritance',
        subheading: 'Unit 7: Genetics and Evolution · NCERT Page 69-72',
        sourceReference: 'NCERT Class 12 Biology, Chapter 5, Page 70',
        topics: ['Mendel\'s Experiments', 'Seven Characters of Pea', 'Monohybrid Cross', 'Law of Segregation'],
        sections: [
          {
            id: 'sec-gen-1',
            title: '5.1 Mendel\'s Law of Inheritance',
            content: [
              'Gregor Mendel conducted hybridization experiments on garden peas (Pisum sativum) for seven years (1856-1863) and proposed the laws of inheritance in living organisms.',
              'Mendel investigated characters in the garden pea plant that were manifested as two opposing traits, e.g., tall or dwarf plants, yellow or green seeds. This allowed him to set up a basic framework of rules governing inheritance.',
              'He selected 14 true-breeding pea plant varieties, as pairs which were similar except for one character with contrasting traits.'
            ],
            keyTerms: ['Gregor Mendel (1856-1863, 7 years)', 'Pisum sativum (Garden Pea)', '14 true-breeding varieties (7 pairs of contrasting traits)'],
            ncertHighlight: 'Mendel selected 14 true-breeding pea plant varieties, as pairs which were similar except for one character with contrasting traits.'
          }
        ],
        summaryPoints: [
          'Mendel worked for 7 years (1856-1863).',
          'Pod color: Green is dominant, Yellow is recessive (opposite of seed color!).',
          'Law of Segregation is universally applicable with no exceptions in diploid organisms.'
        ]
      },
      {
        pageNumber: 2,
        chapterId: 'bio-12-genetics',
        title: 'Dihybrid Cross & Chromosomal Theory',
        subheading: 'Unit 7: Genetics and Evolution · NCERT Page 79-84',
        sourceReference: 'NCERT Class 12 Biology, Chapter 5, Page 82',
        topics: ['Law of Independent Assortment', 'Sutton & Boveri', 'Morgan\'s Drosophila Experiments', 'Linkage'],
        sections: [
          {
            id: 'sec-gen-2',
            title: '5.3 Chromosomal Theory of Inheritance',
            content: [
              'In 1900, three scientists (de Vries, Correns and von Tschermak) independently rediscovered Mendel’s results on the inheritance of characters.',
              'Walter Sutton and Theodore Boveri noted that the behaviour of chromosomes was parallel to the behaviour of genes and used chromosome movement to explain Mendel\'s laws.',
              'Experimental verification of the chromosomal theory of inheritance by Thomas Hunt Morgan and his colleagues led to discovering the basis for the variation that sexual reproduction produced. Morgan worked with the tiny fruit flies, Drosophila melanogaster.'
            ],
            keyTerms: ['Rediscoverers: de Vries, Correns, von Tschermak (1900)', 'Sutton & Boveri (Chromosomal Theory 1902)', 'T.H. Morgan (Fly room, Drosophila)']
          }
        ],
        summaryPoints: [
          'Drosophila completes its life cycle in about two weeks.',
          'A single mating produces a large number of progeny flies.',
          'Morgan discovered sex linkage and gene distance mapping.'
        ]
      }
    ]
  },
  {
    id: 'phy-11-work',
    number: 6,
    title: 'Work, Energy and Power',
    subjectId: 'PHYSICS',
    classLevel: '11',
    description: 'Work done by constant and variable forces, kinetic energy, work-energy theorem, potential energy of a spring, and elastic/inelastic collisions.',
    totalPages: 2,
    highYieldFor: ['NEET', 'JEE_MAIN', 'JEE_ADV'],
    weightage: '6-8% in NEET & JEE (2-3 questions)',
    concepts: [
      'Work Done by Constant & Variable Force',
      'Work-Energy Theorem for a Variable Force',
      'Conservative and Non-Conservative Forces',
      'Potential Energy of a Spring (1/2 k x²)',
      'Conservation of Mechanical Energy',
      'Collisions in 1D and 2D'
    ],
    pages: [
      {
        pageNumber: 1,
        chapterId: 'phy-11-work',
        title: 'Work and Work-Energy Theorem',
        subheading: 'NCERT Physics Class 11, Chapter 6, Page 114-118',
        sourceReference: 'NCERT Class 11 Physics, Chapter 6, Page 116',
        topics: ['Scalar Product', 'Work Definition', 'Kinetic Energy', 'Work-Energy Theorem'],
        sections: [
          {
            id: 'sec-phy-1',
            title: '6.2 Notions of Work and Kinetic Energy: The Work-Energy Theorem',
            content: [
              'The work done by a force is defined to be the product of component of the force in the direction of the displacement and the magnitude of this displacement: W = (F cos θ) d = F · d.',
              'Work is zero if displacement is zero, force is zero, or force and displacement are mutually perpendicular (θ = 90°).',
              'The Work-Energy Theorem states that the change in kinetic energy of a particle is equal to the work done on it by the net force: Kf - Ki = W_net.'
            ],
            keyTerms: ['W = F · d = F d cos θ', 'Work-Energy Theorem: ΔK = W_total', 'Work is scalar with SI unit Joule (J)'],
            ncertHighlight: 'The work-energy theorem is valid for variable forces and in non-inertial frames provided pseudo forces are included in work calculation.'
          }
        ],
        summaryPoints: [
          'Centripetal force does zero work because force is perpendicular to instantaneous displacement.',
          'Work-Energy Theorem holds true regardless of whether the forces are conservative or non-conservative.'
        ]
      },
      {
        pageNumber: 2,
        chapterId: 'phy-11-work',
        title: 'Potential Energy & Conservation of Mechanical Energy',
        subheading: 'NCERT Physics Class 11, Chapter 6, Page 119-124',
        sourceReference: 'NCERT Class 11 Physics, Chapter 6, Page 120',
        topics: ['Conservative Forces', 'Potential Energy U(x)', 'Spring Potential Energy', 'Power'],
        sections: [
          {
            id: 'sec-phy-2',
            title: '6.7 The Potential Energy of a Spring',
            content: [
              'A spring force is conservative. For an ideal spring obeying Hooke\'s law, F_s = -k x, where k is the spring constant and x is the displacement from equilibrium.',
              'Work done by the spring force when stretched from 0 to x is W_s = - (1/2) k x². The potential energy stored in the spring is U(x) = (1/2) k x².',
              'In the presence of only conservative forces, the total mechanical energy E = K + U remains constant.'
            ],
            keyTerms: ['F = -kx', 'U = 1/2 k x²', 'Mechanical energy conservation: ΔE = 0 if non-conservative forces do no work'],
            ncertHighlight: 'A force is conservative if the work done by it in a closed loop is zero: ∮ F · dr = 0.'
          }
        ],
        summaryPoints: [
          'Friction and air drag are non-conservative forces; they dissipate mechanical energy into heat.',
          'Power is the rate of doing work: P = dW/dt = F · v.'
        ]
      }
    ]
  },
  {
    id: 'chem-11-bonding',
    number: 4,
    title: 'Chemical Bonding and Molecular Structure',
    subjectId: 'CHEMISTRY',
    classLevel: '11',
    description: 'Octet rule, Lewis structures, VSEPR theory, valence bond theory, hybridization (sp, sp2, sp3, sp3d), and molecular orbital theory (MOT).',
    totalPages: 2,
    highYieldFor: ['NEET', 'JEE_MAIN', 'JEE_ADV', 'BOARDS'],
    weightage: '8-10% in NEET & JEE (3-4 questions)',
    concepts: [
      'Lewis Symbols & Octet Rule Limitations',
      'VSEPR Theory (Predicting Shapes of Molecules)',
      'Valence Bond Theory & Orbital Overlap',
      'Hybridization of Atomic Orbitals',
      'Molecular Orbital Theory (Bond Order & Magnetism)',
      'Hydrogen Bonding (Inter vs Intra)'
    ],
    pages: [
      {
        pageNumber: 1,
        chapterId: 'chem-11-bonding',
        title: 'VSEPR Theory & Hybridization',
        subheading: 'NCERT Chemistry Class 11, Chapter 4, Page 108-114',
        sourceReference: 'NCERT Class 11 Chemistry, Chapter 4, Page 110',
        topics: ['VSEPR Postulates', 'Repulsion Order', 'Geometry vs Shape', 'sp3, sp2, sp Hybridization'],
        sections: [
          {
            id: 'sec-chem-1',
            title: '4.2 The VSEPR Model',
            content: [
              'The Valence Shell Electron Pair Repulsion (VSEPR) theory provides a simple procedure to predict the shapes of covalent molecules.',
              'The order of repulsive interaction of electron pairs is: Lone Pair (lp) - Lone Pair (lp) > Lone Pair (lp) - Bond Pair (bp) > Bond Pair (bp) - Bond Pair (bp).',
              'For example, in NH3 there are three bond pairs and one lone pair. The lone pair pushes the bond pairs, reducing the H-N-H angle from 109.5° to 107°. In H2O with two lone pairs, the angle shrinks to 104.5°.'
            ],
            keyTerms: ['Order: lp-lp > lp-bp > bp-bp', 'NH3: Trigonal Pyramidal (107°)', 'H2O: Bent / V-shaped (104.5°)'],
            ncertHighlight: 'Lone pairs are localized on the central atom and occupy more space compared to bonding pairs which are shared between two nuclei.'
          }
        ],
        summaryPoints: [
          'Hybridization involves mixing of orbitals of nearly equal energy on the same atom.',
          'SF4 has see-saw shape with 4 bond pairs and 1 lone pair at equatorial position to minimize repulsion.'
        ]
      },
      {
        pageNumber: 2,
        chapterId: 'chem-11-bonding',
        title: 'Molecular Orbital Theory (MOT) & Bond Order',
        subheading: 'NCERT Chemistry Class 11, Chapter 4, Page 121-127',
        sourceReference: 'NCERT Class 11 Chemistry, Chapter 4, Page 123',
        topics: ['LCAO Principle', 'Bonding vs Antibonding MOs', 'Electronic Configuration of O2 & N2', 'Bond Order Formula'],
        sections: [
          {
            id: 'sec-chem-2',
            title: '4.5 Molecular Orbital Theory',
            content: [
              'Molecular orbitals are formed by the combination of atomic orbitals of comparable energies and proper symmetry (LCAO: Linear Combination of Atomic Orbitals).',
              'Bond order is defined as one half the difference between the number of electrons in bonding orbitals (Nb) and antibonding orbitals (Na): Bond Order = (Nb - Na) / 2.',
              'A positive bond order indicates a stable molecule. O2 has 16 electrons. According to MOT, O2 has two unpaired electrons in antibonding π*2px and π*2py orbitals, successfully explaining why oxygen is paramagnetic!'
            ],
            keyTerms: ['Bond Order = (Nb - Na) / 2', 'O2 is paramagnetic (2 unpaired electrons in π* orbitals)', 'N2 bond order = 3 (diamagnetic)'],
            ncertHighlight: 'MOT explains the paramagnetism of O2, which Valence Bond Theory failed to explain.'
          }
        ],
        summaryPoints: [
          'For molecules with ≤ 14 electrons (e.g. B2, C2, N2), π2px = π2py is lower in energy than σ2pz.',
          'For molecules with > 14 electrons (e.g. O2, F2), σ2pz is lower in energy than π2px = π2py.'
        ]
      }
    ]
  }
];

export const ALL_QUESTIONS: Question[] = [
  // ================= BIO-11 CELL - PAGE 1 =================
  {
    id: 'q-cell-p1-1',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'Cell Theory Formulation',
    section: '8.2 Cell Theory',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Easy',
    questionText: 'Who among the following scientists concluded based on studies on plant tissues that the presence of cell wall is a unique character of plant cells?',
    options: [
      { id: 'A', text: 'Matthias Schleiden (German Botanist)' },
      { id: 'B', text: 'Theodore Schwann (British Zoologist)' },
      { id: 'C', text: 'Rudolf Virchow' },
      { id: 'D', text: 'Robert Brown' }
    ],
    correctAnswer: 'B',
    explanation: 'According to NCERT, Theodore Schwann (1839), who was a British Zoologist, studied plant tissues as well and deduced that the presence of a cell wall is a unique character of plant cells.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 125',
    sourceSnippet: 'Theodore Schwann (1839), a British Zoologist... concluded, based on studies on plant tissues, that the presence of cell wall is a unique character of the plant cells.',
    sourceAnchorId: 'sec-8-2',
    isPYQ: true,
    pyqYear: '2020',
    pyqExam: 'NEET',
    tags: ['NCERT Direct', 'High Yield', 'Cell Theory', 'Concept']
  },
  {
    id: 'q-cell-p1-2',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'Modern Cell Theory & Omnis Cellula',
    section: '8.2 Cell Theory',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'statement_based',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Given below are two statements regarding Cell Theory:\nStatement I: Schleiden and Schwann together formulated the cell theory, but their theory could not explain how new cells were formed.\nStatement II: Rudolf Virchow (1855) modified the cell theory by explaining that new cells arise from pre-existing cells (Omnis cellula-e cellula).\nChoose the correct option:',
    options: [
      { id: 'A', text: 'Both Statement I and Statement II are correct' },
      { id: 'B', text: 'Both Statement I and Statement II are incorrect' },
      { id: 'C', text: 'Statement I is correct but Statement II is incorrect' },
      { id: 'D', text: 'Statement I is incorrect but Statement II is correct' }
    ],
    correctAnswer: 'A',
    explanation: 'Both statements are exact lines from NCERT Class 11, Page 126. Schleiden and Schwann failed to explain new cell origin until Rudolf Virchow added "Omnis cellula-e cellula" in 1855.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 126',
    sourceSnippet: 'This theory however, did not explain as to how new cells were formed. Rudolf Virchow (1855) first explained that cells divided and new cells are formed from pre-existing cells.',
    sourceAnchorId: 'sec-8-2',
    isPYQ: true,
    pyqYear: '2023',
    pyqExam: 'NEET',
    tags: ['Statement Based', 'NCERT Fact', 'PYQ', 'Concept']
  },
  {
    id: 'q-cell-p1-3',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'Cell Dimensions',
    section: '8.3 An Overview of Cell & Dimensions',
    examGoals: ['NEET'],
    questionType: 'match_the_following',
    questionCategory: 'numerical',
    difficulty: 'Medium',
    questionText: 'Match the cells in Column I with their respective sizes in Column II as given in NCERT:\nColumn I:\n(a) Mycoplasma\n(b) Bacteria\n(c) Human RBC diameter\n(d) Largest isolated single cell\nColumn II:\n(i) 3 to 5 µm\n(ii) Ostrich egg\n(iii) 0.3 µm\n(iv) ~7.0 µm',
    options: [
      { id: 'A', text: 'a-(iii), b-(i), c-(iv), d-(ii)' },
      { id: 'B', text: 'a-(i), b-(iii), c-(iv), d-(ii)' },
      { id: 'C', text: 'a-(iii), b-(iv), c-(i), d-(ii)' },
      { id: 'D', text: 'a-(iv), b-(i), c-(iii), d-(ii)' }
    ],
    correctAnswer: 'A',
    explanation: 'NCERT Page 126: Mycoplasma is 0.3 µm; typical bacteria are 3-5 µm; human RBC is ~7.0 µm in diameter; largest isolated single cell is the ostrich egg.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 126',
    sourceSnippet: 'Mycoplasmas, the smallest cells, are only 0.3 µm in length while bacteria could be 3 to 5 µm... human red blood cells are about 7.0 µm in diameter.',
    sourceAnchorId: 'sec-8-3',
    isPYQ: false,
    tags: ['Match the Following', 'Numerical Dimensions', 'NCERT Direct', 'Numerical']
  },
  {
    id: 'q-cell-p1-4',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'Organism Size Scale Diagram',
    section: '8.3 An Overview of Cell & Dimensions',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Medium',
    questionText: 'Refer to the NCERT schematic comparison of organism dimensions below. Identify the entities represented by labels (A), (B), and (C):',
    diagramSvg: `<svg viewBox="0 0 420 120" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="120" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- Eukaryote circle -->
      <circle cx="70" cy="60" r="45" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
      <text x="70" y="55" font-size="12" font-weight="bold" fill="#4338ca" text-anchor="middle">(A)</text>
      <text x="70" y="72" font-size="10" fill="#6366f1" text-anchor="middle">10 - 20 µm</text>
      <!-- Bacterium capsule -->
      <rect x="160" y="42" width="60" height="36" rx="18" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="190" y="58" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">(B)</text>
      <text x="190" y="72" font-size="9" fill="#16a34a" text-anchor="middle">1 - 2 µm</text>
      <!-- PPLO -->
      <circle cx="280" cy="60" r="14" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="280" y="58" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">(C)</text>
      <text x="280" y="70" font-size="8" fill="#d97706" text-anchor="middle">~0.1 µm</text>
      <!-- Virus -->
      <circle cx="360" cy="60" r="6" fill="#fce7f3" stroke="#db2777" stroke-width="1.5"/>
      <text x="360" y="82" font-size="9" fill="#9d174d" text-anchor="middle">Viruses (0.02-0.2 µm)</text>
    </svg>`,
    options: [
      { id: 'A', text: '(A) Typical Eukaryotic Cell, (B) Typical Bacteria, (C) PPLO' },
      { id: 'B', text: '(A) Human RBC, (B) PPLO, (C) Bacteria' },
      { id: 'C', text: '(A) Ostrich Egg, (B) Virus, (C) Mycoplasma' },
      { id: 'D', text: '(A) Typical Bacteria, (B) Typical Eukaryotic Cell, (C) Virus' }
    ],
    correctAnswer: 'A',
    explanation: 'NCERT Figure 8.2 diagrammatically compares relative sizes: A typical eukaryotic cell is 10-20 µm, a typical bacterium is 1-2 µm, PPLO (pleuro-pneumonia like organisms) is about 0.1 µm, and viruses are 0.02-0.2 µm.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 127',
    sourceSnippet: 'Diagram showing comparison of sizes of organisms: A typical eukaryotic cell (10-20 µm), Typical bacteria (1-2 µm), PPLO (about 0.1 µm), Viruses (0.02-0.2 µm).',
    sourceAnchorId: 'sec-8-3',
    isPYQ: true,
    pyqYear: '2021',
    pyqExam: 'NEET',
    tags: ['Diagram Based', 'Size Comparison', 'Figure 8.2', 'Diagram']
  },
  {
    id: 'q-cell-p1-5',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'RBC Linear Packing Calculation',
    section: '8.3 An Overview of Cell & Dimensions',
    examGoals: ['NEET'],
    questionType: 'single_correct',
    questionCategory: 'numerical',
    difficulty: 'Hard',
    questionText: 'A high-resolution microscope viewing field has a linear diameter of 1.4 mm (1400 µm). If human red blood cells of average diameter 7.0 µm are placed side-by-side in a single unbroken linear chain across the diameter, calculate the exact number of RBCs accommodated:',
    options: [
      { id: 'A', text: '200 RBCs' },
      { id: 'B', text: '20 RBCs' },
      { id: 'C', text: '2000 RBCs' },
      { id: 'D', text: '140 RBCs' }
    ],
    correctAnswer: 'A',
    explanation: 'Total field diameter = 1.4 mm = 1400 µm. Diameter of one human RBC = 7.0 µm (NCERT Page 126). Number of RBCs = 1400 µm / 7.0 µm = 200.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 126',
    sourceSnippet: 'Human red blood cells are about 7.0 µm in diameter.',
    sourceAnchorId: 'sec-8-3',
    isPYQ: false,
    tags: ['Numerical Calculation', 'RBC Diameter', 'Numerical']
  },
  {
    id: 'q-cell-p1-6',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 1,
    concept: 'Cell Theory Exceptions',
    section: '8.2 Cell Theory',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Hard',
    questionText: 'Which of the following biological entities is considered an absolute exception to the classical formulation of the Cell Theory proposed by Schleiden and Schwann?',
    options: [
      { id: 'A', text: 'Viruses (acellular nucleoprotein particles without protoplasm)' },
      { id: 'B', text: 'Mycoplasma (smallest living single cell without cell wall)' },
      { id: 'C', text: 'Acetabularia (giant unicellular alga)' },
      { id: 'D', text: 'Cyanobacteria (photosynthetic prokaryotes)' }
    ],
    correctAnswer: 'A',
    explanation: 'Cell theory states all living organisms are composed of cells and cell products. Viruses lack a cellular organization, protoplasm, and metabolic machinery outside a host cell, making them classical exceptions to cell theory.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 126',
    sourceSnippet: 'All living organisms are composed of cells and products of cells.',
    sourceAnchorId: 'sec-8-2',
    isPYQ: false,
    tags: ['Conceptual Trap', 'Virus Exception', 'Concept']
  },

  // ================= BIO-11 CELL - PAGE 2 =================
  {
    id: 'q-cell-p2-1',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 2,
    concept: 'Bacterial Cell Envelope',
    section: '8.4.1 Cell Envelope and its Modifications',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Easy',
    questionText: 'Which of the following is the correct arrangement of the layers of the prokaryotic cell envelope from outside to inside?',
    options: [
      { id: 'A', text: 'Cell wall → Glycocalyx → Plasma membrane' },
      { id: 'B', text: 'Glycocalyx → Cell wall → Plasma membrane' },
      { id: 'C', text: 'Plasma membrane → Cell wall → Glycocalyx' },
      { id: 'D', text: 'Glycocalyx → Plasma membrane → Cell wall' }
    ],
    correctAnswer: 'B',
    explanation: 'In bacteria, the tightly bound three-layered envelope comprises outermost Glycocalyx, middle Cell Wall, and innermost Plasma Membrane.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 128',
    sourceSnippet: 'The cell envelope consists of a tightly bound three layered structure: the outermost glycocalyx followed by the cell wall and then the plasma membrane.',
    sourceAnchorId: 'sec-8-5',
    isPYQ: true,
    pyqYear: '2021',
    pyqExam: 'NEET',
    tags: ['Cell Envelope', 'NEET Direct', 'PYQ', 'Concept']
  },
  {
    id: 'q-cell-p2-2',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 2,
    concept: 'Mesosome Functions',
    section: '8.4.1 Cell Envelope and its Modifications',
    examGoals: ['NEET'],
    questionType: 'assertion_reason',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Assertion (A): Mesosomes in prokaryotes are analogous to mitochondria in eukaryotes.\nReason (R): Mesosomes are plasma membrane extensions that contain enzymes for respiration and increase the enzymatic surface area.',
    options: [
      { id: 'A', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)' },
      { id: 'B', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)' },
      { id: 'C', text: '(A) is true but (R) is false' },
      { id: 'D', text: '(A) is false but (R) is true' }
    ],
    correctAnswer: 'A',
    explanation: 'Mesosomes are invaginations of the bacterial plasma membrane carrying respiratory enzymes, serving the respiratory function of mitochondria in prokaryotic cells.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 129',
    sourceSnippet: 'They help in cell wall formation, DNA replication and distribution to daughter cells. They also help in respiration and secretion processes.',
    sourceAnchorId: 'sec-8-5',
    isPYQ: false,
    tags: ['Assertion Reason', 'Conceptual', 'High Yield', 'Concept']
  },
  {
    id: 'q-cell-p2-3',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 2,
    concept: 'Prokaryotic Cell Structure Diagram',
    section: '8.4.1 Cell Envelope and its Modifications',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Medium',
    questionText: 'Identify the structural components labeled (1), (2), and (3) in the prokaryotic cell diagram below:',
    diagramSvg: `<svg viewBox="0 0 420 130" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="130" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- Bacterium body -->
      <rect x="90" y="30" width="180" height="70" rx="35" fill="#dbeafe" stroke="#3b82f6" stroke-width="4"/>
      <rect x="94" y="34" width="172" height="62" rx="31" fill="#ede9fe" stroke="#8b5cf6" stroke-width="3"/>
      <rect x="98" y="38" width="164" height="54" rx="27" fill="#f0fdf4" stroke="#22c55e" stroke-width="2"/>
      <!-- Mesosome -->
      <path d="M 130 38 Q 140 60 145 42" stroke="#22c55e" stroke-width="2.5" fill="none"/>
      <text x="145" y="30" font-size="10" font-weight="bold" fill="#15803d">(3) Mesosome</text>
      <!-- Flagellum -->
      <path d="M 270 65 Q 310 40 340 70 T 390 60" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <!-- Labels -->
      <line x1="60" y1="20" x2="92" y2="34" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="10" y="20" font-size="10" font-weight="bold" fill="#2563eb">(1) Glycocalyx</text>
      <line x1="60" y1="65" x2="95" y2="65" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="10" y="68" font-size="10" font-weight="bold" fill="#7c3aed">(2) Cell Wall</text>
      <text x="350" y="90" font-size="10" font-weight="bold" fill="#d97706">Flagellum</text>
    </svg>`,
    options: [
      { id: 'A', text: '(1) Glycocalyx, (2) Cell wall, (3) Mesosome invagination' },
      { id: 'B', text: '(1) Plasma membrane, (2) Glycocalyx, (3) Mitochondrion' },
      { id: 'C', text: '(1) Cell wall, (2) Slime layer, (3) Ribosome' },
      { id: 'D', text: '(1) Capsule, (2) Plasma membrane, (3) Nucleoid' }
    ],
    correctAnswer: 'A',
    explanation: 'From outside to inside: (1) is the outermost Glycocalyx, (2) is the middle peptidoglycan Cell Wall, and (3) is the plasma membrane infolding known as the Mesosome.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 128',
    sourceSnippet: 'The outermost glycocalyx followed by the cell wall and then the plasma membrane... extensions in the form of vesicles, tubules and lamellae are called mesosomes.',
    sourceAnchorId: 'sec-8-5',
    isPYQ: true,
    pyqYear: '2023',
    pyqExam: 'NEET',
    tags: ['Diagram Based', 'Cell Envelope', 'Mesosome', 'Diagram']
  },
  {
    id: 'q-cell-p2-4',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 2,
    concept: 'Bacterial Binary Fission Calculation',
    section: '8.4 Prokaryotic Cells',
    examGoals: ['NEET'],
    questionType: 'single_correct',
    questionCategory: 'numerical',
    difficulty: 'Hard',
    questionText: 'A sterile nutrient broth is inoculated with 1 × 10⁴ cells of E. coli. If the generation time under optimal conditions is 20 minutes, calculate the total number of bacterial cells present after 1 hour of exponential growth (assume no cell death):',
    options: [
      { id: 'A', text: '8 × 10⁴ cells' },
      { id: 'B', text: '4 × 10⁴ cells' },
      { id: 'C', text: '6 × 10⁴ cells' },
      { id: 'D', text: '1.6 × 10⁵ cells' }
    ],
    correctAnswer: 'A',
    explanation: 'Total time = 60 minutes. Number of generations n = 60 / 20 = 3 generations. Final population N = N₀ × 2ⁿ = (1 × 10⁴) × 2³ = 8 × 10⁴ cells.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 129',
    sourceSnippet: 'Bacteria reproduce mainly by fission. Sometimes, under unfavourable conditions, they produce spores.',
    sourceAnchorId: 'sec-8-5',
    isPYQ: false,
    tags: ['Exponential Growth', 'Binary Fission', 'Calculation', 'Numerical']
  },

  // ================= BIO-11 CELL - PAGE 3 =================
  {
    id: 'q-cell-p3-1',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 3,
    concept: 'Fluid Mosaic Model & Membrane Composition',
    section: '8.5.1 Cell Membrane & Fluid Mosaic Model',
    examGoals: ['NEET'],
    questionType: 'single_correct',
    questionCategory: 'numerical',
    difficulty: 'Easy',
    questionText: 'In human red blood cells (erythrocytes), the approximate percentage of protein and lipid in the plasma membrane is:',
    options: [
      { id: 'A', text: '40% protein and 52% lipid' },
      { id: 'B', text: '52% protein and 40% lipid' },
      { id: 'C', text: '50% protein and 50% lipid' },
      { id: 'D', text: '60% protein and 40% lipid' }
    ],
    correctAnswer: 'B',
    explanation: 'NCERT explicitly states that in human erythrocytes, the membrane consists of approximately 52% protein and 40% lipids.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 131',
    sourceSnippet: 'In human beings, the membrane of the erythrocyte has approximately 52 per cent protein and 40 per cent lipids.',
    sourceAnchorId: 'sec-8-6',
    isPYQ: true,
    pyqYear: '2022',
    pyqExam: 'NEET',
    tags: ['NEET PYQ', 'Memory Fact', 'RBC Membrane', 'Numerical']
  },
  {
    id: 'q-cell-p3-2',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 3,
    concept: 'Endomembrane System Organelles',
    section: '8.5.3 Endomembrane System',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Which of the following group of organelles is NOT considered as part of the endomembrane system?',
    options: [
      { id: 'A', text: 'Endoplasmic reticulum, Golgi complex, Lysosomes' },
      { id: 'B', text: 'Vacuoles and Lysosomes' },
      { id: 'C', text: 'Mitochondria, Chloroplasts, and Peroxisomes' },
      { id: 'D', text: 'Golgi complex and Vacuoles' }
    ],
    correctAnswer: 'C',
    explanation: 'Mitochondria, chloroplasts, and peroxisomes are excluded from the endomembrane system because their physiological functions are not coordinated with ER and Golgi.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 133',
    sourceSnippet: 'Since the functions of the mitochondria, chloroplast and peroxisomes are not coordinated with the above components, these are not considered as part of the endomembrane system.',
    sourceAnchorId: 'sec-8-7',
    isPYQ: true,
    pyqYear: '2024',
    pyqExam: 'NEET',
    tags: ['Endomembrane System', 'NEET 2024', 'PYQ', 'Concept']
  },
  {
    id: 'q-cell-p3-3',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 3,
    concept: 'Golgi Apparatus Faces',
    section: '8.5.3 Endomembrane System',
    examGoals: ['NEET'],
    questionType: 'statement_based',
    questionCategory: 'concept',
    difficulty: 'Hard',
    questionText: 'Read the following statements regarding the Golgi Apparatus:\nStatement I: The convex cis face is called the forming face, while the concave trans face is called the maturing face.\nStatement II: The cis and trans faces of the Golgi organelle are entirely identical and not interconnected.\nWhich statement(s) is/are true?',
    options: [
      { id: 'A', text: 'Statement I is true, Statement II is false' },
      { id: 'B', text: 'Both Statement I and II are true' },
      { id: 'C', text: 'Statement I is false, Statement II is true' },
      { id: 'D', text: 'Both Statement I and II are false' }
    ],
    correctAnswer: 'A',
    explanation: 'NCERT Page 134 explicitly says: "The cis and trans faces of the organelle are entirely different, but interconnected." Statement II says "identical and not interconnected", which is false.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 134',
    sourceSnippet: 'The cis and trans faces of the organelle are entirely different, but interconnected.',
    sourceAnchorId: 'sec-8-7',
    isPYQ: false,
    tags: ['Golgi Cis Trans', 'Statement Trap', 'High Yield', 'Concept']
  },
  {
    id: 'q-cell-p3-4',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 3,
    concept: 'Fluid Mosaic Model Diagram',
    section: '8.5.1 Cell Membrane & Fluid Mosaic Model',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Medium',
    questionText: 'Study the diagrammatic representation of Singer and Nicolson’s Fluid Mosaic Model below. Identify the components indicated by (X) and (Y):',
    diagramSvg: `<svg viewBox="0 0 420 130" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="130" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- Top lipid head row -->
      <g fill="#38bdf8" stroke="#0284c7" stroke-width="1.5">
        <circle cx="40" cy="35" r="8"/><circle cx="60" cy="35" r="8"/><circle cx="80" cy="35" r="8"/>
        <circle cx="210" cy="35" r="8"/><circle cx="230" cy="35" r="8"/><circle cx="250" cy="35" r="8"/>
        <circle cx="270" cy="35" r="8"/><circle cx="370" cy="35" r="8"/><circle cx="390" cy="35" r="8"/>
      </g>
      <!-- Bottom lipid head row -->
      <g fill="#38bdf8" stroke="#0284c7" stroke-width="1.5">
        <circle cx="40" cy="95" r="8"/><circle cx="60" cy="95" r="8"/><circle cx="80" cy="95" r="8"/>
        <circle cx="210" cy="95" r="8"/><circle cx="230" cy="95" r="8"/><circle cx="250" cy="95" r="8"/>
        <circle cx="270" cy="95" r="8"/><circle cx="370" cy="95" r="8"/><circle cx="390" cy="95" r="8"/>
      </g>
      <!-- Tails -->
      <path d="M 40 43 L 40 87 M 60 43 L 60 87 M 80 43 L 80 87 M 210 43 L 210 87 M 230 43 L 230 87 M 250 43 L 250 87 M 270 43 L 270 87 M 370 43 L 370 87 M 390 43 L 390 87" stroke="#94a3b8" stroke-width="2"/>
      <!-- Integral Protein (X) -->
      <rect x="110" y="22" width="75" height="86" rx="14" fill="#818cf8" stroke="#4f46e5" stroke-width="2"/>
      <text x="147" y="68" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">(X)</text>
      <!-- Peripheral Protein (Y) -->
      <ellipse cx="320" cy="24" rx="32" ry="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <text x="320" y="28" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">(Y)</text>
      <text x="147" y="122" font-size="10" font-weight="bold" fill="#4f46e5" text-anchor="middle">Spans Bilayer</text>
      <text x="320" y="122" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">Surface Attached</text>
    </svg>`,
    options: [
      { id: 'A', text: '(X) Integral/Intrinsic Protein, (Y) Peripheral/Extrinsic Protein' },
      { id: 'B', text: '(X) Peripheral Protein, (Y) Cholesterol molecule' },
      { id: 'C', text: '(X) Phospholipid head, (Y) Glycocalyx sugar chain' },
      { id: 'D', text: '(X) Channel protein, (Y) Hydrophobic core' }
    ],
    correctAnswer: 'A',
    explanation: 'In NCERT Figure 8.4, membrane proteins are classified as integral (partially or totally buried spanning the lipid bilayer, labeled X) and peripheral (lying on the surface of the membrane, labeled Y).',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 131',
    sourceSnippet: 'Peripheral proteins lie on the surface of membrane while the integral proteins are partially or totally buried in the membrane.',
    sourceAnchorId: 'sec-8-6',
    isPYQ: true,
    pyqYear: '2023',
    pyqExam: 'NEET',
    tags: ['Diagram Based', 'Fluid Mosaic Model', 'Integral Protein', 'Diagram']
  },
  {
    id: 'q-cell-p3-5',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 3,
    concept: 'Membrane Protein-to-Lipid Ratio Calculation',
    section: '8.5.1 Cell Membrane',
    examGoals: ['NEET'],
    questionType: 'single_correct',
    questionCategory: 'numerical',
    difficulty: 'Hard',
    questionText: 'Human RBC membrane is composed of 52% protein and 40% lipids by weight. Calculate the precise ratio of protein to lipid mass in the membrane:',
    options: [
      { id: 'A', text: '1.30 : 1' },
      { id: 'B', text: '1.00 : 1.30' },
      { id: 'C', text: '0.77 : 1' },
      { id: 'D', text: '1.50 : 1' }
    ],
    correctAnswer: 'A',
    explanation: 'Ratio of protein to lipid = 52% / 40% = 52 / 40 = 1.30 : 1.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 131',
    sourceSnippet: 'In human beings, the membrane of the erythrocyte has approximately 52 per cent protein and 40 per cent lipids.',
    sourceAnchorId: 'sec-8-6',
    isPYQ: false,
    tags: ['Ratio Calculation', 'RBC Membrane', 'Numerical']
  },

  // ================= BIO-11 CELL - PAGE 4 =================
  {
    id: 'q-cell-p4-1',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 4,
    concept: 'Mitochondrial Matrix & Division',
    section: '8.5.4 Mitochondria: Powerhouse of the Cell',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'multiple_correct',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Which of the following statements about mitochondria are TRUE according to NCERT?\n(1) The inner membrane forms infoldings called cristae to increase surface area\n(2) The matrix possesses single circular DNA molecule\n(3) The ribosomes present inside mitochondria are 80S type\n(4) Mitochondria divide by fission',
    options: [
      { id: 'A', text: '(1), (2), and (4) only' },
      { id: 'B', text: '(1) and (2) only' },
      { id: 'C', text: '(1), (2), and (3) only' },
      { id: 'D', text: 'All (1), (2), (3), and (4)' }
    ],
    correctAnswer: 'A',
    explanation: 'Statement (3) is FALSE because mitochondria contain 70S ribosomes (like prokaryotes), not 80S ribosomes! Statements (1), (2), and (4) are correct.',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 135',
    sourceSnippet: 'The matrix also possesses single circular DNA molecule, a few RNA molecules, ribosomes (70S)... The mitochondria divide by fission.',
    sourceAnchorId: 'sec-8-8',
    isPYQ: true,
    pyqYear: '2023',
    pyqExam: 'NEET',
    tags: ['Mitochondria', '70S Ribosomes', 'NEET PYQ', 'Concept']
  },
  {
    id: 'q-cell-p4-2',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 4,
    concept: 'Chromosome Morphology',
    section: '8.5.7 Nucleus & Chromosomes',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Easy',
    questionText: 'A chromosome having centromere situated close to its end, forming one extremely short and one very long arm is classified as:',
    options: [
      { id: 'A', text: 'Metacentric' },
      { id: 'B', text: 'Sub-metacentric' },
      { id: 'C', text: 'Acrocentric' },
      { id: 'D', text: 'Telocentric' }
    ],
    correctAnswer: 'C',
    explanation: 'Acrocentric chromosome has centromere situated close to its end forming one extremely short and one very long arm. (Telocentric has terminal centromere).',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 138',
    sourceSnippet: 'Acrocentric chromosome has centromere situated close to its end forming one extremely short and one very long arm.',
    sourceAnchorId: 'sec-8-10',
    isPYQ: true,
    pyqYear: '2022',
    pyqExam: 'NEET',
    tags: ['Chromosomes', 'Centromere', 'NCERT Direct', 'Concept']
  },
  {
    id: 'q-cell-p4-3',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 4,
    concept: 'Chromosome Morphology Diagram',
    section: '8.5.7 Nucleus & Chromosomes',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Medium',
    questionText: 'Study the four morphological types of chromosomes shown below. Identify chromosome type (C):',
    diagramSvg: `<svg viewBox="0 0 420 140" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="140" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- Metacentric (A) -->
      <g transform="translate(45, 15)">
        <rect x="15" y="0" width="10" height="40" rx="5" fill="#a7f3d0" stroke="#059669" stroke-width="1.5"/>
        <circle cx="20" cy="45" r="6" fill="#f59e0b"/>
        <rect x="15" y="50" width="10" height="40" rx="5" fill="#a7f3d0" stroke="#059669" stroke-width="1.5"/>
        <text x="20" y="105" font-size="10" font-weight="bold" fill="#047857" text-anchor="middle">(A) Equal arms</text>
      </g>
      <!-- Sub-metacentric (B) -->
      <g transform="translate(140, 15)">
        <rect x="15" y="10" width="10" height="30" rx="5" fill="#bfdbfe" stroke="#2563eb" stroke-width="1.5"/>
        <circle cx="20" cy="45" r="6" fill="#f59e0b"/>
        <rect x="15" y="50" width="10" height="50" rx="5" fill="#bfdbfe" stroke="#2563eb" stroke-width="1.5"/>
        <text x="20" y="115" font-size="10" font-weight="bold" fill="#1d4ed8" text-anchor="middle">(B) Unequal arms</text>
      </g>
      <!-- Acrocentric (C) -->
      <g transform="translate(245, 15)">
        <rect x="15" y="24" width="10" height="15" rx="5" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
        <circle cx="20" cy="45" r="6" fill="#dc2626"/>
        <rect x="15" y="50" width="10" height="65" rx="5" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
        <text x="20" y="128" font-size="11" font-weight="bold" fill="#c2410c" text-anchor="middle">(C) ?</text>
      </g>
      <!-- Telocentric (D) -->
      <g transform="translate(345, 15)">
        <circle cx="20" cy="30" r="6" fill="#f59e0b"/>
        <rect x="15" y="36" width="10" height="75" rx="5" fill="#e9d5ff" stroke="#9333ea" stroke-width="1.5"/>
        <text x="20" y="125" font-size="10" font-weight="bold" fill="#7e22ce" text-anchor="middle">(D) Terminal</text>
      </g>
    </svg>`,
    options: [
      { id: 'A', text: 'Metacentric chromosome' },
      { id: 'B', text: 'Sub-metacentric chromosome' },
      { id: 'C', text: 'Acrocentric chromosome' },
      { id: 'D', text: 'Telocentric chromosome' }
    ],
    correctAnswer: 'C',
    explanation: 'In NCERT Figure 8.13: (A) is Metacentric (centromere at middle), (B) is Sub-metacentric (centromere slightly away from middle), (C) is Acrocentric (centromere close to end with one extremely short arm), and (D) is Telocentric (centromere strictly terminal).',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 138',
    sourceSnippet: 'Types of chromosomes based on the position of centromere: (a) Metacentric, (b) Sub-metacentric, (c) Acrocentric, (d) Telocentric.',
    sourceAnchorId: 'sec-8-10',
    isPYQ: true,
    pyqYear: '2021',
    pyqExam: 'NEET',
    tags: ['Diagram Based', 'Chromosome Types', 'Figure 8.13', 'Diagram']
  },
  {
    id: 'q-cell-p4-4',
    subjectId: 'BIOLOGY',
    classLevel: '11',
    chapterId: 'bio-11-cell',
    pageNumber: 4,
    concept: 'Centromeric Index & Arm Ratio Calculation',
    section: '8.5.7 Nucleus & Chromosomes',
    examGoals: ['NEET'],
    questionType: 'single_correct',
    questionCategory: 'numerical',
    difficulty: 'Hard',
    questionText: 'In an acrocentric human chromosome, the short arm (p) measures 1.5 µm and the long arm (q) measures 7.5 µm. Calculate the arm ratio (q / p) and the centromeric index [p / (p + q) × 100%]:',
    options: [
      { id: 'A', text: 'Arm ratio = 5.0, Centromeric index = 16.7%' },
      { id: 'B', text: 'Arm ratio = 3.0, Centromeric index = 25.0%' },
      { id: 'C', text: 'Arm ratio = 4.0, Centromeric index = 20.0%' },
      { id: 'D', text: 'Arm ratio = 2.5, Centromeric index = 33.3%' }
    ],
    correctAnswer: 'A',
    explanation: 'Arm ratio = q / p = 7.5 / 1.5 = 5.0. Centromeric index = p / (p + q) × 100% = 1.5 / (1.5 + 7.5) × 100% = 1.5 / 9.0 × 100% = 16.67% (~16.7%).',
    sourceReference: 'NCERT Class 11 Biology, Chapter 8, Page 138',
    sourceSnippet: 'Acrocentric chromosome has centromere situated close to its end forming one extremely short and one very long arm.',
    sourceAnchorId: 'sec-8-10',
    isPYQ: false,
    tags: ['Centromeric Index', 'Arm Ratio', 'Numerical Calculation', 'Numerical']
  },

  // ================= GENETICS CLASS 12 =================
  {
    id: 'q-gen-p1-1',
    subjectId: 'BIOLOGY',
    classLevel: '12',
    chapterId: 'bio-12-genetics',
    pageNumber: 1,
    concept: 'Mendel\'s Pea Varieties',
    section: '5.1 Mendel\'s Law of Inheritance',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Easy',
    questionText: 'How many pairs of contrasting characters in pea plants were studied by Mendel in his experiments?',
    options: [
      { id: 'A', text: 'Seven' },
      { id: 'B', text: 'Fourteen' },
      { id: 'C', text: 'Eight' },
      { id: 'D', text: 'Twelve' }
    ],
    correctAnswer: 'A',
    explanation: 'Mendel studied 7 pairs of contrasting traits (meaning 14 true-breeding varieties).',
    sourceReference: 'NCERT Class 12 Biology, Chapter 5, Page 70',
    sourceSnippet: 'Mendel investigated characters in the garden pea plant that were manifested as two opposing traits... selected 14 true-breeding pea plant varieties, as pairs.',
    sourceAnchorId: 'sec-gen-1',
    isPYQ: true,
    pyqYear: '2020',
    pyqExam: 'NEET',
    tags: ['Mendel', 'Pea Plant', 'PYQ', 'Concept']
  },
  {
    id: 'q-gen-p2-1',
    subjectId: 'BIOLOGY',
    classLevel: '12',
    chapterId: 'bio-12-genetics',
    pageNumber: 2,
    concept: 'Chromosomal Theory of Inheritance',
    section: '5.3 Chromosomal Theory of Inheritance',
    examGoals: ['NEET', 'BOARDS'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Who provided experimental verification of the Chromosomal Theory of Inheritance using Drosophila melanogaster?',
    options: [
      { id: 'A', text: 'Walter Sutton and Theodore Boveri' },
      { id: 'B', text: 'Thomas Hunt Morgan and colleagues' },
      { id: 'C', text: 'Hugo de Vries and Carl Correns' },
      { id: 'D', text: 'Alfred Sturtevant' }
    ],
    correctAnswer: 'B',
    explanation: 'Sutton and Boveri proposed the theory, but experimental verification was conducted by Thomas Hunt Morgan and his colleagues using Drosophila melanogaster.',
    sourceReference: 'NCERT Class 12 Biology, Chapter 5, Page 83',
    sourceSnippet: 'Experimental verification of the chromosomal theory of inheritance by Thomas Hunt Morgan and his colleagues led to discovering the basis for the variation.',
    sourceAnchorId: 'sec-gen-2',
    isPYQ: true,
    pyqYear: '2022',
    pyqExam: 'NEET',
    tags: ['Morgan', 'Drosophila', 'Chromosomal Theory', 'Concept']
  },

  // ================= PHYSICS WORK ENERGY =================
  {
    id: 'q-phy-p1-1',
    subjectId: 'PHYSICS',
    classLevel: '11',
    chapterId: 'phy-11-work',
    pageNumber: 1,
    concept: 'Work-Energy Theorem',
    section: '6.2 Notions of Work and Kinetic Energy',
    examGoals: ['NEET', 'JEE_MAIN', 'JEE_ADV'],
    questionType: 'numerical',
    questionCategory: 'numerical',
    difficulty: 'Medium',
    questionText: 'A particle of mass m = 2 kg moves along the x-axis under the action of a force F(x) = (3x² - 2x) N. If the particle is displaced from x = 0 to x = 2 m, find the change in its kinetic energy in Joules.',
    options: [
      { id: 'A', text: '4 J' },
      { id: 'B', text: '8 J' },
      { id: 'C', text: '12 J' },
      { id: 'D', text: '16 J' }
    ],
    correctAnswer: 'A',
    explanation: 'By Work-Energy Theorem: ΔK = W = ∫ F dx from 0 to 2 = [x³ - x²] from 0 to 2 = (8 - 4) - 0 = 4 J.',
    sourceReference: 'NCERT Class 11 Physics, Chapter 6, Page 116',
    sourceSnippet: 'The change in kinetic energy of a particle is equal to the work done on it by the net force.',
    sourceAnchorId: 'sec-phy-1',
    isPYQ: true,
    pyqYear: '2023',
    pyqExam: 'JEE_MAIN',
    tags: ['Work Integral', 'JEE Main', 'Work-Energy Theorem', 'Numerical']
  },
  {
    id: 'q-phy-p1-2',
    subjectId: 'PHYSICS',
    classLevel: '11',
    chapterId: 'phy-11-work',
    pageNumber: 1,
    concept: 'Force-Displacement Graph Diagram',
    section: '6.2 Notions of Work and Kinetic Energy',
    examGoals: ['NEET', 'JEE_MAIN'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Easy',
    questionText: 'A variable force acts on a particle moving along the x-axis as depicted in the F-x graph below. What is the total work done by this force in displacing the particle from x = 0 to x = 4 m?',
    diagramSvg: `<svg viewBox="0 0 420 130" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="130" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- Axes -->
      <line x1="50" y1="105" x2="380" y2="105" stroke="#475569" stroke-width="2"/>
      <line x1="50" y1="105" x2="50" y2="20" stroke="#475569" stroke-width="2"/>
      <text x="385" y="108" font-size="10" font-weight="bold" fill="#475569">x (m)</text>
      <text x="45" y="15" font-size="10" font-weight="bold" fill="#475569">F (N)</text>
      <!-- Work area polygon -->
      <polygon points="50,105 50,35 170,35 290,105" fill="#c7d2fe" fill-opacity="0.6" stroke="#4f46e5" stroke-width="2"/>
      <!-- Grid ticks -->
      <line x1="170" y1="105" x2="170" y2="109" stroke="#475569" stroke-width="1.5"/>
      <text x="170" y="120" font-size="10" text-anchor="middle" fill="#475569">x = 2 m</text>
      <line x1="290" y1="105" x2="290" y2="109" stroke="#475569" stroke-width="1.5"/>
      <text x="290" y="120" font-size="10" text-anchor="middle" fill="#475569">x = 4 m</text>
      <text x="40" y="40" font-size="10" font-weight="bold" fill="#4f46e5" text-anchor="end">10 N</text>
      <text x="160" y="70" font-size="11" font-weight="bold" fill="#3730a3">Area = Work Done</text>
    </svg>`,
    options: [
      { id: 'A', text: '30 Joules' },
      { id: 'B', text: '20 Joules' },
      { id: 'C', text: '40 Joules' },
      { id: 'D', text: '15 Joules' }
    ],
    correctAnswer: 'A',
    explanation: 'Work done = Area under F-x graph. Area of rectangle (0 to 2 m) = 2 × 10 = 20 J. Area of triangle (2 to 4 m) = 1/2 × (4 - 2) × 10 = 10 J. Total work = 20 + 10 = 30 J.',
    sourceReference: 'NCERT Class 11 Physics, Chapter 6, Page 118',
    sourceSnippet: 'Work done by a variable force is equal to the area under the force-displacement graph.',
    sourceAnchorId: 'sec-phy-1',
    isPYQ: true,
    pyqYear: '2021',
    pyqExam: 'JEE_MAIN',
    tags: ['F-x Graph', 'Area Under Curve', 'Diagram Based', 'Diagram']
  },
  {
    id: 'q-phy-p2-1',
    subjectId: 'PHYSICS',
    classLevel: '11',
    chapterId: 'phy-11-work',
    pageNumber: 2,
    concept: 'Spring Potential Energy',
    section: '6.7 The Potential Energy of a Spring',
    examGoals: ['NEET', 'JEE_MAIN', 'JEE_ADV'],
    questionType: 'numerical',
    questionCategory: 'numerical',
    difficulty: 'Medium',
    questionText: 'An ideal spring of force constant k = 200 N/m is compressed by x = 0.1 m from its natural length. What is the potential energy stored in the spring?',
    options: [
      { id: 'A', text: '1.0 J' },
      { id: 'B', text: '2.0 J' },
      { id: 'C', text: '0.5 J' },
      { id: 'D', text: '4.0 J' }
    ],
    correctAnswer: 'A',
    explanation: 'Potential energy of spring U = (1/2) k x² = (1/2) * 200 * (0.1)² = 100 * 0.01 = 1.0 J.',
    sourceReference: 'NCERT Class 11 Physics, Chapter 6, Page 120',
    sourceSnippet: 'The potential energy stored in the spring is U(x) = (1/2) k x².',
    sourceAnchorId: 'sec-phy-2',
    isPYQ: true,
    pyqYear: '2022',
    pyqExam: 'JEE_MAIN',
    tags: ['Spring Force', 'Conservative Force', 'Formula Direct', 'Numerical']
  },

  // ================= CHEMISTRY BONDING =================
  {
    id: 'q-chem-p1-1',
    subjectId: 'CHEMISTRY',
    classLevel: '11',
    chapterId: 'chem-11-bonding',
    pageNumber: 1,
    concept: 'VSEPR Theory',
    section: '4.2 The VSEPR Model',
    examGoals: ['NEET', 'JEE_MAIN'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Easy',
    questionText: 'According to VSEPR theory, the correct decreasing order of repulsive forces between electron pairs is:',
    options: [
      { id: 'A', text: 'lp - lp > lp - bp > bp - bp' },
      { id: 'B', text: 'bp - bp > lp - bp > lp - lp' },
      { id: 'C', text: 'lp - bp > lp - lp > bp - bp' },
      { id: 'D', text: 'lp - lp > bp - bp > lp - bp' }
    ],
    correctAnswer: 'A',
    explanation: 'The repulsion order is Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair because lone pairs are localized only on the central atom and occupy more spherical space.',
    sourceReference: 'NCERT Class 11 Chemistry, Chapter 4, Page 110',
    sourceSnippet: 'The repulsive interaction of electron pairs decreases in the order: Lone pair (lp) - Lone pair (lp) > Lone pair (lp) - Bond pair (bp) > Bond pair (bp) - Bond pair (bp).',
    sourceAnchorId: 'sec-chem-1',
    isPYQ: true,
    pyqYear: '2021',
    pyqExam: 'NEET',
    tags: ['VSEPR Repulsion', 'High Yield', 'NEET Direct', 'Concept']
  },
  {
    id: 'q-chem-p1-2',
    subjectId: 'CHEMISTRY',
    classLevel: '11',
    chapterId: 'chem-11-bonding',
    pageNumber: 1,
    concept: 'VSEPR Geometry Diagram',
    section: '4.2 The VSEPR Model',
    examGoals: ['NEET', 'JEE_MAIN'],
    questionType: 'single_correct',
    questionCategory: 'diagram',
    difficulty: 'Medium',
    questionText: 'Study the molecular geometry and lone-pair distortions shown below for NH3 and H2O. Why is the bond angle in H2O (104.5°) smaller than that in NH3 (107°)?',
    diagramSvg: `<svg viewBox="0 0 420 130" class="w-full h-auto text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="130" rx="8" fill="#f8fafc" class="dark:fill-slate-800" stroke="#cbd5e1" class="dark:stroke-slate-700"/>
      <!-- NH3 Trigonal Pyramidal -->
      <g transform="translate(60, 20)">
        <ellipse cx="40" cy="18" rx="14" ry="8" fill="#e0e7ff" stroke="#6366f1" stroke-dasharray="2,2"/>
        <text x="40" y="21" font-size="9" fill="#4338ca" text-anchor="middle">1 lp</text>
        <circle cx="40" cy="45" r="14" fill="#6366f1"/>
        <text x="40" y="49" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">N</text>
        <line x1="30" y1="55" x2="10" y2="85" stroke="#4338ca" stroke-width="2.5"/>
        <line x1="50" y1="55" x2="70" y2="85" stroke="#4338ca" stroke-width="2.5"/>
        <line x1="40" y1="58" x2="40" y2="90" stroke="#4338ca" stroke-width="2"/>
        <text x="40" y="102" font-size="10" font-weight="bold" fill="#312e81" text-anchor="middle">Angle = 107°</text>
      </g>
      <!-- H2O Bent -->
      <g transform="translate(240, 20)">
        <ellipse cx="30" cy="18" rx="12" ry="7" fill="#fee2e2" stroke="#ef4444" stroke-dasharray="2,2"/>
        <ellipse cx="55" cy="18" rx="12" ry="7" fill="#fee2e2" stroke="#ef4444" stroke-dasharray="2,2"/>
        <text x="42" y="10" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">2 lone pairs</text>
        <circle cx="42" cy="45" r="14" fill="#ef4444"/>
        <text x="42" y="49" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">O</text>
        <line x1="32" y1="55" x2="12" y2="85" stroke="#b91c1c" stroke-width="2.5"/>
        <line x1="52" y1="55" x2="72" y2="85" stroke="#b91c1c" stroke-width="2.5"/>
        <text x="42" y="102" font-size="10" font-weight="bold" fill="#7f1d1d" text-anchor="middle">Angle = 104.5°</text>
      </g>
    </svg>`,
    options: [
      { id: 'A', text: 'H2O has two lone pairs exerting greater lp-lp repulsion than the single lone pair in NH3' },
      { id: 'B', text: 'Nitrogen is more electronegative than Oxygen' },
      { id: 'C', text: 'NH3 has sp² hybridization while H2O has sp³ hybridization' },
      { id: 'D', text: 'The bond pairs in H2O repel each other more strongly' }
    ],
    correctAnswer: 'A',
    explanation: 'In H2O, there are 2 lone pairs and 2 bond pairs. The repulsion between 2 lone pairs (lp - lp) is greater than lp - bp repulsion in NH3 (which has only 1 lone pair), squeezing the H-O-H bond angle down to 104.5° from the tetrahedral 109.5° angle.',
    sourceReference: 'NCERT Class 11 Chemistry, Chapter 4, Page 112',
    sourceSnippet: 'In water molecule, two lone pairs distort the tetrahedral shape to bent/angular shape with a bond angle of 104.5° due to lp-lp repulsion.',
    sourceAnchorId: 'sec-chem-1',
    isPYQ: true,
    pyqYear: '2022',
    pyqExam: 'NEET',
    tags: ['VSEPR Geometry', 'Bond Angle Distortion', 'Diagram Based', 'Diagram']
  },
  {
    id: 'q-chem-p2-1',
    subjectId: 'CHEMISTRY',
    classLevel: '11',
    chapterId: 'chem-11-bonding',
    pageNumber: 2,
    concept: 'Molecular Orbital Theory & Magnetism',
    section: '4.5 Molecular Orbital Theory',
    examGoals: ['NEET', 'JEE_MAIN', 'JEE_ADV'],
    questionType: 'single_correct',
    questionCategory: 'concept',
    difficulty: 'Medium',
    questionText: 'Which theory explains the paramagnetism of oxygen molecule (O2) with 2 unpaired electrons in antibonding π* orbitals?',
    options: [
      { id: 'A', text: 'Valence Bond Theory' },
      { id: 'B', text: 'Molecular Orbital Theory' },
      { id: 'C', text: 'VSEPR Theory' },
      { id: 'D', text: 'Lewis Theory' }
    ],
    correctAnswer: 'B',
    explanation: 'Valence Bond Theory incorrectly predicted O2 to be diamagnetic. Molecular Orbital Theory showed that O2 has 2 unpaired electrons in π*2px and π*2py orbitals, correctly explaining its paramagnetism.',
    sourceReference: 'NCERT Class 11 Chemistry, Chapter 4, Page 123',
    sourceSnippet: 'According to MOT, O2 has two unpaired electrons in antibonding π*2px and π*2py orbitals, successfully explaining why oxygen is paramagnetic.',
    sourceAnchorId: 'sec-chem-2',
    isPYQ: true,
    pyqYear: '2024',
    pyqExam: 'NEET',
    tags: ['MOT', 'Paramagnetism', 'JEE Main', 'Concept']
  }
];

export const FULL_NEET_MOCK: CBTTest = {
  id: 'cbt-neet-mini-1',
  title: 'NEXT SOCH NEET High-Yield Unit Test: Cell & Genetics',
  exam: 'NEET',
  durationMinutes: 45,
  totalMarks: 40,
  subjects: [
    {
      subject: 'BIOLOGY',
      questionsCount: 10,
      marksPerCorrect: 4,
      negativeMarks: 1,
    }
  ],
  questions: ALL_QUESTIONS.filter(q => q.subjectId === 'BIOLOGY')
};

export const CBT_TESTS: CBTTest[] = [FULL_NEET_MOCK];

export const SOCH_OF_THE_DAY = [
  {
    id: 'sod-1',
    quote: 'NCERT isn’t a book you read once. It is a treasure map where every diagram and footnote conceals a 4-mark NEET rank booster.',
    author: 'NEXT SOCH Academic Council',
    insight: 'Did you know? Schwann was a Zoologist who discovered that the cell wall is unique to plant cells. Never confuse him with Schleiden!',
    date: 'Today',
  },
  {
    id: 'sod-2',
    quote: 'Solving 30 questions directly from the textbook page you just read burns the concept into long-term memory 4x faster than passive highlighting.',
    author: 'Cognitive Science of Exam Prep',
    insight: 'Pro Tip: Mesosomes are the prokaryotic mitochondria. Whenever you see respiration in bacteria, think mesosomes.',
    date: 'Yesterday',
  }
];

export const FUN_STUDENT_MEMES = [
  {
    id: 'meme-1',
    title: 'Me reading NCERT vs Me solving Assertion-Reason',
    caption: '“I understand everything” ➡️ “Both A and R are true but R is... wait what?”',
    mood: 'Brain fried 🍳',
  },
  {
    id: 'meme-2',
    title: 'Cell: The Unit of Life supremacy',
    caption: 'Janus Green B for mitochondria, Flemming for chromatin... my brain is 90% NCERT names now.',
    mood: 'In the zone 🎯',
  }
];
