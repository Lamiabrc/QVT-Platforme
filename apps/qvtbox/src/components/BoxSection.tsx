import { Link } from "react-router-dom";
import boxImage from "@/assets/box-artisanal.jpg";

const BoxSection = () => {
  const boxTypes = [
    {
      category: "Box Thématiques",
      boxes: ["Focus & Reset", "Mobilité", "Pénibilité", "Cohésion"],
      description: "Des solutions ciblées pour chaque besoin de votre équipe"
    },
    {
      category: "Box Événementielles", 
      boxes: ["Retraite", "Naissance", "Anniversaire", "Promotion", "Mariage"],
      description: "Célébrez les moments importants avec délicatesse"
    }
  ];

  return (
    <section className="section-gradient py-20 px-6">
      <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
              Nos <span className="text-primary">Box Magiques</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light mb-6">
              Chaque box est pensée comme un cadeau bienveillant, 
              remplie de produits français artisanaux choisis avec cœur.
            </p>
            <div className="card-bubble p-6 max-w-4xl mx-auto">
              <p className="text-lg text-foreground/80 leading-relaxed font-light">
                Parce que les salariés ont besoin de moyens visibles et utiles, nos box apportent des réponses concrètes aux réalités du travail : fatigue, charge, cohésion, reconnaissance. Elles sont conçues pour être offertes par l'entreprise à ses collaborateurs comme preuves tangibles d'attention et de soutien.
              </p>
            </div>
          </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="card-bubble p-8 hover:shadow-floating transition-all duration-300">
            <h3 className="text-2xl font-kalam font-bold text-primary mb-4">
              Box Thématiques
            </h3>
            <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wide">
              → Pour gérer le stress, la mobilité, la pénibilité et renforcer la cohésion, avec des produits utiles et accessibles.
            </p>
            <p className="text-foreground/70 mb-6">Des solutions ciblées pour chaque besoin de votre équipe</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Focus & Reset", "Mobilité", "Pénibilité", "Cohésion"].map((box, boxIndex) => (
                <div key={boxIndex} className="bg-primary/5 rounded-xl p-3 text-center">
                  <span className="text-sm font-medium text-primary">{box}</span>
                </div>
              ))}
            </div>
            
            <Link to="/box" className="inline-block btn-soft w-full text-center">
              Voir tous les détails
            </Link>
          </div>

          <div className="card-bubble p-8 hover:shadow-floating transition-all duration-300">
            <h3 className="text-2xl font-kalam font-bold text-secondary mb-4">
              Box Événementielles
            </h3>
            <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wide">
              → Pour célébrer les moments de vie, renforcer le collectif et valoriser chaque étape.
            </p>
            <p className="text-foreground/70 mb-6">Célébrez les moments importants avec délicatesse</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Retraite", "Naissance", "Anniversaire", "Promotion", "Mariage"].map((box, boxIndex) => (
                <div key={boxIndex} className="bg-secondary/5 rounded-xl p-3 text-center">
                  <span className="text-sm font-medium text-secondary">{box}</span>
                </div>
              ))}
            </div>
            
            <Link to="/box" className="inline-block btn-soft w-full text-center">
              Voir tous les détails
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src={boxImage} 
              alt="Box artisanale française avec produits naturels" 
              className="w-full rounded-2xl shadow-bubble"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-kalam font-bold text-foreground mb-6">
              Made in <span className="text-primary">France</span> avec amour
            </h3>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Nos box rassemblent le meilleur de l'artisanat français : tisanes bio, 
              carnets manuscrits, objets du quotidien pensés pour le bien-être. 
              Chaque produit raconte une histoire, chaque box crée du lien.
            </p>
            <Link to="/box" className="btn-bubble">
              Soutenir mes équipes avec une Box
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxSection;