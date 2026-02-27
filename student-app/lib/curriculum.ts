import { SubjectInfo } from '@/types'

type CurriculumMap = {
  [classNum: number]: {
    [subject: string]: SubjectInfo
  }
}

export const CURRICULUM: CurriculumMap = {
  9: {
    science: {
      name: 'Science',
      chapters: [
        { id: 1, name: 'Matter in Our Surroundings', topics: ['Physical nature of matter', 'States of matter', 'Evaporation', 'Latent heat'] },
        { id: 2, name: 'Is Matter Around Us Pure', topics: ['Mixtures', 'Solutions', 'Colloids', 'Separation techniques', 'Physical and chemical changes'] },
        { id: 3, name: 'Atoms and Molecules', topics: ['Laws of chemical combination', 'Dalton\'s atomic theory', 'Atoms', 'Molecules', 'Molecular mass', 'Mole concept'] },
        { id: 4, name: 'Structure of the Atom', topics: ['Thomson model', 'Rutherford model', 'Bohr model', 'Atomic number', 'Mass number', 'Isotopes'] },
        { id: 5, name: 'The Fundamental Unit of Life', topics: ['Cell structure', 'Prokaryotic vs Eukaryotic', 'Cell organelles', 'Plasma membrane', 'Cell wall'] },
        { id: 6, name: 'Tissues', topics: ['Plant tissues', 'Meristematic tissue', 'Permanent tissue', 'Animal tissues', 'Epithelial', 'Connective', 'Muscular', 'Nervous'] },
        { id: 7, name: 'Motion', topics: ['Uniform motion', 'Non-uniform motion', 'Velocity', 'Acceleration', 'Equations of motion', 'Graphical representation'] },
        { id: 8, name: 'Force and Laws of Motion', topics: ['Newton\'s first law', 'Newton\'s second law', 'Newton\'s third law', 'Momentum', 'Conservation of momentum'] },
        { id: 9, name: 'Gravitation', topics: ['Universal law of gravitation', 'Free fall', 'Weight vs Mass', 'Pressure', 'Thrust', 'Buoyancy', 'Archimedes principle'] },
        { id: 10, name: 'Work and Energy', topics: ['Work done', 'Energy types', 'Kinetic energy', 'Potential energy', 'Power', 'Conservation of energy'] },
        { id: 11, name: 'Sound', topics: ['Wave motion', 'Characteristics of sound', 'Speed of sound', 'Reflection of sound', 'Echo', 'Ultrasound', 'SONAR'] },
        { id: 12, name: 'Improvement in Food Resources', topics: ['Crop production', 'Manure and fertilizers', 'Irrigation', 'Crop protection', 'Animal husbandry'] },
      ],
    },
    maths: {
      name: 'Mathematics',
      chapters: [
        { id: 1, name: 'Number Systems', topics: ['Irrational numbers', 'Real numbers', 'Decimal expansions', 'Number line', 'Laws of exponents'] },
        { id: 2, name: 'Polynomials', topics: ['Degree', 'Zeroes of polynomial', 'Remainder theorem', 'Factor theorem', 'Algebraic identities'] },
        { id: 3, name: 'Coordinate Geometry', topics: ['Cartesian system', 'Quadrants', 'Plotting points', 'Linear equations as lines'] },
        { id: 4, name: 'Linear Equations in Two Variables', topics: ['Solutions', 'Graphical method', 'Equations of axes', 'Word problems'] },
        { id: 5, name: 'Introduction to Euclid\'s Geometry', topics: ['Euclid\'s definitions', 'Axioms', 'Postulates', 'Theorems'] },
        { id: 6, name: 'Lines and Angles', topics: ['Types of angles', 'Parallel lines', 'Transversal', 'Angle sum property'] },
        { id: 7, name: 'Triangles', topics: ['Congruence criteria (SAS, ASA, SSS, RHS)', 'Properties of triangles', 'Inequalities in triangles'] },
        { id: 8, name: 'Quadrilaterals', topics: ['Types of quadrilaterals', 'Properties of parallelogram', 'Mid-point theorem'] },
        { id: 9, name: 'Circles', topics: ['Circle terms', 'Chord properties', 'Angle subtended by chord', 'Cyclic quadrilateral'] },
        { id: 10, name: 'Heron\'s Formula', topics: ['Area of triangle using sides', 'Area of quadrilateral'] },
        { id: 11, name: 'Surface Areas and Volumes', topics: ['Cuboid', 'Cube', 'Right circular cylinder', 'Right circular cone', 'Sphere'] },
        { id: 12, name: 'Statistics', topics: ['Collection of data', 'Presentation of data', 'Mean', 'Median', 'Mode', 'Bar graphs', 'Histograms', 'Frequency polygons'] },
        { id: 13, name: 'Probability', topics: ['Empirical probability', 'Experiments', 'Events', 'Probability formula'] },
      ],
    },
  },
  10: {
    science: {
      name: 'Science',
      chapters: [
        { id: 1, name: 'Chemical Reactions and Equations', topics: ['Balancing chemical equations', 'Types of reactions', 'Oxidation and reduction', 'Corrosion', 'Rancidity'] },
        { id: 2, name: 'Acids, Bases and Salts', topics: ['Properties of acids/bases', 'pH scale', 'Indicators', 'Common salts', 'Preparation of salts'] },
        { id: 3, name: 'Metals and Non-metals', topics: ['Physical properties', 'Chemical properties', 'Reactivity series', 'Extraction of metals', 'Corrosion prevention'] },
        { id: 4, name: 'Carbon and its Compounds', topics: ['Bonding in carbon', 'Hydrocarbons', 'Functional groups', 'Homologous series', 'Nomenclature', 'Chemical reactions'] },
        { id: 5, name: 'Life Processes', topics: ['Nutrition', 'Respiration', 'Transportation in plants and animals', 'Excretion'] },
        { id: 6, name: 'Control and Coordination', topics: ['Nervous system', 'Reflex action', 'Human brain', 'Endocrine system', 'Plant hormones'] },
        { id: 7, name: 'How do Organisms Reproduce?', topics: ['Asexual reproduction', 'Sexual reproduction in plants', 'Sexual reproduction in humans', 'Contraception'] },
        { id: 8, name: 'Heredity', topics: ['Mendel\'s laws', 'Dominant and recessive traits', 'Sex determination', 'Evolution', 'Natural selection'] },
        { id: 9, name: 'Light – Reflection and Refraction', topics: ['Laws of reflection', 'Spherical mirrors', 'Mirror formula', 'Laws of refraction', 'Lenses', 'Lens formula', 'Power of lens'] },
        { id: 10, name: 'Human Eye and the Colourful World', topics: ['Eye structure and working', 'Defects of vision', 'Refraction by prism', 'Dispersion', 'Atmospheric refraction'] },
        { id: 11, name: 'Electricity', topics: ['Ohm\'s law', 'Resistance', 'Series and parallel circuits', 'Heating effect', 'Electric power'] },
        { id: 12, name: 'Magnetic Effects of Electric Current', topics: ['Magnetic field', 'Electromagnet', 'Force on current-carrying conductor', 'Electric motor', 'Electromagnetic induction', 'Electric generator'] },
        { id: 13, name: 'Our Environment', topics: ['Ecosystem', 'Food chains and webs', 'Ozone layer depletion', 'Management of garbage'] },
      ],
    },
    maths: {
      name: 'Mathematics',
      chapters: [
        { id: 1, name: 'Real Numbers', topics: ['Euclid\'s division algorithm', 'Fundamental theorem of arithmetic', 'Irrational numbers', 'Rational numbers as decimals'] },
        { id: 2, name: 'Polynomials', topics: ['Zeroes and coefficients relationship', 'Division algorithm for polynomials'] },
        { id: 3, name: 'Pair of Linear Equations in Two Variables', topics: ['Graphical method', 'Substitution method', 'Elimination method', 'Cross-multiplication', 'Reducible equations'] },
        { id: 4, name: 'Quadratic Equations', topics: ['Standard form', 'Factorisation method', 'Completing the square', 'Quadratic formula', 'Nature of roots'] },
        { id: 5, name: 'Arithmetic Progressions', topics: ['AP definition', 'nth term formula', 'Sum of n terms', 'Applications'] },
        { id: 6, name: 'Triangles', topics: ['Similarity criteria (AA, SSS, SAS)', 'Areas of similar triangles', 'Pythagoras theorem', 'Converse of Pythagoras'] },
        { id: 7, name: 'Coordinate Geometry', topics: ['Distance formula', 'Section formula', 'Midpoint formula', 'Area of triangle using coordinates'] },
        { id: 8, name: 'Introduction to Trigonometry', topics: ['Trigonometric ratios', 'Values of specific angles', 'Trigonometric identities', 'Complementary angles'] },
        { id: 9, name: 'Some Applications of Trigonometry', topics: ['Heights and distances', 'Angle of elevation', 'Angle of depression'] },
        { id: 10, name: 'Circles', topics: ['Tangent to a circle', 'Number of tangents from a point', 'Length of tangent'] },
        { id: 11, name: 'Areas Related to Circles', topics: ['Perimeter and area of circle', 'Area of sector', 'Area of segment', 'Combinations of figures'] },
        { id: 12, name: 'Surface Areas and Volumes', topics: ['Combination of solids', 'Conversion of solids', 'Frustum of a cone'] },
        { id: 13, name: 'Statistics', topics: ['Mean by different methods', 'Mode', 'Median', 'Cumulative frequency', 'Ogive'] },
        { id: 14, name: 'Probability', topics: ['Classical definition', 'Sample space', 'Events', 'Complementary events'] },
      ],
    },
  },
  11: {
    physics: {
      name: 'Physics',
      chapters: [
        { id: 1, name: 'Physical World', topics: ['Scope of physics', 'Scientific method', 'Fundamental forces'] },
        { id: 2, name: 'Units and Measurement', topics: ['SI units', 'Dimensional analysis', 'Significant figures', 'Errors in measurement'] },
        { id: 3, name: 'Motion in a Straight Line', topics: ['Position and displacement', 'Uniform motion', 'Non-uniform motion', 'Velocity', 'Acceleration', 'Kinematic equations', 'Free fall'] },
        { id: 4, name: 'Motion in a Plane', topics: ['Scalars and vectors', 'Vector operations', 'Projectile motion', 'Uniform circular motion', 'Relative velocity'] },
        { id: 5, name: 'Laws of Motion', topics: ['Newton\'s laws', 'Inertia', 'Momentum', 'Friction', 'Circular dynamics'] },
        { id: 6, name: 'Work, Energy and Power', topics: ['Work-energy theorem', 'Potential energy', 'Conservation of energy', 'Power', 'Collisions'] },
        { id: 7, name: 'System of Particles and Rotational Motion', topics: ['Centre of mass', 'Torque', 'Angular momentum', 'Moment of inertia', 'Rolling motion'] },
        { id: 8, name: 'Gravitation', topics: ['Kepler\'s laws', 'Universal gravitation', 'Gravitational potential energy', 'Orbital velocity', 'Escape velocity', 'Satellites'] },
        { id: 9, name: 'Mechanical Properties of Solids', topics: ['Elasticity', 'Stress and strain', 'Hooke\'s law', 'Young\'s modulus', 'Bulk modulus', 'Shear modulus'] },
        { id: 10, name: 'Mechanical Properties of Fluids', topics: ['Pressure', 'Pascal\'s law', 'Archimedes\' principle', 'Viscosity', 'Surface tension', 'Bernoulli\'s principle'] },
        { id: 11, name: 'Thermal Properties of Matter', topics: ['Temperature', 'Thermal expansion', 'Specific heat', 'Calorimetry', 'Heat transfer modes'] },
        { id: 12, name: 'Thermodynamics', topics: ['Thermal equilibrium', 'Zeroth law', 'First law', 'Second law', 'Heat engines', 'Carnot cycle'] },
        { id: 13, name: 'Kinetic Theory', topics: ['Gas laws', 'Kinetic theory of gases', 'RMS speed', 'Degrees of freedom', 'Mean free path'] },
        { id: 14, name: 'Oscillations', topics: ['SHM', 'Equations of SHM', 'Spring-mass system', 'Simple pendulum', 'Damped oscillations', 'Resonance'] },
        { id: 15, name: 'Waves', topics: ['Wave motion', 'Transverse and longitudinal waves', 'Speed of wave', 'Principle of superposition', 'Standing waves', 'Beats', 'Doppler effect'] },
      ],
    },
    chemistry: {
      name: 'Chemistry',
      chapters: [
        { id: 1, name: 'Some Basic Concepts of Chemistry', topics: ['Matter', 'Atomic mass', 'Mole concept', 'Empirical and molecular formula', 'Stoichiometry'] },
        { id: 2, name: 'Structure of Atom', topics: ['Discovery of electron/proton/neutron', 'Bohr\'s model', 'Quantum numbers', 'Aufbau principle', 'Electronic configuration'] },
        { id: 3, name: 'Classification of Elements and Periodicity', topics: ['Periodic law', 'Modern periodic table', 'Periodic trends in properties'] },
        { id: 4, name: 'Chemical Bonding and Molecular Structure', topics: ['Ionic bond', 'Covalent bond', 'VSEPR theory', 'Hybridization', 'Hydrogen bonding'] },
        { id: 5, name: 'Thermodynamics', topics: ['System and surroundings', 'Enthalpy', 'Hess\'s law', 'Entropy', 'Gibbs free energy', 'Spontaneity'] },
        { id: 6, name: 'Equilibrium', topics: ['Chemical equilibrium', 'Equilibrium constant', 'Le Chatelier\'s principle', 'Ionic equilibrium', 'pH calculations', 'Buffer solutions'] },
        { id: 7, name: 'Redox Reactions', topics: ['Oxidation number', 'Oxidation and reduction', 'Balancing redox equations', 'Electrochemical series'] },
        { id: 8, name: 'Organic Chemistry – Basic Principles', topics: ['IUPAC nomenclature', 'Isomerism', 'Inductive effect', 'Resonance', 'Hyperconjugation', 'Reaction mechanisms'] },
        { id: 9, name: 'Hydrocarbons', topics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic hydrocarbons', 'Reactions'] },
        { id: 10, name: 'The s-Block Elements', topics: ['Alkali metals properties', 'Alkaline earth metals', 'Biological importance', 'Compounds and uses'] },
        { id: 11, name: 'The p-Block Elements', topics: ['Group 13 elements (Boron family)', 'Group 14 elements (Carbon family)', 'Allotropes', 'Important compounds'] },
        { id: 12, name: 'Environmental Chemistry', topics: ['Atmospheric pollution', 'Water pollution', 'Soil pollution', 'Industrial waste', 'Green chemistry'] },
      ],
    },
    maths: {
      name: 'Mathematics',
      chapters: [
        { id: 1, name: 'Sets', topics: ['Types of sets', 'Set operations', 'Venn diagrams', 'De Morgan\'s laws', 'Cartesian product'] },
        { id: 2, name: 'Relations and Functions', topics: ['Ordered pairs', 'Types of relations', 'Types of functions', 'Domain and range'] },
        { id: 3, name: 'Trigonometric Functions', topics: ['Radian measure', 'Trigonometric functions', 'Graphs', 'Identities', 'Trigonometric equations'] },
        { id: 4, name: 'Complex Numbers and Quadratic Equations', topics: ['Complex numbers', 'Argand plane', 'Modulus and argument', 'Quadratic equations with complex roots'] },
        { id: 5, name: 'Linear Inequalities', topics: ['Algebraic solutions', 'Graphical method', 'System of linear inequalities'] },
        { id: 6, name: 'Permutations and Combinations', topics: ['Fundamental counting principle', 'Permutations', 'Combinations', 'Word problems'] },
        { id: 7, name: 'Binomial Theorem', topics: ['Binomial expansion', 'General term', 'Middle term', 'Properties of binomial coefficients'] },
        { id: 8, name: 'Sequences and Series', topics: ['AP', 'GP', 'Relationship between AM and GM', 'Sum of special series'] },
        { id: 9, name: 'Straight Lines', topics: ['Slope', 'Various forms of equation', 'Distance from point to line', 'Angle between lines'] },
        { id: 10, name: 'Conic Sections', topics: ['Circle', 'Parabola', 'Ellipse', 'Hyperbola', 'Standard equations'] },
        { id: 11, name: 'Introduction to 3D Geometry', topics: ['Coordinate axes and planes', 'Coordinates of a point', 'Distance formula', 'Section formula'] },
        { id: 12, name: 'Limits and Derivatives', topics: ['Intuitive idea of limit', 'Algebra of limits', 'Limits of trigonometric functions', 'Derivatives', 'Algebra of derivatives'] },
        { id: 13, name: 'Statistics', topics: ['Measures of dispersion', 'Range', 'Mean deviation', 'Variance', 'Standard deviation'] },
        { id: 14, name: 'Probability', topics: ['Random experiment', 'Sample space', 'Events', 'Axiomatic probability', 'Mutually exclusive events'] },
      ],
    },
    biology: {
      name: 'Biology',
      chapters: [
        { id: 1, name: 'The Living World', topics: ['Biodiversity', 'Classification', 'Nomenclature', 'Taxonomic categories', 'Taxonomical aids'] },
        { id: 2, name: 'Biological Classification', topics: ['Five kingdom classification', 'Monera', 'Protista', 'Fungi', 'Viruses and lichens'] },
        { id: 3, name: 'Plant Kingdom', topics: ['Algae', 'Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms', 'Plant life cycles'] },
        { id: 4, name: 'Animal Kingdom', topics: ['Basis of classification', 'Major phyla characteristics', 'Vertebrates classification'] },
        { id: 5, name: 'Morphology of Flowering Plants', topics: ['Root', 'Stem', 'Leaf', 'Inflorescence', 'Flower', 'Fruit', 'Seed'] },
        { id: 6, name: 'Anatomy of Flowering Plants', topics: ['Tissue systems', 'Anatomy of root/stem/leaf', 'Secondary growth'] },
        { id: 7, name: 'Structural Organisation in Animals', topics: ['Tissues', 'Organs', 'Earthworm anatomy', 'Cockroach anatomy', 'Frog anatomy'] },
        { id: 8, name: 'Cell: The Unit of Life', topics: ['Cell theory', 'Prokaryotic cell', 'Eukaryotic cell', 'Cell organelles in detail'] },
        { id: 9, name: 'Biomolecules', topics: ['Carbohydrates', 'Proteins', 'Lipids', 'Nucleic acids', 'Enzymes'] },
        { id: 10, name: 'Cell Cycle and Cell Division', topics: ['Cell cycle phases', 'Mitosis', 'Meiosis', 'Significance'] },
        { id: 11, name: 'Photosynthesis in Higher Plants', topics: ['Light reactions', 'Calvin cycle', 'C4 pathway', 'Photorespiration', 'Factors affecting photosynthesis'] },
        { id: 12, name: 'Respiration in Plants', topics: ['Glycolysis', 'Fermentation', 'Aerobic respiration', 'Krebs cycle', 'Electron transport chain'] },
        { id: 13, name: 'Plant Growth and Development', topics: ['Growth phases', 'Plant growth regulators', 'Photoperiodism', 'Vernalisation'] },
        { id: 14, name: 'Digestion and Absorption', topics: ['Digestive system', 'Digestion in mouth/stomach/intestine', 'Absorption', 'Disorders'] },
        { id: 15, name: 'Breathing and Exchange of Gases', topics: ['Respiratory organs', 'Breathing mechanism', 'Exchange of gases', 'Transport of gases', 'Disorders'] },
        { id: 16, name: 'Body Fluids and Circulation', topics: ['Blood composition', 'Blood groups', 'Cardiac cycle', 'ECG', 'Lymph', 'Disorders'] },
        { id: 17, name: 'Excretory Products and their Elimination', topics: ['Nephron structure', 'Urine formation', 'Tubular reabsorption', 'Dialysis', 'Disorders'] },
        { id: 18, name: 'Locomotion and Movement', topics: ['Types of movement', 'Muscle types', 'Skeletal system', 'Joints', 'Disorders'] },
        { id: 19, name: 'Neural Control and Coordination', topics: ['Neuron structure', 'Nerve impulse', 'CNS', 'PNS', 'Reflex action', 'Sense organs'] },
        { id: 20, name: 'Chemical Coordination and Integration', topics: ['Endocrine glands', 'Hormones and their functions', 'Disorders'] },
      ],
    },
  },
  12: {
    physics: {
      name: 'Physics',
      chapters: [
        { id: 1, name: 'Electric Charges and Fields', topics: ['Coulomb\'s law', 'Superposition principle', 'Electric field', 'Electric field lines', 'Electric flux', 'Gauss\'s law'] },
        { id: 2, name: 'Electrostatic Potential and Capacitance', topics: ['Electric potential', 'Potential due to point charge', 'Capacitors', 'Dielectrics', 'Energy stored in capacitor'] },
        { id: 3, name: 'Current Electricity', topics: ['Drift velocity', 'Ohm\'s law', 'Resistivity', 'Kirchhoff\'s laws', 'Wheatstone bridge', 'Potentiometer'] },
        { id: 4, name: 'Moving Charges and Magnetism', topics: ['Magnetic force', 'Biot-Savart law', 'Ampere\'s law', 'Solenoid', 'Cyclotron'] },
        { id: 5, name: 'Magnetism and Matter', topics: ['Bar magnet', 'Earth\'s magnetism', 'Magnetization', 'Dia/Para/Ferromagnetic materials'] },
        { id: 6, name: 'Electromagnetic Induction', topics: ['Faraday\'s laws', 'Lenz\'s law', 'Motional EMF', 'Eddy currents', 'Inductance'] },
        { id: 7, name: 'Alternating Current', topics: ['AC voltage', 'Impedance', 'LC oscillations', 'Series LCR circuit', 'Resonance', 'Power in AC', 'Transformer'] },
        { id: 8, name: 'Electromagnetic Waves', topics: ['Displacement current', 'Maxwell\'s equations', 'EM spectrum', 'Properties of EM waves'] },
        { id: 9, name: 'Ray Optics and Optical Instruments', topics: ['Reflection', 'Refraction', 'Total internal reflection', 'Lenses', 'Microscope', 'Telescope'] },
        { id: 10, name: 'Wave Optics', topics: ['Huygens principle', 'Young\'s double slit experiment', 'Interference', 'Diffraction', 'Polarisation'] },
        { id: 11, name: 'Dual Nature of Radiation and Matter', topics: ['Photoelectric effect', 'Einstein\'s photoelectric equation', 'de Broglie wavelength', 'Davisson-Germer experiment'] },
        { id: 12, name: 'Atoms', topics: ['Rutherford\'s model', 'Bohr\'s model', 'Energy levels', 'Hydrogen spectrum', 'Spectral series'] },
        { id: 13, name: 'Nuclei', topics: ['Atomic masses', 'Nuclear binding energy', 'Radioactivity', 'Nuclear fission', 'Nuclear fusion', 'Nuclear reactor'] },
        { id: 14, name: 'Semiconductor Electronics', topics: ['Energy bands', 'p-n junction diode', 'Rectifiers', 'Transistor', 'Logic gates', 'Integrated circuits'] },
      ],
    },
    chemistry: {
      name: 'Chemistry',
      chapters: [
        { id: 1, name: 'The Solid State', topics: ['Amorphous and crystalline solids', 'Crystal systems', 'Packing efficiency', 'Ionic radii', 'Point defects'] },
        { id: 2, name: 'Solutions', topics: ['Types of solutions', 'Expressing concentration', 'Vapour pressure', 'Colligative properties', 'Van\'t Hoff factor'] },
        { id: 3, name: 'Electrochemistry', topics: ['Electrochemical cells', 'Galvanic cell', 'Nernst equation', 'Conductance', 'Faraday\'s laws of electrolysis', 'Corrosion'] },
        { id: 4, name: 'Chemical Kinetics', topics: ['Rate of reaction', 'Factors affecting rate', 'Rate law', 'Order of reaction', 'Integrated rate equations', 'Activation energy', 'Arrhenius equation'] },
        { id: 5, name: 'Surface Chemistry', topics: ['Adsorption', 'Catalysis', 'Colloids', 'Classification of colloids', 'Preparation and properties'] },
        { id: 6, name: 'General Principles of Isolation of Elements', topics: ['Occurrence of metals', 'Concentration of ores', 'Extraction methods', 'Refining', 'Thermodynamic principles'] },
        { id: 7, name: 'The p-Block Elements', topics: ['Group 15 (Nitrogen family)', 'Group 16 (Oxygen family)', 'Group 17 (Halogen family)', 'Group 18 (Noble gases)', 'Oxyacids'] },
        { id: 8, name: 'The d and f Block Elements', topics: ['Transition metals', 'Properties of transition metals', 'Important compounds', 'Lanthanides', 'Actinides'] },
        { id: 9, name: 'Coordination Compounds', topics: ['Ligands', 'IUPAC nomenclature', 'Isomerism', 'Crystal field theory', 'Stability constants'] },
        { id: 10, name: 'Haloalkanes and Haloarenes', topics: ['Classification', 'Nomenclature', 'Preparation', 'Properties', 'SN1 and SN2 reactions', 'Environmental effects'] },
        { id: 11, name: 'Alcohols, Phenols and Ethers', topics: ['Classification', 'Preparation', 'Physical properties', 'Chemical reactions', 'Important uses'] },
        { id: 12, name: 'Aldehydes, Ketones and Carboxylic Acids', topics: ['Preparation', 'Nucleophilic addition', 'Oxidation/reduction', 'Aldol condensation', 'Acidity of carboxylic acids'] },
        { id: 13, name: 'Amines', topics: ['Classification', 'Structure', 'Preparation', 'Properties', 'Diazonium salts', 'Coupling reactions'] },
        { id: 14, name: 'Biomolecules', topics: ['Carbohydrates', 'Proteins', 'Enzymes', 'Vitamins', 'Nucleic acids', 'Hormones'] },
        { id: 15, name: 'Polymers', topics: ['Classification', 'Methods of polymerisation', 'Molecular mass', 'Biodegradable polymers', 'Commercial polymers'] },
        { id: 16, name: 'Chemistry in Everyday Life', topics: ['Drugs and medicines', 'Chemicals in food', 'Cleansing agents'] },
      ],
    },
    maths: {
      name: 'Mathematics',
      chapters: [
        { id: 1, name: 'Relations and Functions', topics: ['Types of relations', 'Types of functions', 'Composition of functions', 'Inverse functions', 'Binary operations'] },
        { id: 2, name: 'Inverse Trigonometric Functions', topics: ['Domain and range', 'Properties', 'Graphs', 'Formulae and applications'] },
        { id: 3, name: 'Matrices', topics: ['Types of matrices', 'Matrix operations', 'Transpose', 'Symmetric matrices', 'Inverse of matrix'] },
        { id: 4, name: 'Determinants', topics: ['Properties of determinants', 'Cofactors and adjoint', 'Inverse using adjoint', 'Solution of equations', 'Area of triangle'] },
        { id: 5, name: 'Continuity and Differentiability', topics: ['Continuity', 'Differentiability', 'Chain rule', 'Implicit differentiation', 'Rolle\'s theorem', 'Mean value theorem'] },
        { id: 6, name: 'Application of Derivatives', topics: ['Rate of change', 'Increasing/decreasing functions', 'Tangents and normals', 'Maxima and minima', 'Approximations'] },
        { id: 7, name: 'Integrals', topics: ['Integration by substitution', 'Integration by parts', 'Integration by partial fractions', 'Definite integrals', 'Fundamental theorem'] },
        { id: 8, name: 'Application of Integrals', topics: ['Area under simple curves', 'Area between curves'] },
        { id: 9, name: 'Differential Equations', topics: ['Order and degree', 'Variable separable method', 'Homogeneous differential equations', 'Linear differential equations'] },
        { id: 10, name: 'Vector Algebra', topics: ['Types of vectors', 'Addition and multiplication', 'Dot product', 'Cross product', 'Scalar triple product'] },
        { id: 11, name: 'Three Dimensional Geometry', topics: ['Direction cosines', 'Equation of line', 'Plane', 'Angle between line and plane', 'Distance from point to plane'] },
        { id: 12, name: 'Linear Programming', topics: ['Linear programming problem', 'Feasible region', 'Graphical method', 'Corner point theorem'] },
        { id: 13, name: 'Probability', topics: ['Conditional probability', 'Multiplication theorem', 'Bayes\' theorem', 'Random variables', 'Probability distributions', 'Binomial distribution'] },
      ],
    },
    biology: {
      name: 'Biology',
      chapters: [
        { id: 1, name: 'Reproduction in Organisms', topics: ['Modes of asexual reproduction', 'Sexual reproduction', 'Pre and post fertilisation events'] },
        { id: 2, name: 'Sexual Reproduction in Flowering Plants', topics: ['Flower structure', 'Microsporogenesis', 'Megasporogenesis', 'Pollination', 'Fertilisation', 'Fruits and seeds'] },
        { id: 3, name: 'Human Reproduction', topics: ['Male reproductive system', 'Female reproductive system', 'Gametogenesis', 'Fertilisation', 'Pregnancy', 'Parturition'] },
        { id: 4, name: 'Reproductive Health', topics: ['Population explosion', 'Contraception', 'STDs', 'Infertility', 'ART techniques'] },
        { id: 5, name: 'Principles of Inheritance and Variation', topics: ['Mendel\'s laws', 'Chromosomal theory', 'Linkage', 'Sex determination', 'Mutation', 'Genetic disorders'] },
        { id: 6, name: 'Molecular Basis of Inheritance', topics: ['DNA structure', 'DNA replication', 'Transcription', 'Genetic code', 'Translation', 'Gene expression regulation'] },
        { id: 7, name: 'Evolution', topics: ['Origin of life', 'Theories of evolution', 'Darwin\'s theory', 'Natural selection', 'Speciation', 'Human evolution'] },
        { id: 8, name: 'Human Health and Disease', topics: ['Common diseases', 'Immunity', 'Vaccination', 'AIDS', 'Cancer', 'Drug and alcohol abuse'] },
        { id: 9, name: 'Strategies for Enhancement in Food Production', topics: ['Plant breeding', 'Mutation breeding', 'Animal husbandry', 'Single cell protein', 'Tissue culture'] },
        { id: 10, name: 'Microbes in Human Welfare', topics: ['Microbes in household products', 'Industrial microbiology', 'Biogas production', 'Biocontrol agents', 'Biofertilisers'] },
        { id: 11, name: 'Biotechnology: Principles and Processes', topics: ['Recombinant DNA technology', 'PCR', 'Gel electrophoresis', 'Cloning vectors', 'Competent host'] },
        { id: 12, name: 'Biotechnology and its Applications', topics: ['Insulin production', 'Gene therapy', 'Bt crops', 'RNAi', 'Bioethics', 'Biopiracy'] },
        { id: 13, name: 'Organisms and Populations', topics: ['Habitat and niche', 'Population attributes', 'Population growth models', 'Life history variation', 'Population interactions'] },
        { id: 14, name: 'Ecosystem', topics: ['Ecosystem structure', 'Productivity', 'Decomposition', 'Energy flow', 'Nutrient cycling', 'Ecosystem services'] },
        { id: 15, name: 'Biodiversity and Conservation', topics: ['Biodiversity types', 'Importance', 'Loss of biodiversity', 'Conservation strategies', 'Hotspots', 'Red data book'] },
        { id: 16, name: 'Environmental Issues', topics: ['Air pollution', 'Water pollution', 'Solid waste management', 'Deforestation', 'Greenhouse effect', 'Ozone depletion'] },
      ],
    },
  },
}

export function getSubjectsForClass(classNum: number): string[] {
  const classData = CURRICULUM[classNum]
  if (!classData) return []
  return Object.keys(classData)
}

export function getSubjectInfo(classNum: number, subject: string): SubjectInfo | null {
  return CURRICULUM[classNum]?.[subject] ?? null
}

export function getChapterInfo(classNum: number, subject: string, chapterId: number) {
  const subjectInfo = getSubjectInfo(classNum, subject)
  return subjectInfo?.chapters.find((c) => c.id === chapterId) ?? null
}
