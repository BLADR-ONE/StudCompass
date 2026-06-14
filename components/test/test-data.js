/* Content for the career test, ported faithfully from the legacy Firestore
   document `personalityTest/questions` (diacritics modernized ş/ţ → ș/ț).
   Question order is load-bearing: the server scores answer i into the
   dimension DIMENSION_KEYS[i % 6] — see app/api/personality/route.js. */

export const TOTAL_QUESTIONS = 120;
export const STEP_SIZE = 10;
export const STEP_COUNT = TOTAL_QUESTIONS / STEP_SIZE;

/* 20 questions per dimension, each answered 0–2. */
export const MAX_PER_DIMENSION = 40;

/* Same order the API uses to attribute answers (index % 6). */
export const DIMENSION_KEYS = [
  'realist',
  'conventional',
  'social',
  'investigativ',
  'intreprinzator',
  'artistic',
];

/* RIASEC profiles — same copy as the account page reading, so the result
   feels like one voice across the app. */
export const DIMENSIONS = {
  realist: {
    label: 'Realist',
    blurb:
      'Spirit practic și ingeniozitate tehnică: îți place să construiești, să repari și să lucrezi cu unelte, mașini sau în aer liber.',
    jobs: [
      'Inginer mecanic',
      'Constructor',
      'Electrician',
      'Polițist',
      'Tehnician dentar',
      'Arheolog',
    ],
  },
  investigativ: {
    label: 'Investigativ',
    blurb:
      'Analitic și curios: rezolvi sarcini abstracte și vrei să înțelegi lumea. Te atrag cercetarea, științele și problemele grele.',
    jobs: [
      'Informatician',
      'Economist',
      'Chimist',
      'Fizician',
      'Farmacist',
      'Psiholog',
    ],
  },
  artistic: {
    label: 'Artistic',
    blurb:
      'Imaginație și sensibilitate: preferi activitățile libere, nestructurate, în care te poți exprima — adesea prin artă.',
    jobs: ['Arhitect', 'Fotograf', 'Designer', 'Actor', 'Editor', 'Jurnalist'],
  },
  social: {
    label: 'Social',
    blurb:
      'Cooperant și generos, cu abilități verbale: te atrag activitățile care presupun relaționare, informare și sprijinirea celorlalți.',
    jobs: [
      'Profesor',
      'Medic',
      'Psiholog',
      'Asistent social',
      'Logoped',
      'Mass-media',
    ],
  },
  intreprinzator: {
    label: 'Întreprinzător',
    blurb:
      'Entuziast și încrezător: îți place să conduci, să convingi și să-ți asumi inițiativa. Cauți statut și impact.',
    jobs: [
      'Manager',
      'Procuror',
      'Relații cu publicul',
      'Agent de turism',
      'Jurnalist',
    ],
  },
  conventional: {
    label: 'Convențional',
    blurb:
      'Stabil, ordonat și atent la detalii: preferi activitățile clare, cu reguli, în care datele și informațiile stau la locul lor.',
    jobs: [
      'Contabil',
      'Analist financiar',
      'Bibliotecar',
      'Asistent administrativ',
      'Casier',
    ],
  },
};

/* Where the explore CTA points after the reading: dominant profile →
   study-domain slugs from the catalog (seeded in scripts/seed.mjs). */
export const EXPLORE_DOMAINS = {
  realist: ['inginerie', 'arhitectura-si-constructii'],
  conventional: ['stiinte-economice', 'informatica-si-it'],
  social: [
    'stiinte-ale-educatiei',
    'medicina-si-sanatate',
    'psihologie-si-stiinte-ale-comunicarii',
  ],
  investigativ: [
    'stiinte-ale-naturii',
    'biologie-si-mediu',
    'informatica-si-it',
  ],
  intreprinzator: ['stiinte-economice', 'drept-si-stiinte-sociale'],
  artistic: ['arte-si-design', 'stiinte-umaniste'],
};

/* The legacy answer scale: 2 = da, 1 = indiferent, 0 = nu. */
export const ANSWER_OPTIONS = [
  { value: 2, label: 'Da, mi-ar plăcea' },
  { value: 1, label: 'Îmi este indiferent' },
  { value: 0, label: 'Nu mi-ar plăcea' },
];

/* Every question completes the stem «Ți-ar plăcea să…?». */
export const QUESTIONS = [
  'Să repari ceasuri și bijuterii?',
  'Să fii numărător de bani (de exemplu persoana care să primească și să dea bani la o bancă)?',
  'Să discuți cu diverși oameni despre problemele ce privesc comunitatea?',
  'Să faci experiențe științifice?',
  'Să conduci un departament administrativ?',
  'Să cânți pe o scenă?',
  'Să repari motoare de automobile?',
  'Să înregistrezi datele financiare ale unei firme?',
  'Să ajuți persoanele handicapate fizic să se pregătească pentru o meserie?',
  'Să folosești microscopul pentru a studia celule și bacterii?',
  'Să cumperi marfă pentru un magazin mare?',
  'Să fii artist?',
  'Să faci mobilier?',
  'Să lucrezi cu calculatorul sau cu un copiator într-un birou?',
  'Să ajuți pe cei neajutorați (handicap, bătrâni, copii cu probleme)?',
  'Să citești cărți, reviste științifice?',
  'Să fii manager de vânzări?',
  'Să scrii scurte povestiri?',
  'Să lucrezi pe o macara?',
  'Să faci rezervări pentru zboruri de avioane, pentru hoteluri într-un birou de voiaj?',
  'Să fii profesor sau învățător?',
  'Să faci muncă de cercetare într-un laborator fizic?',
  'Să înregistrezi muncitori care au nemulțumiri la locul de muncă?',
  'Să faci desene animate?',
  'Să fii dulgher?',
  'Să fii expert contabil (verificare)?',
  'Să studiezi sociologia, adică cum trăiesc oamenii împreună (grupurile sociale)?',
  'Să faci studii științifice despre Soare, Lună, planete, stele?',
  'Să câștigi bani din comerț sau la bursa de valori?',
  'Să predai muzica în școli?',
  'Să asamblezi componentele unui echipament stereo?',
  'Să verifici bugetul unei firme?',
  'Să dai sfaturi privind legislația oamenilor săraci?',
  'Să studiezi cauzele bolilor de inimă?',
  'Să conduci un restaurant mare?',
  'Să scrii un roman?',
  'Să fii electrician?',
  'Să ții evidența mărfurilor, a ceea ce se consumă la o firmă?',
  'Să ai grijă de oameni bolnavi?',
  'Să utilizezi matematica pentru a rezolva o problemă tehnică și științifică?',
  'Să te ocupi de politica administrativă?',
  'Să organizezi/regizezi piese de teatru?',
  'Să conduci un tractor cu remorcă?',
  'Să lucrezi cu cifre într-un birou de afaceri?',
  'Să ajuți persoanele care au ieșit din închisoare să își găsească un loc de muncă?',
  'Să fii medic chirurg?',
  'Să fii vicepreședinte de bancă?',
  'Să fii cântăreț de jazz?',
  'Să faci, repari, refinisezi mobilă?',
  'Să studiezi o firmă și să elaborezi un sistem contabil pentru nevoile sale financiare?',
  'Să înveți să califici adulți pentru o meserie?',
  'Să fii biolog marin?',
  'Să fii jurisconsultul unei firme?',
  'Să citești articole despre muzică și artă?',
  'Să utilizezi și să repari echipament de radio, telegraf?',
  'Să supervizezi personalul administrativ al unui oficiu?',
  'Să ajuți oamenii în alegerea unei cariere?',
  'Să examinezi efectele aerului poluat asupra mediului?',
  'Să ocupi o poziție de lider?',
  'Să fii designerul reclamelor pentru reviste sau TV?',
  'Să instalezi sau să repari telefoane?',
  'Să urmezi un curs de matematică pentru afaceri?',
  'Să supraveghezi persoane care au încălcat legea?',
  'Să inventezi un nou tip de echipament tehnic?',
  'Să fii agent imobiliar?',
  'Să studiezi operele marilor muzicieni?',
  'Să lucrezi în construcții?',
  'Să controlezi actele băncilor pentru a descoperi greșeli?',
  'Să participi la strângerea fondurilor de caritate?',
  'Să faci cercetare științifică cu privire la utilizarea energiei solare?',
  'Să lucrezi pentru a convinge guvernul să adopte o anumită măsură?',
  'Să scrii o piesă de teatru?',
  'Să montezi dispozitive electrice?',
  'Să utilizezi calculatorul pentru a prelucra date contabile?',
  'Să planifici activitatea altora?',
  'Să lucrezi la realizarea unei inimi artificiale?',
  'Să promovezi dezvoltarea unei noi piețe de aprovizionare a populației?',
  'Să compui muzică sau să faci aranjamente muzicale?',
  'Să construiești etajere pentru cărți?',
  'Să urmezi un curs de contabilitate?',
  'Să dai primul ajutor?',
  'Să fii asistent medical de laborator?',
  'Să faci afaceri, comerț?',
  'Să dirijezi o orchestră simfonică?',
  'Să fii antreprenor în construcții de locuințe?',
  'Să introduci informații în calculator?',
  'Să lucrezi în calitate de consilier familial?',
  'Să urmezi un curs de biologie la o școală sau universitate?',
  'Să fii legiuitorul care să medieze disputele dintre sindicate și patronat?',
  'Să scrii reportaje pentru reviste?',
  'Să faci jucării din lemn?',
  'Să ții evidența încasărilor pentru lucrările efectuate?',
  'Să ajuți copii cu tulburări mentale?',
  'Să cercetezi, să cauți un remediu contra cancerului?',
  'Să fii judecător?',
  'Să pictezi peisaje?',
  'Să lucrezi ca paznic sau custode?',
  'Să operezi într-un registru de încasări?',
  'Să înveți să ajuți oameni în suferință?',
  'Să conduci studii științifice privind controlul bolilor plantelor?',
  'Să recrutezi și să angajezi oameni pentru o mare firmă?',
  'Să scrii scenarii TV?',
  'Să conduci un autobuz?',
  'Să fii recepționer la un hotel?',
  'Să studiezi psihologia?',
  'Să fii medic care să ajute la prevenirea bolilor?',
  'Să călătorești prin țară pentru a vinde produsele firmei?',
  'Să faci scenografie pentru piesele de teatru?',
  'Să repari lucrurile din jurul casei?',
  'Să fii funcționar administrativ?',
  'Să coordonezi programul sportiv pe un teren de sport?',
  'Să faci studii științifice despre natură?',
  'Să organizezi și să coordonezi afaceri?',
  'Să aranjezi muzica de fond pentru film?',
  'Să repari mecanisme?',
  'Să operezi cu cifre pe computer?',
  'Să conduci discuțiile de grup pentru copii delincvenți?',
  'Să ajuți cercetătorii științifici în laboratoarele lor experimentale?',
  'Să fii manager de producție?',
  'Să faci recenzii de cărți ca un critic literar?',
];
