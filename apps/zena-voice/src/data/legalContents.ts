import { LegalContent } from "@/types/content.types";

/**
 * ⚖️ Textes de loi QVT – Base de connaissances légales
 * ----------------------------------------------------------
 */
export const legalContents: LegalContent[] = [
  {
    id: "l4121-1",
    title: "Obligations de l'employeur en matière de santé au travail",
    reference: "Article L4121-1 du Code du travail",
    category: "obligation",
    summary: "L'employeur doit prendre les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs.",
    fullText: `L'employeur prend les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs.

Ces mesures comprennent :
1° Des actions de prévention des risques professionnels, y compris ceux mentionnés à l'article L. 4161-1 ;
2° Des actions d'information et de formation ;
3° La mise en place d'une organisation et de moyens adaptés.

L'employeur veille à l'adaptation de ces mesures pour tenir compte du changement des circonstances et tendre à l'amélioration des situations existantes.`,
    effectiveDate: "2008-08-20",
    relatedTopics: ["Prévention des risques", "Santé mentale", "Obligation employeur"]
  },
  {
    id: "l4121-2",
    title: "Principes généraux de prévention",
    reference: "Article L4121-2 du Code du travail",
    category: "prevention",
    summary: "9 principes de prévention que l'employeur doit mettre en œuvre pour assurer la sécurité et la santé des travailleurs.",
    fullText: `L'employeur met en œuvre les mesures prévues à l'article L. 4121-1 sur le fondement des principes généraux de prévention suivants :

1° Éviter les risques ;
2° Évaluer les risques qui ne peuvent pas être évités ;
3° Combattre les risques à la source ;
4° Adapter le travail à l'homme, en particulier en ce qui concerne la conception des postes de travail ainsi que le choix des équipements de travail et des méthodes de travail et de production, en vue notamment de limiter le travail monotone et le travail cadencé et de réduire les effets de ceux-ci sur la santé ;
5° Tenir compte de l'état d'évolution de la technique ;
6° Remplacer ce qui est dangereux par ce qui n'est pas dangereux ou par ce qui est moins dangereux ;
7° Planifier la prévention en y intégrant, dans un ensemble cohérent, la technique, l'organisation du travail, les conditions de travail, les relations sociales et l'influence des facteurs ambiants, notamment les risques liés au harcèlement moral et au harcèlement sexuel, tels qu'ils sont définis aux articles L. 1152-1 et L. 1153-1 ;
8° Prendre des mesures de protection collective en leur donnant la priorité sur les mesures de protection individuelle ;
9° Donner les instructions appropriées aux travailleurs.`,
    effectiveDate: "2008-08-20",
    relatedTopics: ["Prévention", "Évaluation des risques", "Organisation du travail"]
  },
  {
    id: "ani-qvt-2013",
    title: "Accord National Interprofessionnel sur la Qualité de Vie au Travail",
    reference: "ANI du 19 juin 2013",
    category: "droit",
    summary: "Définition de la QVT et engagement des partenaires sociaux pour promouvoir la qualité de vie au travail.",
    fullText: `L'Accord National Interprofessionnel du 19 juin 2013 définit la Qualité de Vie au Travail (QVT) comme :

"Un sentiment de bien-être au travail perçu collectivement et individuellement qui englobe l'ambiance, la culture de l'entreprise, l'intérêt du travail, les conditions de travail, le sentiment d'implication, le degré d'autonomie et de responsabilisation, l'égalité, un droit à l'erreur accordé à chacun, une reconnaissance et une valorisation du travail effectué."

La QVT vise à :
- Concilier amélioration des conditions de travail et performance de l'entreprise
- Favoriser l'engagement des salariés
- Prévenir les risques psychosociaux
- Développer le dialogue social
- Promouvoir l'égalité professionnelle

Les employeurs s'engagent à :
- Mettre en place des espaces de discussion sur le travail
- Associer les salariés aux changements organisationnels
- Reconnaître et valoriser le travail accompli
- Garantir l'équilibre vie professionnelle / vie personnelle`,
    effectiveDate: "2013-06-19",
    relatedTopics: ["QVT", "Dialogue social", "Conditions de travail"]
  },
  {
    id: "droit-deconnexion",
    title: "Droit à la déconnexion",
    reference: "Article L2242-17 du Code du travail",
    category: "droit",
    summary: "Les salariés ont le droit de se déconnecter des outils numériques professionnels en dehors de leur temps de travail.",
    fullText: `La négociation annuelle sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie au travail porte sur :

Les modalités du plein exercice par le salarié de son droit à la déconnexion et la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques, en vue d'assurer le respect des temps de repos et de congé ainsi que de la vie personnelle et familiale.

À défaut d'accord, l'employeur élabore une charte, après avis du comité social et économique. Cette charte définit ces modalités de l'exercice du droit à la déconnexion et prévoit en outre la mise en œuvre, à destination des salariés et du personnel d'encadrement et de direction, d'actions de formation et de sensibilisation à un usage raisonnable des outils numériques.

Objectifs :
- Garantir les temps de repos
- Protéger la vie personnelle et familiale
- Prévenir la surcharge mentale
- Lutter contre le stress numérique`,
    effectiveDate: "2016-08-08",
    relatedTopics: ["Droit à la déconnexion", "Équilibre vie pro/perso", "Outils numériques"]
  },
  {
    id: "rps-definition",
    title: "Définition des Risques Psychosociaux",
    reference: "Circulaire du 18 avril 2002",
    category: "prevention",
    summary: "Les risques psychosociaux (RPS) recouvrent des risques professionnels qui portent atteinte à l'intégrité physique et à la santé mentale des salariés.",
    fullText: `Les risques psychosociaux (RPS) correspondent à des situations de travail où sont présents, combinés ou non :

- Le stress : déséquilibre entre la perception qu'une personne a des contraintes de son environnement de travail et la perception qu'elle a de ses propres ressources pour y faire face.

- Les violences internes : harcèlement moral ou sexuel, conflits exacerbés entre personnes ou entre équipes.

- Les violences externes : insultes, menaces, agressions exercées dans le cadre du travail par des personnes extérieures à l'entreprise.

Facteurs de risques psychosociaux :
1. Intensité et temps de travail (surcharge, urgence, interruptions)
2. Exigences émotionnelles (contact avec la souffrance, tensions avec le public)
3. Manque d'autonomie (faible marge de manœuvre)
4. Rapports sociaux dégradés (conflits, manque de reconnaissance)
5. Conflits de valeurs (qualité empêchée)
6. Insécurité de l'emploi (précarité, changements organisationnels)

Conséquences :
- Troubles de la concentration, du sommeil
- Irritabilité, nervosité
- Fatigue importante, palpitations
- Troubles musculosquelettiques
- Dépression, anxiété
- Épuisement professionnel (burnout)`,
    effectiveDate: "2002-04-18",
    relatedTopics: ["RPS", "Stress", "Burnout", "Harcèlement"]
  }
];
